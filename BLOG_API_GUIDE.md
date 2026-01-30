# Blog API Guide

## Tổng quan

Backend Blog đã được thiết kế với các tính năng:

- ✅ **SEO-friendly**: Truy vấn bằng slug thay vì ID
- ✅ **Markdown Editor**: Nội dung blog lưu dạng markdown
- ✅ **Upload Image**: Tích hợp sẵn uploadService cho thumbnail
- ✅ **Views Counter**: Tự động đếm lượt xem
- ✅ **Status Management**: Draft/Published/Hidden
- ✅ **Auto Slug Generation**: Tự động tạo slug từ title (hỗ trợ tiếng Việt)

## Database Schema

```javascript
Blog {
  blog_id: INTEGER (PK, Auto Increment)
  blog_title: STRING (Required)
  slug: STRING (Required, Unique) // SEO-friendly URL
  excerpt: TEXT (Required) // Mô tả ngắn
  blog_content: TEXT (Required) // Markdown content
  blog_thumbnail: STRING (Required) // URL từ Cloudinary
  blog_status: ENUM('draft', 'published', 'hidden')
  views_count: INTEGER (Default: 0)
  user_id: INTEGER (FK -> users)
  created_at: DATE
  updated_at: DATE
}
```

## API Endpoints

### 1. Admin Routes (Yêu cầu Authentication + Admin Role)

#### 1.1. Lấy danh sách blogs (có phân trang)

```http
GET /api/admin/blogs/paginated
Headers: Authorization: Bearer <token>
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (tìm theo title hoặc excerpt)
  - status: 'draft' | 'published' | 'hidden'
  - sortBy: string (default: 'created_at')
  - order: 'ASC' | 'DESC' (default: 'DESC')

Response:
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

#### 1.2. Lấy blog theo ID

```http
GET /api/admin/blogs/:blog_id
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": {
    "blog_id": 1,
    "blog_title": "...",
    "slug": "tieu-de-bai-viet",
    "excerpt": "...",
    "blog_content": "# Markdown content...",
    "blog_thumbnail": "https://...",
    "blog_status": "published",
    "views_count": 150,
    "User": {
      "user_id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "avatar": "..."
    }
  }
}
```

#### 1.3. Lấy blog theo slug (SEO)

```http
GET /api/admin/blogs/slug/:slug
Headers: Authorization: Bearer <token>

Response: (Same as 1.2)
```

#### 1.4. Tạo blog mới

```http
POST /api/admin/blogs
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body (FormData):
  - blog_title: string (Required)
  - excerpt: string (Required)
  - blog_content: string (Required) - Markdown format
  - blog_status: 'draft' | 'published' | 'hidden' (Optional, default: 'draft')
  - file: File (Optional) - Thumbnail image

Response:
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "blog_id": 1,
    "blog_title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet", // Auto-generated
    "excerpt": "...",
    "blog_content": "...",
    "blog_thumbnail": "https://cloudinary.../image.jpg",
    "blog_status": "draft",
    "views_count": 0,
    "user_id": 1, // From token
    "created_at": "2026-01-30T...",
    "updated_at": "2026-01-30T..."
  }
}
```

**Example với axios:**

```javascript
const formData = new FormData();
formData.append("blog_title", "Học JavaScript hiệu quả");
formData.append("excerpt", "Hướng dẫn học JavaScript từ cơ bản đến nâng cao");
formData.append("blog_content", "# Tiêu đề\n\n## Nội dung markdown...");
formData.append("blog_status", "draft");
formData.append("file", thumbnailFile); // File object

const response = await axios.post("/api/admin/blogs", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});
```

#### 1.5. Cập nhật blog

```http
PUT /api/admin/blogs/:blog_id
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body (FormData):
  - blog_title: string (Optional)
  - excerpt: string (Optional)
  - blog_content: string (Optional) - Markdown format
  - blog_status: 'draft' | 'published' | 'hidden' (Optional)
  - file: File (Optional) - New thumbnail image

Response:
{
  "success": true,
  "message": "Blog updated successfully",
  "data": { ... } // Updated blog
}

Note: Nếu title thay đổi, slug sẽ tự động được tạo lại
```

#### 1.6. Thay đổi trạng thái blog

```http
PATCH /api/admin/blogs/:blog_id/status
Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json

Body:
{
  "blog_status": "published" // 'draft' | 'published' | 'hidden'
}

Response:
{
  "success": true,
  "message": "Blog status updated successfully",
  "data": { ... }
}
```

#### 1.7. Xóa blog

```http
DELETE /api/admin/blogs/:blog_id
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### 2. Public Routes (Không yêu cầu Authentication)

#### 2.1. Lấy blogs mới nhất

```http
GET /api/blogs/latest
Query Parameters:
  - limit: number (default: 5)

Response:
{
  "success": true,
  "message": "Latest blogs retrieved successfully",
  "data": [
    {
      "blog_id": 1,
      "blog_title": "...",
      "slug": "...",
      "excerpt": "...",
      "blog_thumbnail": "...",
      "views_count": 150,
      "created_at": "...",
      "User": {
        "user_id": 1,
        "username": "admin",
        "avatar": "..."
      }
    }
  ]
}
```

