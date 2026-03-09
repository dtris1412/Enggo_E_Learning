# Payment API Guide - MoMo & VNPay Integration

## Tổng quan

API tích hợp hai cổng thanh toán phổ biến tại Việt Nam:

- **MoMo**: Ví điện tử MoMo
- **VNPay**: Cổng thanh toán ngân hàng VNPay

## Environment Variables

Thêm các biến môi trường sau vào file `.env`:

```env
# Frontend URL
FRONTEND_URL=http://localhost:5173

# MoMo Configuration
MOMO_PARTNER_CODE=MOMOBKUN20180529
MOMO_ACCESS_KEY=klm05TvNBzhg7h7j
MOMO_SECRET_KEY=at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa
MOMO_API_URL=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:8080/api/payment/momo/callback
MOMO_IPN_URL=http://localhost:8080/api/payment/momo/ipn

# VNPay Configuration
VNPAY_TMN_CODE=DEMOV210
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_API_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_REDIRECT_URL=http://localhost:8080/api/payment/vnpay/callback
VNPAY_IPN_URL=http://localhost:8080/api/payment/vnpay/ipn
```

**Lưu ý**: Các thông tin trên là thông tin test. Khi deploy production, cần thay đổi:

- Partner code, access key, secret key thực tế
- URL callback và IPN phải là URL public có thể truy cập từ internet
- API URL từ sandbox chuyển sang production

---

## 1. MoMo Payment APIs

### 1.1. Tạo yêu cầu thanh toán MoMo

**Endpoint**: `POST /api/payment/momo/:orderId`

**Authentication**: Required (Bearer Token)

**Description**: Tạo yêu cầu thanh toán qua ví điện tử MoMo cho một đơn hàng.

**Request**:

```http
POST /api/payment/momo/12345
Authorization: Bearer <your-token>
Content-Type: application/json
```

**Response Success** (200 OK):

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

**Response Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Order already completed"
}
```

**Error Cases**:

- `404`: Order not found hoặc không có quyền truy cập
- `400`: Order đã hoàn thành hoặc đã có payment
- `500`: Lỗi kết nối với MoMo

**Flow**:

1. Client gọi API này với orderId
2. Server tạo payment request gửi đến MoMo
3. MoMo trả về payment URL
4. Client redirect user đến `payUrl` để thanh toán
5. Sau khi thanh toán, MoMo redirect về callback URL

---

### 1.2. MoMo Callback (Return URL)

**Endpoint**: `GET /api/payment/momo/callback`

**Authentication**: None (MoMo gọi tự động)

**Description**: Endpoint nhận callback từ MoMo sau khi user hoàn tất thanh toán.

**Query Parameters**:

```
?partnerCode=MOMOBKUN20180529
&orderId=12345
&requestId=...
&amount=299000
&orderInfo=Payment for order #12345
&orderType=momo_wallet
&transId=123456789
&resultCode=0
&message=Successful
&payType=qr
&responseTime=2026-03-09 10:30:00
&extraData=...
&signature=abc123...
```

**Flow**:

1. User hoàn tất thanh toán trên MoMo
2. MoMo redirect về URL này
3. Server verify signature
4. Cập nhật trạng thái payment và order
5. Redirect user về frontend với kết quả

**Redirect đến Frontend**:

- Success: `${FRONTEND_URL}/payment/result?success=true&orderId=12345&amount=299000`
- Error: `${FRONTEND_URL}/payment/result?success=false&message=Payment failed`

---

### 1.3. MoMo IPN (Instant Payment Notification)

**Endpoint**: `POST /api/payment/momo/ipn`

**Authentication**: None (MoMo gọi tự động)

**Description**: Endpoint nhận thông báo IPN từ MoMo để đảm bảo payment được xử lý.

**Request Body**:

```json
{
  "partnerCode": "MOMOBKUN20180529",
  "orderId": "12345",
  "requestId": "...",
  "amount": 299000,
  "orderInfo": "Payment for order #12345",
  "orderType": "momo_wallet",
  "transId": 123456789,
  "resultCode": 0,
  "message": "Successful",
  "payType": "qr",
  "responseTime": "2026-03-09 10:30:00",
  "extraData": "",
  "signature": "abc123..."
}
```

**Response**:

```json
{
  "resultCode": 0,
  "message": "Success"
}
```

**Notes**:

- IPN là backup mechanism, đảm bảo không bỏ sót transaction
- Server phải respond với `resultCode: 0` để MoMo biết đã nhận được
- Nếu không respond, MoMo sẽ retry gửi IPN

---

## 2. VNPay Payment APIs

### 2.1. Tạo URL thanh toán VNPay

**Endpoint**: `POST /api/payment/vnpay/:orderId`

**Authentication**: Required (Bearer Token)

**Description**: Tạo URL thanh toán qua cổng VNPay cho một đơn hàng.

**Request**:

```http
POST /api/payment/vnpay/12345
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "bankCode": "NCB",
  "language": "vn"
}
```

**Request Body** (Optional):

- `bankCode` (string, optional): Mã ngân hàng (VD: "NCB", "VISA", "MASTERCARD"). Bỏ trống để user chọn.
- `language` (string, optional): "vn" hoặc "en". Default: "vn"

**Common Bank Codes**:

- `NCB`: Ngân hàng NCB
- `BIDV`: Ngân hàng BIDV
- `VIETCOMBANK`: Ngân hàng Vietcombank
- `TECHCOMBANK`: Ngân hàng Techcombank
- `VNPAYQR`: Thanh toán qua QR Code
- Bỏ trống: Hiển thị tất cả phương thức

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "VNPay payment URL created successfully",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=29900000&...",
    "orderId": "12345",
    "amount": 299000
  }
}
```

