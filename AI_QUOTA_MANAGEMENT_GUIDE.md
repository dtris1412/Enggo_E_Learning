# Hướng dẫn Quản lý AI Quota & Credit

## Tổng quan

Hệ thống quản lý AI Quota mới được thiết kế để **tự động tracking chi phí** dựa trên usage thực tế từ OpenAI API, **không phụ thuộc vào OpenAI billing API**.

---

## 1. Cấu trúc Database

### Bảng: `system_ai_quotas`

| Trường                 | Kiểu  | Mô tả                                                 |
| ---------------------- | ----- | ----------------------------------------------------- |
| `quota_id`             | INT   | ID (luôn = 1)                                         |
| `open_ai_credit`       | FLOAT | Tổng số tiền đã nạp vào hệ thống (USD)                |
| `total_cost`           | FLOAT | **Tổng chi phí đã sử dụng (USD)**                     |
| `system_open_ai_token` | INT   | Số OpenAI tokens còn lại (tracking quota)             |
| `ai_token_unit`        | INT   | Số OpenAI tokens cho 1 AI token nội bộ (mặc định 500) |
| `ai_token_totals`      | INT   | Tổng AI tokens có thể dùng                            |
| `ai_token_used`        | INT   | Số AI tokens đã dùng                                  |
| `buffer_percent`       | FLOAT | Phần trăm buffer (mặc định 40%)                       |
| `price_per_milion`     | FLOAT | Giá 1 triệu tokens (mặc định $0.75 - GPT-4o mini)     |

---

## 2. Flow Nghiệp Vụ

### A. Khi Admin Nạp Tiền

1. Admin nhập số tiền nạp (ví dụ: $10)
2. Frontend gọi API: `PUT /api/admin/ai-quota/credit`
   ```json
   {
     "credit": 10,
     "pricePerMillion": 0.75,
     "bufferPercent": 40,
     "aiTokenUnit": 500
   }
   ```
3. Backend cập nhật:
   - `open_ai_credit = 10`
   - Tính lại quota dựa trên công thức

**Lưu ý:** Không cần gọi OpenAI billing API.

---

### B. Khi User Sử Dụng AI

1. User gọi AI endpoint (ví dụ: `/api/user/ai/context-assist`)
2. Backend gọi OpenAI API và nhận response với `usage` data:
   ```json
   {
     "choices": [...],
     "usage": {
       "prompt_tokens": 150,
       "completion_tokens": 250,
       "total_tokens": 400
     }
   }
   ```
3. Backend tính chi phí phát sinh:
   ```javascript
   cost_used = (total_tokens / 1_000_000) * price_per_milion;
   // Ví dụ: (400 / 1_000_000) * 0.75 = $0.0003
   ```
4. Backend cập nhật DB **atomic** (tránh race condition):
   ```javascript
   await quota.increment({ total_cost: 0.0003 });
   await quota.decrement({ system_open_ai_token: 400 });
   ```
5. Backend kiểm tra credit còn lại:
   ```javascript
   remaining_credit = open_ai_credit - total_cost;
   // Ví dụ: 10 - 0.0003 = $9.9997
   ```

---

### C. Hiển thị Trên Dashboard

Dashboard hiển thị:

- **Tổng đã nạp:** `open_ai_credit` (ví dụ: $10.00)
- **Đã sử dụng:** `total_cost` (ví dụ: $0.0003)
- **Còn lại:** `remaining_credit = open_ai_credit - total_cost` (ví dụ: $9.9997)
- **Phần trăm sử dụng:** `(total_cost / open_ai_credit) * 100` (ví dụ: 0.003%)

---

## 3. Công Thức Tính Toán

### Khi Nạp Tiền

```javascript
open_ai_credit += credit_nạp_mới;
```

### Khi Sử Dụng AI

```javascript
// Tính chi phí phát sinh
cost_used = (tokens_used / 1_000_000) × price_per_milion

// Cộng dồn chi phí
total_cost += cost_used

// Tính credit còn lại
remaining_credit = open_ai_credit - total_cost
```