#### 2.2. Lấy blogs phổ biến (theo views)

```http
GET /api/blogs/popular
Query Parameters:
  - limit: number (default: 5)

Response: (Same format as 2.1)
```

#### 2.3. Lấy blog theo slug (Public, tự động tăng views)

```http
GET /api/blogs/slug/:slug

Response:
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": { ... } // Full blog details
}

Note: Tự động tăng views_count mỗi lần gọi
```

---

## Tính năng đặc biệt

### 1. Auto Slug Generation

- Slug tự động được tạo từ `blog_title`
- Hỗ trợ tiếng Việt (bỏ dấu, chuyển thành chữ thường)
- Tự động thêm số nếu slug bị trùng
- Ví dụ:
  - "Học JavaScript Hiệu Quả" → "hoc-javascript-hieu-qua"
  - "Học JavaScript Hiệu Quả" (lần 2) → "hoc-javascript-hieu-qua-1"

### 2. Markdown Support

- `blog_content` lưu dạng markdown
- Frontend cần sử dụng markdown parser (react-markdown, marked, etc.)

### 3. Image Upload

- Sử dụng `uploadService.uploadLessonImage()` đã có sẵn
- Upload lên Cloudinary folder: `enggo/lessons/images`
- Tự động optimize quality và format

### 4. Views Counter

- Tự động tăng khi gọi GET `/api/blogs/slug/:slug`
- Không tăng views khi admin xem qua admin routes

### 5. SEO Optimization

- Sử dụng slug thay vì ID trong URL
- URL-friendly: `/blog/hoc-javascript-hieu-qua` thay vì `/blog/1`

---

## Frontend Integration Examples

### React Example với Markdown Editor

```jsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

// Component tạo blog
function BlogEditor() {
  const [formData, setFormData] = useState({
    blog_title: "",
    excerpt: "",
    blog_content: "",
    blog_status: "draft",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("blog_title", formData.blog_title);
    data.append("excerpt", formData.excerpt);
    data.append("blog_content", formData.blog_content);
    data.append("blog_status", formData.blog_status);
    if (thumbnail) {
      data.append("file", thumbnail);
    }

    try {
      const response = await axios.post("/api/admin/blogs", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Blog created:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Blog Title"
        value={formData.blog_title}
        onChange={(e) =>
          setFormData({ ...formData, blog_title: e.target.value })
        }
      />

      <textarea
        placeholder="Excerpt"
        value={formData.excerpt}
        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
      />

      {/* Markdown Editor */}
      <div className="editor">
        <textarea
          placeholder="Blog Content (Markdown)"
          value={formData.blog_content}
          onChange={(e) =>
            setFormData({ ...formData, blog_content: e.target.value })
          }
          style={{ height: "400px" }}
        />

        <button type="button" onClick={() => setPreview(!preview)}>
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Markdown Preview */}
      {preview && (
        <div className="preview">
          <ReactMarkdown>{formData.blog_content}</ReactMarkdown>
        </div>
      )}

      {/* Thumbnail Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
      />

      <select
        value={formData.blog_status}
        onChange={(e) =>
          setFormData({ ...formData, blog_status: e.target.value })
        }
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="hidden">Hidden</option>
      </select>

      <button type="submit">Create Blog</button>
    </form>
  );
}

// Component hiển thị blog detail
function BlogDetail({ slug }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/slug/${slug}`);
        setBlog(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBlog();
  }, [slug]);

  if (!blog) return <div>Loading...</div>;

  return (
    <article>
      <h1>{blog.blog_title}</h1>
      <img src={blog.blog_thumbnail} alt={blog.blog_title} />
      <p className="excerpt">{blog.excerpt}</p>
      <div className="metadata">
        <span>By {blog.User.username}</span>
        <span>{blog.views_count} views</span>
        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
      </div>

      {/* Render Markdown */}
      <div className="blog-content">
        <ReactMarkdown>{blog.blog_content}</ReactMarkdown>
      </div>
    </article>
  );
}
```

---

## Recommended Packages

### Backend (đã có sẵn)

- ✅ Sequelize (ORM)
- ✅ Cloudinary (Image hosting)
- ✅ Multer (File upload)

### Frontend (khuyến nghị)

- `react-markdown` hoặc `marked` - Render markdown
- `react-mde` hoặc `SimpleMDE` - Markdown editor
- `axios` - HTTP client

---

## Notes

1. **Slug Uniqueness**: Slug được tự động đảm bảo unique, không cần lo trùng lặp
2. **Markdown Sanitization**: Frontend nên sanitize markdown để tránh XSS attacks
3. **Image Optimization**: Cloudinary đã tự động optimize ảnh (quality, format)
4. **Views Counter**: Chỉ tăng khi user xem qua public route
5. **Authentication**: Admin routes yêu cầu token + admin role

---

## Migration & Testing

Đảm bảo đã chạy migration để tạo bảng `blogs`:

```bash
cd server
npx sequelize-cli db:migrate --config src/config/config.cjs --migrations-path src/migrations
```

Test API bằng Postman hoặc Thunder Client với các endpoint trên.
