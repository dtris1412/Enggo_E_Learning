# Frontend Blog Setup Guide

## 📦 Cài đặt Dependencies

Cần cài thêm markdown editor cho frontend:

```bash
cd client
npm install @uiw/react-md-editor
```

## 📁 Các file đã tạo

### 1. Context

- `client/src/admin/contexts/blogContext.tsx` - Blog Context với CRUD operations

### 2. Components

- `client/src/admin/components/BlogManagement/AddBlogModal.tsx` - Modal tạo blog
- `client/src/admin/components/BlogManagement/EditBlogModal.tsx` - Modal chỉnh sửa blog
- `client/src/admin/components/BlogManagement/index.ts` - Export components

### 3. Pages

- `client/src/admin/pages/NewsManagement.tsx` - Trang quản lý blog (đã cập nhật)
- `client/src/admin/pages/BlogDetail.tsx` - Trang chi tiết blog

## 🔧 Cấu hình cần thiết

### 1. Thêm BlogProvider vào App

Mở `client/src/App.tsx` và wrap BlogProvider:

```tsx
import { BlogProvider } from "./admin/contexts/blogContext";

// Inside your providers:
<BlogProvider>{/* Your routes */}</BlogProvider>;
```

### 2. Thêm Route cho BlogDetail

Mở file routes và thêm:

```tsx
import BlogDetail from "../pages/BlogDetail";

// Inside your admin routes:
<Route path="/admin/blogs/:slug" element={<BlogDetail />} />;
```

## ✨ Tính năng đã triển khai

### BlogContext

- ✅ `fetchBlogsPaginated` - Lấy danh sách blog (pagination, search, filter)
- ✅ `getBlogById` - Lấy blog theo ID
- ✅ `getBlogBySlug` - Lấy blog theo slug (SEO-friendly)
- ✅ `createBlog` - Tạo blog mới (với FormData cho upload ảnh)
- ✅ `updateBlog` - Cập nhật blog
- ✅ `updateBlogStatus` - Thay đổi trạng thái blog
- ✅ `deleteBlog` - Xóa blog
- ✅ `getLatestBlogs` - Lấy blog mới nhất
- ✅ `getPopularBlogs` - Lấy blog phổ biến

### AddBlogModal

- ✅ Form đầy đủ (title, excerpt, category, status, thumbnail, content)
- ✅ Markdown Editor với preview
- ✅ Upload thumbnail với preview
- ✅ Validation
- ✅ Error handling

### EditBlogModal

- ✅ Load blog data
- ✅ Hiển thị thumbnail hiện tại
- ✅ Upload thumbnail mới (optional)
- ✅ Markdown Editor
- ✅ Update với FormData

### NewsManagement Page

- ✅ Table hiển thị danh sách blog
- ✅ Search & Filter (category, status)
- ✅ Pagination
- ✅ Statistics cards
- ✅ CRUD operations
- ✅ Loading states

### BlogDetail Page

- ✅ Hiển thị đầy đủ thông tin blog
- ✅ Render markdown content
- ✅ Meta information (author, date, views, category, status)
- ✅ Edit & Delete actions
- ✅ Responsive design

## 🎨 UI Components Sử dụng

- **Markdown Editor**: `@uiw/react-md-editor`
  - Edit mode & Preview mode
  - Toolbar với các tính năng markdown
  - Syntax highlighting
- **Icons**: `lucide-react`
  - Consistent icon set
  - Easy to customize

## 📝 Ví dụ sử dụng

### 1. Tạo blog mới

```tsx
// Click button "Tạo bài viết mới"
// Fill form:
// - Title: "10 Mẹo học từ vựng hiệu quả"
// - Category: "Mẹo học tập"
// - Excerpt: "Khám phá những phương pháp..."
// - Content: Write in Markdown
// - Upload thumbnail
// - Status: Published/Draft
// Click "Tạo bài viết"
```

### 2. Filter & Search

```tsx
// Search by title/excerpt
// Filter by category (Mẹo học tập, TOEIC, IELTS, ...)
// Filter by status (Published, Draft, Hidden)
```

### 3. View blog detail

```tsx
// Click eye icon hoặc title
// Navigate to: /admin/blogs/{slug}
// View full content with markdown rendering
```

## 🔐 Authentication

Tất cả admin routes đều yêu cầu:

- ✅ Access token trong localStorage
- ✅ Admin role

## 🚀 Next Steps

1. Cài dependencies:

```bash
cd client
npm install @uiw/react-md-editor
```

2. Thêm BlogProvider vào App.tsx

3. Thêm route cho BlogDetail

4. Test các tính năng:
   - Tạo blog mới
   - Upload ảnh
   - Edit blog
   - Delete blog
   - View detail
   - Search & filter

## 📖 Markdown Editor Features

### Syntax hỗ trợ:

- Headings (# ## ###)
- Bold (**text**)
- Italic (_text_)
- Links ([text](url))
- Images (![alt](url))
- Lists (- item)
- Code blocks (```language)
- Tables
- Blockquotes (> text)

### Toolbar:

- Bold, Italic, Strikethrough
- Headers
- Lists (ordered/unordered)
- Links & Images
- Code & Code blocks
- Tables
- Preview mode

## 🎯 SEO Features

- ✅ **Auto Slug Generation**: Tự động tạo slug từ title
- ✅ **Unique Slug**: Đảm bảo slug không trùng
- ✅ **SEO-friendly URLs**: `/blogs/hoc-tieng-anh-hieu-qua` thay vì `/blogs/1`
- ✅ **Meta Information**: Category, excerpt, thumbnail
- ✅ **Views Counter**: Tracking popularity

## ⚠️ Lưu ý

1. **Thumbnail Upload**:
   - Max size: 5MB
   - Formats: PNG, JPG
   - Auto optimize bởi Cloudinary

2. **Markdown Content**:
   - Content được lưu dạng markdown
   - Render tự động khi hiển thị

3. **Status**:
   - `draft`: Bản nháp (chưa public)
   - `published`: Đã xuất bản
   - `hidden`: Ẩn (không hiển thị)

4. **Category**:
   - Phải chọn 1 trong 5: Mẹo học tập, TOEIC, IELTS, Ngữ pháp, Từ vựng

## 🐛 Troubleshooting

### Issue: Markdown editor không hiển thị

```bash
# Check if package installed
npm list @uiw/react-md-editor

# Reinstall if needed
npm install @uiw/react-md-editor --force
```

### Issue: Upload ảnh lỗi

- Check file size < 5MB
- Check file format (PNG, JPG)
- Check network connection
- Check backend uploadService

### Issue: Context not found

- Ensure BlogProvider wraps component tree
- Check import path

## ✅ Testing Checklist

- [ ] Tạo blog mới thành công
- [ ] Upload thumbnail thành công
- [ ] Markdown editor hoạt động
- [ ] Edit blog thành công
- [ ] Delete blog thành công
- [ ] Search hoạt động
- [ ] Filter by category hoạt động
- [ ] Filter by status hoạt động
- [ ] Pagination hoạt động
- [ ] View detail hiển thị đúng
- [ ] Markdown render đúng
- [ ] Statistics hiển thị đúng
