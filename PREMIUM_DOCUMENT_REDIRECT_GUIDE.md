# Premium Document Redirect to Subscription Guide

## Tổng quan

Khi người dùng cố gắng tải xuống tài liệu Premium mà không có gói Premium, hệ thống sẽ tự động chuyển hướng đến trang Subscription Plans.

## Các thay đổi đã thực hiện

### Backend Changes

#### 1. Document Service (`server/src/user/services/documentService.js`)

- Thêm tham số `user_id` vào hàm `incrementDownloadCount`
- Kiểm tra access_type của document
- Nếu document là premium:
  - Kiểm tra user đã đăng nhập chưa
  - Kiểm tra user có active premium subscription không
  - Trả về error message nếu không có quyền: "This is a premium document. Please upgrade to premium subscription to download."

```javascript
// Check if document is premium and user has access
if (document.access_type === "premium") {
  if (!user_id) {
    return {
      success: false,
      message: "Premium content requires login and premium subscription.",
    };
  }

  // Check if user has active premium subscription
  const activeSubscription = await db.User_Subscription.findOne({
    where: {
      user_id: user_id,
      status: "active",
    },
    include: [
      {
        model: db.Subscription_Price,
        as: "Subscription_Price",
        include: [
          {
            model: db.Subscription_Plan,
            as: "Subscription_Plan",
            where: {
              code: "premium",
            },
          },
        ],
      },
    ],
  });

  if (!activeSubscription) {
    return {
      success: false,
      message:
        "This is a premium document. Please upgrade to premium subscription to download.",
    };
  }
}
```

#### 2. Document Controller (`server/src/user/controllers/documentController.js`)

- Lấy `user_id` từ `req.user` (từ authMiddleware)
- Truyền `user_id` vào service
- Trả về status 403 (Forbidden) thay vì 404 khi không có quyền

```javascript
const user_id = req.user?.user_id; // From authMiddleware
const result = await incrementDownloadCountService(document_id, user_id);

if (!result.success) {
  return res.status(403).json(result);
}
```

### Frontend Changes

#### 1. DocumentDetail Component (`client/src/user/components/DocumentComponent/DocumentDetail.tsx`)

**a) Updated handleDownload function:**

- Kiểm tra error message từ backend
- Nếu message chứa "premium" hoặc "subscription", hiển thị toast thông báo
- Sau 1.5s, redirect đến `/subscription`

```typescript
const handleDownload = async () => {
  if (!document) return;

  const result = await downloadDocument(document.document_id);
  if (result.success) {
    showToast("success", "Document is downloading...");
    setDocument((prev: any) => ({
      ...prev,
      download_count: prev.download_count + 1,
    }));
  } else {
    // Check if it's a premium access issue
    if (
      result.message?.toLowerCase().includes("premium") ||
      result.message?.toLowerCase().includes("subscription")
    ) {
      showToast(
        "info",
        "Tài liệu này yêu cầu gói Premium. Đang chuyển hướng...",
      );
      setTimeout(() => {
        navigate("/subscription");
      }, 1500);
    } else {
      showToast(
        "error",
        result.message || "Failed to download document. Please login first.",
      );
    }
  }
};
```

**b) Enhanced Premium Notice UI:**

- Thay đổi từ text thông báo đơn giản thành card với gradient màu vàng
- Thêm button "Nâng cấp lên Premium" để redirect trực tiếp
- Styling với gradient background và border

```tsx
{
  document.access_type === "premium" && (
    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
      <p className="text-center text-sm text-gray-700 mb-3 flex items-center justify-center gap-2">
        <Lock className="w-4 h-4 text-yellow-600" />
        <span className="font-medium">
          Tài liệu Premium - Yêu cầu gói Premium để tải xuống
        </span>
      </p>
      <button
        onClick={() => navigate("/subscription")}
        className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
      >
        <CheckCircle className="w-5 h-5" />
        Nâng cấp lên Premium
      </button>
    </div>
  );
}
```

#### 2. DocumentList Component (`client/src/user/components/DocumentComponent/DocumentList.tsx`)

**Updated handleDownload function:**

- Tương tự DocumentDetail
- Kiểm tra error message và redirect nếu cần

