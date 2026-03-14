# Flashcard Learning API Guide - SM-2 Spaced Repetition

## Overview

This guide documents the backend API endpoints for the flashcard learning system using the SM-2 (SuperMemo 2) spaced repetition algorithm. The system tracks individual card progress, schedules review sessions, and manages learning sets.

## SM-2 Algorithm Overview

### Quality Ratings

- **again** (0): Complete blackout, incorrect recall
- **hard** (3): Correct response with significant difficulty
- **good** (4): Correct response with some hesitation
- **easy** (5): Perfect response

### Algorithm Parameters

- **repetition_count**: Number of consecutive successful reviews
- **ease_factor**: Multiplier for interval calculation (min: 1.3, default: 2.5)
- **interval_days**: Days until next review (0 → 1 → 6 → 6\*EF → ...)

### Interval Calculation Rules

1. **Quality = again (0)**: Reset to day 1 (repetition_count = 0)
2. **Quality = hard (3)**: Multiply interval by 0.85
3. **Quality = good (4)**: Multiply interval by ease_factor
4. **Quality = easy (5)**: Multiply interval by 1.3 \* ease_factor

### Ease Factor Adjustment

- `EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))`
- Minimum EF: 1.3
- Default EF: 2.5

---

## API Endpoints

### 1. Start Flashcard Set

Begin learning a flashcard set. Creates a `user_flashcard_sets` entry.

**Endpoint**: `POST /api/user/flashcard-sets/:flashcard_set_id/start`

**Authentication**: Required (Bearer Token)

**Parameters**:

- `flashcard_set_id` (URL param): ID of the flashcard set to start

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/user/flashcard-sets/1/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (201 Created)**:

```json
{
  "message": "Bắt đầu học flashcard set thành công",
  "userFlashcardSet": {
    "user_flashcard_set_id": 1,
    "user_id": 123,
    "flashcard_set_id": 1,
    "started_at": "2025-01-27T10:30:00.000Z",
    "progress_percent": 0,
    "status": "active"
  }
}
```

**Error Responses**:

- `400`: Invalid flashcard_set_id
- `404`: Flashcard set not found
- `409`: Already started learning this set

---

### 2. Review Flashcard

Submit a quality rating for a flashcard. Updates progress and calculates next review date.

**Endpoint**: `POST /api/user/flashcards/:flashcard_id/review`

**Authentication**: Required (Bearer Token)

**Parameters**:

- `flashcard_id` (URL param): ID of the flashcard being reviewed
- `quality` (Body): Quality rating ("again", "hard", "good", "easy")

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/user/flashcards/42/review \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quality": "good"
  }'
