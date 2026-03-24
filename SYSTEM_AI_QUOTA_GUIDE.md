# Hướng dẫn Hệ thống AI Quota Management

## Tổng quan

Hệ thống quản lý quota AI cho phép admin kiểm soát chi phí sử dụng OpenAI API bằng cách:

- Quản lý credit OpenAI tổng thể
- Tính toán và phân bổ quota token hệ thống
- Chuyển đổi OpenAI tokens thành AI tokens nội bộ cho user
- Theo dõi chi tiết usage và chi phí

---

## Cài đặt & Yêu cầu

### OpenAI API Key

Hệ thống cần OpenAI API key để:

1. Gọi AI API (chat, flashcard generation...)
2. (Optional) Đồng bộ credit tự động từ OpenAI

**Cấu hình trong `.env`:**

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Tính năng Auto Sync Credit (Optional)

Để sử dụng tự động đồng bộ credit (`POST /api/admin/ai-quota/sync-from-openai`):

**Yêu cầu:**

- ✅ OpenAI API key phải có quyền truy cập billing
- ✅ Khuyến nghị dùng organization-level API key
- ✅ Tài khoản OpenAI phải là Pay-as-you-go hoặc Enterprise

**Kiểm tra API key có hỗ trợ không:**

```bash
GET /api/admin/ai-quota/fetch-openai-credit
```

Nếu trả về lỗi 403/404 → Sử dụng cập nhật thủ công.

**Lưu ý:**

- Personal API key thường không có quyền billing
- Free trial account không hỗ trợ billing API
- Nếu không dùng auto sync, vẫn có thể cập nhật thủ công

---

## Flow Tổng thể

```
Admin add $7 credit vào OpenAI
        ↓
Cập nhật credit vào System AI Quota (Auto sync hoặc Manual)
        ↓
Tính toán: Credit → OpenAI tokens
        ↓
Trừ buffer (40% mặc định)
        ↓
Quy đổi → AI token nội bộ
        ↓
User mua plan → Nhận AI tokens
        ↓
User gọi AI (flashcard, chat, analysis...)
        ↓
Server gọi OpenAI API
        ↓
Trừ token user & system quota
```

---

## Công thức Tính toán

### 1. OpenAI Tokens từ Credit

```
OpenAI_tokens = (credit / price_per_million) * 1,000,000
```

**Ví dụ:**

- Credit: $7
- Price per million: $0.75 (GPT-4o mini average)
- OpenAI_tokens = (7 / 0.75) \* 1,000,000 = **9,333,333 tokens**

### 2. System Tokens sau Buffer

```
system_openai_tokens = OpenAI_tokens * (1 - buffer_percent / 100)
```

**Ví dụ:**

- OpenAI_tokens: 9,333,333
- Buffer percent: 40%
- system_openai_tokens = 9,333,333 \* 0.6 = **5,600,000 tokens**

### 3. AI Tokens Nội bộ

```
ai_tokens_total = floor(system_openai_tokens / ai_token_unit)
```

**Ví dụ:**

- system_openai_tokens: 5,600,000
- ai_token_unit: 500 (1 AI token = 500 OpenAI tokens)
- ai_tokens_total = 5,600,000 / 500 = **11,200 AI tokens**

### 4. Trừ Token khi User sử dụng

```
ai_tokens_used = ceil(openai_tokens_used / ai_token_unit)
```

**Ví dụ:**

- OpenAI API trả về: total_tokens = 360
- ai_token_unit: 500
- ai_tokens_used = ceil(360 / 500) = **1 AI token**

---

## API Endpoints (Admin)

### 1. GET /api/admin/ai-quota

Lấy thông tin quota hệ thống hiện tại.

**Response:**

```json
{
  "success": true,
  "data": {
    "quota_id": 1,
    "open_ai_credit": 7.0,
    "system_open_ai_token": 5600000,
    "ai_token_unit": 500,
    "ai_token_totals": 11200,
    "ai_token_used": 150,
    "buffer_percent": 40,
    "price_per_milion": 0.75
  }
}
```

---

### 2. PUT /api/admin/ai-quota/credit

Cập nhật credit khi admin add credit trên OpenAI.

**Request Body:**

```json
{
  "credit": 10,
  "pricePerMillion": 0.75,
  "bufferPercent": 40,
  "aiTokenUnit": 500
}
```

**Response:**

```json
{
  "success": true,
  "message": "Credit updated successfully",
  "data": {
    "quota": {
      "quota_id": 1,
      "open_ai_credit": 10,
      "system_open_ai_token": 8000000,
      "ai_token_totals": 16000,
      ...
    },
    "calculated": {
      "totalOpenAITokens": 13333333,
      "systemOpenAITokens": 8000000,
      "aiTokensTotal": 16000,
      "bufferTokens": 5333333
    }
  }
}
```

