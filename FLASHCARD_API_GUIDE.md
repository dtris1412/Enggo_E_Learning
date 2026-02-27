# Flashcard Management API Guide

API endpoints để quản lý Flashcard Sets và Flashcards trong hệ thống E-Learning.

## 📋 Mục lục

- [Flashcard Set APIs](#flashcard-set-apis)
- [Flashcard APIs](#flashcard-apis)
- [Models](#models)

---

## Flashcard Set APIs

### 1. Lấy danh sách Flashcard Sets (Phân trang)

**Endpoint:** `GET /api/admin/flashcard-sets/paginated`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Trang hiện tại |
| limit | number | No | 10 | Số lượng mỗi trang |
| search | string | No | "" | Tìm kiếm theo title hoặc description |
| visibility | string | No | "" | Filter: private, public, shared |
| created_by_type | string | No | "" | Filter: admin, user, AI |
| sortBy | string | No | created_at | Sắp xếp theo field |
| order | string | No | DESC | ASC hoặc DESC |

**Response:**

```json
{
  "success": true,
  "message": "Flashcard sets retrieved successfully",
  "data": {
    "flashcardSets": [
      {
        "flashcard_set_id": 1,
        "user_id": 1,
        "title": "TOEIC Vocabulary Set 1",
        "description": "Common TOEIC words",
        "visibility": "public",
        "created_by_type": "admin",
        "total_cards": 50,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "User": {
          "user_id": 1,
          "user_name": "Admin",
          "user_email": "admin@example.com",
          "avatar": "https://..."
        },
        "Flashcards": [...]
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### 2. Lấy Flashcard Set theo ID

**Endpoint:** `GET /api/admin/flashcard-sets/:flashcard_set_id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set retrieved successfully",
  "data": {
    "flashcard_set_id": 1,
    "user_id": 1,
    "title": "TOEIC Vocabulary Set 1",
    "description": "Common TOEIC words",
    "visibility": "public",
    "created_by_type": "admin",
    "total_cards": 50,
    "User": {...},
    "Flashcards": [...]
  }
}
```

---

### 3. Tạo Flashcard Set mới

**Endpoint:** `POST /api/admin/flashcard-sets`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (Manual):**

```json
{
  "title": "My Vocabulary Set",
  "description": "Personal vocabulary collection",
  "source_type": "manual",
  "visibility": "private",
  "user_id": 123
}
```

**Body (From Exam - AI Generated):**

```json
{
  "title": "Vocabulary from TOEIC Test 2024",
  "description": "AI generated from exam questions",
  "source_type": "exam",
  "exam_id": 5,
  "visibility": "public"
}
```

**Validation:**

- `title`: **Required** - Tiêu đề của set
- `source_type`: **Required** - Giá trị: `manual` hoặc `exam` (default: `manual`)
- `exam_id`: **Required if source_type = "exam"** - ID của exam
- `visibility`: Optional - Giá trị: `private`, `public`, `shared` (default: `private`)
- `user_id`: **Optional, admin only, manual only** - ID của user

**Logic phân quyền:**

- **User thường (role = 2)**:
  - `user_id` tự động lấy từ JWT token
  - Manual: `created_by_type = "user"`
  - From Exam: `created_by_type = "AI"`
- **Admin (role = 1)**:
  - `user_id` có thể chỉ định user khác (chỉ với `source_type = "manual"`)
  - Manual: `created_by_type = "admin"`
  - From Exam: `created_by_type = "AI"`

**Auto Logic:**

- `source_type = "exam"` → `created_by_type = "AI"` (tự động)
- `source_type = "manual"` → `created_by_type` theo role (admin/user)

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set created successfully",
  "data": {
    "flashcard_set_id": 1,
    "user_id": 1,
    "title": "TOEIC Vocabulary Set 1",
    "total_cards": 0,
    ...
  }
}
```

---

### 4. Cập nhật Flashcard Set

**Endpoint:** `PUT /api/admin/flashcard-sets/:flashcard_set_id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** (Tất cả fields đều optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "visibility": "private",
  "created_by_type": "user"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set updated successfully",
  "data": {...}
}
```

---

### 5. Xóa Flashcard Set

**Endpoint:** `DELETE /api/admin/flashcard-sets/:flashcard_set_id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set deleted successfully"
}
```

**Note:** Xóa flashcard set sẽ xóa tất cả flashcards trong set đó.

---

## Flashcard APIs

### 1. Lấy danh sách Flashcards trong một Set

**Endpoint:** `GET /api/admin/flashcard-sets/:flashcard_set_id/flashcards`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Trang hiện tại |
| limit | number | No | 20 | Số lượng mỗi trang |
| difficulty_level | string | No | "" | Filter: easy, medium, hard |

**Response:**

```json
{
  "success": true,
  "message": "Flashcards retrieved successfully",
  "data": {
    "flashcards": [
      {
        "flashcard_id": 1,
        "flashcard_set_id": 1,
        "front_content": "Hello",
        "back_content": "Xin chào",
        "example": "Hello, how are you?",
        "difficulty_level": "easy",
        "pronunciation": "/həˈloʊ/",
        "audio_url": "https://..."
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### 2. Lấy Flashcard theo ID

**Endpoint:** `GET /api/admin/flashcards/:flashcard_id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard retrieved successfully",
  "data": {
    "flashcard_id": 1,
    "front_content": "Hello",
    "back_content": "Xin chào",
    "Flashcard_Set": {...}
  }
}
```

---

### 3. Tạo Flashcard mới

**Endpoint:** `POST /api/admin/flashcards`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| flashcard_set_id | number | Yes | ID của flashcard set |
| front_content | string | Yes | Nội dung mặt trước (từ vựng) |
| back_content | string | Yes | Nội dung mặt sau (nghĩa) |
| example | string | No | Câu ví dụ |
| difficulty_level | string | No | easy, medium, hard |
| pronunciation | string | No | Phiên âm |
| file | file | No | File audio (mp3, wav, etc.) |

**Example Request:**

```javascript
const formData = new FormData();
formData.append("flashcard_set_id", "1");
formData.append("front_content", "Hello");
formData.append("back_content", "Xin chào");
formData.append("example", "Hello, how are you?");
formData.append("difficulty_level", "easy");
formData.append("pronunciation", "/həˈloʊ/");
formData.append("file", audioFile); // Nếu có

fetch("/api/admin/flashcards", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + token,
  },
  body: formData,
});
```

**Note về Audio Upload:**

- Audio được upload riêng cho flashcard thông qua `uploadService.uploadFlashcardAudio()`
- Audio được lưu vào folder `flashcards/audios` trên Cloudinary
- Hoặc có thể sử dụng API riêng: `POST /api/upload/flashcard/audio`

**Response:**

```json
{
  "success": true,
  "message": "Flashcard created successfully",
  "data": {
    "flashcard_id": 1,
    "front_content": "Hello",
    "audio_url": "https://cloudinary.com/enggo/flashcards/audios/...",
    ...
  }
}
```

---

### 4. Tạo nhiều Flashcards cùng lúc (Batch Create)

**Endpoint:** `POST /api/admin/flashcards/batch`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "flashcard_set_id": 1,
  "flashcards": [
    {
      "front_content": "Hello",
      "back_content": "Xin chào",
      "example": "Hello, how are you?",
      "difficulty_level": "easy",
      "pronunciation": "/həˈloʊ/"
    },
    {
      "front_content": "Goodbye",
      "back_content": "Tạm biệt",
      "difficulty_level": "easy"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcards created successfully",
  "data": [...]
}
```

