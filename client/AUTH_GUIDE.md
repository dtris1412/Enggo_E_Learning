# Authentication Context Guide

## Tổng quan

AuthContext cung cấp các chức năng xác thực và quản lý người dùng trong ứng dụng.

## Cấu trúc

### 1. AuthContext (`src/shared/contexts/authContext.tsx`)

Cung cấp các chức năng:

- `login(user_name, user_password)` - Đăng nhập
- `register(user_name, user_email, user_password, full_name?, user_phone?)` - Đăng ký
- `logout()` - Đăng xuất
- `forgotPassword(user_email)` - Quên mật khẩu
- `resetPassword(user_name, user_email, otp, new_password)` - Đặt lại mật khẩu
- `loginWithGoogle()` - Đăng nhập bằng Google
- `loginWithFacebook()` - Đăng nhập bằng Facebook

### 2. ProtectedRoute (`src/shared/components/ProtectedRoute.tsx`)

Component bảo vệ các routes cần xác thực:

```tsx
<ProtectedRoute>
  <UserProfile />
</ProtectedRoute>

// Hoặc với role cụ thể
<ProtectedRoute requiredRole={1}>
  <AdminDashboard />
</ProtectedRoute>
```

### 3. ToastProvider (`src/shared/components/Toast/Toast.tsx`)

Hiển thị thông báo:

```tsx
const { showToast } = useToast();
showToast("success", "Đăng nhập thành công!");
showToast("error", "Có lỗi xảy ra!");
```

## Cách sử dụng

### Trong Component

```tsx
import { useAuth } from "../shared/contexts/authContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login("username", "password");
    if (result.success) {
      // Đăng nhập thành công
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Xin chào {user?.full_name}</p>
      ) : (
        <button onClick={handleLogin}>Đăng nhập</button>
      )}
    </div>
  );
};
```

### Routes Structure

```
/                   - Trang chủ (public)
/login             - Đăng nhập (public)
/register          - Đăng ký (public)
/profile           - Trang cá nhân (protected)
/my-courses        - Khóa học của tôi (protected)
/admin/*           - Admin routes (protected, role = 1)
```

## API Endpoints (Backend)

- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/logout` - Đăng xuất
- POST `/api/auth/refresh-token` - Làm mới token
- POST `/api/auth/forgot-password` - Quên mật khẩu
- POST `/api/auth/reset-password` - Đặt lại mật khẩu
- GET `/api/auth/google` - Đăng nhập Google
- GET `/api/auth/facebook` - Đăng nhập Facebook

## Proxy Configuration

Vite proxy đã được cấu hình trong `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080',
  },
}
```

## Environment Variables

```
VITE_API_URL=/api  // Development & Production
```

## User Roles

- `0` - User (người dùng thường)
- `1` - Admin (quản trị viên)