**Lưu ý:**

- Chỉ `credit` là bắt buộc
- Các tham số khác (`pricePerMillion`, `bufferPercent`, `aiTokenUnit`) là optional
- Nếu không truyền, sẽ dùng giá trị hiện tại trong database

---

### 3. PUT /api/admin/ai-quota/config

Cập nhật cấu hình hệ thống (giá model, buffer, unit) mà không thay đổi credit.

**Request Body:**

```json
{
  "pricePerMillion": 0.8,
  "bufferPercent": 30,
  "aiTokenUnit": 600
}
```

**Response:**

```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "data": {
    "quota": {...},
    "calculated": {...}
  }
}
```

**Lưu ý:**

- Ít nhất 1 trong 3 tham số phải có
- Khi cập nhật config, hệ thống sẽ tính lại quota với credit hiện tại

---

### 4. GET /api/admin/ai-quota/stats

Lấy thống kê sử dụng AI chi tiết.

**Response:**

```json
{
  "success": true,
  "data": {
    "credit": {
      "total": 7.0,
      "used": "0.000270",
      "remaining": "6.999730"
    },
    "openAITokens": {
      "total": 9333333,
      "buffer": 3733333,
      "available": 5600000,
      "used": 360,
      "remaining": 5599640,
      "usagePercent": 0.01
    },
    "aiTokens": {
      "total": 11200,
      "used": 1,
      "remaining": 11199,
      "usagePercent": 0.01
    },
    "config": {
      "pricePerMillion": 0.75,
      "bufferPercent": 40,
      "aiTokenUnit": 500
    }
  }
}
```

---

### 5. GET /api/admin/ai-quota/fetch-openai-credit

Lấy thông tin credit trực tiếp từ OpenAI (chỉ xem, không cập nhật DB).

**Mục đích:** Kiểm tra credit hiện tại trên OpenAI để so sánh với hệ thống.

**Response:**

```json
{
  "success": true,
  "message": "Successfully fetched credit from OpenAI",
  "data": {
    "credit": 12.5,
    "endpoint_used": "https://api.openai.com/v1/organization/billing/credit_grants",
    "fetched_at": "2026-03-24T10:30:00.000Z"
  },
  "raw_data": {
    "total_available": 12.5,
    "total_granted": 15.0,
    "total_used": 2.5
  }
}
```

**Error Response (nếu không hỗ trợ):**

```json
{
  "success": false,
  "error": "OpenAI API key does not have billing access",
  "details": "...",
  "help": "Please ensure: 1) API key is valid, 2) API key has organization-level access, 3) Billing API is enabled for your OpenAI account"
}
```

**Lưu ý:**

- Endpoint này chỉ fetch thông tin, không thay đổi database
- Dùng để kiểm tra trước khi sync
- Nếu lỗi 403/404, có thể account của bạn không hỗ trợ billing API

---

### 6. POST /api/admin/ai-quota/sync-from-openai

Đồng bộ credit từ OpenAI về hệ thống và tự động cập nhật quota.

**Mục đích:** Tự động lấy credit từ OpenAI và cập nhật vào SystemAIQuota.

**Request:** Không cần body

**Response:**

```json
{
  "success": true,
  "message": "Successfully synced credit from OpenAI",
  "data": {
    "synced_at": "2026-03-24T10:30:00.000Z",
    "previous_credit": 7.0,
    "new_credit": 12.5,
    "credit_change": 5.5,
    "quota": {
      "quota_id": 1,
      "open_ai_credit": 12.5,
      "system_open_ai_token": 10000000,
      "ai_token_totals": 20000,
      ...
    },
    "calculated": {
      "totalOpenAITokens": 16666666,
      "systemOpenAITokens": 10000000,
      "aiTokensTotal": 20000,
      "bufferTokens": 6666666
    }
  }
}
```

**Lưu ý:**

- Endpoint này tự động cập nhật database
- Giữ nguyên config hiện tại (price, buffer, unit)
- Chỉ thay đổi credit và tính lại quota

---

## Quy trình Quản lý

### Bước 1: Khởi tạo System Quota

Lần đầu tiên, admin cần cập nhật credit:

```bash
POST /api/admin/ai-quota/credit
{
  "credit": 7,
  "pricePerMillion": 0.75,
  "bufferPercent": 40,
  "aiTokenUnit": 500
}
```

### Bước 2: Theo dõi Usage

Định kỳ kiểm tra thống kê:

```bash
GET /api/admin/ai-quota/stats
```

