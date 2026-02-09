# Hướng dẫn Quản lý Báo cáo - E-Learning Platform

## 📋 Tổng quan

Hệ thống quản lý báo cáo cho phép admin:

1. **Xuất nhanh** (Quick Export) - Tải Excel ngay lập tức từ các trang quản lý
2. **Báo cáo chuyên sâu** - Tạo, lưu trữ và quản lý lịch sử báo cáo

## 🎯 Hai cách sử dụng

### 1️⃣ Xuất Nhanh (Quick Export)

**Đặc điểm:**

- ✅ Xuất trực tiếp từ trang quản lý
- ✅ Không lưu vào database
- ✅ Nhanh chóng, tiện lợi
- ✅ Áp dụng filter hiện tại

**Cách sử dụng:**

```
1. Vào trang quản lý (Users, Courses, Lessons, Exams, Blogs, Documents, Roadmaps)
2. Áp dụng filter nếu cần (status, search, category...)
3. Click nút "Xuất Excel" 📥
4. File sẽ tự động download
```

**Ví dụ:**

- Vào **Quản lý Người dùng**
- Filter: Trạng thái = "Hoạt động"
- Search: "nguyen"
- Click "Xuất Excel" → File `users_1707456789.xlsx` được tải về

---

### 2️⃣ Báo cáo Chuyên sâu (Report Management)

**Đặc điểm:**

- ✅ Lưu lịch sử báo cáo
- ✅ Xem lại báo cáo cũ
- ✅ Quản lý tập trung
- ✅ Phù hợp cho báo cáo định kỳ

**Cách sử dụng:**

```
1. Vào menu "Báo cáo" (Report Management)
2. Click "Tạo báo cáo mới"
3. Nhập tên báo cáo (VD: "Báo cáo người dùng tháng 2/2026")
4. Chọn loại báo cáo
5. Click "Tạo báo cáo"
6. Tải xuống hoặc xem lại sau trong lịch sử
```

---

## 🚀 Backend Setup

### 1. Đã tạo các files

```
server/src/
├── admin/
│   ├── controllers/
│   │   ├── userController.js          # Thêm exportUsersToExcel()
│   │   ├── exportController.js        # Export cho courses, lessons, exams, blogs, documents, roadmaps
│   │   └── reportController.js        # Report Management
│   ├── services/
│   │   └── reportService.js           # Logic báo cáo
│   └── routes/
│       └── adminRoutes.js             # Routes cho export & report
└── shared/
    └── services/
        └── excelExportService.js      # Service xuất Excel
```

### 2. API Endpoints

#### Quick Export (không lưu DB)

```javascript
GET /api/admin/users/export?user_status=active&search=nguyen
GET /api/admin/courses/export?course_status=active
GET /api/admin/lessons/export?lesson_status=active
GET /api/admin/exams/export?exam_status=active
GET /api/admin/blogs/export?blog_status=published&category=TOEIC
GET /api/admin/documents/export
GET /api/admin/roadmaps/export?roadmap_status=active
```

**Response:** File Excel (blob)

#### Report Management (lưu DB)

```javascript
// Lấy danh sách báo cáo
GET /api/admin/reports/paginated?page=1&limit=10&search=&report_type=users

// Chi tiết báo cáo
GET /api/admin/reports/:report_id

// Tạo báo cáo mới
POST /api/admin/reports/generate
Body: {
  "report_name": "Báo cáo người dùng tháng 2",
  "report_type": "users",
  "filters": { "user_status": "active" }
}

// Download báo cáo
GET /api/admin/reports/:report_id/download

// Xóa báo cáo
DELETE /api/admin/reports/:report_id
```

---

## 🎨 Frontend Setup

### 1. Đã tạo các files

```
client/src/admin/
├── components/
│   └── ExportButton.tsx               # Nút export tái sử dụng
├── contexts/
│   └── reportAPI.ts                   # API calls
└── pages/
    ├── ReportManagementNew.tsx        # Trang quản lý báo cáo
    ├── AccountManagement.tsx          # Đã thêm ExportButton
    └── NewsManagement.tsx             # Đã thêm ExportButton
```

### 2. Sử dụng ExportButton Component

```tsx
import ExportButton from "../components/ExportButton";

// Trong trang quản lý
<ExportButton
  type="users" // users | courses | lessons | exams | blogs | documents | roadmaps
  filters={{
    // Optional: filters hiện tại
    user_status: selectedStatus,
    search: searchTerm,
  }}
  label="Xuất Excel" // Optional: custom label
  className="" // Optional: custom styles
/>;
```

### 3. Thêm ExportButton vào trang quản lý khác

**Ví dụ: CourseManagement.tsx**

```tsx
// 1. Import
import ExportButton from "../components/ExportButton";

// 2. Thêm vào header
<div className="flex gap-3">
  <ExportButton
    type="courses"
    filters={{
      course_status: selectedStatus,
      search: searchTerm,
    }}
  />
  <button onClick={() => setIsAddModalOpen(true)}>Thêm khóa học</button>
</div>;
```

**Áp dụng tương tự cho:**

- ✅ **LessonManagement.tsx** - `type="lessons"`
- ✅ **ExamManagement.tsx** - `type="exams"`
- ✅ **DocumentManagement.tsx** - `type="documents"`
- ✅ **RoadmapManagement.tsx** - `type="roadmaps"`

---

## 📊 Cấu trúc File Excel

### Quick Export

