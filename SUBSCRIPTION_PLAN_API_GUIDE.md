# Subscription Plan API Guide

## Overview

API endpoint để lấy danh sách các gói subscription và giá tiền của chúng. Cho phép filter theo billing type (tuần, tháng, năm).

## Endpoint

### Get All Subscription Plans

**GET** `/api/user/subscription-plans`

Lấy tất cả các gói subscription với thông tin giá. API này là public, không cần authentication.

#### Query Parameters

| Parameter    | Type   | Required | Description                 | Valid Values                  |
| ------------ | ------ | -------- | --------------------------- | ----------------------------- |
| billing_type | string | No       | Filter theo loại thanh toán | `monthly`, `yearly`, `weekly` |

#### Response Format

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
        "download_documents": false
      },
      "monthly_ai_token_quota": 0,
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
        "priority_support": false
      },
      "monthly_ai_token_quota": 10000,
      "code": "pro",
      "is_active": true,
      "Subscription_Prices": [
        {
          "subscription_price_id": 1,
          "billing_type": "monthly",
          "duration_days": 30,
          "price": 99000,
          "discount_percentage": 0
        },
        {
          "subscription_price_id": 2,
          "billing_type": "yearly",
          "duration_days": 365,
          "price": 990000,
          "discount_percentage": 16.67
        }
      ]
    },
    {
      "subscription_plan_id": 3,
      "name": "Premium",
      "features": {
        "max_courses": -1,
        "ai_assistance": true,
        "download_documents": true,
        "priority_support": true,
        "custom_learning_path": true
      },
      "monthly_ai_token_quota": 50000,
      "code": "premium",
      "is_active": true,
      "Subscription_Prices": [
        {
          "subscription_price_id": 3,
          "billing_type": "monthly",
          "duration_days": 30,
          "price": 199000,
          "discount_percentage": 0
        },
        {
          "subscription_price_id": 4,
          "billing_type": "yearly",
          "duration_days": 365,
          "price": 1990000,
          "discount_percentage": 16.67
        }
      ]
    }
  ],
  "message": "Successfully retrieved all subscription plans."
}
```

## Usage Examples

### 1. Get All Plans (All Billing Types)

```javascript
// Frontend fetch example
fetch("/api/user/subscription-plans")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.data); // Array of all subscription plans
  });
```

```bash
# cURL example
curl -X GET "http://localhost:3000/api/user/subscription-plans"
```

### 2. Get Plans - Monthly Billing Only

```javascript
// Frontend fetch example
fetch("/api/user/subscription-plans?billing_type=monthly")
  .then((res) => res.json())
  .then((data) => {
    // Each plan will only show monthly prices
    data.data.forEach((plan) => {
      console.log(`${plan.name}:`, plan.Subscription_Prices);
    });
  });
```

```bash
# cURL example
curl -X GET "http://localhost:3000/api/user/subscription-plans?billing_type=monthly"
```

### 3. Get Plans - Yearly Billing Only

```javascript
fetch("/api/user/subscription-plans?billing_type=yearly")
  .then((res) => res.json())
  .then((data) => {
    // Each plan will only show yearly prices with discounts
    data.data.forEach((plan) => {
      plan.Subscription_Prices.forEach((price) => {
        console.log(`${plan.name} - Yearly: ${price.price} VND`);
        console.log(`Discount: ${price.discount_percentage}%`);
      });
    });
  });
```

### 4. Get Plans - Weekly Billing Only

```javascript
fetch("/api/user/subscription-plans?billing_type=weekly")
  .then((res) => res.json())
  .then((data) => {
    // Each plan will only show weekly prices
    console.log(data.data);
  });
```

## UI Implementation Flow

### Typical Frontend Flow

```javascript
// 1. Component state
const [billingType, setBillingType] = useState("monthly");
const [subscriptionPlans, setSubscriptionPlans] = useState([]);

