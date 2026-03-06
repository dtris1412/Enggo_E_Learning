# Test Subscription Plans API

## Step 1: Re-seed Database with Correct Features

```bash
cd server

# Undo current subscription plans seeder
npx sequelize-cli db:seed:undo --seed 20260228110000-seed-subscription-plans.cjs

# Re-run seeder with updated features (object instead of array)
npx sequelize-cli db:seed --seed 20260228110000-seed-subscription-plans.cjs
```

## Step 2: Test API Endpoint

### Test 1: Get all plans with all billing types

```bash
curl http://localhost:8080/api/user/subscription-plans | json_pp
```

Expected response:

```json
{
  "success": true,
  "data": [
    {
      "subscription_plan_id": 1,
      "name": "Free",
      "features": {
        "max_courses": 5,
        "ai_assistance": false,
        "download_documents": false,
        "priority_support": false,
        "custom_learning_path": false,
        "certificates": true
      },
      "monthly_ai_token_quota": 1000,
      "code": "free",
      "is_active": true,
      "Subscription_Prices": []
    },
    {
      "subscription_plan_id": 2,
      "name": "Pro",
      "features": {
        "max_courses": 50,
        "ai_assistance": true,
        "download_documents": true,
        "priority_support": false,
        "custom_learning_path": true,
        "certificates": true,
        "offline_access": true
      },
      "monthly_ai_token_quota": 10000,
      "code": "pro",
      "is_active": true,
      "Subscription_Prices": [...]
    }
  ],
  "count": 3,
  "message": "Successfully retrieved 3 subscription plan(s)."
}
```

### Test 2: Get plans with monthly billing only

```bash
curl "http://localhost:8080/api/user/subscription-plans?billing_type=monthly" | json_pp
```

### Test 3: Get plans with yearly billing only

```bash
curl "http://localhost:8080/api/user/subscription-plans?billing_type=yearly" | json_pp
```

### Test 4: Invalid billing type (should return error)

```bash
curl "http://localhost:8080/api/user/subscription-plans?billing_type=daily" | json_pp
```

Expected error:

```json
{
  "success": false,
  "message": "Invalid billing_type. Must be 'monthly', 'yearly', or 'weekly'."
}
```

## Step 3: Test Frontend

1. Start dev server:

```bash
cd client
npm run dev
```

2. Navigate to: `http://localhost:5173/subscription`

3. Check:
   - ✅ Features display correctly with check/cross icons
   - ✅ Feature labels are in Vietnamese
   - ✅ Billing type selector works (yearly/monthly/weekly)
   - ✅ Cards show correct plan details
   - ✅ Free plan has no subscribe button
   - ✅ Premium has gold border
   - ✅ Pro shows "Phổ biến nhất" badge

## Expected Features Display

### Free Plan

- ✓ Khóa học tối đa (5)
- ✓ Chứng chỉ
- ✗ Trợ lý AI
- ✗ Tải tài liệu
- ✗ Hỗ trợ ưu tiên
- ✗ Lộ trình học tập tùy chỉnh

### Pro Plan

- ✓ Khóa học tối đa (50)
- ✓ Trợ lý AI
- ✓ Tải tài liệu
- ✓ Lộ trình học tập tùy chỉnh
- ✓ Chứng chỉ
- ✓ Truy cập offline
- ✗ Hỗ trợ ưu tiên

### Premium Plan

- ✓ Khóa học tối đa (Không giới hạn)
- ✓ Trợ lý AI
- ✓ Tải tài liệu
- ✓ Hỗ trợ ưu tiên
- ✓ Lộ trình học tập tùy chỉnh
- ✓ Chứng chỉ
- ✓ Truy cập offline
- ✓ Buổi học trực tiếp

## Troubleshooting

### Features showing as numbers (0-5)

This means old seeder data is still in database. Solution:

```bash
# Delete old data
npx sequelize-cli db:seed:undo --seed 20260228110000-seed-subscription-plans.cjs

# Insert new data
npx sequelize-cli db:seed --seed 20260228110000-seed-subscription-plans.cjs
```

### Features showing as string "[object Object]"

Check console for JSON parsing errors. Service should auto-parse JSON fields.

### API returns empty Subscription_Prices

Make sure you also seeded subscription prices:

```bash
npx sequelize-cli db:seed --seed 20260228110100-seed-subscription-prices.cjs
```