### Bước 3: Nạp thêm Credit

Có 2 cách để nạp thêm credit vào hệ thống:

#### **Cách 1: Tự động đồng bộ từ OpenAI (Khuyến nghị)**

Khi bạn đã nạp tiền vào OpenAI, sử dụng endpoint sync:

```bash
POST /api/admin/ai-quota/sync-from-openai
```

Hệ thống sẽ:

- Tự động lấy credit hiện tại từ OpenAI
- Cập nhật vào database
- Tính lại quota tự động

**Kiểm tra trước khi sync:**

```bash
GET /api/admin/ai-quota/fetch-openai-credit
```

**Ưu điểm:**

- ✅ Tự động, chính xác
- ✅ Không cần nhập số liệu thủ công
- ✅ Đồng bộ trực tiếp từ OpenAI

**Lưu ý:**

- Chỉ hoạt động nếu API key có quyền truy cập billing
- Cần organization-level API key
- Một số tài khoản OpenAI không hỗ trợ billing API

#### **Cách 2: Cập nhật thủ công**

Nếu không thể sync tự động, cập nhật thủ công:

```bash
PUT /api/admin/ai-quota/credit
{
  "credit": 12
}
```

**Ưu điểm:**

- ✅ Luôn hoạt động
- ✅ Không cần billing API

**Nhược điểm:**

- ❌ Phải nhập thủ công
- ❌ Có thể nhầm số liệu

### Bước 4: Điều chỉnh Cấu hình

Nếu cần thay đổi buffer hoặc giá model:

```bash
PUT /api/admin/ai-quota/config
{
  "bufferPercent": 30,
  "pricePerMillion": 0.8
}
```

---

## Xử lý Token khi User Sử dụng AI

### Flow tự động (đã tích hợp)

1. User gọi API AI (chat, flashcard, analysis...)
2. Server gọi OpenAI API
3. OpenAI trả về `usage.total_tokens` (ví dụ: 360)
4. Hệ thống tự động:
   - Tính `ai_tokens_used = ceil(360 / 500) = 1`
   - Kiểm tra user có đủ AI token không
   - Trừ 1 AI token từ user wallet
   - Trừ 360 OpenAI tokens từ system quota
   - Ghi log vào `user_token_transactions`

### Khi User hết Token

API sẽ trả về lỗi:

```json
{
  "error": "Token quota exceeded",
  "detail": "Insufficient AI tokens. Required: 2, Available: 0"
}
```

User cần:

- Mua thêm plan
- Hoặc chờ admin cấp thêm token

---

## Models & Database

### Bảng `system_ai_quotas`

```sql
CREATE TABLE system_ai_quotas (
  quota_id INT PRIMARY KEY AUTO_INCREMENT,
  open_ai_credit FLOAT DEFAULT 0,
  system_open_ai_token INT DEFAULT 0,
  ai_token_unit INT DEFAULT 500,
  ai_token_totals INT DEFAULT 0,
  ai_token_used INT DEFAULT 0,
  buffer_percent FLOAT DEFAULT 20,
  price_per_milion FLOAT DEFAULT 0
);
```

**Lưu ý:** Chỉ nên có 1 bản ghi duy nhất (quota_id = 1)

### Bảng `user_token_wallets`

Quản lý số dư AI token của từng user.

### Bảng `user_token_transactions`

Ghi log mọi giao dịch token:

- `transaction_type = "usage"` khi user sử dụng AI
- `amount` âm (-1, -2...) khi trừ token
- `amount` dương khi cấp token

---

## Giá Model OpenAI (Tham khảo)

### GPT-4o Mini

- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens
- **Average: ~$0.75 / 1M tokens**

### GPT-4o

- Input: $2.50 / 1M tokens
- Output: $10.00 / 1M tokens
- Average: ~$6.25 / 1M tokens

**Cập nhật giá:** https://openai.com/pricing

---

## Best Practices

### 1. Giữ Buffer Hợp lý

- **40-50%**: An toàn cho production
- **20-30%**: Tối ưu chi phí nhưng rủi ro cao hơn

### 2. Theo dõi Usage Hàng ngày

- Kiểm tra `GET /api/admin/ai-quota/stats` mỗi ngày
- Cảnh báo khi `usagePercent > 80%`

### 3. Cập nhật Giá Model

- Kiểm tra giá OpenAI định kỳ
- Cập nhật `pricePerMillion` khi có thay đổi

### 4. Quản lý Credit Proactive

- Nạp thêm credit trước khi hết
- Không để hệ thống hết quota đột ngột

---

## Troubleshooting

### Lỗi: "System has insufficient OpenAI token quota"

**Nguyên nhân:** Hệ thống đã dùng hết quota.

