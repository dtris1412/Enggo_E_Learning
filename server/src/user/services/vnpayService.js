import crypto from "crypto";
import moment from "moment";
import querystring from "querystring";
import { vnPayConfig } from "../../config/vnPayConfig.js";

/**
 * Log VNPay config for debugging
 */
export const logVNPayConfig = () => {
  console.log("=== VNPay Configuration ===");
  console.log("vnp_TmnCode:", vnPayConfig.vnp_TmnCode);
  console.log(
    "vnp_HashSecret:",
    vnPayConfig.vnp_HashSecret
      ? "SET (length: " + vnPayConfig.vnp_HashSecret.length + ")"
      : "NOT SET",
  );
  console.log("vnp_Url:", vnPayConfig.vnp_Url);
  console.log("vnp_ReturnUrl:", vnPayConfig.vnp_ReturnUrl);
  console.log("============================");
};

/**
 * Tạo chữ ký HMAC SHA512 cho VNPay
 */
const createSignature = (data) => {
  const hmac = crypto.createHmac("sha512", vnPayConfig.vnp_HashSecret);
  return hmac.update(Buffer.from(data, "utf-8")).digest("hex");
};

/**
 * Tạo payment URL cho VNPay
 * @param {Object} orderInfo - Thông tin đơn hàng
 * @param {string} ipAddr - IP address của client
 * @returns {string} - Payment URL
 */
