# Hướng dẫn Quản lý Báo cáo (Report Management)

## 📋 Tổng quan

Chức năng quản lý báo cáo cho phép admin theo dõi, tạo và xuất báo cáo Excel cho các dữ liệu trong hệ thống:

- Người dùng (Users)
- Khóa học (Courses)
- Bài học (Lessons)
- Đề thi (Exams)
- Tin tức (Blogs)
- Tài liệu (Documents)
- Lộ trình (Roadmaps)

## 🚀 Cài đặt

### 1. Cài đặt thư viện ExcelJS

```bash
cd server
npm install exceljs
```

### 2. Cấu trúc đã tạo

```
server/src/
├── models/
│   └── report.js                    # Model Report (đã cập nhật)
├── admin/
│   ├── services/
│   │   └── reportService.js         # Service xử lý logic báo cáo
│   ├── controllers/
│   │   └── reportController.js      # Controller xử lý request
│   └── routes/
│       └── adminRoutes.js           # Routes báo cáo (đã thêm)
└── upload/
    └── reports/                     # Thư mục lưu file Excel
```

## 📊 Database Schema

### Bảng `reports`

```sql
CREATE TABLE reports (
  report_id INT PRIMARY KEY AUTO_INCREMENT,
  report_name VARCHAR(255) NOT NULL,
  report_type ENUM('users', 'courses', 'lessons', 'exams', 'blogs', 'documents', 'roadmaps'),
  report_content TEXT,
  file_path VARCHAR(255),
  file_format ENUM('excel', 'csv') DEFAULT 'excel',
  filters JSON,
  user_id INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

## 🔌 API Endpoints

### 1. Lấy danh sách báo cáo (có phân trang)

```http
GET /api/admin/reports/paginated?page=1&limit=10&search=&report_type=users
```

**Headers:**

```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng/trang (default: 10)
- `search` (optional): Tìm kiếm theo tên báo cáo
- `report_type` (optional): Lọc theo loại báo cáo
- `sortBy` (optional): Sắp xếp theo trường (default: created_at)
- `order` (optional): ASC hoặc DESC (default: DESC)

**Response:**

```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "data": {
    "reports": [
      {
        "report_id": 1,
        "report_name": "Báo cáo người dùng tháng 1",
        "report_type": "users",
        "report_content": "Báo cáo người dùng - Tổng: 150",
        "file_path": "/upload/reports/users_1707456789123.xlsx",
        "file_format": "excel",
        "filters": "{\"user_status\":\"active\"}",
        "user": {
          "user_id": 1,
          "user_name": "Admin",
          "user_email": "admin@example.com"
        },
        "created_at": "2026-02-09T10:00:00.000Z"
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

### 2. Lấy chi tiết báo cáo

```http
GET /api/admin/reports/:report_id
```

**Response:**

```json
{
  "success": true,
  "message": "Report retrieved successfully",
  "data": {
    "report_id": 1,
    "report_name": "Báo cáo người dùng tháng 1",
    "report_type": "users",
    "report_content": "Báo cáo người dùng - Tổng: 150",
    "file_path": "/upload/reports/users_1707456789123.xlsx",
    "user": {
      "user_id": 1,
      "user_name": "Admin"
    }
  }
}
```

### 3. Tạo báo cáo mới và xuất Excel

```http
POST /api/admin/reports/generate
```

**Headers:**

```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "report_name": "Báo cáo người dùng tháng 2/2026",
  "report_type": "users",
  "filters": {
    "user_status": "active"
  }
}
```

**Các loại `report_type` hợp lệ:**

- `users` - Báo cáo người dùng
- `courses` - Báo cáo khóa học
- `lessons` - Báo cáo bài học
- `exams` - Báo cáo đề thi
- `blogs` - Báo cáo tin tức
- `documents` - Báo cáo tài liệu
- `roadmaps` - Báo cáo lộ trình

**Filters theo từng loại:**

```json
// Users
{
  "user_status": "active" // hoặc "inactive", "locked"
}

// Courses
{
  "course_status": "active" // hoặc "inactive"
}

// Lessons
{
  "lesson_status": "active"
}

// Exams
{
  "exam_status": "active"
}

