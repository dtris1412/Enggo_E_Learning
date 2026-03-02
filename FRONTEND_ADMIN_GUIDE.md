# Frontend Admin - Hướng dẫn Quản lý Đơn hàng & Đăng ký

## 📁 Cấu trúc File & Folder

### Contexts (Quản lý State)

```
admin/contexts/
├── orderPaymentContext.tsx          # Quản lý đơn hàng & thanh toán
└── userSubscriptionTrackingContext.tsx  # Theo dõi đăng ký người dùng
```

### Pages (Trang chính)

```
admin/pages/
├── OrderManagement.tsx              # Quản lý đơn hàng & thanh toán
└── UserSubscriptionTracking.tsx     # Theo dõi đăng ký
```

### Components

```
admin/components/
├── OrderManagement/
│   ├── OrdersTable.tsx              # Bảng danh sách đơn hàng
│   ├── PaymentsTable.tsx            # Bảng danh sách thanh toán
│   ├── OrderDetailsModal.tsx        # Chi tiết đơn hàng
│   ├── PaymentDetailsModal.tsx      # Chi tiết thanh toán
│   ├── UpdatePaymentStatusModal.tsx # Cập nhật trạng thái thanh toán ⚡
│   └── index.ts                     # Export
│
└── UserSubscriptionTracking/
    ├── UserSubscriptionsTable.tsx   # Bảng đăng ký người dùng
    ├── ViewSubscriptionModal.tsx    # Chi tiết đăng ký
    └── index.ts                     # Export
```

### Routes

```
admin/routes/adminRoutes.tsx         # Cập nhật routes (3 tuyến mới)
```

---

## 🎯 Tính năng chính

### 1. Quản lý Đơn hàng (Orders)

**Tính năng:**

- ✅ Danh sách đơn hàng với pagination
- ✅ Lọc theo trạng thái (pending/completed/failed)
- ✅ Tìm kiếm theo tên/email người dùng
- ✅ Xem chi tiết đơn hàng (người dùng, gói, giá, lịch sử thanh toán)
- ✅ Thống kê đơn hàng theo trạng thái
- ✅ Cập nhật trạng thái đơn hàng

**Endpoint API:**

```
GET    /api/admin/orders?page=1&limit=10&status=&search=
GET    /api/admin/orders/statistics
GET    /api/admin/orders/:orderId
PATCH  /api/admin/orders/:orderId/status
```

### 2. Quản lý Thanh toán (Payments)

**Tính năng:**

- ✅ Danh sách thanh toán với pagination
- ✅ Lọc theo trạng thái (pending/completed/failed)
- ✅ Lọc theo phương thức thanh toán (credit_card/paypal/bank_transfer)
- ✅ Xem chi tiết thanh toán (mã giao dịch, số tiền, trạng thái)
- ✅ Cập nhật trạng thái thanh toán ⚡ (tự động cấp subscription)
- ✅ Thống kê thanh toán theo status & payment method
- ✅ Xem lịch sử thanh toán của từng đơn hàng

**Endpoint API:**

```
GET    /api/admin/payments?page=1&limit=10&status=&payment_method=
GET    /api/admin/payments/statistics
GET    /api/admin/payments/:paymentId
PATCH  /api/admin/payments/:paymentId/status         ⚡ Triggers subscription
GET    /api/admin/orders/:orderId/payments
```

### 3. Theo dõi Đăng ký Người dùng (User Subscriptions)

**Tính năng:**

- ✅ Danh sách đăng ký với pagination
- ✅ Lọc theo trạng thái (active/expired/cancelled)
- ✅ Tìm kiếm theo tên/email người dùng
- ✅ Xem chi tiết đăng ký (người dùng, gói, token, thời gian)
- ✅ Thống kê đăng ký (đang hoạt động, hết hạn, đã hủy)
- ✅ Cảnh báo đơn hàng sắp hết hạn (≤7 ngày)
- ✅ Hủy đăng ký nếu cần

**Endpoint API:**

```
GET    /api/admin/user-subscriptions?page=1&limit=10&status=&search=
GET    /api/admin/user-subscriptions/:subscriptionId
PATCH  /api/admin/user-subscriptions/:subscriptionId/expire
```

---

## 🔄 Flow Hoạt động

### Tạo Đơn hàng & Thanh toán

```
1. User tạo Order (subscribe button)
   POST /api/user/orders
   → Order created (status: pending)

2. User tạo Payment
   POST /api/user/orders/:orderId/payments
   → Payment created (status: pending)

3. [User completes payment via payment gateway]

4. Admin xác nhận Payment
   PATCH /api/admin/payments/:paymentId/status (status: completed)

5. ⚡ Auto-triggers:
   - Hủy subscription cũ (nếu có)
   - Tạo subscription mới
   - Cộng token vào wallet
   - Tạo transaction record
   - Update order status = "completed"

6. Đăng ký được cấp thành công
```