// 2. Fetch plans when billing type changes
useEffect(() => {
  const fetchPlans = async () => {
    const response = await fetch(
      `/api/user/subscription-plans?billing_type=${billingType}`,
    );
    const data = await response.json();

    if (data.success) {
      setSubscriptionPlans(data.data);
    }
  };

  fetchPlans();
}, [billingType]);

// 3. Render UI
return (
  <div>
    {/* Billing Type Selector */}
    <div className="billing-selector">
      <button onClick={() => setBillingType("weekly")}>Weekly</button>
      <button onClick={() => setBillingType("monthly")}>Monthly</button>
      <button onClick={() => setBillingType("yearly")}>
        Yearly (Save 16%)
      </button>
    </div>

    {/* Subscription Plans Cards */}
    <div className="plans-container">
      {subscriptionPlans.map((plan) => (
        <div key={plan.subscription_plan_id} className="plan-card">
          <h3>{plan.name}</h3>

          {/* Display price for selected billing type */}
          {plan.Subscription_Prices.map((price) => (
            <div key={price.subscription_price_id}>
              <p className="price">
                {price.price.toLocaleString("vi-VN")} VND
                <span>/{price.billing_type}</span>
              </p>

              {price.discount_percentage > 0 && (
                <span className="discount">
                  Save {price.discount_percentage}%
                </span>
              )}
            </div>
          ))}

          {/* Features */}
          <ul>
            {Object.entries(plan.features).map(([key, value]) => (
              <li key={key}>
                {key}: {value === true ? "✓" : value === false ? "✗" : value}
              </li>
            ))}
          </ul>

          <button>Choose {plan.name}</button>
        </div>
      ))}
    </div>
  </div>
);
```

## Error Responses

### Invalid Billing Type

```json
{
  "success": false,
  "message": "Invalid billing_type. Must be 'monthly', 'yearly', or 'weekly'."
}
```

**Status Code:** 400 Bad Request

### Server Error

```json
{
  "success": false,
  "message": "Internal server error while fetching subscription plans."
}
```

**Status Code:** 500 Internal Server Error

## Price Calculation Notes

1. **Discount Percentage**:
   - Yearly plans typically have ~16-17% discount compared to monthly
   - Calculated as: `(monthly * 12 - yearly) / (monthly * 12) * 100`

2. **Duration Days**:
   - Weekly: 7 days
   - Monthly: 30 days
   - Yearly: 365 days

3. **Free Plan**:
   - Has no prices (empty Subscription_Prices array)
   - Always active by default for all users

## Database Schema Reference

### subscription_plans

- `subscription_plan_id` - Primary key
- `name` - Plan name (Free, Pro, Premium)
- `features` - JSON object with plan features
- `monthly_ai_token_quota` - AI tokens per month
- `code` - Unique plan code
- `is_active` - Active status

### subscription_prices

- `subscription_price_id` - Primary key
- `subscription_plan_id` - Foreign key to subscription_plans
- `billing_type` - ENUM: monthly, yearly, weekly
- `duration_days` - Number of days the subscription lasts
- `price` - Price in VND (integer)
- `discount_percentage` - Discount compared to monthly (float)
- `is_active` - Active status

## Testing

### Test with Postman/Thunder Client

1. **Get all plans**: `GET http://localhost:3000/api/user/subscription-plans`
2. **Monthly only**: `GET http://localhost:3000/api/user/subscription-plans?billing_type=monthly`
3. **Yearly only**: `GET http://localhost:3000/api/user/subscription-plans?billing_type=yearly`
4. **Invalid type**: `GET http://localhost:3000/api/user/subscription-plans?billing_type=daily` (should return 400)

### Expected Behavior

- ✅ Returns only active plans (`is_active = true`)
- ✅ Returns only active prices (`is_active = true`)
- ✅ Filters prices by billing_type if provided
- ✅ Shows all prices if no billing_type specified
- ✅ Plans without matching prices still appear (with empty Subscription_Prices array)
- ✅ Results ordered by plan_id and billing_type