**Giải pháp:**

1. Kiểm tra credit còn lại trên OpenAI
2. Nạp thêm credit vào OpenAI
3. Cập nhật credit vào hệ thống:
   ```bash
   PUT /api/admin/ai-quota/credit
   { "credit": <new_value> }
   ```

### Lỗi: "Insufficient AI tokens"

**Nguyên nhân:** User hết AI token.

**Giải pháp:**

1. User mua plan mới
2. Hoặc admin cấp thêm token thủ công

### Giá trị âm trong system_open_ai_token

**Nguyên nhân:** Buffer quá thấp hoặc usage vượt mức.

**Giải pháp:**

1. Tăng buffer_percent
2. Nạp thêm credit
3. Review lại chính sách phân phối token

---

### Lỗi: "Failed to fetch credit from OpenAI" (403/404)

**Nguyên nhân:** API key không có quyền truy cập billing hoặc billing API không khả dụng.

**Các trường hợp:**

#### 1. **403 Forbidden**

```json
{
  "error": "OpenAI API key does not have billing access"
}
```

**Giải pháp:**

- Sử dụng organization-level API key thay vì personal API key
- Đảm bảo API key có quyền billing access trong organization settings
- Liên hệ OpenAI support để kích hoạt billing API

#### 2. **404 Not Found**

```json
{
  "error": "OpenAI billing API not available"
}
```

**Giải pháp:**

- Tính năng billing API có thể không khả dụng cho loại tài khoản của bạn
- Sử dụng phương pháp cập nhật thủ công thay vì auto sync
- Kiểm tra xem tài khoản có phải là Pay-as-you-go không

#### 3. **401 Unauthorized**

```json
{
  "error": "OpenAI API key is invalid or expired"
}
```

**Giải pháp:**

- Kiểm tra API key trong file `.env`
- Tạo API key mới từ OpenAI dashboard
- Re-deploy server sau khi cập nhật API key

#### **Workaround: Dùng cập nhật thủ công**

Nếu auto sync không hoạt động, sử dụng manual update:

```bash
# Kiểm tra credit trên OpenAI dashboard web
# Sau đó cập nhật thủ công:
PUT /api/admin/ai-quota/credit
{
  "credit": 12.5
}
```

---

## Ví dụ Thực tế

### Scenario: Admin nạp $20 vào OpenAI

1. **Nạp credit vào hệ thống:**

   ```bash
   PUT /api/admin/ai-quota/credit
   {
     "credit": 20,
     "pricePerMillion": 0.75,
     "bufferPercent": 40,
     "aiTokenUnit": 500
   }
   ```

2. **Kết quả tính toán:**
   - OpenAI tokens: 20 / 0.75 \* 1M = 26,666,666
   - Buffer (40%): 10,666,666
   - System tokens: 16,000,000
   - AI tokens total: 16,000,000 / 500 = **32,000 AI tokens**

3. **User sử dụng:**
   - Mỗi request AI ~ 300-500 OpenAI tokens
   - = 1 AI token / request
   - Hệ thống có thể phục vụ ~32,000 requests

4. **Theo dõi:**
   ```bash
   GET /api/admin/ai-quota/stats
   ```

---

## Tích hợp với User Flow

### Cấp token cho User khi mua Plan

```javascript
// Trong subscription service
const aiTokensToGrant = 100; // Theo plan

await User_Token_Wallet.update(
  { token_balance: sequelize.literal(`token_balance + ${aiTokensToGrant}`) },
  { where: { user_id } },
);

await User_Token_Transaction.create({
  user_id,
  amount: aiTokensToGrant,
  transaction_type: "subscription_grant",
  reference_id: subscription_id,
});
```

### User gọi AI

**Request:**

```bash
POST /api/user/ai/chat
{
  "message": "Explain IELTS Writing Task 2"
}
```

**Response:**

```json
{
  "reply": "IELTS Writing Task 2 is...",
  "token_info": {
    "openai_tokens_used": 350,
    "ai_tokens_used": 1,
    "ai_token_unit": 500
  }
}
```

**Tự động:**

- User wallet: -1 AI token
- System quota: -350 OpenAI tokens
- Log vào `user_token_transactions`

---

## Kết luận

Hệ thống AI Quota Management giúp:

- ✅ Kiểm soát chi phí OpenAI hiệu quả
- ✅ Phân bổ quota công bằng cho user
- ✅ Theo dõi usage chi tiết, minh bạch
- ✅ Tránh vượt ngân sách đột ngột
- ✅ Dễ dàng mở rộng và điều chỉnh

**Liên hệ:** Admin dashboard hoặc hỗ trợ kỹ thuật
