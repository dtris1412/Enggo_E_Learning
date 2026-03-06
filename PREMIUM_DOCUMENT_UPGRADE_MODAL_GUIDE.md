# Premium Document Upgrade Modal Guide

## Tổng quan
Khi người dùng cố gắng truy cập (xem) tài liệu Premium mà không có quyền, hệ thống sẽ hiển thị modal xác nhận yêu cầu nâng cấp lên Premium.

## Luồng hoạt động

### Kịch bản 1: User chưa đăng nhập
1. User click vào premium document
2. Backend trả về status 401 với message: "Authentication required to access premium content"
3. **Frontend hiển thị modal** với:
   - Thông báo: "Tài liệu này yêu cầu gói Premium để xem và tải xuống"
   - Danh sách lợi ích Premium
   - 2 button: **Hủy** và **Nâng cấp ngay**
4. User chọn:
   - **Hủy** → Navigate back to `/documents`
   - **Nâng cấp ngay** → Navigate to `/subscription`

### Kịch bản 2: User đã đăng nhập nhưng không có Premium
1. User click vào premium document
2. Backend trả về status 403 với message premium/subscription related
3. **Frontend hiển thị modal** tương tự kịch bản 1
4. User chọn:
   - **Hủy** → Navigate back to `/documents`
   - **Nâng cấp ngay** → Navigate to `/subscription`

### Kịch bản 3: User có Premium subscription
1. User click vào premium document
2. Backend cho phép truy cập (status 200)
3. Document được load và hiển thị bình thường
4. User có thể xem và download

## Các thay đổi trong code

### Frontend: DocumentDetail Component

#### 1. Added State
```typescript
const [showUpgradeModal, setShowUpgradeModal] = useState(false);
```

#### 2. Custom Fetch Logic
Thay vì dùng `getDocumentById` từ context, component tự fetch để có được response đầy đủ:

```typescript
const fetchDocument = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/user/documents/${id}`, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      setDocument(result.data);
    } else {
      // Check if it's a premium access error
      if (
        response.status === 401 ||
        response.status === 403 ||
        result.message?.toLowerCase().includes("premium") ||
        result.message?.toLowerCase().includes("authentication")
      ) {
        setShowUpgradeModal(true);
      } else {
        showToast("error", result.message || "Failed to load document");
        setTimeout(() => navigate("/documents"), 2000);
      }
    }
  } catch (error) {
    showToast("error", "Failed to load document");
    setTimeout(() => navigate("/documents"), 2000);
  }
};
```

#### 3. Premium Upgrade Modal UI

```tsx
if (showUpgradeModal) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header với gradient vàng */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6 text-white">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Lock className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">
            Tài liệu Premium
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-700 leading-relaxed">
                Tài liệu này yêu cầu gói Premium để xem và tải xuống.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Nâng cấp ngay để truy cập kho tài liệu chất lượng cao!
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-800 mb-2 text-sm">
              Lợi ích khi nâng cấp Premium:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Truy cập không giới hạn tài liệu Premium
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Hỗ trợ AI không giới hạn
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Tải xuống tài liệu offline
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Hỗ trợ ưu tiên 24/7
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowUpgradeModal(false);
                navigate("/documents");
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={() => navigate("/subscription")}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Nâng cấp ngay
            </button>
          </div>

          {/* Additional info */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Có thể hủy bất cứ lúc nào
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Backend: Middleware & Routes

#### checkSubscriptionAccess Middleware
Location: `server/src/middleware/authMiddleware.js`

**Response khi không có quyền:**
```javascript
// Status 401 - Not logged in
{
  success: false,
  message: "Authentication required to access premium content"
}

// Status 403 - Logged in but no premium
{
  success: false,
  message: "...", // Message from checkContentAccess
  userPlan: "free" | "pro",
  requiredAccess: "premium"
}
```

#### Route Configuration
Location: `server/src/user/routes/userRoutes.js`

```javascript
router.get(
  "/api/user/documents/:document_id",
  optionalVerifyToken,        // Parse token if available
  loadDocumentMiddleware,      // Load document to req.resource
  checkSubscriptionAccess,     // Check if user can access
  getDocumentById,
);
```

## UI/UX Design

### Modal Design
- **Backdrop**: Black overlay with 50% opacity
- **Modal Container**: White background, rounded corners (2xl), max-width 28rem
- **Header**: 
  - Gradient background (yellow-500 to amber-500)
  - Lock icon in center with white background opacity
  - Title: "Tài liệu Premium"
- **Body**:
  - Warning message with AlertCircle icon
  - Benefits list với gradient background
  - 2 buttons: Hủy (outline) và Nâng cấp (gradient)
  - Footer text: "Có thể hủy bất cứ lúc nào"

### Colors
- **Primary**: Yellow-500 to Amber-500 gradient
- **Success**: Green-600
- **Text**: Gray-700 (primary), Gray-600 (secondary)
- **Border**: Gray-300

## Test Cases

### Test 1: Anonymous User Access Premium Document
**Steps:**
1. Logout (clear localStorage)
2. Navigate to `/documents/{premium_document_id}`

**Expected:**
- Loading spinner appears
- Modal shows up with message
- Click "Hủy" → Navigate to `/documents`
- Click "Nâng cấp ngay" → Navigate to `/subscription`

### Test 2: Free User Access Premium Document
**Steps:**
1. Login with free account
2. Navigate to `/documents/{premium_document_id}`

**Expected:**
- Loading spinner appears
- Modal shows up with message
- Click "Hủy" → Navigate to `/documents`
- Click "Nâng cấp ngay" → Navigate to `/subscription`

### Test 3: Premium User Access Premium Document
**Steps:**
1. Login with premium account (active subscription)
2. Navigate to `/documents/{premium_document_id}`

**Expected:**
- Loading spinner appears
- Document loads successfully
- No modal shows
- Can view and download document

### Test 4: Access Free Document
**Steps:**
1. Any user (logged in or not)
2. Navigate to `/documents/{free_document_id}`

**Expected:**
- Document loads successfully
- No modal shows
- No premium check

## Key Differences from Previous Implementation

### Before (Toast + Auto Redirect)
- Error → Show toast "Đang chuyển hướng..."
- Auto redirect after 1.5s
- No user interaction
- Only on download, not view

### After (Modal + User Choice)
- Error → Show modal with detailed message
- User must choose: Cancel or Upgrade
- Better UX with clear options
- Applies to both view and download

## API Endpoints

### GET `/api/user/documents/:document_id`
**Headers:**
- `Authorization: Bearer {token}` (optional)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "document_id": 1,
    "document_name": "Premium Document",
    "access_type": "premium",
    ...
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Authentication required to access premium content"
}
```

**Response Error (403):**
```json
{
  "success": false,
  "message": "Premium subscription required",
  "userPlan": "free",
  "requiredAccess": "premium"
}
```

## Future Enhancements

1. **Remember User Intent**
   - Save document_id before redirect
   - After subscription, redirect back to document

2. **Show Current Plan in Modal**
   - Display user's current plan (Free/Pro)
   - Show comparison with Premium

3. **Add Preview Button**
   - Allow user to see first page/section
   - Tease content before upgrade

4. **Analytics**
   - Track modal show count
   - Track conversion rate (modal → subscription)
   - A/B test different messages

## Notes

- Modal is blocking - user must interact (cannot close by clicking backdrop)
- Modal only shows for premium documents, not for free documents
- Download button on document detail page still has same premium check
- Consistent UX across all premium content access points
