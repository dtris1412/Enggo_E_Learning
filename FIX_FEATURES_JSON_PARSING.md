# Fix Features Display - JSON Text Parsing

## Vấn đề

Features trong database được lưu dưới dạng JSON text (string) nhưng frontend expect object, dẫn đến hiển thị không đúng.

## Nguyên nhân

- Seeder sử dụng `JSON.stringify()` để lưu features
- Database column type là TEXT hoặc VARCHAR
- Sequelize không tự động parse JSON text thành object

## Giải pháp

### 1. Model Update - Thêm Getter/Setter

File: `server/src/models/subscription_plan.js`

**Thay đổi:**

```javascript
features: {
  type: DataTypes.TEXT,  // Changed from DataTypes.JSON
  allowNull: true,
  get() {
    const rawValue = this.getDataValue("features");
    if (!rawValue) return {};
    if (typeof rawValue === "object") return rawValue;
    try {
      return JSON.parse(rawValue);
    } catch (e) {
      console.error("Error parsing features JSON:", e);
      return {};
    }
  },
  set(value) {
    if (typeof value === "string") {
      this.setDataValue("features", value);
    } else {
      this.setDataValue("features", JSON.stringify(value));
    }
  },
}
```

**Lợi ích:**

- ✅ Tự động parse JSON string → object khi read từ DB
- ✅ Tự động stringify object → JSON string khi save vào DB
- ✅ Handle edge cases (null, undefined, invalid JSON)
- ✅ Backwards compatible với existing data

### 2. Service Update - Enhanced Parsing

File: `server/src/user/services/subscriptionPlanService.js`

**Thêm logic:**

```javascript
const formattedData = subscriptionPlans.map((plan) => {
  const planData = plan.toJSON();

  // Ensure features is an object
  // The getter in the model should handle this, but double-check here
  if (typeof planData.features === "string") {
    try {
      console.log("Parsing features string:", planData.features);
      planData.features = JSON.parse(planData.features);
    } catch (e) {
      console.error("Error parsing features JSON for plan:", planData.name, e);
      planData.features = {};
    }
  } else if (!planData.features) {
    // If features is null or undefined, set to empty object
    planData.features = {};
  }

  console.log(
    `Plan ${planData.name} - features type:`,
    typeof planData.features,
    "value:",
    planData.features,
  );

  return planData;
});
```

**Lợi ích:**

- ✅ Double-check parsing (defense in depth)
- ✅ Logging để debug
- ✅ Handle null/undefined gracefully

## Test Plan

### Test 1: API Response Check

```bash
# Call API endpoint
curl http://localhost:8080/api/user/subscription-plans?billing_type=monthly

# Expected response:
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
      ...
    }
  ]
}
```

**Kiểm tra:**

- ✅ `features` phải là object `{...}` chứ không phải string `"{\\"max_courses\\":5...}"`
- ✅ Có thể access properties: `features.max_courses === 5`

### Test 2: Server Logs

Start server và check console logs:

```bash
cd server
npm run dev
```

**Expected logs khi call API:**

```
Plan Free - features type: object value: { max_courses: 5, ai_assistance: false, ... }
Plan Pro - features type: object value: { max_courses: 50, ai_assistance: true, ... }
Plan Premium - features type: object value: { max_courses: -1, ai_assistance: true, ... }
```

**Nếu thấy:**

```
Parsing features string: {"max_courses":5,...}
```

→ Getter chưa hoạt động, features vẫn là string từ DB

### Test 3: Frontend Display

1. Navigate to: `http://localhost:5173/subscription`
2. Select billing type (Monthly/Yearly/Weekly)
3. Check features list trong mỗi pricing card

**Expected:**

- ✅ Free plan:
  - ✅ Khóa học tối đa (5)
  - ✅ Chứng chỉ
  - ✗ Trợ lý AI
  - ✗ Tải tài liệu

