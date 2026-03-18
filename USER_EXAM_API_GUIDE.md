# USER EXAM API GUIDE

Hướng dẫn API cho chức năng thi thử online dành cho user.

## Tổng quan

Hệ thống thi thử online cho phép user:

- Xem danh sách đề thi
- Làm bài thi trực tuyến
- Lưu câu trả lời trong quá trình làm bài
- Submit bài thi và nhận kết quả tự động
- Xem lại kết quả và đáp án chi tiết
- Xem lịch sử các lần thi

## 1. Xem danh sách đề thi

**Endpoint:** `GET /api/user/exams`

**Quyền:** Public (không cần đăng nhập)

**Query Parameters:**

- `search` (string, optional): Tìm kiếm theo tên hoặc mã đề thi
- `exam_type` (string, optional): Lọc theo loại đề thi (`TOEIC`, `IELTS`)
- `year` (number, optional): Lọc theo năm
- `certificate_id` (number, optional): Lọc theo chứng chỉ
- `limit` (number, default: 10): Số lượng bản ghi trên 1 trang
- `page` (number, default: 1): Số trang

**Response:**

```json
{
  "success": true,
  "message": "Exams retrieved successfully",
  "data": {
    "exams": [
      {
        "exam_id": 1,
        "exam_title": "TOEIC Full Test 2024",
        "exam_code": "TC123ABC",
        "exam_duration": 120,
        "year": 2024,
        "exam_type": "TOEIC",
        "source": "ETS Official",
        "total_questions": 200,
        "created_at": "2024-01-01T00:00:00.000Z",
        "Certificate": {
          "certificate_id": 1,
          "certificate_name": "TOEIC"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

## 2. Xem thông tin chi tiết đề thi

**Endpoint:** `GET /api/user/exams/:exam_id`

**Quyền:** Public (không cần đăng nhập)

**Response:**

```json
{
  "success": true,
  "message": "Exam retrieved successfully",
  "data": {
    "exam_id": 1,
    "exam_title": "TOEIC Full Test 2024",
    "exam_code": "TC123ABC",
    "exam_duration": 120,
    "year": 2024,
    "exam_type": "TOEIC",
    "source": "ETS Official",
    "total_questions": 200,
    "created_at": "2024-01-01T00:00:00.000Z",
    "Certificate": {
      "certificate_id": 1,
      "certificate_name": "TOEIC"
    },
    "Exam_Medias": [
      {
        "media_id": 1,
        "audio_url": "https://example.com/audio.mp3",
        "duration": 2700
      }
    ]
  }
}
```

## 3. Lấy đề thi để làm bài

**Endpoint:** `GET /api/user/exams/:exam_id/take`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "message": "Exam for taking retrieved successfully",
  "data": {
    "exam_id": 1,
    "exam_title": "TOEIC Full Test 2024",
    "exam_code": "TC123ABC",
    "exam_duration": 120,
    "exam_type": "TOEIC",
    "total_questions": 200,
    "Certificate": {
      "certificate_id": 1,
      "certificate_name": "TOEIC"
    },
    "Exam_Medias": [...],
    "Exam_Containers": [
      {
        "container_id": 1,
        "skill": "listening",
        "type": "toeic_group",
        "order": 1,
        "content": "Photographs",
        "instruction": "Look at the picture and choose the best answer",
        "image_url": null,
        "audio_url": "https://example.com/part1.mp3",
        "time_limit": null,
        "Container_Questions": [
          {
            "container_question_id": 1,
            "order": 1,
            "image_url": "https://example.com/q1.jpg",
            "score": 1.00,
            "Question": {
              "question_id": 1,
              "question_content": "Look at the picture marked number 1 in your test book"
            },
            "Question_Options": [
              {
                "question_option_id": 1,
                "label": "A",
                "content": "They're looking at the screen.",
                "order_index": 1
              },
              {
                "question_option_id": 2,
                "label": "B",
                "content": "They're sitting at a table.",
                "order_index": 2
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Lưu ý:**

- Response không bao gồm trường `is_correct` trong `Question_Options`
- Đề thi bao gồm tất cả câu hỏi và đáp án (nhưng không có đáp án đúng)

## 4. Bắt đầu bài thi

**Endpoint:** `POST /api/user/user-exams/start`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "exam_id": 1,
  "selected_parts": ["all"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Exam started successfully",
  "data": {
    "user_exam_id": 123,
    "exam_id": 1,
    "started_at": "2024-01-15T10:00:00.000Z"
  }
}
```

## 5. Lưu câu trả lời

