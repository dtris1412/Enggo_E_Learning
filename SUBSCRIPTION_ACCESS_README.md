# Subscription Access Control - Quick Start

## Tổng quan

Hệ thống kiểm tra quyền truy cập course và document dựa trên subscription plan của user.

## Files đã tạo

### 1. Core Service

📁 `server/src/shared/services/subscriptionAccessService.js`

- ✅ `getUserSubscriptionPlan(userId)` - Lấy plan code của user
- ✅ `checkContentAccess(userId, requiredAccessType)` - Check quyền truy cập
- ✅ `getUserSubscriptionInfo(userId)` - Lấy thông tin subscription đầy đủ

### 2. Middleware

📁 `server/src/middleware/authMiddleware.js` (updated)

- ✅ `checkSubscriptionAccess` - Check dựa trên req.resource.access_type
- ✅ `requireSubscription(accessType)` - Yêu cầu subscription level cụ thể
- ✅ `attachSubscriptionInfo` - Attach subscription info vào request

### 3. Documentation

📁 `SUBSCRIPTION_ACCESS_GUIDE.md` - Hướng dẫn chi tiết và examples

### 4. Example Code

📁 `server/src/user/routes/documentRoutes.example.js` - Document routes với subscription check
📁 `server/src/user/routes/courseRoutes.example.js` - Course routes với subscription check

## Cách sử dụng nhanh

### Option 1: Check theo từng resource

```javascript
import {
  verifyToken,
  checkSubscriptionAccess,
} from "../../middleware/authMiddleware.js";

// Load resource trước
const loadDocument = async (req, res, next) => {
  const doc = await db.Document.findByPk(req.params.id);
  req.resource = doc; // Attach resource
  next();
};

// Apply middleware
router.get(
  "/documents/:id",
  verifyToken,
  loadDocument,
  checkSubscriptionAccess, // Auto check based on req.resource.access_type
  getDocumentDetail,
);
```

### Option 2: Yêu cầu subscription cụ thể

```javascript
import {
  verifyToken,
  requireSubscription,
} from "../../middleware/authMiddleware.js";

router.get(
  "/premium-content",
  verifyToken,
  requireSubscription("premium"), // Must have premium plan
  getPremiumContent,
);
```

### Option 3: Sử dụng trong controller

```javascript
import { checkContentAccess } from "../shared/services/subscriptionAccessService.js";

const getCourse = async (req, res) => {
  const course = await db.Course.findByPk(req.params.id);

  const access = await checkContentAccess(req.user.user_id, course.access_type);

  if (!access.canAccess) {
    return res.status(403).json({
      success: false,
      message: access.message,
      userPlan: access.userPlan,
    });
  }

  // Allow access
  res.json({ success: true, data: course });
};
```

## Access Matrix

| User Plan | Free Content | Premium Content |
| --------- | ------------ | --------------- |
| free      | ✅           | ❌              |
| pro       | ✅           | ✅              |
| premium   | ✅           | ✅              |
| admin     | ✅ (bypass)  | ✅ (bypass)     |

## Áp dụng vào project

### Bước 1: Import middleware

```javascript
import {
  verifyToken,
  checkSubscriptionAccess,
} from "../../middleware/authMiddleware.js";
```

### Bước 2: Tạo load resource middleware (nếu cần)

```javascript
const loadResource = async (req, res, next) => {
  const resource = await db.YourModel.findByPk(req.params.id);
  req.resource = resource;
  next();
};
```

### Bước 3: Thêm vào route

```javascript
router.get(
  "/your-route/:id",
  verifyToken,
  loadResource,
  checkSubscriptionAccess,
  yourController,
);
```

## Notes quan trọng

1. **Admin bypass**: Admin (role = 1) tự động có quyền truy cập tất cả
2. **Free content**: Không cần subscription check cho free content
3. **Expired subscription**: User tự động về "free" plan khi hết hạn
4. **Error handling**: Service trả về "free" nếu có lỗi (fail-safe)

## Xem thêm

Đọc `SUBSCRIPTION_ACCESS_GUIDE.md` để biết chi tiết và advanced examples.
