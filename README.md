//Cấu trúc backend

server/src/
├── server.js           ← Entry point: cấu hình Express, đăng ký route, kết nối DB
├── config/             ← Các module cấu hình dịch vụ
│   ├── connectDB.js    ← Kết nối MySQL qua Sequelize (hỗ trợ retry tự động)
│   ├── redisClient.js  ← Redis client với in-memory fallback tự động
│   ├── cloudinary.js   ← Cấu hình SDK Cloudinary
│   ├── momoConfig.js   ← Cấu hình cổng thanh toán MoMo
│   └── vnpayConfig.js  ← Cấu hình cổng thanh toán VNPay
├── middleware/
│   ├── authMiddleware.js   ← Xác thực JWT, kiểm tra quyền, kiểm tra subscription
│   └── multerMiddleware.js ← Xử lý upload file (memory storage, giới hạn 100MB)
├── models/             ← 48 Sequelize model định nghĩa schema toàn bộ CSDL
├── admin/              ← Nhóm nghiệp vụ quản trị
│   ├── routes/         ← Định nghĩa endpoint /api/admin/*
│   ├── controllers/    ← 35 controller xử lý logic Admin
│   └── services/       ← Business logic tầng Admin
├── user/               ← Nhóm nghiệp vụ người học
│   ├── routes/         ← Định nghĩa endpoint /api/user/*
│   ├── controllers/    ← Controller xử lý logic User
│   └── services/       ← 25 service module xử lý nghiệp vụ
└── shared/             ← Thành phần dùng chung cả hai nhóm
    ├── routes/         ← Auth routes, upload routes
    ├── controllers/    ← Auth controller
    └── services/       ← authService, uploadService, subscriptionAccessService...



//Middleware
HTTP Request
    │
    ▼
[1] CORS Middleware (cors)
    │  Kiểm tra và thiết lập header CORS
    │  Dev: chỉ cho phép origin http://localhost:5173
    │  Production: cho phép same-origin (Express serve cả FE lẫn BE)
    ▼
[2] Cookie Parser (cookie-parser)
    │  Phân tích cookie từ request header
    ▼
[3] Body Parser (express.json / express.urlencoded)
    │  Phân tích request body, giới hạn 5MB
    ▼
[4] Router Matching
    │  Khớp đường dẫn với nhóm route tương ứng
    ▼
[5] Auth Middleware (verifyToken / optionalVerifyToken)
    │  Xác thực JWT từ Authorization: Bearer <token>
    │  Gắn thông tin user vào req.user cho các bước tiếp theo
    ▼
[6] Controller
    │  Xử lý logic nghiệp vụ, truy vấn DB, gọi AI API
    ▼
[7] HTTP Response (JSON)



//connection database
Thứ tự ưu tiên kết nối:

[1] DB_HOST + DB_NAME (biến môi trường riêng lẻ)
    → Dùng cho Railway Private Network (hiệu năng cao, không qua public internet)
    → Cấu hình: host=DB_HOST, port=DB_PORT, database=DB_NAME

[2] MYSQL_URL (connection string)
    → Fallback khi dùng Railway Public URL
    → Ví dụ: mysql://user:pass@host:port/dbname

[3] Hardcoded local (enggo/enggo123 @ 127.0.0.1:3307)
    → Fallback cho môi trường phát triển cục bộ

//Kiến trúc tích hợp AI
askOpenAI({ message, type, context, systemPrompt, options })
    │
    ├── type = "chat"        → AI Assistant học tiếng Anh tổng quát
    ├── type = "explanation" → Giải thích đáp án câu hỏi thi
    ├── type = "flashcard"   → Tạo flashcard từ vựng tự động
    └── type = "grading"     → Chấm điểm bài Writing/Speaking


//Tuần tự CI/CD RAILWAY

[1] Nhận mã nguồn
    └── Railway kéo mã nguồn từ kho GitHub

[2] Phân tích & Build (Nixpacks)
    └── Phát hiện Node.js project
    └── Cài đặt dependencies: npm install (cả server/ và client/)
    └── Thực thi build command: npm run build
        └── Vite biên dịch React → client/dist/ (tree-shaking, minify, hash)

[3] Tạo Docker image
    └── Nixpacks đóng gói toàn bộ ứng dụng vào container image

[4] Triển khai container
    └── Railway khởi chạy container với start command: npm start
    └── Express lắng nghe trên cổng $PORT (Railway gán động)

[5] Health Check xác nhận
    └── Railway gọi GET /api/health mỗi 10 giây (tối đa 120 giây)
    └── HTTP 200 → Triển khai thành công
    └── Timeout → Rollback về phiên bản trước


//Flow sau trên môi trường Production
Người dùng (Browser)
        │
        │ HTTPS
        ▼
Railway Load Balancer
        │
        │
        ▼
Express Server (Node.js, cổng động $PORT)
        │
        ├──── Tệp tĩnh React (client/dist/) ───→ Trả về index.html
        │
        ├──── API /api/* ──────────────────────→ Controller Layer
        │                                              │
        │                    ┌──────────────────────── ┤
        │                    │                         │
        │               MySQL Plugin              Redis Plugin
        │            (Private Network)          (Private Network)
        │
        ├──── Upload /api/upload/* ────────────→ Multer → Cloudinary CDN
        │
        └──── AI requests ─────────────────────→ OpenAI API (internet)
                                                       │
                                              Cache kết quả vào Redis
