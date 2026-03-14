# Flashcard Frontend Integration Guide - SM-2 Spaced Repetition

## Tổng quan thay đổi

Đã tích hợp frontend với backend SM-2 spaced repetition API. Hệ thống không còn dùng localStorage để tracking progress mà sử dụng server-side tracking với thuật toán SM-2.

---

## Các file đã thay đổi

### 1. FlashcardViewer.tsx

**Đường dẫn**: `client/src/user/components/FlashcardComponent/FlashcardViewer.tsx`

**Thay đổi chính**:

#### ❌ **Đã loại bỏ**:

- LocalStorage-based progress tracking
- Nút "Đã biết" / "Chưa biết" (binary rating)
- Manual navigation qua array indices
- `knownCards` và `unknownCards` state

#### ✅ **Đã thêm**:

- **Auto-start learning set**: Tự động call `POST /api/user/flashcard-sets/:id/start` khi mở viewer
- **SM-2 Quality Rating Buttons**: 4 nút đánh giá (Again/Hard/Good/Easy)
- **Backend card selection**: Call `GET /next-card` để lấy card tiếp theo theo priority (due > new > future)
- **Progress API integration**: Call `GET /progress` để lấy thống kê real-time
- **Review API**: Call `POST /review` với quality rating khi user đánh giá card
- **Completion screen**: Màn hình tổng kết khi hoàn thành tất cả cards

#### Giao diện mới:

**Stats Bar** (dưới header):

```
🔵 Mới: X    🟡 Đang học: X    🟢 Thành thạo: X    🔴 Cần ôn: X    ⭐ Đánh dấu: X
```

**Quality Rating Buttons** (mặt sau thẻ):

```
[ ❌ Chưa nhớ ]   [ 🧠 Khó ]   [ ✅ Tốt ]   [ ⚡ Dễ ]
  <10 phút        <1 ngày       <4 ngày      4+ ngày
```

**Card Badges**:

- "Cần ôn" (đỏ) - nếu card đến hạn review
- "Thẻ mới" (xanh) - nếu chưa học bao giờ

---

### 2. Flashcard.tsx (Dashboard)

**Đường dẫn**: `client/src/user/pages/Flashcard.tsx`

**Thay đổi chính**:

#### ❌ **Đã loại bỏ**:

- `getCurrentIndexFromLocalStorage()` helper function
- LocalStorage reading for progress display

#### ✅ **Đã thêm**:

- **Active Sets API**: Call `GET /api/user/flashcards/active-sets` để lấy danh sách sets đang học
- **Progress API**: Call `GET /api/user/flashcard-sets/:id/progress` cho từng set để lấy stats chi tiết
- **Smart filtering**: Chỉ hiển thị sets có `learned_cards > 0`
- **Direct to learning**: Link "Jump back in" cards đến `/flashcards/:id/learn` thay vì detail page

#### "Jump back in" Section:

- Hiển thị progress bar dựa trên `(learning + mastered) / total`
- Show số cards đã review (learning + mastered)
- Nút "Continue" link trực tiếp đến viewer

---

## API Endpoints được sử dụng

### FlashcardViewer Integration

| API Endpoint                             | Method | Khi nào gọi                   | Mục đích                                          |
| ---------------------------------------- | ------ | ----------------------------- | ------------------------------------------------- |
| `/api/user/flashcard-sets/:id/start`     | POST   | Khi mở viewer lần đầu         | Bắt đầu học set (tạo user_flashcard_sets)         |
| `/api/user/flashcard-sets/:id/next-card` | GET    | Sau mỗi review / lần refresh  | Lấy card tiếp theo (priority: due > new > future) |
| `/api/user/flashcard-sets/:id/progress`  | GET    | Khi load set / sau review     | Lấy stats (new/learning/mastered/due)             |
| `/api/user/flashcards/:id/review`        | POST   | Khi user click quality rating | Ghi nhận đánh giá, tính interval tiếp theo        |

### Dashboard Integration