### Payment Retry

```
1. Payment thất bại
   PATCH /api/admin/payments/:paymentId/status (status: failed)

2. User retry payment
   POST /api/user/orders/:orderId/payments/retry
   → Tạo payment attempt mới

3. Admin xác nhận payment mới
   PATCH /api/admin/payments/:newPaymentId/status (status: completed)
   → Cấp subscription
```

---

## 📊 Sidebar Navigation

### Quản lý Gói Đăng ký (Dropdown)

```
├── Quản lý gói
│   → /admin/subscriptions (SubscriptionManagement)
└── Quản lý đăng ký
    → /admin/user-subscriptions (UserSubscriptionTracking)
```

### Quản lý Đơn hàng (Dropdown - New!)

```
├── Đơn hàng
│   → /admin/orders (OrderManagement tab: orders)
└── Thanh toán
    → /admin/payments (OrderManagement tab: payments)
```

---

## 🎨 UI Components

### OrderManagement Page

**Tabs:**

- **Đơn hàng Tab**
  - Statistics Cards (thống kê theo status)
  - Filters: Search, Status
  - OrdersTable (Danh sách tuần tự, pagination)
  - OrderDetailsModal (Chi tiết)

- **Thanh toán Tab**
  - Statistics Cards (thống kê theo status & payment method)
  - Filters: Status, Payment Method
  - PaymentsTable (Danh sách tuần tự, pagination)
  - PaymentDetailsModal (Chi tiết)
  - UpdatePaymentStatusModal (Cập nhật status ⚡)

### UserSubscriptionTracking Page

**Components:**

- Statistics Cards (Active/Expired/Cancelled count)
- Filters: Search, Status
- UserSubscriptionsTable (Danh sách, pagination)
  - Cảnh báo sắp hết hạn (≤7 ngày)
  - Nút hủy subscription (nếu đang active)
- ViewSubscriptionModal (Chi tiết)

---

## 📋 Context API Usage

### OrderPaymentContext

```typescript
import { useOrderPayment } from "../contexts/orderPaymentContext";

const MyComponent = () => {
  const {
    // Orders
    orders,
    totalOrders,
    orderPagination,
    orderStatistics,
    orderLoading,
    orderError,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStatistics,

    // Payments
    payments,
    totalPayments,
    paymentPagination,
    paymentStatistics,
    paymentLoading,
    paymentError,
    fetchPayments,
    getPaymentById,
    updatePaymentStatus,
    getPaymentsByOrderId,
    getPaymentStatistics,
  } = useOrderPayment();
};
```

### UserSubscriptionTrackingContext

```typescript
import { useUserSubscriptionTracking } from "../contexts/userSubscriptionTrackingContext";

const MyComponent = () => {
  const {
    subscriptions,
    totalSubscriptions,
    pagination,
    loading,
    error,
    fetchSubscriptions,
    getSubscriptionById,
    getSubscriptionsByUserId,
    expireSubscription,
    getSubscriptionStatistics,
  } = useUserSubscriptionTracking();
};
```

---

## 🔧 Implementation Details

### Order Status Flow

```
pending → completed (khi payment confirmed)
pending → failed (khi payment failed)
failed → pending (retry)
```

### Payment Status Flow

```
pending → completed ⚡ (grants subscription)
       → failed (user can retry)
```

### Subscription Status

```
active → expired (khi end_date > now)
      → cancelled (admin expires)
```

### Statistics Calculation

**Orders:**

```
GROUP BY status
COUNT(*) as count
SUM(amount) as total_amount
```

**Payments:**

```
GROUP BY status, payment_method
COUNT(*) as count
SUM(amount) as total_amount
```

---

## 🎁 Special Features

### 1. Auto-Subscription on Payment ⚡

Khi admin cập nhật payment status → "completed":

```
- Tự động cancel active subscription cũ
- Tạo new subscription từ order's subscription_price_id
- Link subscription → order_id
- Add tokens → user's wallet
- Create transaction record (type: subscription_grant)
```

### 2. Expiring Soon Warning

UserSubscriptionsTable:

```
- Highlight row với background yellow
- Show "Sắp hết hạn" nếu days_remaining ≤ 7
- Bold text cho end_date
```

### 3. Transaction Code Generation

```
Format: TXN-{timestamp}-{random}
Example: TXN-1705315800000-A3B4C5
Unique cho mỗi payment attempt
```

