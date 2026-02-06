# API Exam Management Documentation

## Tổng quan

Tài liệu này mô tả đầy đủ các API endpoints cho hệ thống quản lý đề thi, câu hỏi và câu trả lời.

## Authentication

Tất cả các endpoints yêu cầu:

- `Authorization: Bearer <token>` header
- Role: Admin (role = 1)

---

## 📋 1. EXAM MANAGEMENT (Quản lý đề thi)

### 1.1. Tạo đề thi mới

**POST** `/api/admin/exams`

**Request Body:**

```json
{
  "exam_title": "TOEIC Test 2024 - Part 1",
  "exam_duration": 120,
  "exam_code": "TOEIC-2024-001",
  "year": 2024,
  "certificate_id": 1,
  "exam_type": "TOEIC",
  "source": "ETS Official",
  "total_questions": 200
}
```

**Response:**

```json
{
  "success": true,
  "message": "Exam created successfully",
  "data": {
    "exam_id": 1,
    "exam_title": "TOEIC Test 2024 - Part 1",
    "exam_code": "TOEIC-2024-001",
    "created_at": "2024-02-06T10:00:00.000Z",
    ...
  }
}
```

---

### 1.2. Lấy danh sách đề thi (phân trang)

**GET** `/api/admin/exams/paginated`

**Query Parameters:**

- `search` (optional): Tìm kiếm theo title hoặc exam_code
- `limit` (optional, default: 10): Số lượng mỗi trang
- `page` (optional, default: 1): Trang hiện tại
- `exam_type` (optional): TOEIC | IELTS
- `year` (optional): Năm
- `certificate_id` (optional): ID chứng chỉ

**Example:**

```
GET /api/admin/exams/paginated?search=TOEIC&limit=20&page=1&exam_type=TOEIC&year=2024
```

**Response:**

```json
{
  "success": true,
  "message": "Exams retrieved successfully",
  "data": [...],
  "total": 100,
  "currentPage": 1,
  "totalPages": 5
}
```

---

### 1.3. Lấy thông tin đề thi theo ID

**GET** `/api/admin/exams/:exam_id`

**Response:**

```json
{
  "success": true,
  "message": "Exam retrieved successfully",
  "data": {
    "exam_id": 1,
    "exam_title": "TOEIC Test 2024",
    "Certificate": {
      "certificate_id": 1,
      "certificate_name": "TOEIC Certificate"
    },
    "Exam_Medias": [...]
  }
}
```

---

### 1.4. Lấy thông tin chi tiết đề thi (bao gồm containers, questions, options)

**GET** `/api/admin/exams/:exam_id/details`

**Response:**

