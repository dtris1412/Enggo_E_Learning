================================================================================
                    ENGGO — E-LEARNING PLATFORM
              Hướng dẫn cài đặt và chạy dự án trên máy local
================================================================================

Tác giả  : D.Tris
Mô tả    : Hệ thống học tiếng Anh tích hợp AI (TOEIC/IELTS, Flashcard SM-2)
Stack    : Node.js + Express | React + TypeScript + Vite | MySQL 8 | Redis 7

================================================================================
MỤC LỤC
================================================================================

  1. Yêu cầu phần mềm cần cài đặt
  2. Cài đặt phần mềm
       2.1 Visual Studio Code
       2.2 Node.js
       2.3 Docker Desktop
  3. Lấy mã nguồn dự án
  4. Cấu hình biến môi trường (.env)
  5. Khởi động cơ sở dữ liệu và Redis (Docker)
  6. Cài đặt thư viện (dependencies)
  7. Khởi tạo cơ sở dữ liệu (Migration + Seeder)
  8. Khởi động ứng dụng
  9. Truy cập hệ thống
  10. Dừng hệ thống
  11. Xử lý sự cố thường gặp
  12. Cấu trúc thư mục dự án

================================================================================
1. YÊU CẦU PHẦN MỀM CẦN CÀI ĐẶT
================================================================================

Trước khi bắt đầu, bạn cần cài đặt 3 phần mềm sau:

  [1] Visual Studio Code  — Trình soạn thảo mã nguồn
  [2] Node.js v20+        — Môi trường chạy JavaScript phía server
  [3] Docker Desktop      — Chạy MySQL và Redis trong container

  Kiểm tra xem máy đã có chưa bằng cách mở Terminal / Command Prompt và gõ:

    node --version      (cần >= v20.0.0)
    npm --version       (cần >= 9.0.0)
    docker --version    (cần >= 24.0.0)

  Nếu lệnh nào báo lỗi "not recognized" thì cần cài phần mềm đó (xem mục 2).

================================================================================
2. CÀI ĐẶT PHẦN MỀM
================================================================================

------------------------------------------------------------------------
2.1 Visual Studio Code
------------------------------------------------------------------------

  Tải tại: https://code.visualstudio.com/download
  Chọn phiên bản Windows (hoặc macOS/Linux tùy hệ điều hành).
  Cài đặt theo mặc định, nhấn Next → Next → Install → Finish.

  Extension VS Code được khuyến nghị (cài trong VS Code > Extensions):
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - REST Client (để test API)

------------------------------------------------------------------------
2.2 Node.js
------------------------------------------------------------------------

  Tải tại: https://nodejs.org/en/download
  Chọn phiên bản LTS (Long Term Support) — hiện tại là v20.x hoặc v22.x
  Tải file .msi (Windows) hoặc .pkg (macOS) rồi cài theo mặc định.

  Sau khi cài xong, mở Terminal/Command Prompt mới và kiểm tra:

    node --version
    npm --version

------------------------------------------------------------------------
2.3 Docker Desktop
------------------------------------------------------------------------

  Tải tại: https://www.docker.com/products/docker-desktop/
  Chọn phiên bản Windows (hoặc macOS).

  LƯU Ý QUAN TRỌNG với Windows:
    - Yêu cầu Windows 10 phiên bản 1903 trở lên (64-bit)
    - Cần bật tính năng WSL 2 (Windows Subsystem for Linux)
    - Nếu được hỏi lúc cài đặt, chọn "Use WSL 2 instead of Hyper-V"
    - Sau khi cài, KHỞI ĐỘNG LẠI MÁY TÍNH

  Sau khi khởi động lại, mở Docker Desktop từ Start Menu.
  Chờ cho đến khi biểu tượng Docker ở thanh taskbar chuyển sang màu XANH
  (hoặc hiện chữ "Docker Desktop is running") trước khi tiếp tục.

  Kiểm tra Docker đã chạy chưa:

    docker --version
    docker compose version

