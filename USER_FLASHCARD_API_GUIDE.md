# User Flashcard API Guide

Hướng dẫn sử dụng các API endpoint cho chức năng Flashcard dành cho User.

## Tổng quan

User có thể:

- Xem danh sách flashcard sets (public và của chính họ)
- Tạo, sửa, xóa flashcard sets của chính họ
- Tạo, sửa, xóa flashcards trong các sets mà họ sở hữu
- Xem chi tiết flashcards trong các sets public hoặc của họ

## Authentication

- Routes có `optionalVerifyToken`: Có thể truy cập không cần login, nhưng nếu login sẽ thấy thêm dữ liệu của user
- Routes có `verifyToken` + `requireUser`: Bắt buộc phải login

## API Endpoints

### 1. Flashcard Set Endpoints

#### 1.1. Lấy danh sách Flashcard Sets

**GET** `/api/user/flashcard-sets`

**Query Parameters:**

- `search` (string, optional): Tìm kiếm theo title hoặc description
- `page` (number, optional, default: 1): Số trang
- `limit` (number, optional, default: 10): Số items mỗi trang
- `visibility` (string, optional): Filter theo visibility (`public`, `private`)
- `created_by_type` (string, optional): Filter theo created_by_type (`user`, `admin`)
- `sortBy` (string, optional, default: `created_at`): Sắp xếp theo field (`created_at`, `updated_at`, `title`, `total_cards`)
- `sortOrder` (string, optional, default: `DESC`): Thứ tự sắp xếp (`ASC`, `DESC`)

**Authentication:** Optional (optionalVerifyToken)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 15,
    "totalPages": 2,
    "currentPage": 1,
    "flashcardSets": [
      {
        "flashcard_set_id": 1,
        "user_id": 1,
        "title": "English Vocabulary",
        "description": "Basic English words",
        "visibility": "public",
        "created_by_type": "user",
        "total_cards": 50,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "User": {
          "user_id": 1,
          "user_name": "John Doe",
          "user_email": "john@example.com",
          "avatar": "avatar.jpg"
        }
      }
    ]
  }
}
```

---

#### 1.2. Lấy Flashcard Sets của user hiện tại

**GET** `/api/user/flashcard-sets/my-sets`

**Query Parameters:**

- `search` (string, optional): Tìm kiếm theo title hoặc description
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `sortBy` (string, optional, default: `created_at`)
- `sortOrder` (string, optional, default: `DESC`)

**Authentication:** Required (verifyToken + requireUser)

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 5,
    "totalPages": 1,
    "currentPage": 1,
    "flashcardSets": [...]
  }
}
```

---

#### 1.3. Lấy chi tiết Flashcard Set theo ID

**GET** `/api/user/flashcard-sets/:flashcard_set_id`

**Authentication:** Optional (optionalVerifyToken)

**Response:**

```json
{
  "success": true,
  "data": {
    "flashcard_set_id": 1,
    "user_id": 1,
    "title": "English Vocabulary",
    "description": "Basic English words",
    "visibility": "public",
    "created_by_type": "user",
    "total_cards": 50,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "User": {
      "user_id": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "avatar": "avatar.jpg"
    },
    "Flashcards": [
      {
        "flashcard_id": 1,
        "front_content": "Hello",
        "back_content": "Xin chào",
        "example": "Hello, how are you?",
        "difficulty_level": "easy",
        "pronunciation": "/həˈloʊ/",
        "audio_url": null
      }
    ]
  }
}
```

---

#### 1.4. Tạo Flashcard Set mới

**POST** `/api/user/flashcard-sets`

**Authentication:** Required (verifyToken + requireUser)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "English Vocabulary",
  "description": "Basic English words",
  "visibility": "private" // "public" or "private"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set created successfully.",
  "data": {
    "flashcard_set_id": 1,
    "user_id": 1,
    "title": "English Vocabulary",
    "description": "Basic English words",
    "visibility": "private",
    "created_by_type": "user",
    "total_cards": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### 1.5. Cập nhật Flashcard Set

**PATCH** `/api/user/flashcard-sets/:flashcard_set_id`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner mới có thể update

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "visibility": "public"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set updated successfully.",
  "data": {
    "flashcard_set_id": 1,
    "title": "Updated Title",
    ...
  }
}
```

---

#### 1.6. Xóa Flashcard Set

**DELETE** `/api/user/flashcard-sets/:flashcard_set_id`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner mới có thể delete

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard set deleted successfully."
}
```

**Note:** Xóa flashcard set sẽ xóa luôn tất cả flashcards trong set đó.

---

### 2. Flashcard Endpoints

#### 2.1. Lấy danh sách Flashcards trong một Set

**GET** `/api/user/flashcard-sets/:flashcard_set_id/flashcards`

**Query Parameters:**

- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)
- `difficulty_level` (string, optional): Filter theo độ khó (`easy`, `medium`, `hard`)