```json
{
  "success": true,
  "message": "Exam details retrieved successfully",
  "data": {
    "exam_id": 1,
    "exam_title": "TOEIC Test 2024",
    "Exam_Containers": [
      {
        "container_id": 1,
        "skill": "listening",
        "type": "toeic_group",
        "Container_Questions": [
          {
            "container_question_id": 1,
            "Question": {
              "question_id": 1,
              "question_content": "What is the main topic?",
              "explanation": "..."
            },
            "Question_Options": [
              {
                "question_option_id": 1,
                "label": "A",
                "content": "Option A",
                "is_correct": true,
                "order_index": 1
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

### 1.5. Cập nhật đề thi

**PUT** `/api/admin/exams/:exam_id`

**Request Body:** (Giống như tạo mới)

---

### 1.6. Xóa đề thi

**DELETE** `/api/admin/exams/:exam_id`

**Response:**

```json
{
  "success": true,
  "message": "Exam deleted successfully"
}
```

---

## 📦 2. EXAM CONTAINER MANAGEMENT (Quản lý container/nhóm câu hỏi)

### 2.1. Tạo container mới

**POST** `/api/admin/exam-containers`

**Request Body:**

```json
{
  "exam_id": 1,
  "skill": "listening",
  "type": "toeic_group",
  "order": 1,
  "content": "Questions 1-3 refer to the following conversation.",
  "image_url": "https://...",
  "time_limit": 60
}
```

**Giải thích các trường:**

- `skill`: listening | reading | writing | speaking
- `type`:
  - `toeic_group`: Nhóm câu hỏi TOEIC
  - `toeic_single`: Câu hỏi đơn TOEIC
  - `ielts_passage`: Đoạn văn IELTS
  - `writing_task`: Bài viết
  - `speaking_part`: Phần speaking
- `order`: Thứ tự hiển thị
- `content`: Nội dung đoạn văn/hướng dẫn
- `image_url`: URL ảnh (nếu có)
- `time_limit`: Giới hạn thời gian (giây)

---

### 2.2. Lấy danh sách containers theo exam_id

**GET** `/api/admin/exams/:exam_id/containers`

---

### 2.3. Cập nhật container

**PUT** `/api/admin/exam-containers/:container_id`

---

### 2.4. Xóa container

**DELETE** `/api/admin/exam-containers/:container_id`

---

## ❓ 3. QUESTION MANAGEMENT (Quản lý câu hỏi)

### 3.1. Tạo câu hỏi mới

**POST** `/api/admin/questions`

**Request Body:**

```json
{
  "question_content": "What does the speaker mainly discuss?",
  "explanation": "The speaker talks about the new product launch..."
}
```

---

### 3.2. Cập nhật câu hỏi

**PUT** `/api/admin/questions/:question_id`

---

### 3.3. Xóa câu hỏi

**DELETE** `/api/admin/questions/:question_id`

---

## 🔗 4. CONTAINER-QUESTION MANAGEMENT (Liên kết câu hỏi với container)

### 4.1. Thêm câu hỏi vào container

**POST** `/api/admin/container-questions`

**Request Body:**

```json
{
  "container_id": 1,
  "question_id": 5,
  "order": 1
}
```

---

### 4.2. Xóa câu hỏi khỏi container

**DELETE** `/api/admin/container-questions/:container_question_id`

---

### 4.3. Cập nhật thứ tự câu hỏi trong container

**PATCH** `/api/admin/container-questions/:container_question_id/order`

**Request Body:**

```json
{
  "order": 3
}
```

---

## ✅ 5. QUESTION OPTIONS MANAGEMENT (Quản lý đáp án)

### 5.1. Tạo option mới cho câu hỏi

**POST** `/api/admin/question-options`

**Request Body:**

```json
{
  "container_question_id": 1,
  "label": "A",
  "content": "The marketing strategy",
  "is_correct": true,
  "order_index": 1
}
```

**Lưu ý:**

- Mỗi câu hỏi có thể có nhiều options
- `is_correct`: true cho đáp án đúng
- `order_index`: Thứ tự hiển thị (A, B, C, D...)

---

### 5.2. Cập nhật option

**PUT** `/api/admin/question-options/:question_option_id`

---

### 5.3. Xóa option

**DELETE** `/api/admin/question-options/:question_option_id`

---

## 🎵 6. EXAM MEDIA MANAGEMENT (Quản lý media cho đề thi)

### 6.1. Tạo exam media (audio)

**POST** `/api/admin/exam-media`

**Request Body:**

```json
{
  "exam_id": 1,
  "audio_url": "https://res.cloudinary.com/.../audio.mp3",
  "duration": 180
}
```

**Lưu ý:**

- `audio_url`: URL file audio từ Cloudinary (sử dụng upload API)
- `duration`: Độ dài audio (giây)

---

### 6.2. Lấy danh sách media theo exam_id

**GET** `/api/admin/exams/:exam_id/media`

---

### 6.3. Xóa exam media

**DELETE** `/api/admin/exam-media/:media_id`

---

## 📤 7. FILE UPLOAD APIs (Upload file cho đề thi)

### 7.1. Upload audio cho đề thi

**POST** `/api/upload/exam/audio`

**Headers:**

- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Form Data:**

- `audio`: File audio (mp3, wav, ogg, webm)

**Response:**

```json
{
  "success": true,
  "message": "Exam audio uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../audio.mp3",
    "publicId": "enggo/exams/audios/abc123",
    "duration": 180.5,
    "format": "mp3",
    "bytes": 5242880
  }
}
```

**Cách sử dụng:**

1. Upload audio bằng endpoint này
2. Lấy URL từ response
3. Sử dụng URL đó để tạo Exam_Media hoặc gắn vào Container

---

### 7.2. Upload ảnh cho đề thi

**POST** `/api/upload/exam/images`

**Form Data:**

- `images`: File ảnh hoặc nhiều file ảnh (jpeg, jpg, png, gif, webp)
- Tối đa: 20 ảnh/request

**Response:**

```json
{
  "success": true,
  "message": "Exam images uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "publicId": "enggo/exams/images/img123",
      "width": 1200,
      "height": 800
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "publicId": "enggo/exams/images/img124",
      "width": 800,
      "height": 600
    }
  ]
}
```

**Cách sử dụng:**

1. Upload ảnh bằng endpoint này
2. Lấy URL từ response
3. Sử dụng URL đó để gắn vào `image_url` của Container

---

### 7.3. Upload file tổng quát cho exam

**POST** `/api/upload/exam/file`

**Form Data:**

- `file`: File bất kỳ (pdf, docx, audio, image...)

---

## 🔄 QUY TRÌNH TẠO ĐỀ THI HOÀN CHỈNH

### Bước 1: Tạo Exam

```http
POST /api/admin/exams
{
  "exam_title": "TOEIC Practice Test 1",
  "exam_duration": 120,
  "exam_code": "TOEIC-P1-2024",
  "year": 2024,
  "certificate_id": 1,
  "exam_type": "TOEIC",
  "total_questions": 200
}
```

→ Nhận `exam_id = 1`

---

### Bước 2: Upload audio (nếu có phần listening)

```http
POST /api/upload/exam/audio
Form Data: audio = listening-part1.mp3
```

→ Nhận `audio_url`

---

### Bước 3: Tạo Exam Media

```http
POST /api/admin/exam-media
{
  "exam_id": 1,
  "audio_url": "https://res.cloudinary.com/.../audio.mp3",
  "duration": 180
}
```

---

### Bước 4: Upload ảnh (nếu có)

```http
POST /api/upload/exam/images
Form Data: images = [image1.jpg, image2.jpg]
```

→ Nhận mảng `image_urls`

---

### Bước 5: Tạo Container

```http
POST /api/admin/exam-containers
{
  "exam_id": 1,
  "skill": "listening",
  "type": "toeic_group",
  "order": 1,
  "content": "Questions 1-3 refer to the following conversation.",
  "image_url": "https://res.cloudinary.com/.../image1.jpg"
}
```

→ Nhận `container_id = 1`

---

### Bước 6: Tạo Question

```http
POST /api/admin/questions
{
  "question_content": "What is the main topic of the conversation?",
  "explanation": "The conversation is about..."
}
```

→ Nhận `question_id = 1`

---

### Bước 7: Liên kết Question với Container

```http
POST /api/admin/container-questions
{
  "container_id": 1,
  "question_id": 1,
  "order": 1
}
```

→ Nhận `container_question_id = 1`

---

### Bước 8: Tạo Options cho Question

```http
POST /api/admin/question-options
{
  "container_question_id": 1,
  "label": "A",
  "content": "A new marketing campaign",
  "is_correct": false,
  "order_index": 1
}

