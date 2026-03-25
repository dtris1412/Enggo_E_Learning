# Question Type Implementation Guide

## Tổng quan

Hướng dẫn triển khai trường `question_type` (ENUM) cho bảng `questions` để phân loại câu hỏi theo TOEIC và IELTS.

---

## 1. Database Migration

### File migration

- **Path**: `server/src/migrations/20260325055703-alter-questions.cjs`
- **Mục đích**: Thêm cột `question_type` vào bảng `questions`

### Chạy migration

```bash
cd server/src
npx sequelize-cli db:migrate
```

### Rollback (nếu cần)

```bash
cd server/src
npx sequelize-cli db:migrate:undo
```

### Cấu trúc cột mới

- **Tên cột**: `question_type`
- **Kiểu**: ENUM
- **allowNull**: false
- **defaultValue**: "reading_multiple_choice" (cho dữ liệu cũ)

### Các giá trị ENUM

#### TOEIC

- `listening_photographs` (Part 1)
- `listening_question_response` (Part 2)
- `listening_conversation` (Part 3)
- `listening_talk` (Part 4)
- `reading_incomplete_sentences` (Part 5)
- `reading_text_completion` (Part 6)
- `reading_reading_comprehension` (Part 7)
- `grammar`
- `vocabulary`

#### IELTS

- `reading_matching_headings`
- `reading_true_false_not_given`
- `reading_multiple_choice`
- `reading_matching_information`
- `reading_sentence_completion`
- `reading_summary_completion`
- `reading_short_answer`
- `writing_task_1`
- `writing_task_2`
- `speaking_part_1`
- `speaking_part_2`
- `speaking_part_3`
- `grammar`
- `vocabulary`

---

## 2. Backend Changes

### 2.1. Model Update

**File**: `server/src/models/question.js`

Đã thêm trường `question_type` vào model Question với ENUM values.

### 2.2. Service Layer

**File**: `server/src/admin/services/questionService.js`

#### createQuestion

- **Tham số mới**: `question_type` (required)
- **Validation**: Kiểm tra question_type không được null
- **Return**: Question với question_type

#### updateQuestion

- **Tham số mới**: `question_type` (optional)
- **Logic**: Chỉ update question_type nếu được truyền vào

### 2.3. Controller Layer

**File**: `server/src/admin/controllers/questionController.js`

#### createQuestion

- Nhận `question_type` từ `req.body`
- Truyền vào service

#### updateQuestion

- Nhận `question_type` từ `req.body`
- Truyền vào service

---

## 3. Frontend Changes

### 3.1. Constants File

**File**: `client/src/admin/constants/questionTypes.ts`

#### Exports:

- `QuestionType` - Type definition
- `ExamType` - Type definition ("TOEIC" | "IELTS")
- `QuestionTypeOption` - Interface cho dropdown options
- `TOEIC_QUESTION_TYPES` - Array of TOEIC question types
- `IELTS_QUESTION_TYPES` - Array of IELTS question types
- `ALL_QUESTION_TYPES` - Combined array
- `getQuestionTypesByExamType(examType)` - Helper function
- `getQuestionTypeLabel(type)` - Get label by value
- `isValidQuestionTypeForExam(questionType, examType)` - Validation

### 3.2. Context Update

**File**: `client/src/admin/contexts/examContext.tsx`

#### Question Interface

Thêm field: `question_type: string`

#### createQuestion Function

- Tham số mới: `question_type: string` (required)
- Gửi trong body của POST request

### 3.3. AddQuestionModal Component

**File**: `client/src/admin/components/ExamManagement/AddQuestionModal.tsx`

#### Props mới:

- `examType?: ExamType` - Optional, để filter question types

#### Features:

- Dropdown select cho `question_type`
- Auto-filter options dựa vào `examType`
- Hiển thị warning nếu examType undefined
- Default value: First option trong filtered list

#### Form Fields:

1. **Question Content** (textarea, required)
2. **Question Type** (select, required) - **MỚI**
3. **Explanation** (textarea, optional)
4. **Image Upload** (file input, optional)
5. **Order** (number, required)
6. **Score** (number, required)

### 3.4. ExamDetail Page Update

**File**: `client/src/admin/pages/ExamDetail.tsx`

Truyền `examType={exam?.exam_type}` vào AddQuestionModal.

---

## 4. Flow khi tạo câu hỏi mới

### Backend Flow:

1. Admin gửi POST request đến `/api/admin/questions`
2. Body: `{ question_content, explanation, question_type }`
3. Controller nhận request
4. Service validate và tạo question mới với question_type
5. Return question_id

### Frontend Flow:

1. Admin mở modal "Thêm câu hỏi"
2. Modal nhận `examType` từ exam hiện tại
3. Filter danh sách question types theo examType
4. Admin nhập nội dung và chọn question_type từ dropdown
5. Submit form → gọi `createQuestion({ question_content, explanation, question_type })`
6. Sau khi tạo question, thêm vào container
7. Reload data và đóng modal

---

## 5. Validation & Best Practices