```
┌─────────────────────────────────────┐
│  Header Row (Blue background)      │
│  ID | Tên | Email | Phone | ...    │
├─────────────────────────────────────┤
│  1  | John | john@... | 012... | ...│
│  2  | Jane | jane@... | 098... | ...│
└─────────────────────────────────────┘
- Auto-fit columns
- Borders on all cells
- Data formatted cho từng loại
```

### Report Management Export

```
┌─────────────────────────────────────┐
│  Tên báo cáo (Merged, Size 16)     │
├─────────────────────────────────────┤
│  Loại báo cáo: Users                │
│  Ngày xuất: 09/02/2026 10:30       │
│  Tổng số bản ghi: 150               │
├─────────────────────────────────────┤
│  [Empty Row]                        │
├─────────────────────────────────────┤
│  Header Row (Blue background)      │
│  ID | Tên | Email | ...             │
├─────────────────────────────────────┤
│  Data rows...                       │
└─────────────────────────────────────┘
```

---

## 🔧 Cài đặt

### Backend

```bash
cd server
npm install exceljs
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📝 Checklist Triển khai

### Backend ✅

- [x] Cài đặt exceljs
- [x] Tạo excelExportService.js
- [x] Thêm exportUsersToExcel vào userController
- [x] Tạo exportController cho các entities khác
- [x] Tạo reportService & reportController
- [x] Thêm routes vào adminRoutes.js
- [x] Test API endpoints

### Frontend ✅

- [x] Tạo reportAPI.ts
- [x] Tạo ExportButton component
- [x] Tạo ReportManagementNew page
- [x] Thêm ExportButton vào AccountManagement
- [x] Thêm ExportButton vào NewsManagement
- [ ] Thêm ExportButton vào CourseManagement
- [ ] Thêm ExportButton vào LessonManagement
- [ ] Thêm ExportButton vào ExamManagement
- [ ] Thêm ExportButton vào DocumentManagement
- [ ] Thêm ExportButton vào RoadmapManagement
- [ ] Cập nhật routing cho ReportManagementNew

---

## 🧪 Testing

### Test Quick Export

```bash
# 1. Login as admin
# 2. Vào trang Users Management
# 3. Click "Xuất Excel"
# 4. Kiểm tra file download
# 5. Mở file Excel và verify data
```

### Test Report Management

```bash
# 1. Vào trang Report Management
# 2. Click "Tạo báo cáo mới"
# 3. Điền form và Submit
# 4. Verify báo cáo xuất hiện trong danh sách
# 5. Click Download và verify file
# 6. Test Delete report
```

---

## 🎯 Use Cases

### Use Case 1: Admin cần xuất danh sách người dùng đang hoạt động

```
1. Vào Quản lý Tài khoản
2. Filter: Trạng thái = "Hoạt động"
3. Click "Xuất Excel"
4. File tải về ngay lập tức
```

### Use Case 2: Ban giám đốc cần báo cáo định kỳ

```
1. Vào Báo cáo
2. Tạo báo cáo mới: "Báo cáo người dùng tháng 2/2026"
3. Chọn loại: "Người dùng"
4. Lưu báo cáo
5. Tải về hoặc xem lại sau
```

### Use Case 3: Xuất tất cả khóa học để backup

```
1. Vào Quản lý Khóa học
2. Không filter (lấy tất cả)
3. Click "Xuất Excel"
4. Backup file
```

---

## 💡 Best Practices

### Khi nào dùng Quick Export?

- ✅ Cần data ngay lập tức
- ✅ Export 1 lần
- ✅ Không cần lưu lịch sử
- ✅ Dữ liệu đơn giản (1 bảng)

### Khi nào dùng Report Management?

- ✅ Báo cáo định kỳ
- ✅ Cần lưu lịch sử
- ✅ Chia sẻ với nhiều người
- ✅ Báo cáo phức tạp (nhiều bảng)

---

## 🐛 Troubleshooting

### Lỗi: "Export failed"

**Nguyên nhân:** Không có quyền admin hoặc token hết hạn

**Giải pháp:**

```bash
1. Kiểm tra localStorage.getItem("token")
2. Login lại
3. Verify user role = 1 (admin)
```

### File tải về bị lỗi

**Nguyên nhân:** Dữ liệu có ký tự đặc biệt

**Giải pháp:**

```javascript
// Backend đã xử lý escape ký tự
// Nếu vẫn lỗi, check console logs
```

### Báo cáo không hiển thị

**Nguyên nhân:** API endpoint sai

**Giải pháp:**

```bash
# Check trong reportAPI.ts
const API_URL = "http://localhost:5000/api/admin";

# Verify server đang chạy
curl http://localhost:5000/api/admin/reports/paginated
```

---

## 📚 Tài liệu tham khảo

- [ExcelJS Documentation](https://github.com/exceljs/exceljs)
- [REPORT_MANAGEMENT_GUIDE.md](./REPORT_MANAGEMENT_GUIDE.md)
- Backend API: `http://localhost:5000/api/admin`

---

## ✨ Features Tương lai

- [ ] Xuất PDF
- [ ] Lập lịch báo cáo tự động
- [ ] Gửi email báo cáo
- [ ] Dashboard analytics trong Report page
- [ ] Export CSV
- [ ] Custom columns trong export

---

**Cập nhật:** 09/02/2026
**Phiên bản:** 1.0.0
**Tác giả:** E-Learning Dev Team
