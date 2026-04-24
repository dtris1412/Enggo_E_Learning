# Hướng Dẫn Import Hàng Loạt Câu Hỏi vào Exam Container

## Tổng Quan

Tính năng này cho phép admin thêm nhiều câu hỏi vào một exam container (part) cùng lúc, tương tự như cách thêm nhiều flashcards. Điều này đặc biệt hữu ích khi copy-paste danh sách câu hỏi từ Excel hoặc file text.

## API Endpoint

### Thêm Nhiều Câu Hỏi vào Container

**Endpoint:** `POST /api/admin/container-questions/bulk`

**Authentication:** Yêu cầu admin token

**Request Body:**

```json
{
  "container_id": 123,
  "questions": [
    {
      "question_content": "What is the capital of France?",
      "explanation": "Paris is the capital and largest city of France.",
      "order": 1,
      "image_url": "https://example.com/paris.jpg",
      "audio_url": "https://example.com/paris-audio.mp3",
      "score": 1.0,
      "options": [
        {
          "label": "A",
          "content": "London",
          "is_correct": false,
          "order_index": 1
        },
        {
          "label": "B",
          "content": "Paris",
          "is_correct": true,
          "order_index": 2
        },
        {
          "label": "C",
          "content": "Berlin",
          "is_correct": false,
          "order_index": 3
        },
        {
          "label": "D",
          "content": "Madrid",
          "is_correct": false,
          "order_index": 4
        }
      ]
    },
    {
      "question_content": "Which planet is known as the Red Planet?",
      "explanation": "Mars is called the Red Planet because of its reddish appearance.",
      "order": 2,
      "image_url": null,
      "audio_url": null,
      "score": 1.0,
      "options": [
        {
          "label": "A",
          "content": "Venus",
          "is_correct": false,
          "order_index": 1
        },
        {
          "label": "B",
          "content": "Mars",
          "is_correct": true,
          "order_index": 2
        },
        {
          "label": "C",
          "content": "Jupiter",
          "is_correct": false,
          "order_index": 3
        },
        {
          "label": "D",
          "content": "Saturn",
          "is_correct": false,
          "order_index": 4
        }
      ]
    }
  ]
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "2 questions added to container successfully.",
  "data": [
    {
      "question": {
        "question_id": 456,
        "question_content": "What is the capital of France?",
        "explanation": "Paris is the capital and largest city of France.",
        "created_at": "2026-03-17T10:30:00.000Z",
        "updated_at": "2026-03-17T10:30:00.000Z"
      },
      "containerQuestion": {
        "container_question_id": 789,
        "container_id": 123,
        "question_id": 456,
        "order": 1,
        "image_url": "https://example.com/paris.jpg",
        "score": 1.0
      },
      "options": [...]
    },
    ...
  ]
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Question at index 0 must have at least one correct answer."
}
```

## Cấu Trúc Dữ Liệu

### Question Object

| Field              | Type   | Required | Description                          |
| ------------------ | ------ | -------- | ------------------------------------ |
| `question_content` | string | Yes      | Nội dung câu hỏi                     |
| `explanation`      | string | No       | Giải thích đáp án                    |
| `order`            | number | Yes      | Thứ tự câu hỏi trong container       |
| `image_url`        | string | No       | URL hình ảnh kèm theo câu hỏi        |
| `audio_url`        | string | No       | URL âm thanh riêng cho câu hỏi (mới) |
| `score`            | number | No       | Điểm số (mặc định: 1.0)              |
| `options`          | array  | Yes      | Mảng các đáp án (tối thiểu 1)        |

### Option Object

| Field         | Type    | Required | Description                   |
| ------------- | ------- | -------- | ----------------------------- |
| `label`       | string  | Yes      | Nhãn đáp án (A, B, C, D, ...) |
| `content`     | string  | Yes      | Nội dung đáp án               |
| `is_correct`  | boolean | Yes      | Đáp án đúng hay sai           |
| `order_index` | number  | No       | Thứ tự hiển thị (mặc định: 1) |

## Quy Tắc Validation