// Blogs
{
  "blog_status": "published" // hoặc "draft", "hidden"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "report_id": 2,
    "report_name": "Báo cáo người dùng tháng 2/2026",
    "report_type": "users",
    "report_content": "Báo cáo người dùng - Tổng: 150",
    "file_path": "/upload/reports/users_1707456789123.xlsx",
    "file_format": "excel",
    "created_at": "2026-02-09T10:00:00.000Z"
  }
}
```

### 4. Download file báo cáo Excel

```http
GET /api/admin/reports/:report_id/download
```

**Headers:**

```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Response:** File Excel được download

### 5. Xóa báo cáo

```http
DELETE /api/admin/reports/:report_id
```

**Response:**

```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

## 📝 Ví dụ sử dụng

### Tạo báo cáo tất cả người dùng

```javascript
const response = await fetch("/api/admin/reports/generate", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    report_name: "Toàn bộ người dùng hệ thống",
    report_type: "users",
    filters: {}, // Không filter, lấy tất cả
  }),
});

const result = await response.json();
console.log("File path:", result.data.file_path);
```

### Tạo báo cáo khóa học đang hoạt động

```javascript
const response = await fetch("/api/admin/reports/generate", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    report_name: "Khóa học đang hoạt động",
    report_type: "courses",
    filters: {
      course_status: "active",
    },
  }),
});
```

### Tạo báo cáo tin tức đã published

```javascript
const response = await fetch("/api/admin/reports/generate", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    report_name: "Tin tức đã xuất bản",
    report_type: "blogs",
    filters: {
      blog_status: "published",
    },
  }),
});
```

## 📂 Cấu trúc File Excel

File Excel được tạo sẽ có cấu trúc:

1. **Tiêu đề báo cáo** (merge cells, font size 16, bold)
2. **Thông tin báo cáo:**
   - Loại báo cáo
   - Ngày xuất
   - Tổng số bản ghi
3. **Bảng dữ liệu:**
   - Header (màu xanh, chữ trắng, bold)
   - Data rows
   - Có borders
   - Auto-fit columns

### Ví dụ cột trong báo cáo Users:

| ID  | Tên người dùng | Email            | Số điện thoại | Trạng thái | Vai trò | Ngày tạo         |
| --- | -------------- | ---------------- | ------------- | ---------- | ------- | ---------------- |
| 1   | John Doe       | john@example.com | 0123456789    | active     | user    | 09/02/2026 10:00 |

## 🔒 Quyền truy cập

- Tất cả endpoints yêu cầu:
  - Authentication (`verifyToken`)
  - Role Admin (`requireAdmin`)

## 📌 Lưu ý

1. **File được lưu tại:** `server/upload/reports/`
2. **Format tên file:** `{report_type}_{timestamp}.xlsx`
3. **Khi xóa báo cáo:** File Excel cũng sẽ bị xóa khỏi server
4. **Dữ liệu xuất:** Toàn bộ thông tin của entity được chọn

## 🛠️ Mở rộng

### Thêm loại báo cáo mới

1. Cập nhật ENUM trong [report.js](server/src/models/report.js):

```javascript
report_type: {
  type: DataTypes.ENUM(
    "users", "courses", "lessons", "exams",
    "blogs", "documents", "roadmaps",
    "new_type" // Thêm type mới
  ),
}
```

2. Thêm hàm format trong [reportService.js](server/src/admin/services/reportService.js):

```javascript
const formatNewTypeData = async (filters = {}) => {
  // Implementation
};
```

3. Thêm case trong hàm `generateReport`:

```javascript
case "new_type":
  data = await formatNewTypeData(filters);
  break;
```

## ✅ Checklist triển khai

- [x] Cập nhật model Report
- [x] Tạo reportService.js
- [x] Tạo reportController.js
- [x] Thêm routes vào adminRoutes.js
- [ ] Cài đặt thư viện exceljs (`npm install exceljs`)
- [ ] Test API endpoints
- [ ] Tích hợp vào frontend

## 🧪 Testing

Sau khi cài đặt exceljs, test các endpoint:

```bash
# 1. Tạo báo cáo
curl -X POST http://localhost:5000/api/admin/reports/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"report_name":"Test Report","report_type":"users"}'

# 2. Lấy danh sách
curl http://localhost:5000/api/admin/reports/paginated?page=1 \
  -H "Authorization: Bearer <token>"

# 3. Download
curl http://localhost:5000/api/admin/reports/1/download \
  -H "Authorization: Bearer <token>" \
  --output report.xlsx
```