================================================================================
3. LẤY MÃ NGUỒN DỰ ÁN
================================================================================

  Có 2 cách:

  --- Cách A: Clone từ GitHub  ---

    Mở Terminal / Command Prompt, chọn thư mục muốn lưu dự án, rồi chạy:

      git clone https://github.com/dtris1412/Enggo_E_Learning.git
      cd Enggo_E_Learning

    (Nếu chưa có Git, tải tại: https://git-scm.com/downloads)

  --- Cách B: Nhận folder dự án trực tiếp ---

    Giải nén file .zip (nếu được gửi dạng zip).
    Đặt thư mục dự án vào nơi muốn lưu (ví dụ: C:\Projects\Enggo_E_Learning)

  Sau đó mở VS Code:
    File → Open Folder → chọn thư mục vừa giải nén / clone về

================================================================================
4. CẤU HÌNH BIẾN MÔI TRƯỜNG (.env)
================================================================================

  Dự án cần 2 file .env:

    - server/.env       : Cấu hình backend
    - docker/.env       : Cấu hình MySQL trong Docker

  --------------------------------------------------------------------------
  BƯỚC 4.1 — Tạo file docker/.env
  --------------------------------------------------------------------------

  Tạo file mới tên ".env" trong thư mục "docker/" với nội dung sau:

  ┌─────────────────────────────────────────────────────────────────────┐
  │  MYSQL_ROOT_PASSWORD=your_root_password                             │
  │  MYSQL_DATABASE=enggo_db                                           │
  │  MYSQL_USER=enggo                                                   │
  │  MYSQL_PASSWORD=your_db_password                                    │
  └─────────────────────────────────────────────────────────────────────┘

  (Bạn có thể đổi password tùy thích, nhưng phải khớp với server/.env bên dưới)

  --------------------------------------------------------------------------
  BƯỚC 4.2 — Tạo file server/.env
  --------------------------------------------------------------------------

  Tạo file mới tên ".env" trong thư mục "server/" với nội dung sau.
  Các mục đánh dấu [BẮT BUỘC] phải điền đúng. Mục [TÙY CHỌN] có thể bỏ trống
  nếu không dùng tính năng đó.

  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  # ── Ứng dụng ──────────────────────────────────────────────────  │
  │  NODE_ENV=development                                               │
  │  PORT=8080                                                          │
  │                                                                     │
  │  # ── JWT (BẮT BUỘC) ────────────────────────────────────────────  │
  │  # Chuỗi bí mật bất kỳ, càng dài càng tốt (ví dụ 32+ ký tự)      │
  │  JWT_SECRET=enggo_super_secret_key_change_this_in_production        │
  │                                                                     │
  │  # ── Cơ sở dữ liệu MySQL (BẮT BUỘC) ───────────────────────────  │
  │  # Phải khớp với các giá trị trong docker/.env                     │
  │  DB_HOST=127.0.0.1                                                  │
  │  DB_PORT=3307                                                       │
  │  DB_NAME=enggo_db                                                   │
  │  DB_USER=enggo                                                      │
  │  DB_PASS=your_db_password        # phải khớp với MYSQL_PASSWORD      │
  │                                                                     │
  │  # ── Redis (TÙY CHỌN) ──────────────────────────────────────────  │
  │  # Nếu để trống, hệ thống tự động dùng in-memory cache (OK cho dev)│
  │  REDIS_URL=redis://127.0.0.1:6379                                   │
  │                                                                     │
  │  # ── Cloudinary (BẮT BUỘC để dùng tính năng upload ảnh/file) ──  │
  │  # Đăng ký miễn phí tại: https://cloudinary.com                    │
  │  # Vào Dashboard → Copy Cloud Name, API Key, API Secret            │
  │  CLOUDINARY_CLOUD_NAME=your_cloud_name                             │
  │  CLOUDINARY_API_KEY=your_api_key                                    │
  │  CLOUDINARY_API_SECRET=your_api_secret                             │
  │                                                                     │
  │  # ── OpenAI (BẮT BUỘC để dùng tính năng AI) ───────────────────  │
  │  # Đăng ký tại: https://platform.openai.com → API Keys            │
  │  OPENAI_API_KEY=sk-...your_openai_api_key...                       │
  │                                                                     │
  │  # ── Email (BẮT BUỘC để dùng tính năng quên mật khẩu) ─────────  │
  │  # Dùng tài khoản Gmail                                             │
  │  # Cần bật "App Password": Google Account → Security → App Passwords│
  │  EMAIL_USER=your_gmail@gmail.com                                    │
  │  EMAIL_PASS=your_gmail_app_password                                 │
  │                                                                     │
  │  # ── Google OAuth (TÙY CHỌN) ──────────────────────────────────  │
  │  # Tạo tại: https://console.cloud.google.com → Credentials         │
  │  # (Bỏ trống nếu không dùng đăng nhập Google)                      │
  │  GOOGLE_CLIENT_ID=your_google_client_id                             │
  │  GOOGLE_CLIENT_SECRET=your_google_client_secret                     │
  │  GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback │
  │                                                                     │
  │  # ── Facebook OAuth (TÙY CHỌN) ────────────────────────────────  │
  │  # Tạo tại: https://developers.facebook.com → My Apps              │
  │  # (Bỏ trống nếu không dùng đăng nhập Facebook)                    │
  │  FB_APP_ID=your_facebook_app_id                                     │
  │  FB_APP_SECRET=your_facebook_app_secret                             │
  │  FACEBOOK_CALLBACK_URL=http://localhost:8080/api/auth/facebook/callback│
  │                                                                     │
  │  # ── VNPay Sandbox (TÙY CHỌN) ─────────────────────────────────  │
  │  # (Bỏ trống nếu không test tính năng thanh toán)                  │
  │  VNPAY_TMN_CODE=your_vnpay_tmn_code                                 │
  │  VNPAY_HASH_SECRET=your_vnpay_hash_secret                          │
  │  VNPAY_API_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html  │
  │  VNPAY_REDIRECT_URL=http://localhost:8080/api/payment/vnpay/callback│
  │  VNPAY_IPN_URL=http://localhost:8080/api/payment/vnpay/ipn         │
  │                                                                     │
  │  # ── MoMo Sandbox (TÙY CHỌN) ──────────────────────────────────  │
  │  # (Bỏ trống nếu không test tính năng thanh toán)                  │
  │  MOMO_PARTNER_CODE=your_momo_partner_code                           │
  │  MOMO_ACCESS_KEY=your_momo_access_key                               │
  │  MOMO_SECRET_KEY=your_momo_secret_key                               │
  │  MOMO_API_URL=https://test-payment.momo.vn/v2/gateway/api/create   │
  │  MOMO_REDIRECT_URL=http://localhost:8080/api/payment/momo/callback  │
  │  MOMO_IPN_URL=http://localhost:8080/api/payment/momo/ipn           │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘

  ⚠️  LƯU Ý QUAN TRỌNG:
      - File .env KHÔNG được commit lên Git (đã có trong .gitignore)
      - Không chia sẻ file .env công khai
      - Với đăng nhập Google/Facebook: nếu để trống, hệ thống vẫn chạy
        bình thường, chỉ tắt tính năng đăng nhập mạng xã hội

================================================================================
5. KHỞI ĐỘNG CƠ SỞ DỮ LIỆU VÀ REDIS (DOCKER)
================================================================================

  ⚠️ Đảm bảo Docker Desktop đang CHẠY trước khi thực hiện bước này.

  Mở Terminal, di chuyển vào thư mục docker/ của dự án:

    cd đường_dẫn_đến_dự_án/docker

  Ví dụ trên Windows:
    cd C:\Projects\Enggo_E_Learning\docker

  Khởi động MySQL và Redis:

    docker compose --env-file .env up -d

  Lệnh này sẽ:
    - Tải image MySQL 8.0 và Redis 7 (lần đầu mất vài phút tùy tốc độ mạng)
    - Tạo container "enggo_mysql" (cổng 3307) và "enggo_redis" (cổng 6379)
    - Chạy ở chế độ nền (-d = detach)

  Kiểm tra các container đã chạy chưa:

    docker ps

  Kết quả mong đợi (thấy 2 dòng STATUS "Up"):

    CONTAINER ID   IMAGE          PORTS                    NAMES
    xxxxxxxxxxxx   mysql:8.0      0.0.0.0:3307->3306/tcp   enggo_mysql
    xxxxxxxxxxxx   redis:7-...    0.0.0.0:6379->6379/tcp   enggo_redis

  Chờ khoảng 15-30 giây để MySQL khởi động hoàn toàn trước khi sang bước 7.

================================================================================
6. CÀI ĐẶT THƯ VIỆN (DEPENDENCIES)
================================================================================

  Dự án có 2 phần riêng biệt (server và client), mỗi phần cần cài thư viện
  độc lập. Mở Terminal và chạy lần lượt:

  --- Cài đặt thư viện Backend ---

    cd đường_dẫn_đến_dự_án/server
    npm install

  --- Cài đặt thư viện Frontend ---

    cd đường_dẫn_đến_dự_án/client
    npm install

  Quá trình này tải toàn bộ thư viện vào thư mục node_modules/.
  Có thể mất 2-5 phút tùy tốc độ mạng.

  ⚠️ Nếu bị lỗi EACCES (Permission denied) trên macOS/Linux:
      Thêm sudo trước lệnh: sudo npm install

================================================================================
7. KHỞI TẠO CƠ SỞ DỮ LIỆU (MIGRATION + SEEDER)
================================================================================

  Bước này tạo toàn bộ bảng trong cơ sở dữ liệu và điền dữ liệu ban đầu.
  Chỉ cần thực hiện MỘT LẦN DUY NHẤT khi cài đặt lần đầu.

  ⚠️ Đảm bảo container MySQL (bước 5) đã chạy trước khi tiếp tục.

  Di chuyển vào thư mục server:

    cd đường_dẫn_đến_dự_án/server

  --------------------------------------------------------------------------
  BƯỚC 7.1 — Chạy Migration (tạo các bảng trong database)
  --------------------------------------------------------------------------

    npx sequelize-cli db:migrate --config src/config/config.cjs --migrations-path src/migrations --env development

  Nếu thành công, bạn sẽ thấy danh sách các migration được thực thi,
  kết thúc bằng dòng "XX migrations executed successfully."

  --------------------------------------------------------------------------
  BƯỚC 7.2 — Chạy Seeder (điền dữ liệu ban đầu cho gói đăng ký)
  --------------------------------------------------------------------------

    npx sequelize-cli db:seed:all --config src/config/config.cjs --seeders-path src/seeders --env development

  Seeder sẽ tạo dữ liệu:
    - Các gói đăng ký: Free, Pro, Premium
    - Bảng giá theo chu kỳ: tuần/tháng/năm

  ⚠️ Nếu gặp lỗi "SequelizeConnectionRefusedError":
      MySQL chưa sẵn sàng. Chờ thêm 30 giây rồi thử lại.

  ⚠️ Nếu gặp lỗi "Table already exists":
      Database đã được khởi tạo trước đó. Không cần chạy lại.

================================================================================
8. KHỞI ĐỘNG ỨNG DỤNG
================================================================================

  Cần mở 2 cửa sổ Terminal riêng biệt — một cho Backend, một cho Frontend.

  --------------------------------------------------------------------------
  Terminal 1 — Khởi động Backend (API Server)
  --------------------------------------------------------------------------

    cd đường_dẫn_đến_dự_án/server
    npm run dev

  Kết quả mong đợi:

    Server running on port 8080
    Environment: development
    ✅ Database connected successfully
       Database: enggo_db
       Host: 127.0.0.1

  ⚠️ Nếu thấy "Database connection failed (attempt 1/5)":
      MySQL chưa sẵn sàng. Chờ — server tự retry tối đa 5 lần.

  --------------------------------------------------------------------------
  Terminal 2 — Khởi động Frontend (React App)
  --------------------------------------------------------------------------

    cd đường_dẫn_đến_dự_án/client
    npm run dev

  Kết quả mong đợi:

    VITE v5.x.x  ready in xxx ms
    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose

================================================================================
9. TRUY CẬP HỆ THỐNG
================================================================================

  Sau khi cả hai Terminal báo thành công:

  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  Giao diện người dùng  →  http://localhost:5173              │
  │                                                              │
  │  API Backend           →  http://localhost:8080              │
  │  Health Check API      →  http://localhost:8080/api/health   │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘

  Để kiểm tra API hoạt động, mở trình duyệt và vào:
    http://localhost:8080/api/health

  Kết quả mong đợi: {"status":"ok","env":"development"}

  --------------------------------------------------------------------------
  Tạo tài khoản Admin đầu tiên
  --------------------------------------------------------------------------

  Hệ thống không có tài khoản admin mặc định. Để tạo admin:

    1. Đăng ký tài khoản bình thường tại http://localhost:5173/register
    2. Kết nối vào MySQL và đổi role của tài khoản đó thành 0:

       Sử dụng Docker để vào MySQL:

         docker exec -it enggo_mysql mysql -u enggo -p enggo_db
         (nhập your_db_password khi được hỏi)

       Sau đó chạy SQL (thay your@email.com bằng email vừa đăng ký):

         UPDATE users SET role = 0 WHERE user_email = 'your@email.com';
         EXIT;

    3. Đăng nhập lại — hệ thống tự chuyển hướng vào trang Admin
       tại http://localhost:5173/admin

================================================================================
10. DỪNG HỆ THỐNG
================================================================================

  --- Dừng Frontend và Backend ---
    Nhấn Ctrl + C trong từng cửa sổ Terminal đang chạy.

  --- Dừng Docker (MySQL + Redis) ---

    cd đường_dẫn_đến_dự_án/docker
    docker compose down

  --- Dừng Docker và XÓA toàn bộ dữ liệu database ---
  (⚠️ CẢNH BÁO: Lệnh này xóa sạch dữ liệu, cần chạy migration lại từ đầu)

    docker compose down -v

================================================================================
11. XỬ LÝ SỰ CỐ THƯỜNG GẶP
================================================================================

  ❌ Lỗi: "EADDRINUSE: address already in use :::8080"
     → Cổng 8080 đang được dùng bởi ứng dụng khác
     → Giải pháp: Thêm PORT=8081 vào server/.env rồi khởi động lại

  ❌ Lỗi: "EADDRINUSE: address already in use :::5173"
     → Cổng 5173 đang được dùng
     → Giải pháp: Thêm --port 5174 vào lệnh: npm run dev -- --port 5174

  ❌ Lỗi: "Cannot connect to the Docker daemon"
     → Docker Desktop chưa chạy
     → Giải pháp: Mở Docker Desktop, chờ biểu tượng chuyển xanh rồi thử lại

  ❌ Lỗi: "SequelizeConnectionRefusedError: connect ECONNREFUSED 127.0.0.1:3307"
     → MySQL chưa khởi động xong
     → Giải pháp A: Chờ 30 giây, server tự retry
     → Giải pháp B: Kiểm tra container: docker ps → xem enggo_mysql có STATUS "Up" không

  ❌ Lỗi: "Access denied for user 'enggo'@'...' (using password: YES)"
     → Mật khẩu MySQL trong server/.env không khớp với docker/.env
     → Giải pháp: Kiểm tra DB_PASS trong server/.env = MYSQL_PASSWORD trong docker/.env

  ❌ Lỗi migration: "Table 'XXX' already exists"
     → Database đã khởi tạo trước đó, đây không phải lỗi nguy hiểm
     → Giải pháp: Bỏ qua, không cần chạy migration lại

  ❌ Lỗi: "Module not found" hoặc "Cannot find module"
     → Chưa cài đặt thư viện
     → Giải pháp: Chạy npm install trong thư mục server/ và client/

  ❌ Upload ảnh/file không hoạt động
     → Cloudinary chưa được cấu hình
     → Giải pháp: Điền đúng CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
       CLOUDINARY_API_SECRET vào server/.env

  ❌ AI Assistant / chấm điểm không hoạt động
     → OPENAI_API_KEY chưa được cấu hình hoặc đã hết credit
     → Giải pháp: Kiểm tra key tại https://platform.openai.com/api-keys

  ❌ Không nhận được email OTP quên mật khẩu
     → EMAIL_USER hoặc EMAIL_PASS chưa đúng
     → Lưu ý: EMAIL_PASS phải là App Password của Google (16 ký tự),
       KHÔNG phải mật khẩu đăng nhập Gmail thông thường
     → Hướng dẫn tạo App Password:
       Google Account → Security → 2-Step Verification → App Passwords

================================================================================
12. CẤU TRÚC THƯ MỤC DỰ ÁN
================================================================================

  Enggo_E_Learning/
  ├── README.txt                 ← File hướng dẫn này
  ├── railway.json               ← Cấu hình triển khai Railway (production)
  ├── package.json               ← Script tổng hợp (tùy chọn)
  │
  ├── client/                    ← Frontend (React + TypeScript + Vite)
  │   ├── package.json
  │   ├── vite.config.ts         ← Proxy /api → localhost:8080
  │   ├── tailwind.config.js
  │   └── src/
  │       ├── App.tsx            ← Root component, định nghĩa toàn bộ routes
  │       ├── admin/             ← Giao diện quản trị (/admin/*)
  │       ├── user/              ← Giao diện người học
  │       └── shared/            ← Components, hooks, contexts dùng chung
  │
  ├── server/                    ← Backend (Node.js + Express)
  │   ├── package.json
  │   ├── .env                   ← ⚠️ Bạn phải tạo file này (xem mục 4)
  │   └── src/
  │       ├── server.js          ← Entry point — khởi động Express
  │       ├── config/            ← Kết nối DB, Redis, Cloudinary, thanh toán
  │       ├── middleware/        ← Auth JWT, Multer upload
  │       ├── models/            ← 48 Sequelize model (schema database)
  │       ├── migrations/        ← Lịch sử thay đổi cấu trúc database
  │       ├── seeders/           ← Dữ liệu mẫu ban đầu
  │       ├── admin/             ← Routes + Controllers Admin
  │       ├── user/              ← Routes + Controllers + Services User
  │       └── shared/            ← Auth, Upload, Subscription services
  │
  └── docker/                    ← Cấu hình Docker
      ├── .env                   ← ⚠️ Bạn phải tạo file này (xem mục 4)
      ├── docker-compose.yml     ← Định nghĩa MySQL 8.0 + Redis 7
      └── mysql/
          └── init/              ← SQL script chạy khi MySQL khởi tạo lần đầu

================================================================================
HỖ TRỢ
================================================================================

  Nếu gặp vấn đề không xử lý được, hãy kiểm tra:

  1. Log của Backend Terminal — thường hiện rõ nguyên nhân lỗi
  2. Log của Docker: docker logs enggo_mysql
  3. Đảm bảo tất cả file .env đã được tạo đúng (mục 4)
  4. Đảm bảo Docker Desktop đang chạy (biểu tượng xanh trong taskbar)

================================================================================
