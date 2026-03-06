# Subscription Access Control Guide

Hệ thống kiểm tra quyền truy cập dựa trên subscription plan của user.

## Cấu trúc Subscription

### Subscription Plans

- **free**: Gói miễn phí (mặc định)
- **pro**: Gói Pro
- **premium**: Gói Premium

### Access Types (Course & Document)

- **free**: Nội dung miễn phí
- **premium**: Nội dung cao cấp (yêu cầu gói Pro hoặc Premium)

### Access Matrix

| User Plan | Can Access "free" | Can Access "premium" |
| --------- | ----------------- | -------------------- |
| free      | ✅                | ❌                   |
| pro       | ✅                | ✅                   |
| premium   | ✅                | ✅                   |
| admin     | ✅                | ✅ (bypass all)      |

---

## Services

### 1. subscriptionAccessService.js

Location: `server/src/shared/services/subscriptionAccessService.js`

#### Functions:

##### `getUserSubscriptionPlan(userId)`

Lấy plan code của user.

```javascript
import { getUserSubscriptionPlan } from "../shared/services/subscriptionAccessService.js";

const planCode = await getUserSubscriptionPlan(userId);
// Returns: "free" | "pro" | "premium"
```

##### `checkContentAccess(userId, requiredAccessType)`

Kiểm tra xem user có quyền truy cập content không.

```javascript
import { checkContentAccess } from "../shared/services/subscriptionAccessService.js";

const result = await checkContentAccess(userId, "premium");
// Returns: {
//   canAccess: boolean,
//   userPlan: string,
//   message: string
// }

if (result.canAccess) {
  // Allow access
} else {
  // Deny with result.message
}
```

##### `getUserSubscriptionInfo(userId)`

Lấy thông tin chi tiết về subscription.

```javascript
import { getUserSubscriptionInfo } from "../shared/services/subscriptionAccessService.js";

const info = await getUserSubscriptionInfo(userId);
// Returns: {
//   user_subscription_id: number,
//   plan_code: string,
//   plan_name: string,
//   started_at: Date,
//   expired_at: Date,
//   status: string,
//   billing_type: string,
//   monthly_ai_token_quota: number
// } | null
```

---

## Middleware

### 1. checkSubscriptionAccess

Kiểm tra quyền truy cập dựa trên `req.resource.access_type`.

**Use case**: Khi bạn đã load resource (course/document) và muốn check access.

```javascript
import {
  verifyToken,
  checkSubscriptionAccess,
} from "../middleware/authMiddleware.js";

// Step 1: Load resource và attach vào req
const loadCourseMiddleware = async (req, res, next) => {
  const course = await db.Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  req.resource = course; // Attach resource
  next();
};

// Step 2: Apply middleware chain
router.get(
  "/courses/:id",
  verifyToken, // Auth required
  loadCourseMiddleware, // Load course
  checkSubscriptionAccess, // Check access based on course.access_type
  getCourseDetail, // Controller
);
```

### 2. requireSubscription(accessType)

Yêu cầu user có subscription level cụ thể.

**Use case**: Khi bạn muốn protect endpoint mà không cần load resource trước.

```javascript
import {
  verifyToken,
  requireSubscription,
} from "../middleware/authMiddleware.js";

// Require premium subscription
router.get(
  "/courses/premium-list",
  verifyToken,
  requireSubscription("premium"),
  getPremiumCourses,
);

// Require at least pro or premium (can access premium content)
router.post(
  "/documents/:id/download",
  verifyToken,
  requireSubscription("premium"),
  downloadPremiumDocument,
);
```

### 3. attachSubscriptionInfo

Attach subscription plan vào `req.subscriptionPlan` để sử dụng trong controller.

```javascript
import {
  verifyToken,
  attachSubscriptionInfo,
} from "../middleware/authMiddleware.js";

router.get(
  "/profile/subscription",
  verifyToken,
  attachSubscriptionInfo,
  (req, res) => {
    res.json({
      plan: req.subscriptionPlan, // "free" | "pro" | "premium"
      user: req.user,
    });
  },
);
```

