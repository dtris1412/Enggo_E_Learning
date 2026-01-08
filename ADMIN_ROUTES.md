# 🗺️ Admin Routes Configuration

## ✅ Tất cả các routes đã được cấu hình:

### 📍 Admin Routes (Yêu cầu role = 1)

| Route              | Component          | Mô tả                                    |
| ------------------ | ------------------ | ---------------------------------------- |
| `/admin`           | Dashboard          | Trang chủ admin (redirect đến dashboard) |
| `/admin/dashboard` | Dashboard          | Tổng quan hệ thống                       |
| `/admin/accounts`  | AccountManagement  | Quản lý tài khoản người dùng             |
| `/admin/courses`   | CourseManagement   | Quản lý khóa học                         |
| `/admin/lessons`   | LessonManagement   | Quản lý bài học                          |
| `/admin/tests`     | TestManagement     | Quản lý bài kiểm tra                     |
| `/admin/news`      | NewsManagement     | Quản lý tin tức/blog                     |
| `/admin/feedback`  | FeedbackManagement | Quản lý phản hồi                         |
| `/admin/reports`   | ReportManagement   | Quản lý báo cáo                          |
| `/admin/progress`  | ProgressTracking   | Theo dõi tiến độ học tập                 |
| `/admin/roadmap`   | RoadmapManagement  | Quản lý lộ trình học tập                 |

## 🎨 Layout

- **Admin Layout**: Sidebar navigation + Header + Content area
- **No Header/Footer**: Admin pages không có header/footer của user
- **Responsive Sidebar**: Có thể thu gọn/mở rộng

## 🔐 Bảo mật

- Tất cả routes admin được bảo vệ bởi `ProtectedRoute`
- Yêu cầu `role = 1` (Admin)
- Auto redirect đến `/login` nếu chưa đăng nhập

## 📦 Context Providers

- `AuthProvider`: Quản lý authentication
- `UserProvider`: Quản lý user data cho admin
- `ToastProvider`: Thông báo toast

## 🚀 Cách sử dụng

```typescript
// Trong component admin
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/admin/accounts"); // Điều hướng đến quản lý tài khoản
```

## 📝 Navigation Menu

Sidebar menu tự động highlight route hiện tại với:

- Background: `bg-blue-50`
- Text color: `text-blue-600`