---

### 5. Cập nhật Flashcard

**Endpoint:** `PUT /api/admin/flashcards/:flashcard_id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:** (Tất cả fields đều optional)

```
front_content=Updated Hello
back_content=Xin chào (cập nhật)
example=New example
difficulty_level=medium
pronunciation=/həˈloʊ/ (updated)
file=<audio_file>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard updated successfully",
  "data": {...}
}
```

---

### 6. Xóa Flashcard

**Endpoint:** `DELETE /api/admin/flashcards/:flashcard_id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard deleted successfully"
}
```

**Note:** Xóa flashcard sẽ tự động cập nhật `total_cards` trong flashcard set.

---

### 7. Xóa nhiều Flashcards

**Endpoint:** `POST /api/admin/flashcards/delete-multiple`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "flashcard_ids": [1, 2, 3, 4, 5]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcards deleted successfully"
}
```

---

## Models

### Flashcard_Set Model

```javascript
{
  flashcard_set_id: INTEGER (Primary Key),
  user_id: INTEGER (Foreign Key - users),
  user_exam_id: INTEGER (Foreign Key - user_exams, nullable),
  exam_id: INTEGER (Foreign Key - exams, nullable),
  source_type: STRING (nullable),
  title: STRING (required),
  description: TEXT (nullable),
  visibility: STRING (nullable),
  created_by_type: ENUM('admin', 'user', 'AI'),
  total_cards: INTEGER (default: 0),
  created_at: DATE,
  updated_at: DATE
}
```