```typescript
const handleDownload = async (document_id: number) => {
  const result = await downloadDocument(document_id);
  if (result.success) {
    showToast("success", "Document is downloading...");
    fetchDocumentsPaginated(
      searchTerm,
      currentPage,
      itemsPerPage,
      documentTypeFilter,
      accessTypeFilter,
    );
  } else {
    if (
      result.message?.toLowerCase().includes("premium") ||
      result.message?.toLowerCase().includes("subscription")
    ) {
      showToast(
        "info",
        "Tài liệu này yêu cầu gói Premium. Đang chuyển hướng...",
      );
      setTimeout(() => {
        navigate("/subscription");
      }, 1500);
    } else {
      showToast(
        "error",
        result.message || "Failed to download document. Please login first.",
      );
    }
  }
};
```

## Test Scenarios

### Test 1: Anonymous User Download Premium Document

1. Không đăng nhập
2. Navigate to Documents page
3. Click download button on a Premium document
4. **Expected:**
   - Toast message: "Premium content requires login and premium subscription."
   - After 1.5s, redirect to `/subscription`

### Test 2: Logged In User (without Premium) Download Premium Document

1. Đăng nhập với tài khoản Free hoặc Pro
2. Navigate to Documents page
3. Click download button on a Premium document
4. **Expected:**
   - Toast message: "Tài liệu này yêu cầu gói Premium. Đang chuyển hướng..."
   - After 1.5s, redirect to `/subscription`

### Test 3: Premium User Download Premium Document

1. Đăng nhập với tài khoản Premium (có active subscription)
2. Navigate to Documents page
3. Click download button on a Premium document
4. **Expected:**
   - Toast message: "Document is downloading..."
   - Document downloads successfully
   - Download count increments

### Test 4: Click "Nâng cấp lên Premium" Button

1. Navigate to any Premium document detail page
2. Scroll to download section
3. Click "Nâng cấp lên Premium" button in the premium notice card
4. **Expected:**
   - Immediately redirect to `/subscription`
   - No toast message (direct navigation)

### Test 5: Free Document Download

1. Any user (logged in or not)
2. Click download button on a Free document
3. **Expected:**
   - Document downloads successfully (or login prompt if required)
   - No premium subscription check

## API Endpoints Used

### GET `/api/user/documents/:document_id/download`

- **Authentication:** Required (Bearer token)
- **Authorization:** Premium subscription required for premium documents
- **Response Success (200):**

```json
{
  "success": true,
  "message": "Document ready for download",
  "data": {
    "document_id": 1,
    "document_name": "Example.pdf",
    "document_url": "https://...",
    "file_type": "pdf",
    "document_size": "1024000"
  }
}
```

- **Response Error (403):**

```json
{
  "success": false,
  "message": "This is a premium document. Please upgrade to premium subscription to download."
}
```

## Database Schema

### user_subscriptions table

```sql
user_subscription_id INT PRIMARY KEY
user_id INT (FK to users)
subscription_price_id INT (FK to subscription_prices)
order_id INT (FK to orders)
started_at DATETIME
expired_at DATETIME
status ENUM('active', 'expired', 'canceled')
```

### subscription_prices table

```sql
subscription_price_id INT PRIMARY KEY
subscription_plan_id INT (FK to subscription_plans)
billing_type ENUM('monthly', 'yearly', 'weekly')
duration_days INT
price INT
discount_percentage FLOAT
is_active BOOLEAN
```

### subscription_plans table

```sql
subscription_plan_id INT PRIMARY KEY
name VARCHAR
code VARCHAR (e.g., 'free', 'pro', 'premium')
features JSON
monthly_ai_token_quota INT
is_active BOOLEAN
```

## Notes

1. **Premium Check Logic:**
   - Kiểm tra `document.access_type === "premium"`
   - Kiểm tra `user_subscription.status === "active"`
   - Kiểm tra `subscription_plan.code === "premium"`

2. **Error Handling:**
   - Frontend detect error bằng cách check message chứa "premium" hoặc "subscription"
   - Có thể customize error message trong backend nếu cần

3. **User Experience:**
   - Toast notification để thông báo user
   - 1.5s delay trước khi redirect để user đọc được thông báo
   - Direct button "Nâng cấp lên Premium" để UX tốt hơn

4. **Future Improvements:**
   - Có thể thêm modal thay vì redirect trực tiếp
   - Có thể highlight gói Premium trong subscription page khi redirect từ document
   - Có thể lưu document_id để redirect về sau khi subscribe
