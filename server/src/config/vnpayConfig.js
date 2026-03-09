import dotenv from "dotenv";
dotenv.config();

export const vnPayConfig = {
  vnp_TmnCode: process.env.VNPAY_TMN_CODE,
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
  vnp_Url: process.env.VNPAY_API_URL,
  vnp_ReturnUrl: process.env.VNPAY_REDIRECT_URL,
  vnp_IpnUrl: process.env.VNPAY_IPN_URL,
};

// Expected .env values:
// VNPAY_TMN_CODE=DEMOV210
// VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
// VNPAY_API_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
// VNPAY_REDIRECT_URL=http://localhost:8080/api/payment/vnpay/callback
// VNPAY_IPN_URL=http://localhost:8080/api/payment/vnpay/ipn