| API Endpoint                            | Method | Khi nào gọi        | Mục đích                       |
| --------------------------------------- | ------ | ------------------ | ------------------------------ |
| `/api/user/flashcards/active-sets`      | GET    | Khi load dashboard | Lấy danh sách sets đang học    |
| `/api/user/flashcard-sets/:id/progress` | GET    | Cho mỗi active set | Lấy stats để hiển thị progress |

---

## Flow học flashcard mới

### Bước 1: Người dùng bắt đầu học

```
User clicks "Continue" hoặc "Học ngay"
  ↓
Navigate to /flashcards/:id/learn
  ↓
FlashcardViewer loads
  ↓
Auto call POST /flashcard-sets/:id/start
  ↓
Call GET /next-card → Nhận card đầu tiên (ưu tiên due cards, sau đó new cards)
  ↓
Call GET /progress → Hiển thị stats
```

### Bước 2: Học từng card

```
User lật card (click hoặc Space)
  ↓
Hiển thị đáp án + 4 nút quality rating
  ↓
User chọn Again / Hard / Good / Easy
  ↓
POST /flashcards/:id/review { quality }
  ↓
Server tính toán SM-2:
  - again → reset repetition, interval = 1 day
  - hard → interval × 0.85
  - good → interval × ease_factor
  - easy → interval × 1.3 × ease_factor
  ↓
Show toast với interval tiếp theo ("Tốt - Ôn lại sau 6 ngày")
  ↓
Auto call GET /next-card sau 500ms
  ↓
Hiển thị card tiếp theo hoặc completion screen
```

### Bước 3: Hoàn thành hoặc tiếp tục

```
Nếu còn cards:
  → Lặp lại Bước 2

Nếu hết cards (all_completed = true):
  → Hiển thị completion screen với stats:
    - Total cards
    - Mastered cards
    - Learning cards
    - Due for review
  → Options:
    - "Về trang chủ"
    - "Học lại từ đầu" (call GET /next-card again)
```

---

## Testing Guide

### Test Case 1: Start New Flashcard Set

**Prerequisite**: Đăng nhập, có flashcard set với ít nhất 5 cards

**Steps**:

1. Vào `/flashcards`
2. Chọn một set chưa học
3. Click "Học ngay" hoặc navigate to `/flashcards/:id/learn`

**Expected**:

- ✅ Auto call `POST /start` (check network tab)
- ✅ Card đầu tiên hiển thị
- ✅ Badge "Thẻ mới" xuất hiện
- ✅ Stats bar shows: "Mới: 5, Đang học: 0, Thành thạo: 0, Cần ôn: 0"

---

### Test Case 2: Review Card with Quality Ratings

**Steps**:

1. Trong viewer, lật card (click hoặc Space)
2. Click "Tốt" (Good)

**Expected**:

- ✅ Toast: "Tốt - Ôn lại sau 1 ngày"
- ✅ Network call: `POST /flashcards/:id/review` với `{ quality: "good" }`
- ✅ Response có `interval_days: 1`, `repetition_count: 1`, `ease_factor: 2.6`
- ✅ Card tiếp theo tự động hiển thị sau 500ms
- ✅ Stats update: "Mới: 4, Đang học: 1"

**Try all quality ratings**:

- **Again** (❌ Chưa nhớ): Toast "<10 phút", interval reset to 1 day
- **Hard** (🧠 Khó): Toast "<1 ngày", interval reduced
- **Good** (✅ Tốt): Toast "1-6 ngày" (depends on repetition)
- **Easy** (⚡ Dễ): Toast "4+ ngày", interval increased

---

### Test Case 3: SM-2 Algorithm Progression

**Steps**:

1. Lật thẻ 1, chọn "Good"
   - Expected: interval = 1 day, repetition = 1
2. Lật thẻ 1 lại (giả sử đã qua 1 ngày), chọn "Good"
   - Expected: interval = 6 days, repetition = 2
3. Lật thẻ 1 lần nữa, chọn "Good"
   - Expected: interval ≈ 15 days (6 × 2.6), repetition = 3
4. Lật thẻ 1, chọn "Again"
   - Expected: interval reset to 1 day, repetition = 0, ease_factor giảm

**Verification**: Check database `user_flashcard_progress` table

