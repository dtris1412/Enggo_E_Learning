/**
 * Flashcard Learning API Tests - SM-2 Spaced Repetition System
 *
 * Tests cover:
 * - Starting flashcard sets
 * - Reviewing cards with quality ratings
 * - SM-2 algorithm interval calculations
 * - Progress statistics
 * - Next card priority queue
 * - Daily review queue
 * - Edge cases and error handling
 */

import request from "supertest";
import { expect } from "chai";
import app from "../src/server.js";
import db from "../src/models/index.js";

describe("Flashcard Learning API - SM-2 Spaced Repetition", () => {
  let authToken;
  let userId;
  let flashcardSetId;
  let flashcardIds = [];

  // Setup: Create test user and flashcard set
  before(async () => {
    // Clean up existing test data
    await db.User_Flashcard_Progress.destroy({ where: {}, force: true });
    await db.User_Flashcard_Set.destroy({ where: {}, force: true });

    // Create test user
    const userResponse = await request(app)
      .post("/api/user/register")
      .send({
        username: `test_learning_${Date.now()}`,
        email: `learning${Date.now()}@test.com`,
        password: "Test123!@#",
      });

    userId = userResponse.body.user.user_id;
    authToken = userResponse.body.token;

    // Create test flashcard set with cards
    const setResponse = await request(app)
      .post("/api/user/flashcard-sets")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Learning Set",
        description: "Set for testing SM-2 algorithm",
      });

    flashcardSetId = setResponse.body.flashcard_set.flashcard_set_id;

    // Create 5 test flashcards
    for (let i = 1; i <= 5; i++) {
      const cardResponse = await request(app)
        .post("/api/user/flashcards")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          flashcard_set_id: flashcardSetId,
          question: `Test Question ${i}`,
          answer: `Test Answer ${i}`,
        });

      flashcardIds.push(cardResponse.body.flashcard.flashcard_id);
    }
  });

  // Cleanup after tests
  after(async () => {
    await db.User_Flashcard_Progress.destroy({
      where: { user_id: userId },
      force: true,
    });
    await db.User_Flashcard_Set.destroy({
      where: { user_id: userId },
      force: true,
    });
    await db.Flashcard.destroy({
      where: { flashcard_set_id: flashcardSetId },
      force: true,
    });
    await db.Flashcard_Set.destroy({
      where: { flashcard_set_id: flashcardSetId },
      force: true,
    });
    await db.User.destroy({ where: { user_id: userId }, force: true });
  });

  describe("POST /api/user/flashcard-sets/:flashcard_set_id/start", () => {
    it("should start learning a flashcard set", async () => {
      const response = await request(app)
        .post(`/api/user/flashcard-sets/${flashcardSetId}/start`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("message");
      expect(response.body.userFlashcardSet).to.have.property(
        "user_flashcard_set_id",
      );
      expect(response.body.userFlashcardSet.flashcard_set_id).to.equal(
        flashcardSetId,
      );
      expect(response.body.userFlashcardSet.status).to.equal("active");
      expect(response.body.userFlashcardSet.progress_percent).to.equal(0);
    });

    it("should return error if already started", async () => {
      const response = await request(app)
        .post(`/api/user/flashcard-sets/${flashcardSetId}/start`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(409); // Conflict
    });

    it("should return error for invalid flashcard_set_id", async () => {
      const response = await request(app)
        .post("/api/user/flashcard-sets/99999/start")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });

    it("should require authentication", async () => {
      const response = await request(app).post(
        `/api/user/flashcard-sets/${flashcardSetId}/start`,
      );

      expect(response.status).to.equal(401);
    });
  });

  describe("POST /api/user/flashcards/:flashcard_id/review", () => {
    it('should review a new flashcard with "good" rating', async () => {
      const flashcardId = flashcardIds[0];
      const response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.status).to.equal(200);
      expect(response.body.progress).to.have.property("progress_id");
      expect(response.body.progress.flashcard_id).to.equal(flashcardId);
      expect(response.body.progress.repetition_count).to.equal(1);
      expect(response.body.progress.interval_days).to.equal(1);
      expect(response.body.progress.ease_factor).to.be.greaterThan(2.5);
      expect(response.body.progress.last_core).to.equal("good");
      expect(response.body.progress).to.have.property("next_review_at");
    });

    it('should review flashcard with "easy" rating (increases ease factor more)', async () => {
      const flashcardId = flashcardIds[1];
      const response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "easy" });

      expect(response.status).to.equal(200);
      expect(response.body.progress.ease_factor).to.be.greaterThan(2.5);
      expect(response.body.progress.repetition_count).to.equal(1);
      expect(response.body.progress.interval_days).to.equal(1);
    });

    it('should review flashcard with "hard" rating (reduces ease factor)', async () => {
      const flashcardId = flashcardIds[2];
      const response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "hard" });

      expect(response.status).to.equal(200);
      expect(response.body.progress.ease_factor).to.be.lessThan(2.5);
      expect(response.body.progress.repetition_count).to.equal(1);
    });

    it('should reset progress with "again" rating', async () => {
      const flashcardId = flashcardIds[3];

      // First review with "good"
      await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      // Second review with "again" - should reset
      const response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "again" });

      expect(response.status).to.equal(200);
      expect(response.body.progress.repetition_count).to.equal(0);
      expect(response.body.progress.interval_days).to.equal(1);
    });

    it("should handle multiple reviews and increase interval", async () => {
      const flashcardId = flashcardIds[4];

      // First review - 1 day interval
      let response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.body.progress.repetition_count).to.equal(1);
      expect(response.body.progress.interval_days).to.equal(1);

      // Second review - interval increases to 6 days
      response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.body.progress.repetition_count).to.equal(2);
      expect(response.body.progress.interval_days).to.equal(6);

      // Third review - interval increases further
      response = await request(app)
        .post(`/api/user/flashcards/${flashcardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.body.progress.repetition_count).to.equal(3);
      expect(response.body.progress.interval_days).to.be.greaterThan(6);
    });

    it("should return error for invalid quality rating", async () => {
      const response = await request(app)
        .post(`/api/user/flashcards/${flashcardIds[0]}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "invalid_rating" });

      expect(response.status).to.equal(400);
    });

    it("should return error if quality is missing", async () => {
      const response = await request(app)
        .post(`/api/user/flashcards/${flashcardIds[0]}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).to.equal(400);
    });

    it("should return error for invalid flashcard_id", async () => {
      const response = await request(app)
        .post("/api/user/flashcards/99999/review")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.status).to.equal(404);
    });
  });

  describe("GET /api/user/flashcard-sets/:flashcard_set_id/progress", () => {
    it("should get flashcard set progress statistics", async () => {
      const response = await request(app)
        .get(`/api/user/flashcard-sets/${flashcardSetId}/progress`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("flashcard_set_id");
      expect(response.body).to.have.property("progress_percent");
      expect(response.body).to.have.property("status");
      expect(response.body).to.have.property("cards_stats");

      const stats = response.body.cards_stats;
      expect(stats).to.have.property("total");
      expect(stats).to.have.property("new");
      expect(stats).to.have.property("learning");
      expect(stats).to.have.property("mastered");
      expect(stats).to.have.property("due_for_review");

      // We reviewed 5 cards, so total should equal sum of new + learning + mastered
      expect(stats.total).to.equal(5);
    });

    it("should calculate correct progress percentage", async () => {
      const response = await request(app)
        .get(`/api/user/flashcard-sets/${flashcardSetId}/progress`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.progress_percent).to.be.a("number");
      expect(response.body.progress_percent).to.be.at.least(0);
      expect(response.body.progress_percent).to.be.at.most(100);
    });

    it("should return error for invalid flashcard_set_id", async () => {
      const response = await request(app)
        .get("/api/user/flashcard-sets/99999/progress")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });
  });

  describe("GET /api/user/flashcard-sets/:flashcard_set_id/next-card", () => {
    it("should return the next card to study", async () => {
      const response = await request(app)
        .get(`/api/user/flashcard-sets/${flashcardSetId}/next-card`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(200);

      // Should return either a card or completion message
      if (response.body.all_completed) {
        expect(response.body).to.have.property("message");
      } else {
        expect(response.body).to.have.property("flashcard_id");
        expect(response.body).to.have.property("question");
        expect(response.body).to.have.property("answer");
        expect(response.body).to.have.property("is_due");
        expect(response.body).to.have.property("is_new");
      }
    });

    it("should prioritize due cards over new cards", async () => {
      // Create a new set for this test
      const setResponse = await request(app)
        .post("/api/user/flashcard-sets")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Priority Test Set",
          description: "Testing card priority",
        });

      const testSetId = setResponse.body.flashcard_set.flashcard_set_id;

      // Create 2 cards
      const card1Response = await request(app)
        .post("/api/user/flashcards")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          flashcard_set_id: testSetId,
          question: "Priority Card 1",
          answer: "Answer 1",
        });

      const card2Response = await request(app)
        .post("/api/user/flashcards")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          flashcard_set_id: testSetId,
          question: "Priority Card 2",
          answer: "Answer 2",
        });

      const card1Id = card1Response.body.flashcard.flashcard_id;

      // Start the set
      await request(app)
        .post(`/api/user/flashcard-sets/${testSetId}/start`)
        .set("Authorization", `Bearer ${authToken}`);

      // Review card 1 and make it due (set next_review_at to past)
      await db.User_Flashcard_Progress.create({
        user_id: userId,
        flashcard_id: card1Id,
        repetition_count: 1,
        ease_factor: 2.5,
        interval_days: 1,
        next_review_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        last_reviewed_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        last_core: "good",
      });

      // Get next card - should prioritize the due card
      const response = await request(app)
        .get(`/api/user/flashcard-sets/${testSetId}/next-card`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.flashcard_id).to.equal(card1Id);
      expect(response.body.is_due).to.be.true;

      // Cleanup
      await db.User_Flashcard_Progress.destroy({
        where: { flashcard_id: card1Id },
        force: true,
      });
      await db.User_Flashcard_Set.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
      await db.Flashcard.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
      await db.Flashcard_Set.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
    });
  });

  describe("GET /api/user/flashcards/review-queue (Daily Review Queue)", () => {
    it("should return all cards due for review today", async () => {
      const response = await request(app)
        .get("/api/user/flashcards/review-queue")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("total_due");
      expect(response.body).to.have.property("sets");
      expect(response.body.sets).to.be.an("array");
    });

    it("should group due cards by flashcard set", async () => {
      const response = await request(app)
        .get("/api/user/flashcards/review-queue")
        .set("Authorization", `Bearer ${authToken}`);

      if (response.body.sets.length > 0) {
        const firstSet = response.body.sets[0];
        expect(firstSet).to.have.property("flashcard_set_id");
        expect(firstSet).to.have.property("set_name");
        expect(firstSet).to.have.property("due_cards");
        expect(firstSet.due_cards).to.be.an("array");

        if (firstSet.due_cards.length > 0) {
          const card = firstSet.due_cards[0];
          expect(card).to.have.property("flashcard_id");
          expect(card).to.have.property("question");
          expect(card).to.have.property("answer");
          expect(card).to.have.property("next_review_at");
          expect(card).to.have.property("repetition_count");
          expect(card).to.have.property("ease_factor");
        }
      }
    });

    it("should only return cards with next_review_at <= now", async () => {
      const response = await request(app)
        .get("/api/user/flashcards/review-queue")
        .set("Authorization", `Bearer ${authToken}`);

      const now = new Date();

      response.body.sets.forEach((set) => {
        set.due_cards.forEach((card) => {
          const nextReview = new Date(card.next_review_at);
          expect(nextReview.getTime()).to.be.at.most(now.getTime());
        });
      });
    });
  });

  describe("GET /api/user/flashcards/active-sets", () => {
    it("should return all active learning sets", async () => {
      const response = await request(app)
        .get("/api/user/flashcards/active-sets")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("active_sets");
      expect(response.body.active_sets).to.be.an("array");
      expect(response.body.active_sets.length).to.be.greaterThan(0);
    });

    it("should include set details and progress", async () => {
      const response = await request(app)
        .get("/api/user/flashcards/active-sets")
        .set("Authorization", `Bearer ${authToken}`);

      const firstSet = response.body.active_sets[0];
      expect(firstSet).to.have.property("user_flashcard_set_id");
      expect(firstSet).to.have.property("flashcard_set_id");
      expect(firstSet).to.have.property("set_name");
      expect(firstSet).to.have.property("started_at");
      expect(firstSet).to.have.property("progress_percent");
      expect(firstSet).to.have.property("status");
    });

    it("should only include active and completed sets", async () => {
      const response = await request(app)
        .get("/api/user/flashcards/active-sets")
        .set("Authorization", `Bearer ${authToken}`);

      response.body.active_sets.forEach((set) => {
        expect(["active", "completed"]).to.include(set.status);
      });
    });
  });

  describe("SM-2 Algorithm Verification", () => {
    it("should maintain ease factor minimum of 1.3", async () => {
      const setResponse = await request(app)
        .post("/api/user/flashcard-sets")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "EF Test Set",
          description: "Testing ease factor minimum",
        });

      const testSetId = setResponse.body.flashcard_set.flashcard_set_id;

      const cardResponse = await request(app)
        .post("/api/user/flashcards")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          flashcard_set_id: testSetId,
          question: "EF Test Card",
          answer: "Test Answer",
        });

      const cardId = cardResponse.body.flashcard.flashcard_id;

      await request(app)
        .post(`/api/user/flashcard-sets/${testSetId}/start`)
        .set("Authorization", `Bearer ${authToken}`);

      // Review with "again" multiple times to drive EF down
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post(`/api/user/flashcards/${cardId}/review`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({ quality: "again" });

        // EF should never go below 1.3
        expect(response.body.progress.ease_factor).to.be.at.least(1.3);
      }

      // Cleanup
      await db.User_Flashcard_Progress.destroy({
        where: { flashcard_id: cardId },
        force: true,
      });
      await db.User_Flashcard_Set.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
      await db.Flashcard.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
      await db.Flashcard_Set.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
    });

    it('should follow correct interval progression for "good" ratings', async () => {
      const setResponse = await request(app)
        .post("/api/user/flashcard-sets")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Interval Test Set",
          description: "Testing interval progression",
        });

      const testSetId = setResponse.body.flashcard_set.flashcard_set_id;

      const cardResponse = await request(app)
        .post("/api/user/flashcards")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          flashcard_set_id: testSetId,
          question: "Interval Test Card",
          answer: "Test Answer",
        });

      const cardId = cardResponse.body.flashcard.flashcard_id;

      await request(app)
        .post(`/api/user/flashcard-sets/${testSetId}/start`)
        .set("Authorization", `Bearer ${authToken}`);

      // First review: interval should be 1 day
      let response = await request(app)
        .post(`/api/user/flashcards/${cardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.body.progress.interval_days).to.equal(1);

      // Second review: interval should be 6 days
      response = await request(app)
        .post(`/api/user/flashcards/${cardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.body.progress.interval_days).to.equal(6);

      // Third review: interval should be 6 * EF (approximately 15-16 days)
      response = await request(app)
        .post(`/api/user/flashcards/${cardId}/review`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ quality: "good" });

      expect(response.body.progress.interval_days).to.be.at.least(14);
      expect(response.body.progress.interval_days).to.be.at.most(18);

      // Cleanup
      await db.User_Flashcard_Progress.destroy({
        where: { flashcard_id: cardId },
        force: true,
      });
      await db.User_Flashcard_Set.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
      await db.Flashcard.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
      await db.Flashcard_Set.destroy({
        where: { flashcard_set_id: testSetId },
        force: true,
      });
    });
  });
});
