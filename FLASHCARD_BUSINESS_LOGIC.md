# Flashcard Management - Business Logic

## 📌 Nghiệp vụ tạo Flashcard Set

### 1. Tạo thủ công (Manual)

**Mục đích**: Tạo set flashcard rỗng, sau đó tự thêm cards thủ công

**Cách sử dụng**:

- Admin/User chọn "Manual (Create Empty Set)"
- Nhập title, description, visibility
- Submit → Tạo set rỗng
- Sau đó vào quản lý set để thêm flashcards thủ công

**API Request**:

```javascript
POST / api / admin / flashcard - sets;
Authorization: Bearer <
  token >
  {
    title: "My English Vocabulary",
    description: "Personal flashcard set",
    source_type: "manual",
    visibility: "private",
    user_id: 123, // Optional, admin only
  };

// Response:
// - source_type: "manual"
// - created_by_type: "user" (role 2) hoặc "admin" (role 1)
// - total_cards: 0
```

---

### 2. Tạo từ Exam (AI Generated)

**Mục đích**: Chọn exam từ danh sách → AI tự động generate flashcards từ câu hỏi trong exam

**Cách sử dụng**:

- Tại trang quản lý flashcard
- Chọn "From Exam (AI Generated)"
- Chọn exam từ dropdown (hiển thị tất cả exams)
- Submit → AI tự động tạo flashcards từ exam questions

**API Request**:

```javascript
POST / api / admin / flashcard - sets;
Authorization: Bearer <
  token >
  {
    title: "Vocabulary from TOEIC Test 2024",
    description: "AI generated from exam",
    source_type: "exam",
    exam_id: 5,
    visibility: "public",
  };

// Response:
// - source_type: "exam"
// - exam_id: 5
// - created_by_type: "AI" (tự động)
// - total_cards: 50 (AI đã generate)
```

**Backend Logic**:

```javascript
// Controller tự động xác định created_by_type
if (source_type === "exam") {
  created_by_type = "AI";
} else {
  created_by_type = role === 1 ? "admin" : "user";
}
```

---

### 3. Tạo từ User Exam (Future Feature)

**Mục đích**: Sau khi hoàn thành bài thi, có nút "Create Flashcards from My Results"

**Cách sử dụng** (sẽ phát triển sau):

- User làm bài thi xong
- Xem kết quả bài thi
- Click nút "Create Flashcards" → Tự động tạo flashcards từ:
  - Các câu sai
  - Các câu khó
  - Vocabulary trong bài thi

**API Request** (dự kiến):

```javascript
POST / api / admin / flashcard - sets;
Authorization: Bearer <
  token >
  {
    title: "Review Mistakes from My TOEIC Test",
    description: "Flashcards from my exam results",
    source_type: "user_exam",
    user_exam_id: 123,
    visibility: "private",
  };

// Response:
// - source_type: "user_exam"
// - user_exam_id: 123
// - created_by_type: "AI"
// - Chỉ chứa các câu cần ôn tập
```

---

## 🔐 Phân quyền

### User thường (role = 2)

| Action             | Manual | From Exam | From User Exam |
| ------------------ | ------ | --------- | -------------- |
| Tạo cho chính mình | ✅     | ✅        | ✅ (future)    |
| Tạo cho user khác  | ❌     | ❌        | ❌             |
| created_by_type    | "user" | "AI"      | "AI"           |

### Admin (role = 1)

| Action             | Manual  | From Exam | From User Exam |
| ------------------ | ------- | --------- | -------------- |
| Tạo cho chính mình | ✅      | ✅        | ✅ (future)    |
| Tạo cho user khác  | ✅      | ❌        | ❌             |
| created_by_type    | "admin" | "AI"      | "AI"           |

**Lưu ý**:

- Chỉ có Manual mode mới cho phép admin tạo cho user khác
- Exam và User Exam luôn tạo cho chính mình (user đang đăng nhập)

---

## 🎯 Source Types

| Source Type | Khi nào dùng               | Required Fields         | Created By Type        |
| ----------- | -------------------------- | ----------------------- | ---------------------- |
| `manual`    | Tạo thủ công, set rỗng     | `title`                 | admin/user (theo role) |
| `exam`      | Chọn exam để AI generate   | `title`, `exam_id`      | AI (tự động)           |
| `user_exam` | Từ bài thi đã làm (future) | `title`, `user_exam_id` | AI (tự động)           |

---

## 🖥️ Frontend UI

### AddFlashcardSetModal

**2 Modes**:

1. **Manual (Create Empty Set)**
   - Input: Title, Description, Visibility
   - Admin: Có thể chỉ định User ID
   - Created by: Tự động theo role

2. **From Exam (AI Generated)**
   - Input: Title, Description, Visibility
   - Dropdown: Chọn Exam từ danh sách
   - Icon: ✨ Sparkles để nhận biết AI
   - Help text: "AI will automatically generate flashcards from selected exam"
   - Không hiển thị User ID field (luôn tạo cho chính mình)

**Code Example**:

```tsx
{
  formData.source_type === "exam" && (
    <select name="exam_id" required>
      <option value="">-- Choose an exam --</option>
      {exams?.map((exam) => (
        <option value={exam.exam_id}>
          {exam.exam_title} ({exam.exam_type})
        </option>
      ))}
    </select>
  );
}
```

---

## 📝 Best Practices

1. **Validation**:
   - Manual: Chỉ cần title
   - From Exam: Cần title + exam_id
   - From User Exam: Cần title + user_exam_id

2. **Security**:
   - created_by_type tự động xác định, không nhận từ user input
   - Chỉ admin mới được assign user_id khác (manual only)
   - Backend luôn validate role và source_type

3. **UX**:
   - Hiển thị icon ✨ cho AI-generated
   - Help text rõ ràng cho từng mode
   - Exam dropdown với exam title + exam type
   - Loading state khi fetch exams

4. **Future**:
   - User Exam feature sẽ có nút tạo ngay tại trang kết quả bài thi
   - Có thể filter flashcards theo: câu sai, câu khó, vocabulary
   - Có thể tùy chỉnh số lượng flashcards tạo ra
