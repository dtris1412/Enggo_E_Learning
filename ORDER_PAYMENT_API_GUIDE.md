# Order & Payment API Guide

## Overview

Complete subscription purchase flow with order and payment management for both admin and users.

## Purchase Flow

```
1. User clicks "Subscribe"
   → POST /api/user/orders (Body: { subscription_price_id })
   → Creates Order (status: pending)

2. User chooses payment method
   → POST /api/user/orders/:orderId/payments (Body: { payment_method, provider })
   → Creates Payment (status: pending, transaction_code generated)

3. User completes payment via payment gateway (external)

4. Payment confirmation (webhook/admin)
   → PATCH /api/admin/payments/:paymentId/status (Body: { status: "completed" })
   → Triggers automatic subscription creation

5. Auto-Processing (processCompletedPayment):
   - Cancel existing active subscription (if any)
   - Create new subscription with order_id link
   - Add monthly_ai_token_quota tokens to user wallet
   - Create transaction record (type: "subscription_grant")
   - Update order status to "completed"

6. User receives active subscription + tokens
```

---

## Admin API Endpoints

### Order Management

#### 1. Get All Orders (Paginated)

```http
GET /api/admin/orders?page=1&limit=10&status=pending&search=user@email.com
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional): "pending" | "completed" | "failed"
- `search` (string, optional): Search by user name or email

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 1,
        "user_id": 5,
        "subscription_price_id": 2,
        "status": "completed",
        "amount": 27.0,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T11:00:00Z",
        "User": {
          "user_id": 5,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "Subscription_Price": {
          "price_id": 2,
          "duration_months": 1,
          "price": 30.0,
          "discount": 10,
          "Subscription_Plan": {
            "plan_id": 1,
            "name": "Pro Plan",
            "monthly_ai_token_quota": 1000
          }
        },
        "Payments": [
          {
            "payment_id": 1,
            "payment_method": "credit_card",
            "provider": "stripe",
            "status": "completed"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalOrders": 47,
      "limit": 10
    }
  }
}
```

#### 2. Get Order Statistics

```http
GET /api/admin/orders/statistics
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "statistics": [
      { "status": "pending", "count": "12", "total_amount": "360.00" },
      { "status": "completed", "count": "98", "total_amount": "2940.00" },
      { "status": "failed", "count": "5", "total_amount": "150.00" }
    ]
  }
}
```

#### 3. Get Order by ID

```http
GET /api/admin/orders/:orderId
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "user_id": 5,
    "subscription_price_id": 2,
    "status": "completed",
    "amount": 27.00,
    "created_at": "2024-01-15T10:30:00Z",
    "User": { ... },
    "Subscription_Price": { ... },
    "Payments": [ ... ]
  }
}
```

#### 4. Update Order Status

```http
PATCH /api/admin/orders/:orderId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Valid Statuses:** "pending" | "completed" | "failed"

**Response:**

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order_id": 1,
    "status": "completed",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

---

### Payment Management

#### 1. Get All Payments (Paginated)

```http
GET /api/admin/payments?page=1&limit=10&status=completed&payment_method=credit_card
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional): "pending" | "completed" | "failed"
- `payment_method` (string, optional): "credit_card" | "paypal" | "bank_transfer"

**Response:**

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "payment_id": 1,
        "order_id": 1,
        "payment_method": "credit_card",
        "provider": "stripe",
        "transaction_code": "TXN-1705315800000-A3B4C5",
        "amount": 27.0,
        "status": "completed",
        "created_at": "2024-01-15T10:30:00Z",
        "Order": {
          "order_id": 1,
          "user_id": 5,
          "User": {
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalPayments": 98,
      "limit": 10
    }
  }
}
```

#### 2. Get Payment Statistics

```http
GET /api/admin/payments/statistics
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "statistics": [
      {
        "status": "completed",
        "payment_method": "credit_card",
        "count": "45",
        "total_amount": "1350.00"
      },
      {
        "status": "completed",
        "payment_method": "paypal",
        "count": "30",
        "total_amount": "900.00"
      },
      {
        "status": "pending",
        "payment_method": "bank_transfer",
        "count": "12",
        "total_amount": "360.00"
      }
    ]
  }
}
```

#### 3. Get Payment by ID

```http
GET /api/admin/payments/:paymentId
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "payment_id": 1,
    "order_id": 1,
    "payment_method": "credit_card",
    "provider": "stripe",
    "transaction_code": "TXN-1705315800000-A3B4C5",
    "amount": 27.00,
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "Order": {
      "order_id": 1,
      "user_id": 5,
      "status": "completed",
      "User": { ... }
    }
  }
}
```

#### 4. Update Payment Status ⚠️ TRIGGERS SUBSCRIPTION

```http
PATCH /api/admin/payments/:paymentId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed"
}
```

**⚠️ Important:** When status is updated to "completed", this automatically:

- Cancels user's existing active subscription (if any)
- Creates new subscription based on the order's subscription_price_id
- Links subscription to order via order_id
- Adds monthly_ai_token_quota tokens to user's wallet
- Creates transaction record (type: "subscription_grant")
- Updates order status to "completed"

**Valid Statuses:** "pending" | "completed" | "failed"

**Response:**

```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "payment_id": 1,
    "status": "completed",
    "subscription_created": true,
    "tokens_added": 1000
  }
}
```

#### 5. Get Payments by Order ID

```http
GET /api/admin/orders/:orderId/payments
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "payment_method": "credit_card",
      "status": "failed",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "payment_id": 2,
      "payment_method": "paypal",
      "status": "completed",
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