**Authentication:** Optional (optionalVerifyToken)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 50,
    "totalPages": 3,
    "currentPage": 1,
    "flashcards": [
      {
        "flashcard_id": 1,
        "flashcard_set_id": 1,
        "front_content": "Hello",
        "back_content": "Xin chào",
        "example": "Hello, how are you?",
        "difficulty_level": "easy",
        "pronunciation": "/həˈloʊ/",
        "audio_url": null
      }
    ]
  }
}
```

---

#### 2.2. Lấy chi tiết Flashcard theo ID

**GET** `/api/user/flashcards/:flashcard_id`

**Authentication:** Optional (optionalVerifyToken)

**Response:**

```json
{
  "success": true,
  "data": {
    "flashcard_id": 1,
    "flashcard_set_id": 1,
    "front_content": "Hello",
    "back_content": "Xin chào",
    "example": "Hello, how are you?",
    "difficulty_level": "easy",
    "pronunciation": "/həˈloʊ/",
    "audio_url": null,
    "Flashcard_Set": {
      "flashcard_set_id": 1,
      "title": "English Vocabulary",
      "description": "Basic English words",
      "user_id": 1,
      "visibility": "public"
    }
  }
}
```

---

#### 2.3. Tạo Flashcard mới

**POST** `/api/user/flashcard-sets/:flashcard_set_id/flashcards`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner của flashcard set mới có thể tạo

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "front_content": "Hello",
  "back_content": "Xin chào",
  "example": "Hello, how are you?",
  "difficulty_level": "easy", // "easy", "medium", "hard", or null
  "pronunciation": "/həˈloʊ/"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard created successfully.",
  "data": {
    "flashcard_id": 1,
    "flashcard_set_id": 1,
    "front_content": "Hello",
    "back_content": "Xin chào",
    ...
  }
}
```

---

#### 2.4. Tạo nhiều Flashcards cùng lúc

**POST** `/api/user/flashcard-sets/:flashcard_set_id/flashcards/bulk`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner của flashcard set

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "flashcards": [
    {
      "front_content": "Hello",
      "back_content": "Xin chào",
      "example": "Hello!",
      "difficulty_level": "easy"
    },
    {
      "front_content": "Goodbye",
      "back_content": "Tạm biệt",
      "example": "Goodbye, see you later!",
      "difficulty_level": "easy"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "2 flashcards created successfully.",
  "data": [...]
}
```

---

#### 2.5. Cập nhật Flashcard

**PATCH** `/api/user/flashcards/:flashcard_id`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner của flashcard set

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "front_content": "Updated Hello",
  "back_content": "Xin chào (updated)",
  "example": "Updated example",
  "difficulty_level": "medium",
  "pronunciation": "/həˈloʊ/"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard updated successfully.",
  "data": {...}
}
```

---

#### 2.6. Xóa Flashcard

**DELETE** `/api/user/flashcards/:flashcard_id`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner của flashcard set

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Flashcard deleted successfully."
}
```

---

#### 2.7. Xóa nhiều Flashcards cùng lúc

**POST** `/api/user/flashcards/bulk-delete`

**Authentication:** Required (verifyToken + requireUser)  
**Permission:** Chỉ owner của flashcard set

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "flashcard_ids": [1, 2, 3, 4, 5]
}
```

**Response:**

```json
{
  "success": true,
  "message": "5 flashcards deleted successfully."
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Title is required."
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Flashcard set not found or you don't have permission to view it."
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error."
}
```

---

## Quyền truy cập (Permissions)

### Flashcard Sets:

- **Public sets**: Ai cũng có thể xem (kể cả không login)
- **Private sets**: Chỉ owner mới xem được
- **Create/Update/Delete**: Chỉ owner mới có quyền

### Flashcards:

- **Xem**: Có thể xem nếu có quyền xem flashcard set
- **Create/Update/Delete**: Chỉ owner của flashcard set mới có quyền

---

## Use Cases

### 1. User xem danh sách public flashcard sets (không login)

```
GET /api/user/flashcard-sets
```

### 2. User tạo flashcard set riêng (phải login)

```
POST /api/user/flashcard-sets
Authorization: Bearer <token>
Body: {
  "title": "My English Vocabulary",
  "visibility": "private"
}
```

### 3. User thêm flashcards vào set của mình

```
POST /api/user/flashcard-sets/1/flashcards/bulk
Authorization: Bearer <token>
Body: {
  "flashcards": [...]
}
```

### 4. User xem flashcards trong public set

```
GET /api/user/flashcard-sets/1/flashcards
```

### 5. User xem các flashcard sets của chính mình

```
GET /api/user/flashcard-sets/my-sets
Authorization: Bearer <token>
```

---

## Notes

1. **Auto update total_cards**: Khi tạo/xóa flashcard, `total_cards` trong flashcard_set sẽ tự động được cập nhật.

2. **Bulk operations**: Hỗ trợ tạo và xóa nhiều flashcards cùng lúc để tối ưu performance.

3. **Search & Filter**: Hỗ trợ tìm kiếm theo title/description và filter theo visibility, created_by_type.

4. **Pagination**: Tất cả list endpoints đều hỗ trợ phân trang.

5. **Validation**:
   - `visibility` chỉ nhận: `public` hoặc `private`
   - `difficulty_level` chỉ nhận: `easy`, `medium`, `hard`, hoặc `null`
   - `front_content` và `back_content` là bắt buộc khi tạo flashcard

---

## Files Created

1. `server/src/user/services/userFlashcardSetService.js` - Service cho flashcard sets
2. `server/src/user/services/userFlashcardService.js` - Service cho flashcards
3. `server/src/user/controllers/flashcardController.js` - Controllers cho cả flashcard sets và flashcards
4. `server/src/user/routes/userRoutes.js` - Updated với flashcard routes