**Relationships:**

- `belongsTo` User
- `belongsTo` User_Exam (optional)
- `belongsTo` Exam (optional)
- `hasMany` Flashcard

---

### Flashcard Model

```javascript
{
  flashcard_id: INTEGER (Primary Key),
  flashcard_set_id: INTEGER (Foreign Key - flashcard_sets),
  container_question_id: INTEGER (Foreign Key - container_questions, nullable),
  front_content: STRING (required),
  back_content: STRING (required),
  example: TEXT (nullable),
  difficulty_level: STRING (nullable),
  pronunciation: STRING (nullable),
  audio_url: STRING (nullable)
}
```

**Relationships:**

- `belongsTo` Flashcard_Set
- `belongsTo` Container_Question (optional)

---

## Error Responses

Tất cả endpoints đều có thể trả về các error responses sau:

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Flashcard/Flashcard set not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to perform action",
  "error": "Detailed error message"
}
```

---

## Workflow Ví dụ

### Tạo một bộ flashcard hoàn chỉnh:

1. **Tạo Flashcard Set:**

```bash
POST /api/admin/flashcard-sets
{
  "title": "TOEIC 600+ Vocabulary",
  "description": "Essential words for TOEIC 600+",
  "visibility": "public"
}
```

2. **Thêm Flashcards (Batch):**

```bash
POST /api/admin/flashcards/batch
{
  "flashcard_set_id": 1,
  "flashcards": [
    {
      "front_content": "accomplish",
      "back_content": "hoàn thành",
      "difficulty_level": "medium"
    },
    ...
  ]
}
```

3. **Thêm Flashcard có audio:**

```bash
POST /api/admin/flashcards
FormData:
  - flashcard_set_id: 1
  - front_content: "pronunciation"
  - back_content: "phát âm"
  - file: <audio.mp3>
```

4. **Lấy danh sách flashcards:**

```bash
GET /api/admin/flashcard-sets/1/flashcards?page=1&limit=20
```

---

## Upload API

### Upload Flashcard Audio

**Endpoint:** `POST /api/upload/flashcard/audio`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

```
audio: <audio_file>
```

**Allowed formats:** mp3, wav, ogg, webm

**Response:**

```json
{
  "success": true,
  "message": "Flashcard audio uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/enggo/flashcards/audios/...",
    "publicId": "enggo/flashcards/audios/xxx",
    "duration": 2.5,
    "format": "mp3",
    "bytes": 123456
  }
}
```

**Note:** Audio được upload vào folder riêng `flashcards/audios` trên Cloudinary để dễ quản lý.

---

## File Structure

```
server/src/
├── admin/
│   ├── services/
│   │   ├── flashcard_setService.js    # Business logic cho Flashcard Sets
│   │   └── flashcardService.js        # Business logic cho Flashcards
│   ├── controllers/
│   │   ├── flashcard_setController.js # Request handlers cho Flashcard Sets
│   │   └── flashcardController.js     # Request handlers cho Flashcards
│   └── routes/
│       └── adminRoutes.js             # Route definitions
└── shared/
    ├── services/
    │   └── uploadService.js           # Upload service (có uploadFlashcardAudio)
    ├── controllers/
    │   └── uploadController.js        # Upload controllers
    └── routes/
        └── uploadRoute.js             # Upload routes
```

---

## Notes

- Audio files được upload lên Cloudinary thông qua `uploadService.uploadFlashcardAudio()`
- Audio được lưu vào folder `flashcards/audios` riêng biệt
- `total_cards` tự động cập nhật khi thêm/xóa flashcards
- Tất cả endpoints yêu cầu authentication (Bearer token) và admin role
- Pagination mặc định: page=1, limit=10 (sets) hoặc limit=20 (flashcards)
- Search hỗ trợ tìm kiếm theo title và description của flashcard sets
- Services và Controllers được tách riêng để dễ quản lý:
  - `flashcard_setService.js` & `flashcard_setController.js` cho Flashcard Sets
  - `flashcardService.js` & `flashcardController.js` cho Flashcards

---

## File Structure

```
server/src/admin/
├── services/
│   ├── flashcard_setService.js      # Business logic cho Flashcard Sets
│   └── flashcardService.js          # Business logic cho Flashcards
├── controllers/
│   ├── flashcard_setController.js   # Request handlers cho Flashcard Sets
│   └── flashcardController.js       # Request handlers cho Flashcards
└── routes/
    └── adminRoutes.js                # Route definitions
```
