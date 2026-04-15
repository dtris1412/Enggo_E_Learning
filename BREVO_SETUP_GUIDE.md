# 📧 Setup Email Service với Brevo

## 📋 Hướng dẫn Chi Tiết

### 1️⃣ Tạo Tài Khoản Brevo

1. Truy cập: **https://app.brevo.com** (hoặc https://brevo.com/en)
2. Click **"Sign up"** → Điền email và mật khẩu
3. Xác nhận email
4. Hoàn thành onboarding (chọn "Send transactional emails")

### 2️⃣ Lấy API Key

1. Đăng nhập vào Brevo Dashboard
2. Vào **Settings** → **Keys & Tokens** (hoặc **Integrations**)
3. Chọn **API Keys** → **Create new API key**
4. Tên: `Enggo Learning Dev` (hoặc tùy thích)
5. Quyền: Chọn `Transactional emails`
6. Click **Create** → Copy API key (bắt đầu bằng `xsmtpsib-...`)

### 3️⃣ Xác Thực Sender Email

**Important:** Phải xác thực email gửi đi trước khi gửi email thực.

1. Vào **Senders** (hoặc **From an email/domain**)
2. Click **+ Add a sender**
3. Nhập Email: `noreply@enggo.com` (hoặc email khác)
4. Nhập Name: `Enggo Learning`
5. Click **Verify email** → Brevo sẽ gửi confirm link
6. Bạn sẽ nhận email xác thực → Click link để confirm

**⚠️ Note:** Khi đang phát triển, bạn có thể dùng email cơ sở của bạn để test:

- Admin email: `your-email@gmail.com` → Brevo sẽ xác thực
- Sau đó dùng email đó làm `BREVO_SENDER_EMAIL` trong dev

### 4️⃣ Điền vào `.env`

```bash
# File: .env (tại root của server/)

# ============ EMAIL - BREVO ============
BREVO_API_KEY=xsmtpsib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # API Key từ Brevo
BREVO_SENDER_EMAIL=noreply@enggo.com                  # Email đã xác thực
BREVO_SENDER_NAME=Enggo Learning                      # Tên hiển thị
```

### 5️⃣ Kiểm Tra Xác Thực (Cần làm!)

```bash
cd server
npm run dev

# Nếu log hiển thị:
# ✅ Email service initialized successfully!
# → Có nghĩa cấu hình đúng

# Nếu log hiển thị:
# ⚠️ BREVO_API_KEY not found in environment variables. Email service will not work.
# → Cần check lại file .env
```

---

## 🧪 Test Gửi Email

### Tạo file test tạm thời:

**File:** `server/test-email.js`

```javascript
import {
  sendWelcomeEmail,
  sendInvoiceEmail,
  sendRenewalReminderEmail,
} from "./src/shared/services/emailService.js";

// Test Welcome Email
const testUser = {
  user_email: "your-email@gmail.com", // ← Thay email của bạn
  full_name: "Test User",
};

await sendWelcomeEmail(testUser);
console.log("✅ Welcome email sent!");

// Test Invoice Email
const testOrder = {
  user_email: "your-email@gmail.com",
  full_name: "Test User",
  order_id: 12345,
  total_amount: 99000,
  billing_type: "monthly",
  plan_name: "Pro Plan",
  created_at: new Date(),
  subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

await sendInvoiceEmail(testOrder);
console.log("✅ Invoice email sent!");

// Test Renewal Reminder
const testSubscription = {
  user_email: "your-email@gmail.com",
  full_name: "Test User",
  plan_name: "Pro Plan",
  expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  remaining_tokens: 500,
};

await sendRenewalReminderEmail(testSubscription);
console.log("✅ Reminder email sent!");
```

Chạy test:

```bash
node test-email.js
```

---

## 🔗 Cấu Trúc Files

```
server/
├── .env                          # ← Điền API key ở đây
├── src/
│   ├── config/
│   │   └── brevoConfig.js        # ← Config Brevo
│   └── shared/
│       └── services/
│           └── emailService.js   # ← Service gửi email
```

---

## 📊 Email Functions Có Sẵn

| Function                         | Khi nào gửi              | Template                     |
| -------------------------------- | ------------------------ | ---------------------------- |
| `sendWelcomeEmail()`             | Khi user đăng ký         | Chào mừng + 1000 free tokens |
| `sendInvoiceEmail()`             | Sau thanh toán           | Hóa đơn chi tiết             |
| `sendRenewalReminderEmail()`     | 7 ngày trước hết hạn     | Nhắc hạn + tokens còn lại    |
| `sendSubscriptionExpiredEmail()` | Khi subscription hết hạn | Thông báo hạ cấp về Free     |

---

## 🚨 Troubleshooting

### ❌ Email không gửi đi

**Lỗi 1:** `⚠️ BREVO_API_KEY not found`

- **Fix:** Kiểm tra `.env` file có `BREVO_API_KEY` không

**Lỗi 2:** `401 Unauthorized`

- **Fix:** API key sai → Vào Brevo dashboard lấy lại

**Lỗi 3:** `Sender email not verified`

- **Fix:** Chưa xác thực email → Vào Brevo, xác thực email trong "Senders"

**Lỗi 4:** `Invalid recipient email`

- **Fix:** Email người nhận sai định dạng hoặc không tồn tại

### ✅ Test thành công

Email sẽ vào:

- **Gmail/Yahoo/Outlook:** Inbox hoặc Spam (check cả)
- **Custom domain:** Check spam folder

---

## 💡 Tips

1. **Brevo free tier:** 300 emails/day (đủ cho dev + testing)
2. **Personalization:** Dùng `${full_name}` tự động thay thế tên user
3. **HTML templates:** Có thể tùy chỉnh HTML trong emailService.js
4. **Rate limiting:** Brevo có rate limit, không lo lắng với volume nhỏ
5. **Attachments:** Hỗ trợ gửi file đính kèm nếu cần

---

## 📚 Tài liệu Tham Khảo

- **Brevo API Documentation:** https://developers.brevo.com/docs/send-transactional-email
- **Brevo Dashboard:** https://app.brevo.com
- **Nodemailer vs Brevo API:** Chúng tôi dùng Brevo API (không qua nodemailer) vì nó simple hơn

---

## ✨ Sau khi setup xong

Bất cứ lúc nào code cần gửi email:

```javascript
import {
  sendWelcomeEmail,
  sendInvoiceEmail,
} from "../shared/services/emailService.js";

// Trong user registration
await sendWelcomeEmail(newUser);

// Sau thanh toán
await sendInvoiceEmail(orderData);
```

Cố gắng! 🚀