export const createPaymentUrl = (orderInfo, ipAddr = "127.0.0.1") => {
  const {
    orderId,
    amount,
    orderDescription,
    bankCode = "",
    language = "vn",
  } = orderInfo;

  // Thời gian tạo
  const createDate = moment().format("YYYYMMDDHHmmss");

  // Convert amount to integer (VNPay requires integer, no decimal)
  const vnpAmount = Math.round(parseFloat(amount) * 100);

  // Validate amount
  if (isNaN(vnpAmount) || vnpAmount <= 0) {
    console.error("Invalid VNPay amount:", { amount, vnpAmount });
    throw new Error(`Invalid payment amount: ${amount}`);
  }

  // Sanitize order description - chỉ giữ alphanumeric và space
  const sanitizedDescription = orderDescription
    .replace(/[^a-zA-Z0-9\s]/g, " ") // Chỉ giữ chữ, số, space
    .replace(/\s+/g, " ") // Remove multiple spaces
    .trim()
    .substring(0, 255);

  // Validate VNPay config
  if (!vnPayConfig.vnp_TmnCode || !vnPayConfig.vnp_HashSecret) {
    console.error("VNPay config error:", {
      hasTmnCode: !!vnPayConfig.vnp_TmnCode,
      hasHashSecret: !!vnPayConfig.vnp_HashSecret,
      hasReturnUrl: !!vnPayConfig.vnp_ReturnUrl,
      hasUrl: !!vnPayConfig.vnp_Url,
    });
    throw new Error("VNPay configuration is incomplete");
  }

  // Tạo VNPay params - ALL values must be strings for signature consistency
  let vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: String(vnPayConfig.vnp_TmnCode),
    vnp_Locale: String(language),
    vnp_CurrCode: "VND",
    vnp_TxnRef: String(orderId),
    vnp_OrderInfo: String(sanitizedDescription),
    vnp_OrderType: "other",
    vnp_Amount: String(vnpAmount), // Must be string for signature
    vnp_ReturnUrl: String(vnPayConfig.vnp_ReturnUrl),
    vnp_IpAddr: String(ipAddr),
    vnp_CreateDate: String(createDate),
  };

  // Thêm bankCode nếu có
  if (bankCode) {
    vnpParams.vnp_BankCode = String(bankCode);
  }

  // Log params before signing
  console.log("VNPay params before signing:", {
    ...vnpParams,
    vnp_HashSecret: "***hidden***",
  });

  // Tạo signData - CHỈ sort 1 lần, KHÔNG dùng sortObject
  const sortedKeys = Object.keys(vnpParams).sort();

  console.log("=== VNPay CREATE Signature Debug ===");
  console.log("Sorted keys:", sortedKeys);

  // Build sorted params object for querystring
  const sortedParams = {};
  sortedKeys.forEach((key) => {
    sortedParams[key] = vnpParams[key];
  });

  // Build signData - CRITICAL: Manual build, NO encoding at all
  // Theo VNPay spec: key1=value1&key2=value2 (raw string)
  const signDataParts = [];
  sortedKeys.forEach((key) => {
    const value = vnpParams[key];
    signDataParts.push(`${key}=${value}`);
  });
  const signData = signDataParts.join("&");

  console.log("\nFull signData for CREATE:");
  console.log(signData);

  const secureHash = createSignature(signData);

  console.log("\nSecureHash:", secureHash);
  console.log("============================");

  // Debug logging
  console.log("VNPay Payment Request:", {
    orderId,
    amount,
    vnpAmount,
    createDate,
    tmnCode: vnPayConfig.vnp_TmnCode,
    returnUrl: vnPayConfig.vnp_ReturnUrl,
    url: vnPayConfig.vnp_Url,
    orderInfo: sanitizedDescription,
  });

  // Tạo payment URL - vnp_SecureHash PHẢI ở cuối
  // Build query string với URL encoding (khác với signData)
  const queryString = querystring.stringify(sortedParams);

  // Thêm vnp_SecureHash vào cuối
  const paymentUrl = `${vnPayConfig.vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;

  console.log("=== FULL PAYMENT URL ===");
  console.log(paymentUrl);
  console.log("========================");

  return paymentUrl;
};

/**
 * Verify IPN/Return URL từ VNPay
 * @param {Object} vnpParams - Query params từ VNPay
 * @returns {boolean} - True nếu signature hợp lệ
 */
export const verifyReturnUrl = (vnpParams) => {
  const secureHash = vnpParams.vnp_SecureHash;

  console.log("=== Verify Signature Debug ===");
  console.log("All received params:", JSON.stringify(vnpParams, null, 2));
  console.log("Received hash:", secureHash);

  // Xóa các field không cần thiết cho việc verify
  const params = { ...vnpParams };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  // Sort keys
  const sortedKeys = Object.keys(params).sort();

  // Build sorted params object
  const sortedParams = {};
  sortedKeys.forEach((key) => {
    sortedParams[key] = String(params[key]); // Ensure string
  });

  console.log("Sorted keys for signature:", sortedKeys);

  // Build signData - Manual build, NO encoding (giống CREATE)
  const signDataParts = [];
  sortedKeys.forEach((key) => {
    const value = String(params[key]);
    signDataParts.push(`${key}=${value}`);
  });
  const signData = signDataParts.join("&");

  console.log("\nFull signData string:");
  console.log(signData);

  const calculatedHash = createSignature(signData);

  console.log("\nCalculated hash:", calculatedHash);
  console.log("Received hash:  ", secureHash);
  console.log("Match:", secureHash === calculatedHash);
  console.log("==============================");

  return secureHash === calculatedHash;
};

/**
 * Xử lý kết quả thanh toán từ VNPay return URL
 * @param {Object} vnpParams - Query params từ VNPay
 * @returns {Object} - Kết quả xử lý
 */
export const handleReturnUrl = (vnpParams) => {
  // Verify signature trước
  if (!verifyReturnUrl(vnpParams)) {
    return {
      success: false,
      message: "Chữ ký không hợp lệ",
      code: "97",
    };
  }

  const {
    vnp_TxnRef: orderId,
    vnp_Amount: amount,
    vnp_ResponseCode: responseCode,
    vnp_TransactionNo: transactionNo,
    vnp_BankCode: bankCode,
    vnp_CardType: cardType,
    vnp_PayDate: payDate,
    vnp_OrderInfo: orderInfo,
  } = vnpParams;

  // responseCode = "00" nghĩa là thành công
  const isSuccess = responseCode === "00";

  // Mã lỗi VNPay
  const responseMessages = {
    "00": "Giao dịch thành công",
    "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
    "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
    10: "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
    11: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
    12: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
    13: "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
    24: "Giao dịch không thành công do: Khách hàng hủy giao dịch",
    51: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
    65: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
    75: "Ngân hàng thanh toán đang bảo trì.",
    79: "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
    99: "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
  };

  return {
    success: isSuccess,
    message: responseMessages[responseCode] || "Lỗi không xác định",
    orderId,
    amount: amount / 100, // Chia 100 để trả về số tiền thực
    transactionNo,
    bankCode,
    cardType,
    payDate,
    orderInfo,
    responseCode,
  };
};

/**
 * Xử lý IPN (Instant Payment Notification) từ VNPay
 * @param {Object} vnpParams - Query params từ VNPay IPN
 * @returns {Object} - Response cho VNPay
 */
export const handleIPN = (vnpParams) => {
  // Verify signature
  if (!verifyReturnUrl(vnpParams)) {
    return {
      RspCode: "97",
      Message: "Checksum failed",
    };
  }

  const {
    vnp_TxnRef: orderId,
    vnp_Amount: amount,
    vnp_ResponseCode: responseCode,
    vnp_TransactionNo: transactionNo,
  } = vnpParams;

  // Kiểm tra xem giao dịch đã được xử lý chưa
  // (Cần implement logic check trong database)

  // Nếu chưa xử lý và giao dịch thành công
  if (responseCode === "00") {
    return {
      RspCode: "00",
      Message: "Confirm Success",
      orderId,
      amount: amount / 100,
      transactionNo,
    };
  }

  // Giao dịch thất bại
  return {
    RspCode: responseCode,
    Message: "Transaction failed",
    orderId,
  };
};

/**
 * Query thông tin giao dịch từ VNPay
 * @param {Object} queryInfo - Thông tin query
 * @returns {Object} - Response từ VNPay
 */
export const queryTransaction = (queryInfo) => {
  const {
    orderId,
    transDate, // Format: yyyyMMddHHmmss
    ipAddr = "127.0.0.1",
  } = queryInfo;

  const requestId = moment().format("HHmmss");
  const createDate = moment().format("YYYYMMDDHHmmss");

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "querydr",
    vnp_TmnCode: String(vnPayConfig.vnp_TmnCode),
    vnp_TxnRef: String(orderId),
    vnp_OrderInfo: `Query transaction ${orderId}`,
    vnp_TransactionDate: String(transDate),
    vnp_CreateDate: String(createDate),
    vnp_IpAddr: String(ipAddr),
    vnp_RequestId: String(requestId),
  };

  // Tạo signature - Manual build, consistent method
  const sortedKeys = Object.keys(vnpParams).sort();
  const sortedParams = {};
  sortedKeys.forEach((key) => {
    sortedParams[key] = vnpParams[key];
  });

  const signDataParts = [];
  sortedKeys.forEach((key) => {
    signDataParts.push(`${key}=${vnpParams[key]}`);
  });
  const signData = signDataParts.join("&");
  const secureHash = createSignature(signData);

  return {
    ...sortedParams,
    vnp_SecureHash: secureHash,
  };
};

/**
 * Refund giao dịch VNPay
 * @param {Object} refundInfo - Thông tin hoàn tiền
 * @returns {Object} - Request params
 */
export const refundTransaction = (refundInfo) => {
  const {
    orderId,
    amount,
    transDate, // Format: yyyyMMddHHmmss
    transactionNo,
    createdBy = "System",
    ipAddr = "127.0.0.1",
  } = refundInfo;

  const requestId = moment().format("HHmmss");
  const createDate = moment().format("YYYYMMDDHHmmss");
  const transactionType = "02"; // 02: Toàn phần, 03: Một phần

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "refund",
    vnp_TmnCode: String(vnPayConfig.vnp_TmnCode),
    vnp_TransactionType: String(transactionType),
    vnp_TxnRef: String(orderId),
    vnp_Amount: String(amount * 100),
    vnp_OrderInfo: `Refund transaction ${orderId}`,
    vnp_TransactionNo: String(transactionNo),
    vnp_TransactionDate: String(transDate),
    vnp_CreateBy: String(createdBy),
    vnp_CreateDate: String(createDate),
    vnp_IpAddr: String(ipAddr),
    vnp_RequestId: String(requestId),
  };

  // Tạo signature - Manual build, consistent method
  const sortedKeys = Object.keys(vnpParams).sort();
  const sortedParams = {};
  sortedKeys.forEach((key) => {
    sortedParams[key] = vnpParams[key];
  });

  const signDataParts = [];
  sortedKeys.forEach((key) => {
    signDataParts.push(`${key}=${vnpParams[key]}`);
  });
  const signData = signDataParts.join("&");
  const secureHash = createSignature(signData);

  return {
    ...sortedParams,
    vnp_SecureHash: secureHash,
  };
};

export default {
  createPaymentUrl,
  verifyReturnUrl,
  handleReturnUrl,
  handleIPN,
  queryTransaction,
  refundTransaction,
};
