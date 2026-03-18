/**
 * TEST: Bulk Question Import to Exam Container
 *
 * Test the bulk import functionality for adding multiple questions to an exam container
 */

import request from "supertest";
import app from "../src/server.js";

describe("Bulk Question Import to Container", () => {
  let adminToken;
  let containerId;

  beforeAll(async () => {
    // Login as admin to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      user_email: "admin@example.com",
      user_password: "admin123",
    });

    adminToken = loginResponse.body.token;

    // Create a test container first
    const containerResponse = await request(app)
      .post("/api/admin/exam-containers")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        exam_id: 1, // Assuming exam ID 1 exists
        skill: "Reading",
        type: "Multiple Choice",
        order: 1,
        instruction: "Choose the best answer",
      });

    containerId = containerResponse.body.data.container_id;
  });

  test("Should add multiple questions to container successfully", async () => {
    const questionsData = {
      container_id: containerId,
      questions: [
        {
          question_content: "What is the capital of France?",
          explanation: "Paris is the capital and largest city of France.",
          order: 1,
          image_url: null,
          score: 1.0,
          options: [
            {
              label: "A",
              content: "London",
              is_correct: false,
              order_index: 1,
            },
            { label: "B", content: "Paris", is_correct: true, order_index: 2 },
            {
              label: "C",
              content: "Berlin",
              is_correct: false,
              order_index: 3,
            },
            {
              label: "D",
              content: "Madrid",
              is_correct: false,
              order_index: 4,
            },
          ],
        },
        {
          question_content: "Which planet is known as the Red Planet?",
          explanation:
            "Mars is called the Red Planet because of its reddish appearance.",
          order: 2,
          image_url: null,
          score: 1.0,
          options: [
            { label: "A", content: "Venus", is_correct: false, order_index: 1 },
            { label: "B", content: "Mars", is_correct: true, order_index: 2 },
            {
              label: "C",
              content: "Jupiter",
              is_correct: false,
              order_index: 3,
            },
            {
              label: "D",
              content: "Saturn",
              is_correct: false,
              order_index: 4,
            },
          ],
        },
        {
          question_content: "What is 2 + 2?",
          explanation: "Basic arithmetic: 2 plus 2 equals 4.",
          order: 3,
          score: 1.0,
          options: [
            { label: "A", content: "3", is_correct: false, order_index: 1 },
            { label: "B", content: "4", is_correct: true, order_index: 2 },
            { label: "C", content: "5", is_correct: false, order_index: 3 },
            { label: "D", content: "6", is_correct: false, order_index: 4 },
          ],
        },
      ],
    };

    const response = await request(app)
      .post("/api/admin/container-questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(questionsData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(3);
    expect(response.body.message).toContain("3 questions added");

    // Verify each question has all components
    response.body.data.forEach((item) => {
      expect(item.question).toBeDefined();
      expect(item.containerQuestion).toBeDefined();
      expect(item.options).toBeDefined();
      expect(item.options.length).toBe(4);
    });
  });

  test("Should reject questions without correct answer", async () => {
    const invalidData = {
      container_id: containerId,
      questions: [
        {
          question_content: "Invalid question",
          explanation: "No correct answer",
          order: 1,
          score: 1.0,
          options: [
            { label: "A", content: "Wrong", is_correct: false, order_index: 1 },
            {
              label: "B",
              content: "Also wrong",
              is_correct: false,
              order_index: 2,
            },
          ],
        },
      ],
    };

    const response = await request(app)
      .post("/api/admin/container-questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("at least one correct answer");
  });

  test("Should reject questions without options", async () => {
    const invalidData = {
      container_id: containerId,
      questions: [
        {
          question_content: "Question without options",
          explanation: "No options provided",
          order: 1,
          score: 1.0,
          options: [],
        },
      ],
    };

    const response = await request(app)
      .post("/api/admin/container-questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("must have at least one option");
  });

  test("Should reject empty questions array", async () => {
    const invalidData = {
      container_id: containerId,
      questions: [],
    };

    const response = await request(app)
      .post("/api/admin/container-questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("non-empty array");
  });

  test("Should reject invalid container ID", async () => {
    const invalidData = {
      container_id: 99999, // Non-existent container
      questions: [
        {
          question_content: "Test question",
          explanation: "Test explanation",
          order: 1,
          score: 1.0,
          options: [
            {
              label: "A",
              content: "Option A",
              is_correct: true,
              order_index: 1,
            },
          ],
        },
      ],
    };

    const response = await request(app)
      .post("/api/admin/container-questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Container not found");
  });

  test("Should handle TOEIC-style questions", async () => {
    const toeicQuestions = {
      container_id: containerId,
      questions: [
        {
          question_content:
            "The manager asked all employees _____ the meeting room by 2 PM.",
          explanation:
            "'to enter' is the correct infinitive form after 'ask someone'",
          order: 1,
          score: 1.0,
          options: [
            { label: "A", content: "enter", is_correct: false, order_index: 1 },
            {
              label: "B",
              content: "to enter",
              is_correct: true,
              order_index: 2,
            },
            {
              label: "C",
              content: "entering",
              is_correct: false,
              order_index: 3,
            },
            {
              label: "D",
              content: "entered",
              is_correct: false,
              order_index: 4,
            },
          ],
        },
        {
          question_content:
            "Our company has _____ expanded its operations to Southeast Asia.",
          explanation:
            "'recently' is an adverb that fits the present perfect tense",
          order: 2,
          score: 1.0,
          options: [
            {
              label: "A",
              content: "recent",
              is_correct: false,
              order_index: 1,
            },
            {
              label: "B",
              content: "recently",
              is_correct: true,
              order_index: 2,
            },
            {
              label: "C",
              content: "more recent",
              is_correct: false,
              order_index: 3,
            },
            {
              label: "D",
              content: "most recently",
              is_correct: false,
              order_index: 4,
            },
          ],
        },
      ],
    };

    const response = await request(app)
      .post("/api/admin/container-questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(toeicQuestions);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });
});
