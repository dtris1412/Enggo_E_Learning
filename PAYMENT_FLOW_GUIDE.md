# Payment Flow Implementation Guide

## Overview

Hệ thống payment đã được implement với flow hoàn chỉnh:

1. User tạo order → status: `pending`
2. User thanh toán qua MoMo/VNPay
3. Payment success → Tự động tạo `user_subscription`, cấp tokens, và update order status thành `completed`
4. Payment failed → Order vẫn ở status `pending`, user có thể retry

---

## Complete Payment Flow

### 1. Tạo Order (Status: Pending)

**Endpoint**: `POST /api/user/orders`

**Request**:

```http
POST /api/user/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscription_price_id": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Order created successfully. Please proceed to payment.",
  "data": {
    "order_id": "12345",
    "user_id": 1,
    "subscription_price_id": 1,
    "status": "pending",
    "amount": 299000,
    "content": "Subscription: Premium Monthly - monthly",
    "order_date": "2026-03-09T10:00:00.000Z",
    "Subscription_Price": {
      "subscription_price_id": 1,
      "billing_type": "monthly",
      "duration_days": 30,
      "price": 299000,
      "discount_percentage": 0,
      "Subscription_Plan": {
        "subscription_plan_id": 1,
        "name": "Premium",
        "code": "PREMIUM",
        "monthly_ai_token_quota": 1000000,
        "features": { ... }
      }
    }
  }
}
```

---

### 2. Checkout - Chọn Payment Gateway

Sau khi tạo order, user chọn phương thức thanh toán:

#### Option A: MoMo Payment

**Endpoint**: `POST /api/payment/momo/:orderId`

**Request**:

```http
POST /api/payment/momo/12345
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "message": "MoMo payment URL created successfully",
  "data": {
    "payUrl": "https://test-payment.momo.vn/v2/gateway/pay?t=...",
    "orderId": "12345",
    "amount": 299000,
    "deeplink": "momo://app?action=pay&...",
    "qrCodeUrl": "https://test-payment.momo.vn/qr/..."
  }
}
```

**Frontend Action**: Redirect user to `payUrl`

---

#### Option B: VNPay Payment

**Endpoint**: `POST /api/payment/vnpay/:orderId`

**Request**:

```http
POST /api/payment/vnpay/12345
Authorization: Bearer <token>
Content-Type: application/json

{
  "bankCode": "NCB",
  "language": "vn"
}
```

**Response**:

```json
{
  "success": true,
  "message": "VNPay payment URL created successfully",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "orderId": "12345",
    "amount": 299000
  }
}
```

**Frontend Action**: Redirect user to `paymentUrl`

---

### 3. Payment Success - Auto Create Subscription

Khi user thanh toán thành công, payment gateway sẽ redirect về callback URL.

**Backend tự động xử lý**:

```javascript
// In MoMo/VNPay callback handler
await paymentService.processSuccessfulPayment(orderId, transactionId);
```

**Điều gì xảy ra trong `processSuccessfulPayment`**:

1. **Update Order Status**:

   ```sql
   UPDATE orders SET status = 'completed' WHERE order_id = :orderId
   ```

2. **Cancel Active Subscription** (if exists):

   ```sql
   UPDATE user_subscriptions
   SET status = 'canceled'
   WHERE user_id = :userId AND status = 'active'
   ```

3. **Create New Subscription**:

   ```sql
   INSERT INTO user_subscriptions
   (user_id, subscription_price_id, order_id, started_at, expired_at, status)
   VALUES (:userId, :priceId, :orderId, NOW(), DATE_ADD(NOW(), INTERVAL :days DAY), 'active')
   ```

4. **Grant AI Tokens**:

   ```sql
   UPDATE user_token_wallets
   SET token_balance = token_balance + :monthlyTokens
   WHERE user_id = :userId
   ```

5. **Create Token Transaction**:
   ```sql
   INSERT INTO user_token_transactions
   (user_id, amount, transaction_type, reference_id, transaction_date)
   VALUES (:userId, :monthlyTokens, 'subscription_grant', :subscriptionId, NOW())
   ```

**Result**: User vào redirect về frontend với thông báo success:

```
http://localhost:5173/payment/result?success=true&orderId=12345&amount=299000
```

---

### 4. Payment Failed

Nếu thanh toán thất bại:

**Backend**:

```javascript
// Update payment status to failed
await Payment.update({ status: "failed" }, { where: { order_id: orderId } });
```