```sql
SELECT * FROM user_flashcard_progress WHERE flashcard_id = X;
```

---

### Test Case 4: Dashboard "Jump back in"

**Prerequisite**: Đã học ít nhất 1 set (có progress)

**Steps**:

1. Vào `/flashcards`
2. Kiểm tra section "Jump back in"

**Expected**:

- ✅ Section chỉ hiển thị nếu có sets đang học
- ✅ Progress bar chính xác: `(learning + mastered) / total * 100%`
- ✅ Text: "X/Y cards reviewed"
- ✅ Click "Continue" → navigate to `/flashcards/:id/learn`
- ✅ Tiếp tục từ card tiếp theo (không phải card đầu tiên)

---

### Test Case 5: Due Cards Priority

**Setup**:

1. Học 3 cards, đánh giá tất cả "Good" (interval = 1 day)
2. Đợi hoặc manually update database set `next_review_at` về quá khứ:
   ```sql
   UPDATE user_flashcard_progress
   SET next_review_at = DATE_SUB(NOW(), INTERVAL 1 DAY)
   WHERE flashcard_id IN (1,2,3);
   ```

**Steps**:

1. Mở viewer lại
2. Check card đầu tiên

**Expected**:

- ✅ Card hiển thị có badge "Cần ôn" (đỏ)
- ✅ Stats: "Cần ôn: 3"
- ✅ Due cards xuất hiện trước new cards
- ✅ Sau khi review hết due cards, mới hiển thị new cards

---

### Test Case 6: Completion Screen

**Steps**:

1. Hoàn thành tất cả cards trong set (review hết)
2. Click qua card cuối cùng

**Expected**:

- ✅ Completion screen với confetti/celebration icon
- ✅ Stats hiển thị:
  - Tổng thẻ: X
  - Đã thành thạo: Y
  - Đang học: Z
  - Cần ôn hôm nay: W
- ✅ Nút "Về trang chủ" → navigate to `/flashcards`
- ✅ Nút "Học lại từ đầu" → reset và get next card

---

## Common Issues & Troubleshooting

### Issue 1: "Jump back in" không hiển thị sets

**Possible causes**:

- User chưa bắt đầu học set nào (chưa call `/start`)
- Backend `/active-sets` API không trả về data
- Progress API error

**Debug**:

```javascript
// Check network tab for:
GET /api/user/flashcards/active-sets
GET /api/user/flashcard-sets/:id/progress

// Check console logs:
console.log("Active sets:", result.active_sets);
```

**Fix**:

- Verify user đã login
- Check `user_flashcard_sets` table có data không
- Verify migrations đã chạy

---

### Issue 2: Quality rating không work

**Symptoms**: Click "Tốt/Dễ/..." nhưng không có gì xảy ra

**Debug**:

```javascript
// Check console:
Error reviewing flashcard: ...

// Check network:
POST /api/user/flashcards/:id/review
Response: 400/404/500
```

**Fix**:

- Verify flashcard_id đúng
- Check backend logs: `console.log('Review:', quality)`
- Verify JWT token còn valid

---

### Issue 3: Progress bar không đúng

**Symptoms**: Progress bar 0% hoặc không khớp với số cards đã học

**Debug**:

```javascript
// Check API response:
GET /api/user/flashcard-sets/:id/progress
{
  "cards_stats": {
    "total": 20,
    "new": 15,
    "learning": 3,
    "mastered": 2,
    "due_for_review": 1
  }
}

// Progress should be: (3 + 2) / 20 * 100 = 25%
```

**Fix**:

- Verify service layer `updateSetProgress()` được gọi sau review
- Check database `user_flashcard_sets.progress_percent`

---

### Issue 4: Cards không theo priority (due cards không hiển thị trước)

**Debug**:

```javascript
// Check API response:
GET /api/user/flashcard-sets/:id/next-card
{
  "flashcard_id": X,
  "is_due": true,  // Should be true for due cards
  "is_new": false,
  "next_review_at": "2025-01-25T10:00:00.000Z"
}
```

**Fix**:

- Check service layer `getNextCard()` query:
  ```sql
  -- Priority 1: Due cards (next_review_at <= NOW)
  -- Priority 2: New cards (no progress)
  -- Priority 3: Future cards (next_review_at > NOW)
  ```
- Verify `next_review_at` format đúng

---

## Performance Optimization

### Lazy Loading Active Sets

Hiện tại dashboard fetch progress cho TẤT CẢ active sets song song:

```javascript
const setsWithProgress = await Promise.all(
  activeSets.map(async (set) => {
    // Fetch progress for each set
  }),
);
```

**Pros**: Hiển thị progress ngay lập tức
**Cons**: Nhiều API calls nếu user có 10+ active sets

**Alternative**: Lazy load on hover/scroll

```javascript
const [hoveredSetId, setHoveredSetId] = (useState < number) | (null > null);

useEffect(() => {
  if (hoveredSetId) {
    fetchProgressForSet(hoveredSetId);
  }
}, [hoveredSetId]);
```

---

### Caching Progress Stats

Add client-side caching to reduce API calls:

```javascript
const [progressCache, setProgressCache] = useState<Map<number, any>>(new Map());

const fetchProgressWithCache = async (setId: number) => {
  if (progressCache.has(setId)) {
    const cached = progressCache.get(setId);
    // Return cached if < 5 minutes old
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }
  }

  // Fetch fresh data
  const data = await fetchProgress(setId);
  setProgressCache(new Map(progressCache).set(setId, {
    data,
    timestamp: Date.now()
  }));
  return data;
};
```

---

## Next Steps

### 1. Notification System (chưa implement)

Tạo cron job để gửi notification khi có cards due:

**Backend - Cron Job**:

```javascript
// server/src/services/notificationService.js
import cron from "node-cron";

// Run every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  const usersWithDueCards = await getUsersWithDueCards();

  for (const user of usersWithDueCards) {
    const dueCount = await getDueCardsCount(user.user_id);

    await sendPushNotification(user.user_id, {
      title: "Đến giờ ôn tập! 📚",
      body: `Bạn có ${dueCount} thẻ cần ôn hôm nay`,
      action: "/flashcards/review",
      icon: "/flashcard-icon.png",
    });
  }
});
```

**Frontend - Right Sidebar**:

```jsx
// Show daily review queue in right sidebar
<div className="bg-white rounded-lg p-4">
  <h3 className="font-bold mb-2">Cần ôn hôm nay</h3>
  <p className="text-3xl font-bold text-red-600">{dueCount}</p>
  <button className="mt-2 w-full bg-red-600 text-white py-2 rounded">
    Bắt đầu ôn tập
  </button>
</div>
```

---

### 2. Right Sidebar Content

Thêm nội dung vào sidebar bên phải:

```jsx
<aside className="hidden lg:block w-64 bg-gradient-to-b from-purple-900 via-indigo-800 to-indigo-900 text-white">
  <div className="p-6">
    {/* Daily Stats */}
    <div className="bg-white/10 rounded-lg p-4 mb-4">
      <h3 className="font-bold mb-2">Hôm nay</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Cần ôn:</span>
          <span className="font-bold">{dailyStats.due}</span>
        </div>
        <div className="flex justify-between">
          <span>Đã học:</span>
          <span className="font-bold">{dailyStats.reviewed}</span>
        </div>
      </div>
    </div>

    {/* Streak */}
    <div className="bg-white/10 rounded-lg p-4 mb-4">
      <h3 className="font-bold mb-2">Chuỗi ngày học</h3>
      <p className="text-3xl font-bold">🔥 {streak} ngày</p>
    </div>

    {/* Upcoming Reviews */}
    <div className="bg-white/10 rounded-lg p-4">
      <h3 className="font-bold mb-2">Sắp đến hạn</h3>
      <ul className="space-y-2 text-sm">
        <li>Ngày mai: 5 thẻ</li>
        <li>3 ngày nữa: 12 thẻ</li>
        <li>1 tuần nữa: 8 thẻ</li>
      </ul>
    </div>
  </div>
</aside>
```

---

### 3. Analytics Dashboard

Tạo trang thống kê chi tiết:

**Route**: `/flashcards/analytics`