POST /api/admin/question-options
{
  "container_question_id": 1,
  "label": "B",
  "content": "The annual sales report",
  "is_correct": true,
  "order_index": 2
}

POST /api/admin/question-options
{
  "container_question_id": 1,
  "label": "C",
  "content": "Office relocation",
  "is_correct": false,
  "order_index": 3
}

POST /api/admin/question-options
{
  "container_question_id": 1,
  "label": "D",
  "content": "Employee training",
  "is_correct": false,
  "order_index": 4
}
```

---

### Bước 9: Lặp lại bước 6-8 cho các câu hỏi tiếp theo

---

### Bước 10: Xem đề thi hoàn chỉnh

```http
GET /api/admin/exams/1/details
```

---

## 📊 CẤU TRÚC DỮ LIỆU

```
Exam (Đề thi)
├── Certificate (Chứng chỉ liên quan)
├── Exam_Media[] (Audio files)
└── Exam_Container[] (Các nhóm câu hỏi)
    └── Container_Question[] (Câu hỏi trong nhóm)
        ├── Question (Nội dung câu hỏi)
        └── Question_Option[] (Các đáp án A, B, C, D)
```

---

## 🎯 CÁC LOẠI CONTAINER TYPES

### 1. TOEIC

- `toeic_group`: Nhóm câu hỏi (ví dụ: 3 câu hỏi về 1 đoạn hội thoại)
- `toeic_single`: Câu hỏi đơn

### 2. IELTS

- `ielts_passage`: Đoạn văn Reading
- `writing_task`: Bài viết (Writing Task 1 hoặc 2)
- `speaking_part`: Phần Speaking

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Upload files trước khi tạo database records**
   - Upload audio/image trước
   - Lưu URL vào database sau

2. **Thứ tự tạo dữ liệu**
   - Exam → Container → Question → Container_Question → Options

3. **Validation**
   - `exam_code` phải unique
   - Ít nhất 1 option phải có `is_correct = true`
   - `order` và `order_index` bắt đầu từ 1

4. **Xóa dữ liệu**
   - Xóa Exam sẽ cascade xóa tất cả dữ liệu liên quan
   - Cẩn thận khi xóa

5. **File upload limits**
   - Audio: Unlimited size (có timeout 60s)
   - Images: Tối đa 20 files/request

---

## 🔐 ERROR CODES

- `400`: Bad Request (thiếu fields, validation error)
- `401`: Unauthorized (không có token)
- `403`: Forbidden (không phải admin)
- `404`: Not Found (không tìm thấy resource)
- `500`: Internal Server Error

---

## 📝 EXAMPLES

### Example: Tạo một đề TOEIC hoàn chỉnh với 1 nhóm listening

```javascript
// 1. Tạo exam
const exam = await createExam({
  exam_title: "TOEIC Practice Test 1",
  exam_duration: 120,
  exam_code: "TOEIC-P1-2024",
  year: 2024,
  certificate_id: 1,
  exam_type: "TOEIC",
  total_questions: 200,
});