**Order vẫn ở status**: `pending`

**User redirect về**:

```
http://localhost:5173/payment/result?success=false&message=Payment%20failed
```

**User có thể**:

- Retry payment với cùng order
- Hủy order và tạo order mới

---

## Database State Changes

### Initial State (After Create Order)

```
orders:
  order_id: 12345
  status: pending
  amount: 299000

payments:
  payment_id: 1
  order_id: 12345
  status: pending
  provider: momo

user_subscriptions: (chưa có)
user_token_wallets:
  token_balance: 0
```

### Final State (After Payment Success)

```
orders:
  order_id: 12345
  status: completed  ✅ Changed
  amount: 299000

payments:
  payment_id: 1
  order_id: 12345
  status: completed  ✅ Changed
  provider: momo
  transaction_code: "MoMo123456"

user_subscriptions:  ✅ Created
  user_subscription_id: 1
  user_id: 1
  order_id: 12345
  status: active
  started_at: 2026-03-09
  expired_at: 2026-04-08

user_token_wallets:
  token_balance: 1000000  ✅ Added tokens

user_token_transactions:  ✅ Created
  amount: 1000000
  transaction_type: subscription_grant
  reference_id: 1
```

---

## Error Handling & Edge Cases

### 1. Duplicate Payment Success (Idempotency)

Nếu callback được gọi nhiều lần (do retry từ payment gateway):

```javascript
if (order.status === "completed") {
  // Already processed, return existing subscription
  return { alreadyProcessed: true };
}
```

**Result**: Không tạo duplicate subscription

---

### 2. Subscription Creation Failed

Nếu có lỗi khi tạo subscription nhưng payment đã thành công:

```javascript
try {
  await processSuccessfulPayment(orderId);
} catch (error) {
  console.error("Error processing payment:", error);
  // Still redirect with success
  // Admin can manually create subscription
}
```

**Result**:

- Payment vẫn được mark là completed
- Admin có thể check logs và manually tạo subscription

---

### 3. User Upgrade Subscription

Nếu user đã có active subscription và mua mới:

```javascript
if (activeSubscription) {
  // Cancel current subscription
  await activeSubscription.update({ status: "canceled" });
}
// Then create new subscription
```

**Result**: Old subscription bị cancel, new subscription được activate

---

## Frontend Implementation Example

### Complete Payment Flow Component

```jsx
// PaymentFlowPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentFlowPage = ({ subscriptionPriceId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  // Step 1: Create Order
  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/user/orders",
        { subscription_price_id: subscriptionPriceId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setOrder(response.data.data);
        console.log("Order created:", response.data.data.order_id);
      }
    } catch (error) {
      console.error("Create order error:", error);
      alert(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createOrder();
  }, []);

  // Step 2: Checkout with MoMo
  const checkoutWithMomo = async () => {
    if (!order) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/payment/momo/${order.order_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // Redirect to MoMo payment page
        window.location.href = response.data.data.payUrl;
      }
    } catch (error) {
      console.error("MoMo payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Checkout with VNPay
  const checkoutWithVnpay = async (bankCode = "") => {
    if (!order) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/payment/vnpay/${order.order_id}`,
        {
          bankCode,
          language: "vn",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // Redirect to VNPay payment page
        window.location.href = response.data.data.paymentUrl;
      }
    } catch (error) {
      console.error("VNPay payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div>Creating order...</div>;
  }

  return (
    <div className="payment-flow">
      <h2>Complete Your Payment</h2>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Order ID: {order.order_id}</p>
        <p>Plan: {order.Subscription_Price?.Subscription_Plan?.name}</p>
        <p>Amount: {order.amount.toLocaleString("vi-VN")} VNĐ</p>
        <p>Status: {order.status}</p>
      </div>

      <div className="payment-methods">
        <h3>Choose Payment Method</h3>

        <button
          onClick={checkoutWithMomo}
          disabled={loading}
          className="btn-momo"
        >
          {loading ? "Processing..." : "Pay with MoMo"}
        </button>

        <button
          onClick={() => checkoutWithVnpay()}
          disabled={loading}
          className="btn-vnpay"
        >
          {loading ? "Processing..." : "Pay with VNPay"}
        </button>
      </div>
    </div>
  );
};