### Ví Dụ Cụ Thể

- **Nạp tiền:** $10
- **Sử dụng lần 1:** 400 tokens → cost = (400/1M) × $0.75 = $0.0003
- **Sử dụng lần 2:** 1000 tokens → cost = (1000/1M) × $0.75 = $0.00075
- **Tổng cost:** $0.0003 + $0.00075 = $0.00105
- **Còn lại:** $10 - $0.00105 = **$9.99895**

---

## 4. API Endpoints

### 4.1. Lấy Thông Tin Quota

```http
GET /api/admin/ai-quota
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "quota_id": 1,
    "open_ai_credit": 10,
    "total_cost": 0.00105,
    "system_open_ai_token": 12000000,
    "ai_token_totals": 24000,
    "ai_token_used": 3,
    "buffer_percent": 40,
    "price_per_milion": 0.75
  }
}
```

---

### 4.2. Cập Nhật Credit (Admin Nạp Tiền)

```http
PUT /api/admin/ai-quota/credit
Authorization: Bearer <token>
Content-Type: application/json

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
    "quota": { ... },
    "calculated": {
      "totalOpenAITokens": 13333333,
      "systemOpenAITokens": 8000000,
      "aiTokensTotal": 16000
    }
  }
}
```

---

### 4.3. Lấy Thống Kê Chi Tiết

```http
GET /api/admin/ai-quota/stats
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "credit": {
      "total": 10,
      "used": "0.001050",
      "remaining": "9.998950",
      "usagePercent": 0.01
    },
    "openAITokens": {
      "total": 13333333,
      "buffer": 5333333,
      "available": 8000000,
      "used": 1400,
      "remaining": 7998600,
      "usagePercent": 0.02
    },
    "aiTokens": {
      "total": 16000,
      "used": 3,
      "remaining": 15997,
      "usagePercent": 0.02
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

### 4.4. Cập Nhật Cấu Hình

```http
PUT /api/admin/ai-quota/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "pricePerMillion": 0.8,
  "bufferPercent": 35,
  "aiTokenUnit": 600
}
```

---

## 5. Backend Implementation

### Service: `deductTokenUsage(tokensUsed, aiTokensUsed)`

**Atomic Update để tránh Race Condition:**

```javascript
export const deductTokenUsage = async (tokensUsed, aiTokensUsed) => {
  const quota = await getSystemQuota();

  // Tính chi phí
  const costUsed = (tokensUsed / 1_000_000) * quota.price_per_milion;

  // Kiểm tra credit
  const remainingCredit = quota.open_ai_credit - quota.total_cost;
  if (remainingCredit < costUsed) {
    throw new Error(
      `Insufficient credit. Remaining: $${remainingCredit.toFixed(6)}`,
    );
  }

  // Atomic update
  await quota.increment({ total_cost: costUsed, ai_token_used: aiTokensUsed });
  await quota.decrement({ system_open_ai_token: tokensUsed });

  await quota.reload();
  return {
    quota,
    cost_used: costUsed,
    remaining_credit: quota.open_ai_credit - quota.total_cost,
  };
};
```

---

## 6. Frontend Implementation

### Context: `useSystemAIQuota()`

**Available Functions:**

- `fetchQuota()` - Lấy thông tin quota
- `fetchStats()` - Lấy thống kê chi tiết
- `updateCredit(data)` - Cập nhật credit (admin nạp tiền)
- `updateConfig(data)` - Cập nhật cấu hình

**State:**

- `quota` - Thông tin quota
- `stats` - Thống kê chi tiết
- `loading` - Trạng thái loading
- `error` - Thông báo lỗi

---

### Component: `SystemAIQuotaCard`

**Hiển thị:**

- **Credit Remaining:** Số tiền còn lại (màu xanh/cam/đỏ theo %)
- **AI Tokens:** Số tokens còn lại
- **Credit Usage:** Phần trăm đã sử dụng
- **Progress Bar:** Thanh tiến trình sử dụng
- **Configuration:** Price, Buffer, Token Unit

**Không còn:**

- ❌ Nút "Sync from OpenAI"
- ❌ Gọi OpenAI billing API

---

## 7. Ưu Điểm Flow Mới

1. **Không phụ thuộc OpenAI billing API**
   - Không cần organization-level API key
   - Không gặp lỗi 403/404
   - Hoạt động với key cá nhân

2. **Chủ động tracking chi phí**
   - Tính toán chính xác dựa trên usage thực tế
   - Minh bạch, dễ kiểm toán
   - Cảnh báo khi gần hết credit

3. **Tránh Race Condition**
   - Dùng atomic update (`increment`/`decrement`)
   - An toàn khi nhiều user sử dụng đồng thời

4. **Dễ mở rộng**
   - Có thể áp dụng cho nhiều AI provider khác
   - Dễ thêm tracking chi tiết (log từng lần sử dụng)

---

## 8. Migration Guide

### Nếu Hệ Thống Cũ Đã Có Dữ Liệu

1. **Thêm cột `total_cost`:**

   ```sql
   ALTER TABLE system_ai_quotas ADD COLUMN total_cost FLOAT DEFAULT 0;
   ```

2. **Tính toán lại `total_cost` từ dữ liệu cũ (nếu có):**

   ```sql
   -- Giả sử tokens đã dùng = system_open_ai_token ban đầu - hiện tại
   UPDATE system_ai_quotas
   SET total_cost = ((ai_token_used * ai_token_unit) / 1000000.0) * price_per_milion
   WHERE quota_id = 1;
   ```

3. **Xóa các hàm deprecated:**
   - ❌ `fetchOpenAICredit()`
   - ❌ `syncCreditFromOpenAI()`
   - ❌ Routes: `/fetch-openai-credit`, `/sync-from-openai`

4. **Update frontend:**
   - Loại bỏ `fetchOpenAICredit`, `syncFromOpenAI` khỏi context
   - Loại bỏ nút "Sync from OpenAI" khỏi component

---

## 9. Testing

### Test Case 1: Admin Nạp Tiền

```bash
curl -X PUT http://localhost:8080/api/admin/ai-quota/credit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"credit": 10, "pricePerMillion": 0.75}'
```

### Test Case 2: User Dùng AI

```bash
curl -X POST http://localhost:8080/api/user/ai/context-assist \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is AI?"}'
```

### Test Case 3: Kiểm Tra Stats

```bash
curl -X GET http://localhost:8080/api/admin/ai-quota/stats \
  -H "Authorization: Bearer <token>"
