# ✅ Blog Feature - Testing Checklist

## 🎉 Đã hoàn thành setup!

### ✓ Package đã cài

- [x] `@uiw/react-md-editor` installed

### ✓ BlogProvider đã thêm vào App.tsx

- [x] Import BlogProvider
- [x] Wrap trong provider tree
- [x] Close tag đúng

### ✓ Route đã cấu hình

- [x] Import BlogDetail
- [x] Route `/admin/blogs/:slug` added

---

## 🧪 Hướng dẫn Test

### 1. Khởi động ứng dụng

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### 2. Đăng nhập Admin

1. Truy cập: `http://localhost:5173/login`
2. Đăng nhập với tài khoản admin (role = 1)
3. Navigate to: `http://localhost:5173/admin/news`

---

## ✅ Test Cases

### Test 1: Tạo Blog Mới

**Steps:**

1. Click button "Tạo bài viết mới"
2. Điền thông tin:
   - **Tiêu đề**: "10 Mẹo học từ vựng tiếng Anh hiệu quả"
   - **Danh mục**: Chọn "Mẹo học tập"
   - **Trạng thái**: Chọn "Xuất bản" hoặc "Bản nháp"
   - **Mô tả ngắn**: "Khám phá những phương pháp học từ vựng được chứng minh khoa học..."
   - **Upload ảnh**: Chọn 1 ảnh thumbnail (PNG/JPG < 5MB)
   - **Nội dung**: Viết nội dung markdown:

     ```markdown
     # Giới thiệu

     Học từ vựng là một trong những...

     ## 1. Phương pháp Spaced Repetition

     **Spaced Repetition** giúp bạn...

     - Ưu điểm 1
     - Ưu điểm 2

     ## 2. Sử dụng Flashcard

     ![Example](url-to-image)
     ```

3. Click "Tạo bài viết"

**Expected:**

- ✅ Modal đóng lại
- ✅ Toast success hiển thị
- ✅ Blog mới xuất hiện trong danh sách
- ✅ Slug tự động tạo: "10-meo-hoc-tu-vung-tieng-anh-hieu-qua"

---

### Test 2: Markdown Editor

**Steps:**

1. Trong modal tạo/sửa blog
2. Test các tính năng markdown:
   - Type `# Heading 1` → Check preview
   - Type `**bold text**` → Check preview
   - Type `*italic*` → Check preview
   - Click toolbar buttons → Check insert syntax
   - Switch Preview mode → Check rendering

**Expected:**

- ✅ Editor hiển thị markdown syntax
- ✅ Preview render đúng HTML
- ✅ Toolbar buttons hoạt động
- ✅ Drag bar để resize editor

---

### Test 3: Upload Thumbnail

**Steps:**

1. Click vùng "Click để tải ảnh lên"
2. Chọn file ảnh (PNG/JPG)
3. Check preview hiển thị
4. Click X để remove ảnh
5. Upload lại ảnh khác

**Expected:**

- ✅ Preview ảnh hiển thị ngay
- ✅ Kích thước preview phù hợp (h-32 w-32)
- ✅ Remove ảnh hoạt động
- ✅ Validation: File > 5MB → Error message
- ✅ Validation: File không phải image → Error

---

### Test 4: Search & Filter

**Steps:**

1. Tạo vài blog với category khác nhau
2. Test search:
   - Type "mẹo" vào search box
   - Check results filter theo title/excerpt
3. Test filter category:
   - Select "TOEIC"
   - Check chỉ hiển thị blogs category TOEIC
4. Test filter status:
   - Select "Đã xuất bản"
   - Check chỉ hiển thị published blogs
5. Combine filters:
   - Search + Category + Status

**Expected:**

- ✅ Search hoạt động real-time
- ✅ Filter category chính xác
- ✅ Filter status chính xác
- ✅ Combine filters hoạt động
- ✅ Reset về page 1 khi filter

---

### Test 5: Pagination

**Steps:**

1. Tạo > 10 blogs
2. Check pagination hiển thị
3. Click "Next page"
4. Click "Previous page"
5. Check page numbers