```

**Response (200 OK)**:

```json
{
  "message": "Đánh giá flashcard thành công",
  "progress": {
    "progress_id": 15,
    "user_id": 123,
    "flashcard_id": 42,
    "repetition_count": 2,
    "ease_factor": 2.6,
    "interval_days": 6,
    "next_review_at": "2025-02-02T10:30:00.000Z",
    "last_reviewed_at": "2025-01-27T10:30:00.000Z",
    "last_core": "good"
  }
}
```

**Quality Rating Effects**:

```
Initial: repetition=0, ease=2.5, interval=0
↓ quality="good"
After:   repetition=1, ease=2.6, interval=1
↓ quality="good"
After:   repetition=2, ease=2.7, interval=6
↓ quality="good"
After:   repetition=3, ease=2.8, interval=16
↓ quality="again"
After:   repetition=0, ease=1.8, interval=1
```

**Error Responses**:

- `400`: Invalid flashcard_id or missing quality
- `404`: Flashcard not found

---

### 3. Get Flashcard Set Progress

Get statistics and progress for a specific flashcard set.

**Endpoint**: `GET /api/user/flashcard-sets/:flashcard_set_id/progress`

**Authentication**: Required (Bearer Token)

**Parameters**:

- `flashcard_set_id` (URL param): ID of the flashcard set

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/user/flashcard-sets/1/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK)**:

```json
{
  "flashcard_set_id": 1,
  "progress_percent": 45.5,
  "status": "active",
  "cards_stats": {
    "total": 20,
    "new": 8,
    "learning": 7,
    "mastered": 5,
    "due_for_review": 3
  }
}
```

**Card States Explained**:

- **new**: Never reviewed (no progress entry)
- **learning**: Reviewed but not mastered (repetition_count < 3)
- **mastered**: Successfully reviewed 3+ times consecutively
- **due_for_review**: Cards with `next_review_at <= NOW()`

**Error Responses**:

- `400`: Invalid flashcard_set_id
- `404`: Flashcard set not found or not started

---

### 4. Get Next Card

Retrieve the next card to study using priority queue logic.

**Endpoint**: `GET /api/user/flashcard-sets/:flashcard_set_id/next-card`

**Authentication**: Required (Bearer Token)

**Parameters**:

- `flashcard_set_id` (URL param): ID of the flashcard set

**Priority Logic**:

1. **Due cards** (next_review_at <= NOW) - highest priority
2. **New cards** (never reviewed)
3. **Future cards** (next_review_at > NOW) - lowest priority

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/user/flashcard-sets/1/next-card \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK) - Due Card**:

```json
{
  "flashcard_id": 42,
  "question": "What is the capital of France?",
  "answer": "Paris",
  "image_url": "https://...",
  "video_url": null,
  "audio_url": null,
  "is_due": true,
  "is_new": false,
  "next_review_at": "2025-01-25T10:00:00.000Z",
  "progress": {
    "repetition_count": 2,
    "ease_factor": 2.6,
    "interval_days": 6,
    "last_reviewed_at": "2025-01-19T10:00:00.000Z"
  }
}
```

**Response (200 OK) - New Card**:

```json
{
  "flashcard_id": 15,
  "question": "What is 2 + 2?",
  "answer": "4",
  "image_url": null,
  "video_url": null,
  "audio_url": null,
  "is_due": false,
  "is_new": true,
  "next_review_at": null,
  "progress": null
}
```

**Response (200 OK) - All Done**:

```json
{
  "message": "Đã hoàn thành tất cả các flashcard trong set này",
  "all_completed": true
}
```

**Error Responses**:

- `400`: Invalid flashcard_set_id
- `404`: Flashcard set not found

---

### 5. Get Daily Review Queue

Get all cards due for review today across all active sets.

**Endpoint**: `GET /api/user/flashcards/review-queue`

**Authentication**: Required (Bearer Token)

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/user/flashcards/review-queue \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK)**:

```json
{
  "total_due": 12,
  "sets": [
    {
      "flashcard_set_id": 1,
      "set_name": "French Vocabulary - Level 1",
      "due_cards": [
        {
          "flashcard_id": 42,
          "question": "Bonjour",
          "answer": "Hello",
          "next_review_at": "2025-01-26T08:00:00.000Z",
          "repetition_count": 2,
          "ease_factor": 2.6
        },
        {
          "flashcard_id": 43,
          "question": "Merci",
          "answer": "Thank you",
          "next_review_at": "2025-01-27T09:15:00.000Z",
          "repetition_count": 1,
          "ease_factor": 2.5
        }
      ]
    },
    {
      "flashcard_set_id": 3,
      "set_name": "Spanish Basics",
      "due_cards": [
        {
          "flashcard_id": 88,
          "question": "Hola",
          "answer": "Hello",
          "next_review_at": "2025-01-27T07:30:00.000Z",
          "repetition_count": 3,
          "ease_factor": 2.8
        }
      ]
    }
  ]
}
```

**Use Cases**:

- Daily review dashboard
- Push notification scheduling
- "Study now" button data source

**Error Responses**:

- None (returns empty array if no due cards)

---

### 6. Get Active Sets

List all flashcard sets the user is currently learning or has completed.

**Endpoint**: `GET /api/user/flashcards/active-sets`

**Authentication**: Required (Bearer Token)

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/user/flashcards/active-sets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK)**:

```json
{
  "active_sets": [
    {
      "user_flashcard_set_id": 1,
      "flashcard_set_id": 1,
      "set_name": "French Vocabulary - Level 1",
      "description": "Common French words and phrases",
      "started_at": "2025-01-15T10:00:00.000Z",
      "progress_percent": 65.5,
      "status": "active",
      "total_cards": 20,
      "reviewed_cards": 13
    },
    {
      "user_flashcard_set_id": 2,
      "flashcard_set_id": 3,
      "set_name": "Spanish Basics",
      "description": "Introduction to Spanish",
      "started_at": "2025-01-20T14:30:00.000Z",
      "progress_percent": 100,
      "status": "completed",
      "total_cards": 15,
      "reviewed_cards": 15
    }
  ]
}
```

**Status Values**:

- `active`: Currently learning
- `completed`: All cards mastered
- `archived`: User archived the set

**Error Responses**:

- None (returns empty array if no active sets)

---

## Learning Flow Example

### Complete Learning Session

```javascript
// 1. Start learning a new set
POST /api/user/flashcard-sets/1/start
→ Creates user_flashcard_sets entry

