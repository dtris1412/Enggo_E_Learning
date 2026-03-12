# Debug Guide - Media & Questions Not Showing

## Đã thêm Debug Logging

Đã thêm comprehensive debug logging vào toàn bộ data flow. Khi bạn click vào bài học, console sẽ hiển thị:

### 1. **Learning Context (learningContext.tsx)**

#### selectLesson:

- 🎯 `selectLesson called with moduleLessonId: X`
- ✅ `Found module lesson: [lesson_title]`
- 📊 `Loading progress for lesson_id: X`
- 🔄 `Calling loadLessonDetail for lesson_id: X`
- ✅ `selectLesson completed`

#### loadLessonDetail:

- 🔍 `Loading lesson detail for lesson_id: X`
- 📦 `Raw API response: {...}` - Kiểm tra response từ API
- 📊 `Before transform - Lesson_Media: [...]` - Data trước khi transform
- 📊 `Before transform - Lesson_Questions: [...]`
- ✅ `After transform - Lesson_Media count: X`
- ✅ `After transform - Lesson_Questions count: X`
- 📋 `Full transformed lesson data: {...}` - Data đã transform
- 💾 `Lesson saved to state`

### 2. **LessonContent Component**

- 🎨 `Rendering LessonContent`
- 📚 `Current lesson: [lesson_title]`
- 📊 `Media available: X`
- ❓ `Questions available: X`
- 🎬 `Media data: [...]` - Nếu có media
- 📝 `Questions data: [...]` - Nếu có questions
- 🔍 `Checking Lesson_Media condition: {...}` - Chi tiết điều kiện render
- 🔍 `Checking Lesson_Questions condition: {...}`

### 3. **Child Components**

#### LessonMediaGallery:

- 📸 `LessonMediaGallery rendered with media: [...]`
- 📊 `Media count: X`
- ⚠️ `LessonMediaGallery: No media to display` - Nếu không có

#### LessonQuiz:

- ❓ `LessonQuiz rendered with questions: [...]`
- 📊 `Questions count: X`
- ⚠️ `LessonQuiz: No questions to display` - Nếu không có

---

## Cách Debug

### Bước 1: Mở DevTools

1. Press `F12` hoặc right-click → Inspect
2. Chuyển sang tab **Console**
3. Clear console: `Ctrl + L`

### Bước 2: Reload và Click Lesson

1. Reload trang: `Ctrl + R`
2. Navigate đến Learning Space
3. Click vào bài học `lesson_id = 1`

### Bước 3: Phân tích Logs

#### ✅ Flow Đúng:

```
🎯 selectLesson called with moduleLessonId: X
✅ Found module lesson: TOEIC Listening Part 1
📊 Loading progress for lesson_id: 1
🔄 Calling loadLessonDetail for lesson_id: 1
🔍 Loading lesson detail for lesson_id: 1
📦 Raw API response: {success: true, data: {...}}
📊 Before transform - Lesson_Media: (4) [{...}, {...}, {...}, {...}]
📊 Before transform - Lesson_Questions: (2) [{...}, {...}]
✅ After transform - Lesson_Media count: 4
✅ After transform - Lesson_Questions count: 2
💾 Lesson saved to state
✅ selectLesson completed
🎨 Rendering LessonContent
📚 Current lesson: TOEIC Listening Part 1
📊 Media available: 4
❓ Questions available: 2
🔍 Checking Lesson_Media condition: {exists: true, isArray: true, length: 4, shouldRender: true}
📸 LessonMediaGallery rendered with media: (4) [{...}]
🔍 Checking Lesson_Questions condition: {exists: true, isArray: true, length: 2, shouldRender: true}
❓ LessonQuiz rendered with questions: (2) [{...}]
```

#### ❌ Các Vấn đề Có Thể:

**1. API không trả về data:**

```
📦 Raw API response: {success: false, message: "..."}
```

→ Kiểm tra backend service, database có data không

**2. Field names sai:**

```
📊 Before transform - Lesson_Media: undefined
📊 Before transform - Lesson_Questions: undefined
```

→ Kiểm tra API response, có thể field name là `Lesson_Medias` hoặc khác
→ Expand `Raw API response` để xem field names thực tế

**3. Data không lưu vào state:**

```
🎨 Rendering LessonContent
📚 Current lesson: TOEIC Listening Part 1
📊 Media available: 0  ← Số này phải là 4
❓ Questions available: 0  ← Số này phải là 2
```

→ State không được update, có thể do React re-render issue

**4. Conditions không pass:**

```
🔍 Checking Lesson_Media condition: {exists: true, isArray: false, ...}
```

→ Data không phải array

**5. Components không render:**

- Không thấy logs `📸 LessonMediaGallery rendered`
- Không thấy logs `❓ LessonQuiz rendered`
  → Components bị block bởi conditions

---

## Expected Console Output

Với API response bạn đã cung cấp, bạn **PHẢI** thấy:

```javascript
📦 Raw API response: {
  success: true,
  data: {
    lesson_id: 1,
    lesson_title: "TOEIC Listening Part 1 - Làm quen với Part",
    Lesson_Media: [
      {media_id: 3, media_type: "audio", ...},
      {media_id: 6, media_type: "text", ...},
      {media_id: 1, media_type: "video", ...},
      {media_id: 5, media_type: "text", ...}
    ],
    Lesson_Questions: [
      {lesson_question_id: 1, content: "The documents...", ...},
      {lesson_question_id: 2, content: "The documents...", ...}
    ]
  }
}
```

Và sau đó:

```
✅ After transform - Lesson_Media count: 4
✅ After transform - Lesson_Questions count: 2
```

---

## Nếu Vẫn Không Hiển thị

### Check 1: Inspect Raw API Response

Expand `📦 Raw API response` và kiểm tra:

- `result.data.Lesson_Media` có tồn tại không?
- `result.data.Lesson_Questions` có tồn tại không?
- Field names có đúng không? (có thể là `Lesson_Medias` với 's')

### Check 2: Verify Transform

- `Before transform` có data không?
- `After transform count` có đúng số lượng không?

### Check 3: Check Component Render

- Có thấy `📸 LessonMediaGallery rendered` không?
- Có thấy `❓ LessonQuiz rendered` không?

### Check 4: React DevTools

1. Install React DevTools extension
2. Open Components tab
3. Find `LessonContent` component
4. Check `currentLesson` props
5. Verify `Lesson_Media` và `Lesson_Questions` arrays

---

## Quick Fix Commands

Nếu vẫn không work, thử:

1. **Hard Reload:**

   ```
   Ctrl + Shift + R (or Cmd + Shift + R on Mac)
   ```

2. **Clear Cache:**

   ```
   F12 → Network tab → Disable cache checkbox
   ```

3. **Check Network Tab:**
   - F12 → Network tab
   - Filter: XHR/Fetch
   - Find request: `GET /api/user/lessons/1`
   - Click → Preview tab
   - Xem response data

---

## Report Back

Sau khi debug, báo lại:

1. Screenshot console logs
2. Hoặc copy/paste đoạn logs từ `🎯 selectLesson` đến `📝 Questions data`
3. Screenshot Network tab cho API call `/api/user/lessons/1`

Từ đó tôi sẽ biết chính xác vấn đề ở đâu! 🎯
