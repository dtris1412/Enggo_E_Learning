# API Hướng Dẫn - Chương Trình Học (Roadmap & Course)

## Mô Tả

API cung cấp 2 chế độ xem chương trình học:

1. **Chế độ Course**: Xem danh sách các khóa học độc lập, mỗi course có modules và lessons
2. **Chế độ Roadmap**: Xem lộ trình học tập hoàn chỉnh, mỗi roadmap chứa các phases, courses (kèm modules và lessons), và documents

---

## 1. CHẾ ĐỘ COURSE

### 1.1. Lấy Danh Sách Courses (Có Phân Trang)

**Endpoint:** `GET /api/user/courses`  
**Mô tả:** Lấy danh sách tất cả courses với modules, hỗ trợ phân trang và bộ lọc  
**Authentication:** Không yêu cầu (Public)

**Query Parameters:**

- `search` (string, optional): Tìm kiếm theo tên course
- `page` (number, optional, default=1): Số trang
- `limit` (number, optional, default=10): Số item trên mỗi trang
- `course_level` (string, optional): Lọc theo level (VD: "Beginner", "Intermediate", "Advanced")
- `access_type` (string, optional): Lọc theo loại truy cập ("free" hoặc "premium")
- `tag` (string, optional): Lọc theo tag
- `sortBy` (string, optional, default="created_at"): Sắp xếp theo field ("created_at", "course_title", "estimate_duration")
- `sortOrder` (string, optional, default="DESC"): Thứ tự sắp xếp ("ASC" hoặc "DESC")

**Response Example:**

```json
{
  "success": true,
  "data": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1,
    "courses": [
      {
        "course_id": 1,
        "course_title": "HTML & CSS Fundamentals",
        "description": "Learn HTML and CSS from scratch",
        "course_level": "Beginner",
        "course_aim": "Master HTML and CSS",
        "estimate_duration": 30,
        "course_status": true,
        "tag": "frontend,html,css",
        "access_type": "free",
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z",
        "Modules": [
          {
            "module_id": 1,
            "module_title": "HTML Basics",
            "module_description": "Introduction to HTML",
            "order_index": 1,
            "estimated_time": 10
          }
        ]
      }
    ]
  }
}
```

**Example Requests:**

```bash
# Lấy tất cả courses
GET /api/user/courses

# Lọc theo level và access_type
GET /api/user/courses?course_level=Beginner&access_type=free

# Tìm kiếm và lọc theo tag
GET /api/user/courses?search=javascript&tag=frontend&page=1&limit=10

# Sắp xếp theo tên
GET /api/user/courses?sortBy=course_title&sortOrder=ASC
```

---

### 1.2. Lấy Chi Tiết Course Theo ID

**Endpoint:** `GET /api/user/courses/:course_id`  
**Mô tả:** Lấy thông tin chi tiết course kèm modules và lessons đầy đủ  
**Authentication:** Không yêu cầu (Public)

**URL Parameters:**

- `course_id` (number, required): ID của course

**Response Example:**

```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "course_title": "HTML & CSS Fundamentals",
    "description": "Learn HTML and CSS from scratch",
    "course_level": "Beginner",
    "course_aim": "Master HTML and CSS",
    "estimate_duration": 30,
    "course_status": true,
    "tag": "frontend,html,css",
    "access_type": "free",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "Modules": [
      {
        "module_id": 1,
        "module_title": "HTML Basics",
        "module_description": "Introduction to HTML",
        "order_index": 1,
        "estimated_time": 10,
        "Module_Lessons": [
          {
            "module_lesson_id": 1,
            "description": "Learn HTML tags",
            "order_index": 1,
            "status": true,
            "Lesson": {
              "lesson_id": 1,
              "lesson_type": "video",
              "lesson_title": "Introduction to HTML",
              "lesson_content": "...",
              "estimated_time": 5
            }
          }
        ]
      }
    ]
  }
}
```

**Example Requests:**

```bash
GET /api/user/courses/1
```

---

## 2. CHẾ ĐỘ ROADMAP

### 2.1. Lấy Danh Sách Roadmaps (Có Phân Trang)

**Endpoint:** `GET /api/user/roadmaps`  
**Mô tả:** Lấy danh sách tất cả roadmaps với phân trang và bộ lọc  
**Authentication:** Không yêu cầu (Public)

**Query Parameters:**

- `search` (string, optional): Tìm kiếm theo tên roadmap
- `page` (number, optional, default=1): Số trang
- `limit` (number, optional, default=10): Số item trên mỗi trang
- `roadmap_level` (string, optional): Lọc theo level ("Beginner", "Intermediate", "Advanced")
- `certificate_id` (number, optional): Lọc theo certificate ID
- `sortBy` (string, optional, default="created_at"): Sắp xếp theo field ("created_at", "roadmap_title", "estimated_duration")
- `sortOrder` (string, optional, default="DESC"): Thứ tự sắp xếp ("ASC" hoặc "DESC")

**Response Example:**

```json
{
  "success": true,
  "data": {
    "totalItems": 25,
    "totalPages": 3,
    "currentPage": 1,
    "roadmaps": [
      {
        "roadmap_id": 1,
        "roadmap_title": "Full Stack Web Development",
        "roadmap_description": "Complete roadmap for full stack web development",
        "roadmap_aim": "Become a full stack developer",
        "roadmap_level": "Intermediate",
        "estimated_duration": 180,
        "roadmap_status": true,
        "certificate_id": 1,
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z",
        "Certificate": {
          "certificate_id": 1,
          "certificate_name": "Full Stack Developer Certificate",
          "description": "Certificate for full stack developers"
        }
      }
    ]
  }
}
```

**Example Requests:**