### Backend Validation

- ✅ question_type là required khi tạo mới
- ✅ question_type phải thuộc ENUM values
- ✅ Database constraint đảm bảo data integrity

### Frontend Validation

- ✅ Dropdown chỉ hiển thị options phù hợp với exam_type
- ✅ Required field, không thể submit nếu chưa chọn
- ✅ Auto-select first option khi mở modal

### UX Considerations

- ⚠️ Nếu exam không có exam_type, hiển thị tất cả question types với warning
- ✅ Label rõ ràng với description cho từng type
- ✅ Group theo skill (listening/reading/writing/speaking) trong future enhancement

---

## 6. Testing Checklist

### Backend Testing

- [ ] Tạo question mới với question_type
- [ ] Update question với question_type mới
- [ ] Validate ENUM constraint (thử gửi invalid type)
- [ ] Test với existing data (default value hoạt động)

### Frontend Testing

- [ ] Mở modal trong exam TOEIC → chỉ thấy TOEIC question types
- [ ] Mở modal trong exam IELTS → chỉ thấy IELTS question types
- [ ] Tạo câu hỏi mới với từng loại type
- [ ] Kiểm tra data được lưu đúng trong database
- [ ] Test responsive UI của dropdown

### Integration Testing

- [ ] Tạo exam TOEIC → tạo question với TOEIC type → lưu thành công
- [ ] Tạo exam IELTS → tạo question với IELTS type → lưu thành công
- [ ] Import bulk questions → question_type được set đúng
- [ ] Export questions → question_type được hiển thị

---

## 7. Known Issues & Solutions

### Issue 1: Existing Questions

**Problem**: Questions tạo trước khi thêm question_type sẽ có defaultValue
**Solution**: Migration đã set defaultValue = "reading_multiple_choice"
**Action Required**: Admin cần review và update question_type cho câu hỏi cũ

### Issue 2: Exam Without exam_type

**Problem**: Một số exam cũ có thể không có exam_type
**Solution**: Modal hiển thị all question types với warning
**Action Required**: Update exam_type cho các exam cũ

### Issue 3: Type Safety

**Problem**: TypeScript type cho question_type là string
**Solution**: Sử dụng QuestionType type từ constants file
**Future Enhancement**: Strict typing trong interfaces

---

## 8. Future Enhancements

### Phase 2

- [ ] Thêm question_type vào bulk import template
- [ ] Filter questions theo type trong question management
- [ ] Statistics dashboard theo question type
- [ ] Auto-suggest question_type dựa vào container skill

### Phase 3 (Phân tích kết quả)

- [ ] Thống kê user làm sai nhiều theo question_type
- [ ] Đề xuất lộ trình ôn tập dựa vào weakness_types
- [ ] Report admin: question_type nào khó nhất

---

## 9. Files Changed Summary

### Backend (4 files)

1. `server/src/models/question.js` - Added question_type ENUM
2. `server/src/admin/services/questionService.js` - Updated create/update logic
3. `server/src/admin/controllers/questionController.js` - Added question_type param
4. `server/src/migrations/20260325055703-alter-questions.cjs` - Migration file

### Frontend (4 files)

1. `client/src/admin/constants/questionTypes.ts` - **NEW** Constants & helpers
2. `client/src/admin/contexts/examContext.tsx` - Updated Question interface & createQuestion
3. `client/src/admin/components/ExamManagement/AddQuestionModal.tsx` - Added question_type dropdown
4. `client/src/admin/pages/ExamDetail.tsx` - Pass examType to modal

---

## 10. Quick Start

### Bước 1: Run Migration

```bash
cd server/src
npx sequelize-cli db:migrate
```

### Bước 2: Restart Backend

```bash
cd server
npm run dev
```

### Bước 3: Refresh Frontend

Frontend tự động reload khi code thay đổi.

### Bước 4: Test

1. Vào ExamManagement
2. Chọn 1 exam TOEIC
3. Click "Thêm câu hỏi"
4. Kiểm tra dropdown chỉ hiển thị TOEIC types
5. Tạo câu hỏi và verify trong database

---

## 11. Troubleshooting

### Lỗi: ENUM type already exists

**Solution**:

```sql
DROP TYPE IF EXISTS "enum_questions_question_type";
```

Then re-run migration.

### Lỗi: Column question_type cannot be null

**Solution**: Migration đã có defaultValue, nhưng nếu vẫn lỗi:

1. Check migration đã chạy chưa
2. Verify defaultValue trong migration
3. Manually update existing records

### Lỗi: Frontend không hiển thị dropdown

**Solution**:

1. Check import constants file
2. Verify examType được pass vào modal
3. Check console for errors

---

## Kết luận

Triển khai question_type hoàn tất với:

- ✅ Database migration với ENUM constraint
- ✅ Backend validation & business logic
- ✅ Frontend filtering theo exam type
- ✅ Type-safe constants & helpers
- ✅ User-friendly UI/UX

**Next Steps**: Chạy migration → Test → Deploy → Monitor data quality