## User API Endpoints

### Order Operations

#### 1. Get User's Orders

```http
GET /api/user/orders?page=1&limit=10&status=pending
Authorization: Bearer <user_token>
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional): "pending" | "completed" | "failed"

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 1,
        "subscription_price_id": 2,
        "status": "completed",
        "amount": 27.00,
        "created_at": "2024-01-15T10:30:00Z",
        "Subscription_Price": {
          "duration_months": 1,
          "price": 30.00,
          "discount": 10,
          "Subscription_Plan": {
            "name": "Pro Plan",
            "monthly_ai_token_quota": 1000
          }
        },
        "Payments": [ ... ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalOrders": 15,
      "limit": 10
    }
  }
}
```

#### 2. Get Order by ID

```http
GET /api/user/orders/:orderId
Authorization: Bearer <user_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "subscription_price_id": 2,
    "status": "pending",
    "amount": 27.00,
    "Subscription_Price": { ... },
    "Payments": [ ... ]
  }
}
```

#### 3. Create Order (Subscribe Button)

```http
POST /api/user/orders
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "subscription_price_id": 2
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order_id": 15,
    "user_id": 5,
    "subscription_price_id": 2,
    "status": "pending",
    "amount": 27.0,
    "created_at": "2024-01-15T10:30:00Z",
    "Subscription_Price": {
      "price_id": 2,
      "duration_months": 1,
      "price": 30.0,
      "discount": 10,
      "Subscription_Plan": {
        "plan_id": 1,
        "name": "Pro Plan",
        "monthly_ai_token_quota": 1000
      }
    }
  }
}
```

---

### Payment Operations

#### 1. Get User's Payments

```http
GET /api/user/payments?page=1&limit=10&status=completed
Authorization: Bearer <user_token>
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional): "pending" | "completed" | "failed"

**Response:**

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "payment_id": 1,
        "order_id": 1,
        "payment_method": "credit_card",
        "provider": "stripe",
        "transaction_code": "TXN-1705315800000-A3B4C5",
        "amount": 27.0,
        "status": "completed",
        "created_at": "2024-01-15T10:30:00Z",
        "Order": {
          "order_id": 1,
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalPayments": 25,
      "limit": 10
    }
  }
}
```

#### 2. Get Payments by Order ID

