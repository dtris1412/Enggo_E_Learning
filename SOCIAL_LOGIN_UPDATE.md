# Cập nhật Social Login Redirect

## Những thay đổi đã thực hiện:

### 1. Backend (`server/src/shared/controllers/authController.js`)

- Sửa `socialLoginCallBack` để redirect về frontend với token và user data trong URL
- Set refresh token vào cookie
- Xử lý error và redirect về login page nếu có lỗi

### 2. Frontend - AuthCallback Page (`client/src/shared/pages/AuthCallback.tsx`)

- Tạo trang callback để nhận token từ social login
- Parse token và user data từ URL
- Lưu vào localStorage và cập nhật auth context
- Redirect về trang trước đó (hoặc trang chủ)

### 3. Frontend - AuthContext (`client/src/shared/contexts/authContext.tsx`)

- Thêm method `setAuthData(user, token)` để cập nhật auth state từ callback
- Lưu current path vào sessionStorage trước khi redirect sang social login
- Redirect về path đã lưu sau khi đăng nhập thành công

### 4. Frontend - App.tsx

- Thêm route `/auth/callback` cho AuthCallback component

### 5. Frontend - Login.tsx

- Hiển thị lỗi từ social login nếu có (qua URL params)

### 6. Backend - Environment Variables (`.env.example`)

- Thêm `FRONTEND_URL` để cấu hình URL frontend cho redirect

## Cách hoạt động:

### Flow đăng nhập Google/Facebook:

1. User click "Đăng nhập bằng Google/Facebook"
2. Frontend lưu current path vào `sessionStorage` với key `redirectAfterLogin`
3. Frontend redirect sang backend endpoint: `/api/auth/google` hoặc `/api/auth/facebook`
4. Backend xử lý OAuth và redirect về `/api/auth/google/callback` hoặc `/api/auth/facebook/callback`
5. Backend tạo token, lưu refresh token vào cookie
6. Backend redirect về frontend callback: `/auth/callback?token=xxx&user=yyy`
7. Frontend AuthCallback page:
   - Parse token và user từ URL
   - Lưu vào localStorage
   - Cập nhật auth context
   - Lấy redirect path từ sessionStorage
   - Redirect về trang trước đó (hoặc trang chủ)

### Trong trường hợp lỗi:

- Backend redirect về: `/login?error=social_login_failed`
- Frontend hiển thị message tương ứng với error code

## Cấu hình cần thiết:

### Server `.env`:

```env
FRONTEND_URL=http://localhost:5173  # Development
# FRONTEND_URL=https://yourdomain.com  # Production

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:8080/api/auth/facebook/callback
```

## Test:

1. Đăng nhập bằng Google/Facebook từ trang `/courses`
2. Sau khi đăng nhập thành công, sẽ redirect về trang `/courses`
3. User info và token đã được lưu trong localStorage