// 2. Get first card
GET /api/user/flashcard-sets/1/next-card
→ Returns new card (no progress yet)

// 3. Review the card (user answers correctly after some thought)
POST /api/user/flashcards/42/review
Body: { "quality": "good" }
→ Creates progress entry: repetition=1, interval=1 day, next_review=tomorrow

// 4. Get next card
GET /api/user/flashcard-sets/1/next-card
→ Returns another new card

// 5. Review again (user struggles)
POST /api/user/flashcards/43/review
Body: { "quality": "hard" }
→ Creates progress: repetition=1, interval=1 day (but ease_factor reduced)

// ... Continue studying ...

// 6. Check progress
GET /api/user/flashcard-sets/1/progress
→ Shows stats: 20 total, 15 new, 5 learning, 0 mastered, 0 due

// 7. Come back tomorrow
GET /api/user/flashcards/review-queue
→ Shows 5 cards due for review (the ones studied yesterday)

// 8. Review a due card (still remember well)
POST /api/user/flashcards/42/review
Body: { "quality": "good" }
→ Updates progress: repetition=2, interval=6 days, next_review=6 days from now

// 9. Review a card you forgot
POST /api/user/flashcards/43/review
Body: { "quality": "again" }
→ Resets progress: repetition=0, interval=1 day, next_review=tomorrow
```

---

## Database Schema

### user_flashcard_sets

```sql
CREATE TABLE user_flashcard_sets (
  user_flashcard_set_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  flashcard_set_id INT NOT NULL,
  started_at DATETIME,
  progress_percent FLOAT,
  status ENUM('active', 'completed', 'archived') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (flashcard_set_id) REFERENCES flashcard_sets(flashcard_set_id)
);
```

### user_flashcard_progress

```sql
CREATE TABLE user_flashcard_progress (
  progress_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  flashcard_id INT NOT NULL,
  repetition_count INT DEFAULT 0,
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INT DEFAULT 0,
  next_review_at DATETIME,
  last_reviewed_at DATETIME,
  last_core ENUM('again', 'hard', 'good', 'easy'),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (flashcard_id) REFERENCES flashcards(flashcard_id)
);
```

---

## Frontend Integration Guide

### Replace localStorage with Backend

**Current (localStorage)**:

```javascript
// OLD - Don't use this anymore
const progress = JSON.parse(
  localStorage.getItem(`flashcard_progress_${id}`) || "{}",
);
```

**New (API)**:

```javascript
// Get next card to study
const response = await fetch(`/api/user/flashcard-sets/${setId}/next-card`, {
  headers: { Authorization: `Bearer ${token}` },
});
const nextCard = await response.json();
```

### Add Quality Rating Buttons

```jsx
// In FlashcardViewer.tsx
const handleQualityRating = async (quality: 'again' | 'hard' | 'good' | 'easy') => {
  try {
    await fetch(`/api/user/flashcards/${currentCard.flashcard_id}/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quality })
    });

    // Get next card
    fetchNextCard();
  } catch (error) {
    console.error('Review failed:', error);
  }
};

// UI buttons
<div className="flex gap-2">
  <button onClick={() => handleQualityRating('again')}>Again (&lt;1min)</button>
  <button onClick={() => handleQualityRating('hard')}>Hard (10min)</button>
  <button onClick={() => handleQualityRating('good')}>Good (1d)</button>
  <button onClick={() => handleQualityRating('easy')}>Easy (4d)</button>
</div>
```

### Update Progress Display

```jsx
// Get set progress for dashboard
const response = await fetch(`/api/user/flashcard-sets/${setId}/progress`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { progress_percent, cards_stats } = await response.json();

// Show in UI
<div>
  <p>Progress: {progress_percent}%</p>
  <p>New: {cards_stats.new}</p>
  <p>Learning: {cards_stats.learning}</p>
  <p>Mastered: {cards_stats.mastered}</p>
  <p>Due today: {cards_stats.due_for_review}</p>
</div>;
```

### Daily Review Queue

```jsx
// Get all due cards for dashboard
const response = await fetch("/api/user/flashcards/review-queue", {
  headers: { Authorization: `Bearer ${token}` },
});
const { total_due, sets } = await response.json();

// Show notification badge
<Badge count={total_due}>Review</Badge>;
```

---

## Notification System (To Be Implemented)

### Cron Job Pseudocode

```javascript
// Run daily at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  // Get all users with due cards
  const users = await db.User.findAll({
    include: [
      {
        model: db.User_Flashcard_Progress,
        where: {
          next_review_at: {
            [Op.lte]: new Date(),
          },
        },
      },
    ],
  });

  // Send notifications
  for (const user of users) {
    const dueCount = await getDueCardsCount(user.user_id);
    await sendPushNotification(user.user_id, {
      title: "Time to review!",
      body: `You have ${dueCount} cards waiting for review`,
      action: "/flashcards/review",
    });
  }
});
```

---

## Testing Endpoints

See `tests/flashcardLearning.test.js` for comprehensive test cases covering:

- Starting a flashcard set
- Reviewing cards with different quality ratings
- SM-2 algorithm interval calculations
- Progress statistics
- Next card priority queue
- Daily review queue
- Edge cases (already started, invalid IDs, etc.)

---

## Related Documentation

- [FLASHCARD_API_GUIDE.md](./FLASHCARD_API_GUIDE.md) - CRUD operations for flashcards
- [FLASHCARD_BUSINESS_LOGIC.md](./FLASHCARD_BUSINESS_LOGIC.md) - Business rules
- [SUBSCRIPTION_ACCESS_GUIDE.md](./SUBSCRIPTION_ACCESS_GUIDE.md) - Premium access control

---

## Troubleshooting

### Card Not Appearing in Review Queue

- Check `next_review_at` is in the past
- Verify user has started the flashcard set (user_flashcard_sets exists)
- Ensure flashcard exists in the set

### Progress Not Updating

- Verify quality rating is valid ("again", "hard", "good", "easy")
- Check flashcard_id is correct
- Look for errors in server logs

### Ease Factor Too Low

- If ease factor drops below 1.3, it stays at 1.3 (minimum)
- Repeatedly rating "again" will reset but not decrease EF below minimum
- Consider "hard" (3) instead of "again" (0) to preserve progress

### All Cards Showing as "New"

- Verify migrations have been run: `npx sequelize-cli db:migrate`
- Check user_flashcard_progress table exists
- Ensure user is authenticated (user_id is set correctly)