- ✅ Pro plan:
  - ✅ Khóa học tối đa (50)
  - ✅ Trợ lý AI
  - ✅ Tải tài liệu
  - ✅ Lộ trình tùy chỉnh

- ✅ Premium plan:
  - ✅ Khóa học tối đa (Không giới hạn)
  - ✅ Tất cả features

**Not expected:**

- ❌ Features showing as "[object Object]"
- ❌ Features showing as JSON string
- ❌ Features showing as numbers (0, 1, 2, 3...)
- ❌ Empty features list

### Test 4: Database Direct Query

```sql
SELECT name, features FROM subscription_plans;
```

**Expected result:**

```
+----------+------------------------------------------------------------------+
| name     | features                                                         |
+----------+------------------------------------------------------------------+
| Free     | {"max_courses":5,"ai_assistance":false,...}                      |
| Pro      | {"max_courses":50,"ai_assistance":true,...}                      |
| Premium  | {"max_courses":-1,"ai_assistance":true,...}                      |
+----------+------------------------------------------------------------------+
```

→ Data in DB is still JSON text (string), which is correct!
→ Model getter converts it to object when reading

## Troubleshooting

### Issue 1: Features still showing as string

**Cause:** Getter not being called
**Solution:**

1. Restart server
2. Clear any caching
3. Check Sequelize version compatibility

### Issue 2: Features showing as empty object {}

**Cause:** JSON parsing error
**Solution:**

1. Check server logs for parse errors
2. Verify JSON format in database is valid
3. Run: `JSON.parse('{"max_courses":5}')` manually to test

### Issue 3: Frontend showing numbers instead of labels

**Cause:** Different issue - mapping problem
**Solution:**

1. Check `getFriendlyFeatureName()` function in PricingCard
2. Verify Object.entries(features) iteration
3. Check feature keys match expected keys

### Issue 4: Database column type mismatch

**Cause:** Column is VARCHAR but trying to use JSON
**Solution:**

```sql
-- Check current type
DESCRIBE subscription_plans;

-- If needed, alter column
ALTER TABLE subscription_plans MODIFY features TEXT;
```

## Database Schema

### Current Schema

```sql
CREATE TABLE subscription_plans (
  subscription_plan_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  features TEXT,  -- Stores JSON string
  monthly_ai_token_quota INT NOT NULL,
  code VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true
);
```

### Sample Data Format

```javascript
// In seeder (stays the same):
features: JSON.stringify({
  max_courses: 5,
  ai_assistance: false,
  download_documents: false,
  priority_support: false,
  custom_learning_path: false,
  certificates: true,
})

// In DB (TEXT column):
'{"max_courses":5,"ai_assistance":false,"download_documents":false,"priority_support":false,"custom_learning_path":false,"certificates":true}'

// After model getter:
{
  max_courses: 5,
  ai_assistance: false,
  download_documents: false,
  priority_support: false,
  custom_learning_path: false,
  certificates: true
}
```

## Key Points

1. **Database stores JSON as TEXT** - Không thay đổi database format
2. **Model getter parses automatically** - Transparent conversion
3. **Service adds safety layer** - Defense in depth
4. **Frontend receives objects** - No changes needed
5. **Backwards compatible** - Works with existing data

## Next Steps

1. ✅ Model updated with getter/setter
2. ✅ Service enhanced with robust parsing
3. ⏳ Test API endpoint
4. ⏳ Verify frontend display
5. ⏳ Check server logs
6. ⏳ Confirm features render correctly

## Commands to Run

```bash
# 1. Restart server (if running)
cd server
npm run dev

# 2. Test API
curl http://localhost:8080/api/user/subscription-plans?billing_type=monthly | jq .

# 3. Start frontend (if running)
cd client
npm run dev

# 4. Navigate to subscription page
# Visit: http://localhost:5173/subscription
```

## Expected Outcome

- Features field được automatic parse từ JSON string → object
- Frontend PricingCard component nhận được object và render đúng
- Không cần thay đổi seeder hoặc database
- Không cần migrate data
- Hoạt động với both new và existing records