**Expected:**

- ✅ Hiển thị "Trang X / Y"
- ✅ Hiển thị "Hiển thị 1-10 của 15 bài viết"
- ✅ Next/Previous buttons hoạt động
- ✅ Disabled state khi ở trang đầu/cuối
- ✅ Dữ liệu load đúng theo trang

---

### Test 6: Edit Blog

**Steps:**

1. Click icon Edit (pen) ở một blog
2. Modal Edit hiển thị
3. Check data đã load:
   - Title filled
   - Category selected
   - Status selected
   - Excerpt filled
   - Content loaded in editor
   - Thumbnail hiển thị (nếu có)
4. Sửa thông tin:
   - Change title
   - Upload thumbnail mới
   - Edit content
5. Click "Cập nhật"

**Expected:**

- ✅ Modal hiển thị với data loaded
- ✅ Markdown editor có nội dung cũ
- ✅ Thumbnail hiện tại hiển thị
- ✅ Upload thumbnail mới → Preview mới
- ✅ Update thành công
- ✅ Slug tự động update nếu title thay đổi
- ✅ Toast success

---

### Test 7: View Blog Detail

**Steps:**

1. Click icon Eye (eye) ở một blog
2. Navigate to `/admin/blogs/{slug}`
3. Check trang detail:
   - Thumbnail hiển thị (nếu có)
   - Title hiển thị
   - Meta info (category, status, author, date, views)
   - Excerpt hiển thị
   - Content markdown render đúng
4. Check actions:
   - Button "Quay lại"
   - Button "Chỉnh sửa"
   - Button "Xóa bài viết"

**Expected:**

- ✅ Navigate to detail page
- ✅ All information hiển thị đầy đủ
- ✅ Markdown content render đẹp
- ✅ Status badge có màu đúng
- ✅ View count tự động tăng
- ✅ "Quay lại" → Back to list
- ✅ "Chỉnh sửa" → Open edit modal
- ✅ "Xóa" → Confirm & delete

---

### Test 8: Delete Blog

**Steps:**

1. Click icon Delete (trash) ở một blog
2. Confirm dialog hiển thị
3. Click "OK"

**Expected:**

- ✅ Confirm dialog: "Bạn có chắc chắn muốn xóa bài viết này?"
- ✅ Click OK → Blog bị xóa
- ✅ List refresh
- ✅ Toast success
- ✅ Statistics update

---

### Test 9: Statistics Cards

**Steps:**

1. Check 3 statistics cards:
   - Tổng bài viết
   - Đã xuất bản
   - Bản nháp
2. Tạo blog mới → Check stats update
3. Delete blog → Check stats update
4. Change status → Check stats update

**Expected:**

- ✅ Tổng bài viết = Total count
- ✅ Đã xuất bản = Published count
- ✅ Bản nháp = Draft count
- ✅ Stats update real-time

---

### Test 10: Validation

**Steps:**

1. Click "Tạo bài viết mới"
2. Leave title empty → Click submit
3. Leave excerpt empty → Click submit
4. Leave content empty → Click submit
5. Don't select category → Click submit
6. Upload file > 5MB → Check error

**Expected:**

- ✅ Title required error
- ✅ Excerpt required error
- ✅ Content required error
- ✅ Category required error
- ✅ File size error
- ✅ Red border on error fields
- ✅ Error messages hiển thị

---

### Test 11: Markdown Rendering

**Steps:**

1. Tạo blog với nội dung:

```markdown
# Heading 1

## Heading 2

### Heading 3

**Bold text**
_Italic text_
~~Strikethrough~~

- List item 1
- List item 2
  - Nested item

1. Numbered list
2. Item 2

> Blockquote

`inline code`

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

[Link text](https://example.com)

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```

2. Save và view detail

**Expected:**

- ✅ Headings render với size đúng
- ✅ Bold/Italic/Strikethrough đúng
- ✅ Lists render đúng (bullet & numbered)
- ✅ Blockquote có style khác biệt
- ✅ Inline code có background
- ✅ Code blocks có syntax highlighting
- ✅ Links clickable
- ✅ Tables render đẹp

