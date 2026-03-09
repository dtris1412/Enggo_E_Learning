import dotenv from "dotenv";
dotenv.config();

export const momoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: process.env.MOMO_API_URL,
  redirectUrl: process.env.MOMO_REDIRECT_URL,
  ipnUrl: process.env.MOMO_IPN_URL,
};

// Expected .env values:
// MOMO_PARTNER_CODE=MOMOBKUN20180529
// MOMO_ACCESS_KEY=klm05TvNBzhg7h7j
// MOMO_SECRET_KEY=at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa
// MOMO_API_URL=https://test-payment.momo.vn/v2/gateway/api/create
// MOMO_REDIRECT_URL=http://localhost:8080/api/payment/momo/callback
// MOMO_IPN_URL=http://localhost:8080/api/payment/momo/ipn