```bash
# Lấy tất cả roadmaps
GET /api/user/roadmaps

# Lọc theo level
GET /api/user/roadmaps?roadmap_level=Beginner

# Tìm kiếm và phân trang
GET /api/user/roadmaps?search=web&page=1&limit=5

# Lọc theo certificate và sắp xếp
GET /api/user/roadmaps?certificate_id=1&sortBy=roadmap_title&sortOrder=ASC
```

---

### 2.2. Lấy Chi Tiết Roadmap Theo ID

**Endpoint:** `GET /api/user/roadmaps/:roadmap_id`  
**Mô tả:** Lấy thông tin chi tiết roadmap kèm phases, courses (courses có đầy đủ modules và lessons), và documents  
**Authentication:** Không yêu cầu (Public)

**URL Parameters:**

- `roadmap_id` (number, required): ID của roadmap

**Response Example:**

```json
{
  "success": true,
  "data": {
    "roadmap_id": 1,
    "roadmap_title": "Full Stack Web Development",
    "roadmap_description": "Complete roadmap for full stack web development",
    "roadmap_aim": "Become a full stack developer",
    "roadmap_level": "Intermediate",
    "estimated_duration": 180,
    "roadmap_status": true,
    "certificate_id": 1,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "Certificate": {
      "certificate_id": 1,
      "certificate_name": "Full Stack Developer Certificate",
      "description": "Certificate for full stack developers"
    },
    "Phases": [
      {
        "phase_id": 1,
        "phase_name": "Frontend Basics",
        "phase_description": "Learn HTML, CSS, JavaScript basics",
        "order": 1,
        "phase_aims": "Master frontend fundamentals",
        "Phase_Courses": [
          {
            "phase_course_id": 1,
            "order_number": 1,
            "is_required": true,
            "Course": {
              "course_id": 1,
              "course_title": "HTML & CSS Fundamentals",
              "description": "Learn HTML and CSS from scratch",
              "course_level": "Beginner",
              "estimate_duration": 30,
              "tag": "frontend,html,css",
              "access_type": "free",
              "Modules": [
                {
                  "module_id": 1,
                  "module_title": "HTML Basics",
                  "module_description": "Introduction to HTML",
                  "order_index": 1,
                  "estimated_time": 10,
                  "Module_Lessons": [
                    {
                      "module_lesson_id": 1,
                      "description": "Learn HTML tags",
                      "order_index": 1,
                      "status": true,
                      "Lesson": {
                        "lesson_id": 1,
                        "lesson_type": "video",
                        "lesson_title": "Introduction to HTML",
                        "lesson_content": "...",
                        "estimated_time": 5
                      }
                    }
                  ]
                }
              ]
            }
          }
        ],
        "Document_Phases": [
          {
            "document_phase_id": 1,
            "order_index": 1,
            "Document": {
              "document_id": 1,
              "document_type": "Guide",
              "document_name": "HTML Cheat Sheet",
              "document_description": "Quick reference for HTML tags",
              "document_url": "https://...",
              "file_type": "pdf",
              "access_type": "free"
            }
          }
        ]
      }
    ]
  }
}
```

**Example Requests:**

```bash
GET /api/user/roadmaps/1
```

---

## 3. Use Cases Phổ Biến

### 3.1. Chế Độ Course - Trang danh sách courses

```bash
# Hiển thị tất cả courses với modules
GET /api/user/courses?page=1&limit=10

# Lọc courses miễn phí cho người mới bắt đầu
GET /api/user/courses?course_level=Beginner&access_type=free

# Tìm kiếm courses về JavaScript
GET /api/user/courses?search=javascript
```

### 3.2. Chế Độ Course - Xem chi tiết một course

```bash
# Xem toàn bộ modules và lessons của course
GET /api/user/courses/1
```

### 3.3. Chế Độ Roadmap - Trang danh sách roadmaps

```bash
# Hiển thị tất cả roadmaps
GET /api/user/roadmaps?page=1&limit=10

# Lọc roadmaps cho người mới bắt đầu
GET /api/user/roadmaps?roadmap_level=Beginner
```

### 3.4. Chế Độ Roadmap - Xem chi tiết roadmap hoàn chỉnh

```bash
# Xem roadmap với tất cả phases, courses (kèm modules, lessons), và documents
GET /api/user/roadmaps/1
```

---

## 4. So Sánh 2 Chế Độ

| Tính năng       | Chế độ Course                   | Chế độ Roadmap                                 |
| --------------- | ------------------------------- | ---------------------------------------------- |
| **Mục đích**    | Xem courses độc lập             | Xem lộ trình học tập có cấu trúc               |
| **Cấu trúc**    | Course → Modules → Lessons      | Roadmap → Phases → Courses → Modules → Lessons |
| **Bộ lọc**      | Level, access_type, tag, search | Level, certificate, search                     |
| **Documents**   | Không có                        | Có (trong phases)                              |
| **Phù hợp khi** | Học từng khóa riêng lẻ          | Theo lộ trình có định hướng                    |

---

## 5. Lưu Ý Important

1. **2 Chế Độ Độc Lập**: Course và Roadmap là 2 cách hiển thị khác nhau
2. **Course trong Roadmap**: Roadmap chứa courses, nhưng courses cũng có thể xem độc lập
3. **Đầy Đủ Nội Dung**: Cả 2 chế độ đều trả về modules và lessons đầy đủ
4. **Phân Trang**: Tất cả endpoint list đều hỗ trợ pagination
5. **Public Access**: Không cần authentication
6. **Active Only**: Chỉ trả về roadmaps/courses có status = true

---

## 6. Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid parameters"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

hoặc

```json
{
  "success": false,
  "message": "Roadmap not found."
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error."
}
```