**Response Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Order already completed"
}
```

**Error Cases**:

- `404`: Order not found hoặc không có quyền truy cập
- `400`: Order đã hoàn thành hoặc đã có payment
- `500`: Lỗi tạo payment URL

**Flow**:

1. Client gọi API với orderId (có thể kèm bankCode)
2. Server tạo payment URL với VNPay
3. Client redirect user đến `paymentUrl`
4. User nhập thông tin thẻ/tài khoản và thanh toán
5. VNPay redirect về callback URL

---

### 2.2. VNPay Callback (Return URL)

**Endpoint**: `GET /api/payment/vnpay/callback`

**Authentication**: None (VNPay gọi tự động)

**Description**: Endpoint nhận callback từ VNPay sau khi thanh toán.

**Query Parameters**:

```
?vnp_Amount=29900000
&vnp_BankCode=NCB
&vnp_BankTranNo=20260309123456
&vnp_CardType=ATM
&vnp_OrderInfo=Payment for order #12345
&vnp_PayDate=20260309103000
&vnp_ResponseCode=00
&vnp_TmnCode=DEMOV210
&vnp_TransactionNo=123456789
&vnp_TxnRef=12345
&vnp_SecureHash=abc123...
```

**Response Codes**:

- `00`: Giao dịch thành công
- `07`: Trừ tiền thành công nhưng giao dịch bị nghi ngờ
- `09`: Thẻ chưa đăng ký Internet Banking
- `10`: Xác thực sai quá 3 lần
- `11`: Hết hạn chờ thanh toán
- `12`: Thẻ bị khóa
- `13`: Sai mật khẩu OTP
- `24`: Khách hàng hủy giao dịch
- `51`: Tài khoản không đủ số dư
- `65`: Vượt quá hạn mức giao dịch
- `75`: Ngân hàng bảo trì
- `99`: Lỗi khác

**Flow**:

1. User hoàn tất thanh toán trên VNPay
2. VNPay redirect về URL này
3. Server verify secure hash
4. Cập nhật payment và order status
5. Redirect về frontend

**Redirect đến Frontend**:

- Success: `${FRONTEND_URL}/payment/result?success=true&orderId=12345&amount=299000`
- Error: `${FRONTEND_URL}/payment/result?success=false&message=<error_message>`

---

### 2.3. VNPay IPN (Instant Payment Notification)

**Endpoint**: `GET /api/payment/vnpay/ipn`

**Authentication**: None (VNPay gọi tự động)

**Description**: Endpoint nhận IPN từ VNPay để confirm transaction.

**Query Parameters**: Giống như callback URL

**Response**:

```json
{
  "RspCode": "00",
  "Message": "Confirm Success"
}
```

**Response Codes**:

- `00`: Confirm thành công
- `97`: Checksum failed (signature không hợp lệ)
- `99`: Lỗi khác

---

## 3. Frontend Implementation

### 3.1. Tạo Payment Page

```javascript
// PaymentPage.jsx
import { useState } from "react";
import axios from "axios";

const PaymentPage = ({ orderId }) => {
  const [loading, setLoading] = useState(false);

  const handleMomoPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/payment/momo/${orderId}`,
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
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVnpayPayment = async (bankCode = "") => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/payment/vnpay/${orderId}`,
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
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Chọn phương thức thanh toán</h2>

      <button
        onClick={handleMomoPayment}
        disabled={loading}
        className="btn-momo"
      >
        {loading ? "Đang xử lý..." : "Thanh toán qua MoMo"}
      </button>

      <button
        onClick={() => handleVnpayPayment()}
        disabled={loading}
        className="btn-vnpay"
      >
        {loading ? "Đang xử lý..." : "Thanh toán qua VNPay"}
      </button>

      <button
        onClick={() => handleVnpayPayment("NCB")}
        disabled={loading}
        className="btn-vnpay"
      >
        {loading ? "Đang xử lý..." : "Thanh toán qua NCB"}
      </button>
    </div>
  );
};