### 4. Payment Retry

- User có thể retry payment nếu failed
- Tạo new payment với new transaction code
- Không cần tạo new order

---

## 🔐 Security & Validation

### Ownership Verification

- Backend: All user endpoints verify `order.user_id === userId`
- Frontend: Admin only sees orders (not user-specific)

### Admin-Only Operations

- Update payment status
- Expire subscription
- View all orders/payments

### Input Validation

- Payment method: "credit_card" | "paypal" | "bank_transfer"
- Status: "pending" | "completed" | "failed" | "active" | "expired" | "cancelled"
- Page/Limit: Positive integers

---

## 📝 Mock Data Examples

### Order

```typescript
{
  order_id: 1,
  user_id: 5,
  subscription_price_id: 2,
  status: "completed",
  amount: 27.00,
  created_at: "2024-01-15T10:30:00Z",
  User: {
    name: "Nguyễn Văn A",
    email: "a@example.com"
  },
  Subscription_Price: {
    price: 30.00,
    discount: 10,
    duration_months: 1,
    Subscription_Plan: {
      name: "Pro Plan",
      monthly_ai_token_quota: 1000
    }
  },
  Payments: [...]
}
```

### Payment

```typescript
{
  payment_id: 1,
  order_id: 1,
  payment_method: "credit_card",
  provider: "stripe",
  transaction_code: "TXN-1705315800000-A3B4C5",
  amount: 27.00,
  status: "completed",
  created_at: "2024-01-15T10:30:00Z"
}
```

### Subscription

```typescript
{
  subscription_id: 1,
  user_id: 5,
  subscription_plan_id: 1,
  start_date: "2024-01-15",
  end_date: "2024-02-15",
  status: "active",
  monthly_ai_token_quota: 1000,
  order_id: 1,
  User: { ... },
  Subscription_Plan: { ... }
}
```

---

## 🚀 Getting Started

### 1. Ensure Providers are Wrapped

Check `App.tsx`:

```tsx
<OrderPaymentProvider>
  <UserSubscriptionTrackingProvider>
    {/* Your app content */}
  </UserSubscriptionTrackingProvider>
</OrderPaymentProvider>
```

### 2. Access Admin Pages

Sidebar:

```
Quản lý Gói Đăng ký
├── Quản lý gói (existing)
└── Quản lý đăng ký (new) → /admin/user-subscriptions

Quản lý Đơn hàng (new dropdown)
├── Đơn hàng → /admin/orders
└── Thanh toán → /admin/payments
```

### 3. Test Flow

1. Navigate to `/admin/orders`
2. View orders, search, filter
3. Click "Chi tiết" to see order details
4. Switch to "Thanh toán" tab
5. Click payment to see details
6. Click "Cập nhật" button (if pending)
7. Change status to "completed"
8. Navigate to `/admin/user-subscriptions`
9. Verify new subscription created

---

## ⚠️ Important Notes

### Payment Status Update ⚡

- **Only update payment to "completed" if user has actually paid**
- This will IMMEDIATELY grant subscription to user
- Cannot be reversed automatically

### Subscription Expiry

- Automatic expiry based on end_date
- Admin can manually expire active subscriptions
- Expired subscriptions can be renewed (create new order/payment)

### Token Granting

- Done automatically when payment completed
- Amount: `Subscription_Plan.monthly_ai_token_quota`
- User can check wallet: `/api/user/wallet`

### API Errors

- 400: Bad request (missing fields)
- 403: Forbidden (unauthorized)
- 404: Not found
- 500: Server error

---

## 🎓 Best Practices

1. **Always verify order exists before updating payment**
2. **Check if user has active subscription before granting new one**
3. **Log all important actions** (update status, expire subscription)
4. **Show confirmation dialogs** before important operations
5. **Handle network errors gracefully** with toast notifications
6. **Refresh data after mutations** to keep UI in sync
7. **Validate payment status transitions** (only valid statuses)

---

## 📞 Troubleshooting

### Issue: "Failed to fetch orders"

- Check admin token in localStorage
- Verify API URL in .env
- Check server is running

### Issue: "You do not have permission"

- Ensure logged in as admin (role = 1)
- Try re-login
- Check token expiration

### Issue: Payment status won't update

- Verify payment ID exists
- Check status is valid (pending → completed/failed)
- Check server logs for errors

### Issue: Subscription not created

- Check order exists with valid subscription_price_id
- Verify subscription price has discount
- Check token wallet has space
- Look at server logs for details

---

Đây là hệ thống admin đầy đủ để quản lý orders, payments và subscriptions. Mọi thao tác được thiết kế để an toàn và user-friendly! 🎉