---

## Example Implementation

### Document Controller với Subscription Check

```javascript
// user/routes/userRoutes.js
import {
  verifyToken,
  checkSubscriptionAccess,
} from "../../middleware/authMiddleware.js";
import { getDocumentById } from "../controllers/documentController.js";
import db from "../../models/index.js";

// Middleware to load document
const loadDocument = async (req, res, next) => {
  try {
    const document = await db.Document.findByPk(req.params.document_id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    req.resource = document; // Attach for subscription check
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Routes
router.get(
  "/documents/:document_id",
  verifyToken, // Optional: remove if allow guest view
  loadDocument, // Load document
  checkSubscriptionAccess, // Check if user can access based on document.acess_type
  getDocumentById, // Controller
);

// Download requires authentication + subscription
router.get(
  "/documents/:document_id/download",
  verifyToken, // Required: must be logged in
  loadDocument,
  checkSubscriptionAccess,
  downloadDocument,
);
```

### Course Controller với Subscription Check

```javascript
// user/routes/courseRoutes.js
import {
  verifyToken,
  checkSubscriptionAccess,
} from "../../middleware/authMiddleware.js";
import db from "../../models/index.js";

const loadCourse = async (req, res, next) => {
  try {
    const course = await db.Course.findByPk(req.params.course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    req.resource = course;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.get(
  "/courses/:course_id",
  verifyToken,
  loadCourse,
  checkSubscriptionAccess, // Check based on course.access_type
  getCourseDetail,
);

router.post(
  "/courses/:course_id/enroll",
  verifyToken,
  loadCourse,
  checkSubscriptionAccess, // Must have proper subscription to enroll
  enrollCourse,
);
```

---

## Migration Guide

### Adding "pro" to ENUM (Optional)

Nếu muốn thêm level "pro" cho documents và courses:

```javascript
// Create migration file
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE documents 
      MODIFY COLUMN acess_type ENUM('free', 'pro', 'premium') 
      NOT NULL DEFAULT 'free'
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE courses 
      MODIFY COLUMN access_type ENUM('free', 'pro', 'premium') 
      NOT NULL DEFAULT 'free'
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback
  },
};
```

### Update Access Matrix

Sau khi thêm "pro" access type:

```javascript
// In subscriptionAccessService.js
const accessLevels = {
  free: ["free"],
  pro: ["free", "pro"],
  premium: ["free", "pro", "premium"],
};
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required to access premium content"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "This content requires premium access. Your plan: free",
  "userPlan": "free",
  "requiredAccess": "premium"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Error checking subscription access"
}
```

---

## Testing

```javascript
// Example test cases
describe("Subscription Access", () => {
  it("Free user cannot access premium course", async () => {
    const response = await request(app)
      .get("/api/user/courses/1")
      .set("Authorization", `Bearer ${freeUserToken}`);

    expect(response.status).toBe(403);
    expect(response.body.userPlan).toBe("free");
  });

  it("Premium user can access premium course", async () => {
    const response = await request(app)
      .get("/api/user/courses/1")
      .set("Authorization", `Bearer ${premiumUserToken}`);

    expect(response.status).toBe(200);
  });

  it("Admin can bypass all restrictions", async () => {
    const response = await request(app)
      .get("/api/user/courses/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });
});
```

---

## Notes

1. **Admin Bypass**: Admin (role = 1) luôn có quyền truy cập mọi nội dung.

2. **Free Content**: Nội dung "free" luôn accessible cho tất cả users (kể cả chưa đăng nhập nếu không dùng verifyToken).

3. **Expired Subscriptions**: Nếu subscription hết hạn, user tự động về "free" plan.

4. **Default Plan**: Nếu không tìm thấy subscription hoặc có lỗi, mặc định là "free".

5. **Performance**: Service cache subscription info nếu cần optimize (tránh query DB nhiều lần).

6. **Typo Note**: Document model có typo `acess_type` thay vì `access_type`. Course model đúng là `access_type`.