export default PaymentFlowPage;
```

### Payment Result Page

```jsx
// PaymentResultPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const success = searchParams.get("success") === "true";
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const message = searchParams.get("message");

    setResult({ success, orderId, amount, message });

    // Fetch subscription if payment success
    if (success && orderId) {
      fetchSubscription();
    }
  }, [searchParams]);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get("/api/user/subscriptions/active", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      console.error("Fetch subscription error:", error);
    }
  };

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div className="payment-result">
      {result.success ? (
        <div className="success">
          <h2>✓ Payment Successful!</h2>
          <p>Order ID: {result.orderId}</p>
          <p>Amount: {Number(result.amount).toLocaleString("vi-VN")} VNĐ</p>

          {subscription && (
            <div className="subscription-info">
              <h3>Your Subscription</h3>
              <p>
                Plan: {subscription.Subscription_Price?.Subscription_Plan?.name}
              </p>
              <p>
                Valid until:{" "}
                {new Date(subscription.expired_at).toLocaleDateString()}
              </p>
              <p>
                AI Tokens:{" "}
                {subscription.Subscription_Price?.Subscription_Plan?.monthly_ai_token_quota?.toLocaleString()}
              </p>
            </div>
          )}

          <button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="error">
          <h2>✗ Payment Failed</h2>
          <p>{result.message || "Something went wrong"}</p>
          <button onClick={() => navigate(`/orders/${result.orderId}`)}>
            Retry Payment
          </button>
          <button onClick={() => navigate("/pricing")}>Back to Pricing</button>
        </div>
      )}
    </div>
  );
};

export default PaymentResultPage;
```

---

## Testing Flow

### 1. Test với MoMo (Sandbox)

```bash
# Step 1: Create order
POST /api/user/orders
{
  "subscription_price_id": 1
}
# Response: order_id = 12345

# Step 2: Create MoMo payment
POST /api/payment/momo/12345
# Response: payUrl

# Step 3: Mở payUrl trong browser
# Sử dụng: Phone = 0999999999, OTP = bất kỳ

# Step 4: Check database
SELECT * FROM orders WHERE order_id = 12345;
# status should be 'completed'

SELECT * FROM user_subscriptions WHERE order_id = 12345;
# Should have new subscription

SELECT * FROM user_token_wallets WHERE user_id = 1;
# token_balance should be increased
```

### 2. Test với VNPay (Sandbox)

```bash
# Step 1: Create order
POST /api/user/orders
{
  "subscription_price_id": 1
}

# Step 2: Create VNPay payment
POST /api/payment/vnpay/12345
{
  "bankCode": "NCB"
}

# Step 3: Mở paymentUrl
# Sử dụng test card: 9704198526191432198

# Step 4: Verify database
# Same as MoMo test
```

---

## Monitoring & Logs

### What to Monitor

1. **Order Creation Rate**: Track số lượng orders được tạo
2. **Payment Success Rate**: `completed_payments / total_payments`
3. **Failed Payments**: Log reasons cho failed payments
4. **Subscription Creation**: Verify tất cả completed orders đều có subscription
5. **Token Grants**: Verify tokens được cấp đúng

### Log Examples

```javascript
// In processSuccessfulPayment
console.log("Payment processed successfully:", {
  orderId: result.orderId,
  tokensGranted: processResult.tokensGranted,
  alreadyProcessed: processResult.alreadyProcessed,
});

// In callback handlers
console.error("Error processing payment success:", error);
```

---

## Troubleshooting

### Issue 1: Payment thành công nhưng không có subscription

**Check**:

1. Xem logs của `processSuccessfulPayment`
2. Check order status trong database
3. Verify payment status

**Fix**: Manually call processSuccessfulPayment

```javascript
await paymentService.processSuccessfulPayment(orderId);
```

### Issue 2: Duplicate subscriptions

**Cause**: Idempotency check không hoạt động

**Fix**: Đã có check trong code:

```javascript
if (order.status === "completed") {
  return { alreadyProcessed: true };
}
```

### Issue 3: Tokens không được cấp

**Check**:

1. Verify subscription plan có `monthly_ai_token_quota`
2. Check user_token_wallet exists
3. Check transaction logs

---

## Summary

✅ **Flow hoàn chỉnh**:

- Create order (pending) → Payment → Auto create subscription + grant tokens → Order completed

✅ **Idempotent**: Handle duplicate callbacks

✅ **Transaction safe**: Sử dụng database transaction

✅ **Error resilient**: Log errors nhưng vẫn complete payment

✅ **User friendly**: Clear redirect với success/fail message