**Endpoint:** `POST /api/user/user-exams/save-answers`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "user_exam_id": 123,
  "answers": [
    {
      "container_question_id": 1,
      "question_option_id": 2
    },
    {
      "container_question_id": 2,
      "question_option_id": 5
    },
    {
      "container_question_id": 3,
      "question_option_id": null
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Answers saved successfully",
  "data": {
    "saved_count": 3
  }
}
```

**Lưu ý:**

- Có thể lưu từng câu hoặc nhiều câu một lúc
- Nếu đã có câu trả lời cho câu hỏi thì sẽ được cập nhật
- `question_option_id` = null nếu user chưa chọn đáp án

## 6. Submit bài thi

**Endpoint:** `POST /api/user/user-exams/submit`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "user_exam_id": 123
}
```

**Response:**

```json
{
  "success": true,
  "message": "Exam submitted and graded successfully",
  "data": {
    "user_exam_id": 123,
    "total_score": 185.0,
    "total_questions": 200,
    "correct_answers": 185,
    "percentage": 92.5
  }
}
```

**Lưu ý:**

- Hệ thống sẽ tự động chấm điểm ngay sau khi submit
- Status của user_exam sẽ chuyển sang "graded"

## 7. Xem kết quả bài thi

**Endpoint:** `GET /api/user/user-exams/:user_exam_id/result`

**Quyền:** Yêu cầu đăng nhập (chỉ xem được bài thi của chính mình)

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "message": "Exam result retrieved successfully",
  "data": {
    "user_exam_id": 123,
    "exam": {
      "exam_id": 1,
      "exam_title": "TOEIC Full Test 2024",
      "exam_code": "TC123ABC",
      "exam_type": "TOEIC",
      "total_questions": 200,
      "exam_duration": 120,
      "Certificate": {
        "certificate_id": 1,
        "certificate_name": "TOEIC"
      }
    },
    "started_at": "2024-01-15T10:00:00.000Z",
    "submitted_at": "2024-01-15T12:00:00.000Z",
    "status": "graded",
    "total_score": 185.0,
    "statistics": {
      "total_questions": 200,
      "correct_answers": 185,
      "incorrect_answers": 15,
      "percentage": "92.50"
    },
    "answers": [
      {
        "user_answer_id": 1,
        "container_question_id": 1,
        "question_option_id": 2,
        "is_correct": true,
        "Container_Question": {
          "container_question_id": 1,
          "order": 1,
          "score": 1.0,
          "Question": {
            "question_id": 1,
            "question_content": "Look at the picture marked number 1",
            "explanation": "The people are sitting at a table..."
          },
          "Question_Options": [
            {
              "question_option_id": 1,
              "label": "A",
              "content": "They're looking at the screen.",
              "is_correct": false,
              "order_index": 1
            },
            {
              "question_option_id": 2,
              "label": "B",
              "content": "They're sitting at a table.",
              "is_correct": true,
              "order_index": 2
            }
          ]
        },
        "Question_Option": {
          "question_option_id": 2,
          "label": "B",
          "content": "They're sitting at a table.",
          "order_index": 2
        }
      }
    ]
  }
}
```

**Lưu ý:**

- Response bao gồm đầy đủ câu trả lời của user, đáp án đúng, và giải thích
- Trường `is_correct` cho biết câu trả lời của user đúng hay sai

## 8. Xem chi tiết lần thi

**Endpoint:** `GET /api/user/user-exams/:user_exam_id/detail`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** Giống với endpoint `/result`

## 9. Xem lịch sử thi

**Endpoint:** `GET /api/user/exams/history`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `limit` (number, default: 10): Số lượng bản ghi trên 1 trang
- `page` (number, default: 1): Số trang

**Response:**

```json
{
  "success": true,
  "message": "User exam history retrieved successfully",
  "data": {
    "exams": [
      {
        "user_exam_id": 123,
        "started_at": "2024-01-15T10:00:00.000Z",
        "submitted_at": "2024-01-15T12:00:00.000Z",
        "status": "graded",
        "total_score": 185.0,
        "selected_parts": ["all"],
        "Exam": {
          "exam_id": 1,
          "exam_title": "TOEIC Full Test 2024",
          "exam_code": "TC123ABC",
          "exam_type": "TOEIC",
          "total_questions": 200,
          "Certificate": {
            "certificate_id": 1,
            "certificate_name": "TOEIC"
          }
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

## 10. Hủy bài thi đang làm

**Endpoint:** `DELETE /api/user/user-exams/:user_exam_id/abandon`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "message": "Exam abandoned successfully"
}
```

**Lưu ý:**

- Xóa bài thi chưa hoàn thành
- Xóa tất cả câu trả lời đã lưu

## 11. Kiểm tra bài thi đang làm

**Endpoint:** `GET /api/user/user-exams/ongoing`

**Quyền:** Yêu cầu đăng nhập

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "message": "Ongoing exam retrieved successfully",
  "data": {
    "user_exam_id": 123,
    "exam": {
      "exam_id": 1,
      "exam_title": "TOEIC Full Test 2024",
      "exam_code": "TC123ABC",
      "exam_duration": 120
    },
    "started_at": "2024-01-15T10:00:00.000Z",
    "saved_answers": [
      {
        "container_question_id": 1,
        "question_option_id": 2
      },
      {
        "container_question_id": 2,
        "question_option_id": 5
      }
    ]
  }
}
```

**Nếu không có bài thi đang làm:**

```json
{
  "success": true,
  "message": "No ongoing exam found",
  "data": null
}
```

## Quy trình làm bài thi

1. **User xem danh sách đề thi** → `GET /api/user/exams`
2. **User chọn đề thi và xem chi tiết** → `GET /api/user/exams/:exam_id`
3. **User bắt đầu làm bài** → `POST /api/user/user-exams/start`
4. **User lấy đề thi** → `GET /api/user/exams/:exam_id/take`
5. **User làm bài và lưu câu trả lời** → `POST /api/user/user-exams/save-answers` (có thể gọi nhiều lần)
6. **User submit bài** → `POST /api/user/user-exams/submit`
7. **User xem kết quả** → `GET /api/user/user-exams/:user_exam_id/result`

## Error Responses

Tất cả các endpoint đều có thể trả về các lỗi sau:

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Exam ID is required."
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Authentication required"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Exam not found."
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Ghi chú

- Tất cả các endpoint yêu cầu đăng nhập đều cần có JWT token trong header
- User chỉ có thể xem và quản lý bài thi của chính mình
- Câu trả lời được lưu tự động trong quá trình làm bài
- Điểm được tính tự động ngay sau khi submit
- Có thể xem lại đáp án và giải thích sau khi submit