1. **Container phải tồn tại:** Container ID phải hợp lệ
2. **Mảng questions không được rỗng:** Phải có ít nhất 1 câu hỏi
3. **Mỗi câu hỏi phải có:**
   - `question_content` không rỗng
   - `order` là số hợp lệ
   - Ít nhất 1 option
   - Ít nhất 1 đáp án đúng (is_correct = true)
4. **Mỗi option phải có:**
   - `label` không rỗng
   - `content` không rỗng
   - `is_correct` được định nghĩa (true/false)

## Cách Sử dụng

### 1. Chuẩn Bị Dữ Liệu từ Excel/CSV

Bạn có thể chuẩn bị dữ liệu trong Excel với các cột:

| Question    | Explanation | Order | Image URL | Score | Option A | Option B | Option C | Option D | Correct |
| ----------- | ----------- | ----- | --------- | ----- | -------- | -------- | -------- | -------- | ------- |
| What is...? | Because...  | 1     | url       | 1.0   | London   | Paris    | Berlin   | Madrid   | B       |

### 2. Chuyển Đổi sang JSON

Sử dụng script hoặc công cụ để chuyển đổi dữ liệu Excel thành format JSON như trên.

### 3. Gọi API

```javascript
const response = await fetch("/api/admin/container-questions/bulk", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    container_id: containerId,
    questions: questionsArray,
  }),
});

const result = await response.json();
console.log(result);
```

## Lợi Ích

1. **Tiết kiệm thời gian:** Thêm hàng chục/hàng trăm câu hỏi chỉ trong 1 request
2. **Atomic transaction:** Tất cả câu hỏi được tạo hoặc không tạo câu nào (nếu có lỗi)
3. **Validation đầy đủ:** Kiểm tra dữ liệu trước khi insert vào database
4. **Dễ import từ nguồn khác:** Copy-paste từ Excel, CSV hoặc file text

## Ví Dụ với TOEIC Reading Part 5

```json
{
  "container_id": 101,
  "questions": [
    {
      "question_content": "The manager asked all employees _____ the meeting room by 2 PM.",
      "explanation": "'to enter' is the correct infinitive form after 'ask someone'",
      "order": 1,
      "score": 1.0,
      "options": [
        {
          "label": "A",
          "content": "enter",
          "is_correct": false,
          "order_index": 1
        },
        {
          "label": "B",
          "content": "to enter",
          "is_correct": true,
          "order_index": 2
        },
        {
          "label": "C",
          "content": "entering",
          "is_correct": false,
          "order_index": 3
        },
        {
          "label": "D",
          "content": "entered",
          "is_correct": false,
          "order_index": 4
        }
      ]
    },
    {
      "question_content": "Our company has _____ expanded its operations to Southeast Asia.",
      "explanation": "'recently' is an adverb that fits the present perfect tense",
      "order": 2,
      "score": 1.0,
      "options": [
        {
          "label": "A",
          "content": "recent",
          "is_correct": false,
          "order_index": 1
        },
        {
          "label": "B",
          "content": "recently",
          "is_correct": true,
          "order_index": 2
        },
        {
          "label": "C",
          "content": "more recent",
          "is_correct": false,
          "order_index": 3
        },
        {
          "label": "D",
          "content": "most recently",
          "is_correct": false,
          "order_index": 4
        }
      ]
    }
  ]
}
```

## Error Handling

Tất cả các lỗi sẽ rollback toàn bộ transaction. Các lỗi phổ biến:

1. **Container not found:** Container ID không tồn tại
2. **Invalid data structure:** Thiếu trường bắt buộc
3. **No correct answer:** Không có đáp án đúng nào
4. **Empty options:** Câu hỏi không có option nào
5. **Database error:** Lỗi khi insert vào database

## Technical Details

- **Service:** `containerQuestionService.addMultipleQuestionsToContainer()`
- **Controller:** `containerQuestionController.addMultipleQuestionsToContainer()`
- **Route:** `POST /api/admin/container-questions/bulk`
- **Transaction:** Sử dụng Sequelize transaction để đảm bảo tính toàn vẹn
- **Models:** Question, Container_Question, Question_Option

## Next Steps

Có thể mở rộng thêm:

1. Import từ CSV/Excel file trực tiếp
2. Template download để điền dữ liệu
3. Preview trước khi submit
4. Validate format trong frontend
5. Progress indicator cho bulk import lớn