export default PaymentPage;
```

### 3.2. Tạo Payment Result Page

```javascript
// PaymentResultPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const success = searchParams.get("success") === "true";
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    setResult({
      success,
      message:
        message ||
        (success ? "Thanh toán thành công!" : "Thanh toán thất bại!"),
      orderId,
      amount,
    });
  }, [searchParams]);

  if (!result) {
    return <div>Đang xử lý...</div>;
  }

  return (
    <div className="payment-result">
      {result.success ? (
        <div className="success">
          <h2>✓ Thanh toán thành công!</h2>
          <p>Mã đơn hàng: {result.orderId}</p>
          <p>Số tiền: {Number(result.amount).toLocaleString("vi-VN")} VNĐ</p>
          <button onClick={() => navigate("/orders")}>Xem đơn hàng</button>
        </div>
      ) : (
        <div className="error">
          <h2>✗ Thanh toán thất bại</h2>
          <p>{result.message}</p>
          <button onClick={() => navigate("/orders")}>Quay lại</button>
        </div>
      )}
    </div>
  );
};

export default PaymentResultPage;
```

### 3.3. Add Routes

```javascript
// App.jsx hoặc router config
import PaymentResultPage from "./pages/PaymentResultPage";

// Add route
<Route path="/payment/result" element={<PaymentResultPage />} />;
```

---

## 4. Testing

### 4.1. Test MoMo (Sandbox)

1. Tạo order mới
2. Gọi API `/api/payment/momo/:orderId`
3. Mở `payUrl` trong response
4. Sử dụng thông tin test của MoMo:
   - Số điện thoại: 0999999999
   - OTP: Bất kỳ (sandbox mode)
5. Kiểm tra callback và IPN

### 4.2. Test VNPay (Sandbox)

1. Tạo order mới
2. Gọi API `/api/payment/vnpay/:orderId`
3. Mở `paymentUrl` trong response
4. Chọn ngân hàng NCB và sử dụng:
   - Số thẻ: 9704198526191432198
   - Tên chủ thẻ: NGUYEN VAN A
   - Ngày phát hành: 07/15
   - Mật khẩu OTP: 123456 (hoặc OTP bất kỳ)
5. Kiểm tra callback và IPN

---

## 5. Production Deployment Checklist

### 5.1. MoMo

- [ ] Đăng ký merchant account thực tế tại [business.momo.vn](https://business.momo.vn)
- [ ] Nhận Partner Code, Access Key, Secret Key thực
- [ ] Cập nhật `.env` với credentials thực
- [ ] Đổi `MOMO_API_URL` sang production: `https://payment.momo.vn/v2/gateway/api/create`
- [ ] Cập nhật `MOMO_REDIRECT_URL` và `MOMO_IPN_URL` thành public URL
- [ ] Whitelist IP server trong MoMo dashboard
- [ ] Test với số tiền nhỏ trước

### 5.2. VNPay

- [ ] Đăng ký merchant account tại [vnpay.vn](https://vnpay.vn)
- [ ] Nhận Terminal Code (vnp_TmnCode) và Hash Secret thực
- [ ] Cập nhật `.env` với credentials thực
- [ ] Đổi `VNPAY_API_URL` sang production: `https://vnpayment.vn/paymentv2/vpcpay.html`
- [ ] Cập nhật `VNPAY_REDIRECT_URL` và `VNPAY_IPN_URL` thành public URL
- [ ] Đăng ký URL callback/IPN trong VNPay dashboard
- [ ] Test với số tiền nhỏ trước

### 5.3. General

- [ ] Đảm bảo HTTPS cho tất cả callback URLs
- [ ] Setup logging cho tất cả payment transactions
- [ ] Implement proper error handling và retry mechanism
- [ ] Setup monitoring và alerts cho payment failures
- [ ] Backup database thường xuyên
- [ ] Implement reconciliation process (đối soát)
- [ ] Test fail scenarios (timeout, network error, etc.)
- [ ] Document payment flow cho team

---

## 6. Security Best Practices

1. **Verify Signatures**: Luôn verify signature từ MoMo/VNPay
2. **HTTPS Only**: Chỉ dùng HTTPS cho callback URLs
3. **Idempotency**: Xử lý duplicate IPN requests
4. **Logging**: Log tất cả payment transactions
5. **Secret Management**: Không commit secrets vào git
6. **IP Whitelist**: Whitelist IP của payment gateway nếu có thể
7. **Amount Validation**: Verify amount trong callback
8. **Order Validation**: Check order status trước khi process payment

---

## 7. Troubleshooting

### Signature Invalid

- Kiểm tra secret key có đúng không
- Kiểm tra format của raw signature string
- Đảm bảo encoding đúng (UTF-8)
- Kiểm tra order của params khi tạo signature

### Callback không được gọi

- Kiểm tra callback URL có public và accessible không
- Kiểm tra firewall/security group
- Check logs của payment gateway
- Verify URL trong merchant dashboard

### IPN bị duplicate

- Implement idempotency check
- Check payment status trước khi update
- Use transaction/lock khi update database

### Payment stuck ở pending

- Implement timeout mechanism
- Manual check qua query API
- Setup cron job để sync payment status

---

## 8. API Flow Diagram

```
User → Frontend → Backend → Payment Gateway
                     ↓
                  Database
                     ↓
    ← Callback URL  ←  Payment Gateway
                     ↓
                  Update DB
                     ↓
                Frontend (Result Page)
```

---

Tài liệu này cung cấp đầy đủ thông tin để integrate MoMo và VNPay vào ứng dụng E-Learning.