**Features**:

- Biểu đồ cards learned per day (last 30 days)
- Ease factor distribution
- Success rate per quality rating
- Most difficult cards (lowest ease factor)
- Study time tracking
- Heatmap calendar (similar to GitHub contributions)

---

### 4. Keyboard Shortcuts Enhancement

Thêm shortcuts cho quality ratings:

```javascript
const handleKeyPress = (e: KeyboardEvent) => {
  if (!showAnswer) {
    if (e.key === " ") handleFlip(); // Space: Flip card
    return;
  }

  // Quality ratings (only after flipping)
  if (e.key === "1") handleReviewCard("again");
  if (e.key === "2") handleReviewCard("hard");
  if (e.key === "3") handleReviewCard("good");
  if (e.key === "4") handleReviewCard("easy");

  // Navigation
  if (e.key === "ArrowLeft") handlePrevious();
  if (e.key === "ArrowRight") handleNext();
};
```

Update help text:

```jsx
<p className="text-sm text-gray-600 text-center">
  <span className="font-medium">Phím tắt:</span>
  Space: Lật thẻ | 1: Chưa nhớ | 2: Khó | 3: Tốt | 4: Dễ
</p>
```

---

## Database Queries for Debugging

### Check user progress

```sql
SELECT
  f.front_content,
  p.repetition_count,
  p.ease_factor,
  p.interval_days,
  p.next_review_at,
  p.last_core
FROM user_flashcard_progress p
JOIN flashcards f ON p.flashcard_id = f.flashcard_id
WHERE p.user_id = YOUR_USER_ID
ORDER BY p.next_review_at;
```

### Find due cards

```sql
SELECT
  fs.title,
  COUNT(*) as due_count
FROM user_flashcard_progress p
JOIN flashcards f ON p.flashcard_id = f.flashcard_id
JOIN flashcard_sets fs ON f.flashcard_set_id = fs.flashcard_set_id
WHERE p.user_id = YOUR_USER_ID
  AND p.next_review_at <= NOW()
GROUP BY fs.flashcard_set_id;
```

### Check set progress

```sql
SELECT
  fs.title,
  COUNT(DISTINCT f.flashcard_id) as total_cards,
  COUNT(DISTINCT p.flashcard_id) as reviewed_cards,
  AVG(p.ease_factor) as avg_ease,
  AVG(p.interval_days) as avg_interval
FROM flashcard_sets fs
JOIN flashcards f ON fs.flashcard_set_id = f.flashcard_set_id
LEFT JOIN user_flashcard_progress p
  ON f.flashcard_id = p.flashcard_id
  AND p.user_id = YOUR_USER_ID
WHERE fs.flashcard_set_id = YOUR_SET_ID
GROUP BY fs.flashcard_set_id;
```

---

## Summary of Changes

| Component             | Before                  | After                                |
| --------------------- | ----------------------- | ------------------------------------ |
| **Progress Storage**  | localStorage            | Database (user_flashcard_progress)   |
| **Rating System**     | Binary (Biết/Chưa biết) | SM-2 (Again/Hard/Good/Easy)          |
| **Card Selection**    | Manual array navigation | Backend priority queue               |
| **Progress Display**  | currentIndex+1 / total  | (learning+mastered) / total          |
| **Dashboard Data**    | localStorage scan       | Backend API (active-sets + progress) |
| **Learning Tracking** | Client-side only        | Server-side with scheduled reviews   |

---

## Related Documentation

- [FLASHCARD_LEARNING_API_GUIDE.md](./FLASHCARD_LEARNING_API_GUIDE.md) - Backend API reference
- [FLASHCARD_API_GUIDE.md](./FLASHCARD_API_GUIDE.md) - CRUD operations
- [FLASHCARD_BUSINESS_LOGIC.md](./FLASHCARD_BUSINESS_LOGIC.md) - Business rules

---

## Contact & Support

Nếu gặp vấn đề khi testing:

1. Check browser console for errors
2. Check network tab for failed API calls
3. Check backend server logs
4. Verify database migrations: `npx sequelize-cli db:migrate`
5. Clear browser cache and localStorage if needed
