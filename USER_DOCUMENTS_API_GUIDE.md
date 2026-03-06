# User Documents API Guide

API endpoints cho phép người dùng xem và tải xuống documents với tracking tự động.

## Endpoints

### 1. Get Documents List (Paginated)

**Endpoint:** `GET /api/user/documents`

**Authentication:** Public (không cần token)

**Query Parameters:**

- `search` (optional): Tìm kiếm theo tên document
- `page` (optional, default=1): Trang hiện tại
- `limit` (optional, default=10): Số lượng items mỗi trang
- `document_type` (optional): Lọc theo loại document (learning, reference, guideline, other)
- `acess_type` (optional): Lọc theo quyền truy cập (free, premium)

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1,
    "documents": [
      {
        "document_id": 1,
        "document_type": "learning",
        "document_name": "Introduction to Node.js",
        "document_description": "Beginner guide",
        "document_url": "https://...",
        "document_size": "1048576",
        "file_type": "pdf",
        "view_count": 150,
        "download_count": 45,
        "acess_type": "free",
        "created_at": "2026-03-01T00:00:00.000Z",
        "updated_at": "2026-03-06T00:00:00.000Z"
      }
    ]
  }
}
```

**Example:**

```bash
GET /api/user/documents?search=node&page=1&limit=10&acess_type=free
```

---

### 2. Get Document Detail

**Endpoint:** `GET /api/user/documents/:document_id`

**Authentication:** Public (không cần token)

**Tracking:**

- ✅ Tự động tăng `view_count` nếu là unique view trong 24h
- Sử dụng IP + User-Agent để tracking (tránh spam)

**Response:**

```json
{
  "success": true,
  "data": {
    "document_id": 1,
    "document_type": "learning",
    "document_name": "Introduction to Node.js",
    "document_description": "Beginner guide to Node.js development",
    "document_url": "https://cloudinary.com/...",
    "document_size": "1048576",
    "file_type": "pdf",
    "view_count": 151,
    "download_count": 45,
    "acess_type": "free",
    "created_at": "2026-03-01T00:00:00.000Z",
    "updated_at": "2026-03-06T00:00:00.000Z"
  }
}
```

**Example:**

```bash
GET /api/user/documents/1
```

---

### 3. Download Document

**Endpoint:** `GET /api/user/documents/:document_id/download`

**Authentication:** ✅ Required (Bearer Token)

**Tracking:**

- ✅ Tự động tăng `download_count` mỗi lần download
- Không giới hạn số lần download của cùng 1 user

**Response:**

```json
{
  "success": true,
  "message": "Document ready for download",
  "data": {
    "document_id": 1,
    "document_name": "Introduction to Node.js",
    "document_url": "https://cloudinary.com/document.pdf",
    "file_type": "pdf",
    "document_size": "1048576"
  }
}
```

**Example:**

```bash
GET /api/user/documents/1/download
Authorization: Bearer <token>
```

**Client Implementation:**

```javascript
// Frontend code example
const downloadDocument = async (documentId) => {
  const response = await fetch(`/api/user/documents/${documentId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (result.success) {
    // Open download link in new tab
    window.open(result.data.document_url, "_blank");
  }
};
```

---

## View Tracking Logic

### Anti-Spam Protection

- Sử dụng `viewTracker` service để track unique views
- Mỗi IP + User-Agent chỉ được tính 1 view trong 24 giờ
- Sau 24 giờ, view mới từ cùng IP sẽ được tính lại

### View Count Increment

- **Tự động:** Khi gọi `GET /api/user/documents/:document_id`
- **Điều kiện:** Chưa view document này trong 24h gần nhất
- **Storage:** In-memory (production nên dùng Redis)

### Download Count Increment

- **Tự động:** Mỗi lần gọi `GET /api/user/documents/:document_id/download`
- **Không giới hạn:** User có thể download nhiều lần
- **Authentication:** Yêu cầu đăng nhập

---

## Access Control

### Free Documents

- Tất cả user đều có thể xem và tải
- Không cần authentication để xem danh sách và chi tiết
- **Cần authentication** để download

### Premium Documents

- Hiển thị trong danh sách nhưng có label "premium"
- Frontend có thể kiểm tra `acess_type` để hiển thị badge
- Backend có thể thêm middleware kiểm tra subscription (tùy chọn)

---

## Error Handling

### 404 - Document Not Found

```json
{
  "success": false,
  "message": "Document not found."
}
```

### 401 - Unauthorized (cho download endpoint)

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error."
}
```

---

## Admin Benefits

### Track Engagement

- Admins có thể xem `view_count` và `download_count` trong admin dashboard
- Biết được documents nào phổ biến nhất
- Ra quyết định về nội dung dựa trên metrics

### Analytics Data

- Top viewed documents
- Top downloaded documents
- Engagement rate (downloads/views ratio)
- Popular document types

---

## Future Enhancements

1. **Premium Access Control:**
   - Thêm middleware kiểm tra user subscription
   - Chỉ cho premium users tải premium documents

2. **Redis Cache:**
   - Thay in-memory tracking bằng Redis
   - Persistent và scalable hơn

3. **Rate Limiting:**
   - Giới hạn số lượng downloads trong 1 khoảng thời gian
   - Tránh abuse

4. **Download History:**
   - Lưu lịch sử download của user
   - User có thể xem lại documents đã tải

5. **Favorites/Bookmarks:**
   - User có thể lưu documents yêu thích
   - Quick access cho documents thường dùng