---

### Test 12: Responsive Design

**Steps:**

1. Open DevTools
2. Test các breakpoints:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
3. Check:
   - Table scroll on mobile
   - Modal responsive
   - Editor responsive
   - Filters stack on mobile

**Expected:**

- ✅ Table scroll horizontal trên mobile
- ✅ Modal fit screen
- ✅ Filters stack vertically trên mobile
- ✅ Buttons không bị cắt
- ✅ Images scale properly

---

### Test 13: Loading States

**Steps:**

1. Check loading khi:
   - Fetch blogs
   - Create blog
   - Update blog
   - Delete blog
   - Load blog detail
2. Simulate slow network (DevTools → Network → Slow 3G)

**Expected:**

- ✅ "Đang tải..." text hiển thị
- ✅ Buttons disabled khi loading
- ✅ Spinner/loading indicator
- ✅ No broken UI during load

---

### Test 14: Error Handling

**Steps:**

1. Turn off backend
2. Try các actions:
   - Fetch blogs
   - Create blog
   - Update blog
   - Delete blog
3. Check error messages

**Expected:**

- ✅ Error toast hiển thị
- ✅ Error message rõ ràng
- ✅ UI không crash
- ✅ Graceful degradation

---

### Test 15: SEO Features

**Steps:**

1. Tạo blog với title: "Học Tiếng Anh Hiệu Quả"
2. Check slug generated: "hoc-tieng-anh-hieu-qua"
3. Tạo blog khác cùng title
4. Check slug: "hoc-tieng-anh-hieu-qua-1"
5. View detail → Check URL

**Expected:**

- ✅ Slug không dấu tiếng Việt
- ✅ Slug unique (auto increment nếu trùng)
- ✅ URL clean: `/admin/blogs/hoc-tieng-anh-hieu-qua`
- ✅ Slug hiển thị ở blog detail

---

## 🐛 Common Issues & Solutions

### Issue 1: Module not found '@uiw/react-md-editor'

```bash
cd client
npm install @uiw/react-md-editor
```

### Issue 2: BlogProvider error

- Check import path in App.tsx
- Ensure BlogProvider wraps routes
- Check closing tags match

### Issue 3: Upload ảnh không hoạt động

- Check backend running
- Check uploadService.uploadBlogThumbnail exists
- Check FormData append đúng field name

### Issue 4: Markdown không render

- Check MDEditor.Markdown component
- Check data-color-mode="light"
- Check source prop có data

### Issue 5: Route không hoạt động

- Check AdminRoutes.tsx có import BlogDetail
- Check route path: "blogs/:slug"
- Check navigate(`/admin/blogs/${slug}`)

---

## 📊 Success Criteria

✅ All test cases pass
✅ No console errors
✅ No network errors
✅ Smooth UX
✅ Fast performance
✅ Responsive on all devices
✅ Markdown render correctly
✅ Images upload successfully
✅ SEO-friendly URLs

---

## 🎯 Next Steps After Testing

1. **Deployment**:
   - Deploy backend với migration
   - Deploy frontend
   - Test production

2. **Optimization**:
   - Image lazy loading
   - Code splitting
   - Cache optimization

3. **Features to add**:
   - Tags system
   - Comments
   - Related posts
   - Share buttons
   - Print view
   - Export to PDF

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

Test Results:
- Create Blog: ☐ Pass ☐ Fail
- Edit Blog: ☐ Pass ☐ Fail
- Delete Blog: ☐ Pass ☐ Fail
- View Detail: ☐ Pass ☐ Fail
- Search: ☐ Pass ☐ Fail
- Filter: ☐ Pass ☐ Fail
- Pagination: ☐ Pass ☐ Fail
- Upload Image: ☐ Pass ☐ Fail
- Markdown: ☐ Pass ☐ Fail
- Validation: ☐ Pass ☐ Fail

Issues Found:
1. _________________
2. _________________

Notes:
_________________
```

Good luck testing! 🚀
