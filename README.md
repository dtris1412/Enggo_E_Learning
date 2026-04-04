Cấu trúc backend

server/src/
├── server.js           ← Entry point, cấu hình Express & khởi động
├── config/             ← Kết nối DB, Redis, Cloudinary, cổng thanh toán
├── middleware/         ← authMiddleware (JWT), multerMiddleware (upload)
├── models/             ← Định nghĩa schema 48 bảng (Sequelize ORM)
├── admin/              ← Routes + Controllers của Admin
│   ├── routes/
│   └── controllers/
├── user/               ← Routes + Controllers của User
│   ├── routes/
│   └── controllers/
└── shared/             ← Routes, Controllers, Services dùng chung
    ├── routes/
    ├── controllers/
    └── services/       ← authService, uploadService, subscriptionAccessService...