```http
GET /api/user/orders/:orderId/payments
Authorization: Bearer <user_token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "payment_method": "credit_card",
      "provider": "stripe",
      "transaction_code": "TXN-1705315800000-A3B4C5",
      "status": "failed",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "payment_id": 2,
      "payment_method": "paypal",
      "provider": "paypal",
      "transaction_code": "TXN-1705316400000-D7E8F9",
      "status": "completed",
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

#### 3. Get Payment by ID

```http
GET /api/user/payments/:paymentId
Authorization: Bearer <user_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "payment_id": 1,
    "order_id": 1,
    "payment_method": "credit_card",
    "provider": "stripe",
    "transaction_code": "TXN-1705315800000-A3B4C5",
    "amount": 27.0,
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "Order": {
      "order_id": 1,
      "status": "completed"
    }
  }
}
```

#### 4. Create Payment

```http
POST /api/user/orders/:orderId/payments
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "payment_method": "credit_card",
  "provider": "stripe"
}
```

**Valid Payment Methods:**

- `credit_card`
- `paypal`
- `bank_transfer`

**Response:**

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 2,
    "order_id": 1,
    "payment_method": "credit_card",
    "provider": "stripe",
    "transaction_code": "TXN-1705315800000-A3B4C5",
    "amount": 27.0,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### 5. Retry Failed Payment

```http
POST /api/user/orders/:orderId/payments/retry
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "payment_method": "paypal",
  "provider": "paypal"
}
```

**Requirements:**

- Order must have status "pending" or "failed"
- Creates a new payment attempt with new transaction code

**Response:**

```json
{
  "success": true,
  "message": "Payment retry created successfully",
  "data": {
    "payment_id": 3,
    "order_id": 1,
    "payment_method": "paypal",
    "provider": "paypal",
    "transaction_code": "TXN-1705316400000-D7E8F9",
    "amount": 27.0,
    "status": "pending",
    "created_at": "2024-01-15T11:00:00Z"
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Payment method and provider are required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "You do not have permission to access this order"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Order not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Error creating payment",
  "error": "Detailed error message"
}
```

---

## Database Models

### Order

```javascript
{
  order_id: INTEGER (PK, AUTO_INCREMENT),
  user_id: INTEGER (FK -> Users),
  subscription_price_id: INTEGER (FK -> Subscription_Prices),
  status: ENUM('pending', 'completed', 'failed'),
  amount: DECIMAL(10,2),
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Payment

```javascript
{
  payment_id: INTEGER (PK, AUTO_INCREMENT),
  order_id: INTEGER (FK -> Orders),
  payment_method: ENUM('credit_card', 'paypal', 'bank_transfer'),
  provider: STRING,
  transaction_code: STRING (UNIQUE),
  amount: DECIMAL(10,2),
  status: ENUM('pending', 'completed', 'failed'),
  created_at: DATETIME,
  updated_at: DATETIME
}
```

---

## Security Notes

1. **Ownership Verification**: All user endpoints verify that the order/payment belongs to the authenticated user
2. **Admin Only**: Order/payment status updates are restricted to admin users only
3. **Transaction Codes**: Auto-generated unique codes: `TXN-{timestamp}-{random}`
4. **Token Protection**: All endpoints require valid JWT token
5. **Status Validation**: Only valid status transitions are allowed

---

## Testing Flow

### Complete Purchase Test

```bash
# 1. User creates order (Subscribe button click)
POST /api/user/orders
Body: { "subscription_price_id": 2 }
→ Returns order_id: 15

# 2. User creates payment
POST /api/user/orders/15/payments
Body: { "payment_method": "credit_card", "provider": "stripe" }
→ Returns payment_id: 25, transaction_code: "TXN-..."

# 3. User completes payment via Stripe (external)
# ... Payment gateway processing ...

# 4. Webhook/Admin confirms payment
PATCH /api/admin/payments/25/status
Body: { "status": "completed" }
→ Auto-creates subscription
→ Adds tokens to wallet
→ Updates order status

# 5. User checks subscription
GET /api/user/subscriptions/active
→ Returns new active subscription

# 6. User checks wallet
GET /api/user/wallet
→ Shows increased token balance
```

### Payment Retry Test

```bash
# 1. First payment fails
PATCH /api/admin/payments/25/status
Body: { "status": "failed" }

# 2. User retries with different method
POST /api/user/orders/15/payments/retry
Body: { "payment_method": "paypal", "provider": "paypal" }
→ Creates new payment_id: 26 with new transaction_code

# 3. New payment succeeds
PATCH /api/admin/payments/26/status
Body: { "status": "completed" }
→ Subscription granted
```

---

## Implementation Files

### Services

- `server/src/admin/services/orderService.js` - Admin order management
- `server/src/admin/services/paymentService.js` - Admin payment + auto-subscription
- `server/src/user/services/orderService.js` - User order operations
- `server/src/user/services/paymentService.js` - User payment + retry

### Controllers

- `server/src/admin/controllers/orderController.js` - Admin order endpoints
- `server/src/admin/controllers/paymentController.js` - Admin payment endpoints
- `server/src/user/controllers/orderController.js` - User order endpoints
- `server/src/user/controllers/paymentController.js` - User payment endpoints

### Routes

- `server/src/admin/routes/adminRoutes.js` - Admin routes configuration
- `server/src/user/routes/userRoutes.js` - User routes configuration

---

## Next Steps

1. **Payment Gateway Integration**: Integrate with Stripe/PayPal APIs for real payment processing
2. **Webhooks**: Set up payment gateway webhooks to auto-update payment status
3. **Email Notifications**: Send confirmation emails on subscription creation
4. **Frontend Integration**: Build UI components for order/payment flow
5. **Testing**: Write comprehensive unit and integration tests