// 2. Upload & tạo media
const audioUpload = await uploadExamAudio(audioFile);
const media = await createExamMedia({
  exam_id: exam.exam_id,
  audio_url: audioUpload.url,
  duration: audioUpload.duration,
});

// 3. Tạo container
const container = await createExamContainer({
  exam_id: exam.exam_id,
  skill: "listening",
  type: "toeic_group",
  order: 1,
  content:
    "Questions 1-3 refer to the following conversation about a business meeting.",
});

// 4. Tạo 3 câu hỏi
for (let i = 1; i <= 3; i++) {
  const question = await createQuestion({
    question_content: `Question ${i} content`,
    explanation: `Explanation for question ${i}`,
  });

  const containerQuestion = await addQuestionToContainer({
    container_id: container.container_id,
    question_id: question.question_id,
    order: i,
  });

  // Tạo 4 options cho mỗi câu
  for (let j = 0; j < 4; j++) {
    await createQuestionOption({
      container_question_id: containerQuestion.container_question_id,
      label: String.fromCharCode(65 + j), // A, B, C, D
      content: `Option ${String.fromCharCode(65 + j)}`,
      is_correct: j === 1, // B là đáp án đúng
      order_index: j + 1,
    });
  }
}
```

---

**Version:** 1.0  
**Last Updated:** 2024-02-06  
**Author:** Development Team