```

**Kỳ vọng:** `total_cost` tăng, `remaining_credit` giảm sau mỗi lần dùng AI.

---

## 10. Troubleshooting

### Vấn đề: Credit không giảm sau khi dùng AI

- **Kiểm tra:** Backend có gọi `deductTokenUsage()` sau mỗi AI request không?
- **Kiểm tra:** `total_cost` có tăng trong DB không?

### Vấn đề: Race condition khi nhiều user dùng đồng thời

- **Giải pháp:** Đảm bảo dùng `quota.increment()` và `quota.decrement()` thay vì `quota.update()`.

### Vấn đề: Quota không chính xác

- **Kiểm tra:** `price_per_milion` có đúng với model đang dùng không?
- **Kiểm tra:** Có tracking đủ `total_tokens` từ OpenAI response không?

---

## 11. Tóm Tắt

**Flow chuẩn:**

1. Admin nạp credit → `open_ai_credit = $10`
2. User dùng AI → Backend tính `cost_used`, cộng vào `total_cost`
3. Hiển thị `remaining_credit = open_ai_credit - total_cost` trên dashboard
4. Cảnh báo khi gần hết credit

**Không cần:**

- ❌ Gọi OpenAI billing API
- ❌ Organization-level API key
- ❌ Sync thủ công

**Công thức cốt lõi:**

```
remaining_credit = open_ai_credit - total_cost
```

---

**Hệ thống sẵn sàng sử dụng!** 🚀
