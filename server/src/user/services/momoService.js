import crypto from "crypto";
import axios from "axios";
import { momoConfig } from "../../config/momoConfig.js";

/**
 * Tạo chữ ký HMAC SHA256 cho MoMo request
 */
const createSignature = (data) => {
  const hmac = crypto.createHmac("sha256", momoConfig.secretKey);
  return hmac.update(data).digest("hex");
};

/**
 * Tạo payment request đến MoMo
 * @param {Object} orderInfo - Thông tin đơn hàng
 * @returns {Promise<Object>} - Response từ MoMo
 */
export const createPaymentRequest = async (orderInfo) => {
  const {
    orderId,
    amount,
    orderDescription,
    userInfo = {},
    language = "vi",
  } = orderInfo;

  // Validate config
  if (
    !momoConfig.partnerCode ||
    !momoConfig.accessKey ||
    !momoConfig.secretKey
  ) {
    console.error("MoMo config error:", {
      hasPartnerCode: !!momoConfig.partnerCode,
      hasAccessKey: !!momoConfig.accessKey,
      hasSecretKey: !!momoConfig.secretKey,
    });
    throw new Error("MoMo configuration is incomplete");
  }

  // Convert orderId to string và amount to integer
  // MoMo yêu cầu orderId UNIQUE cho mỗi request
  // Thêm timestamp để tránh trùng lặp
  const timestamp = Date.now();
  const orderIdStr = `ORDER_${orderId}_${timestamp}`;
  const amountInt = Math.round(parseFloat(amount));

  // Validate amount
  if (isNaN(amountInt) || amountInt <= 0) {
    console.error("Invalid MoMo amount:", { amount, amountInt });
    throw new Error(`Invalid payment amount: ${amount}`);
  }

  // Sanitize orderDescription - MoMo không cho phép ký tự đặc biệt
  const sanitizedDescription = orderDescription
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 255);

  // Tạo request ID duy nhất
  const requestId = `${momoConfig.partnerCode}_${Date.now()}`;
  const requestType = "payWithMethod";
  const extraData =
    userInfo && Object.keys(userInfo).length > 0
      ? Buffer.from(JSON.stringify(userInfo)).toString("base64")
      : "";

  console.log("Creating MoMo payment with:", {
    orderId: orderIdStr,
    amount: amountInt,
    requestId,
    orderDescription: sanitizedDescription,
  });

  // Tạo raw signature string theo yêu cầu của MoMo
  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amountInt}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderIdStr}&orderInfo=${sanitizedDescription}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  console.log("MoMo signature data:", rawSignature);

  const signature = createSignature(rawSignature);
  console.log("MoMo signature:", signature);

  // Request body gửi đến MoMo
  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    partnerName: "E-Learning Platform",
    storeId: momoConfig.partnerCode,
    requestId,
    amount: amountInt,
    orderId: orderIdStr,
    orderInfo: sanitizedDescription,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    lang: language,
    requestType,
    autoCapture: true,
    extraData,
    signature,
  };

  console.log("MoMo request body:", {
    ...requestBody,
    signature: signature.substring(0, 20) + "...",
  });

  try {
    const response = await axios.post(momoConfig.endpoint, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("MoMo response:", response.data);
    return response.data;
  } catch (error) {
    console.error("MoMo payment request error:");
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw new Error(
      error.response?.data?.message || "Không thể tạo yêu cầu thanh toán MoMo",
    );
  }
};

/**
 * Verify callback/IPN signature từ MoMo
 * @param {Object} callbackData - Dữ liệu callback từ MoMo
 * @returns {boolean} - True nếu signature hợp lệ
 */
export const verifySignature = (callbackData) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = callbackData;

  // Tạo raw signature string để verify - THEO ĐÚNG THỨ TỰ CỦA MOMO
  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const calculatedSignature = createSignature(rawSignature);

  console.log("MoMo signature verification:", {
    receivedSignature: signature,
    calculatedSignature,
    match: calculatedSignature === signature,
  });

  return calculatedSignature === signature;
};

/**
 * Kiểm tra trạng thái giao dịch từ MoMo
 * @param {string} orderId - Mã đơn hàng
 * @returns {Promise<Object>} - Thông tin giao dịch
 */
export const checkTransactionStatus = async (orderId) => {
  const requestId = `${momoConfig.partnerCode}_${Date.now()}`;

  const rawSignature = `accessKey=${momoConfig.accessKey}&orderId=${orderId}&partnerCode=${momoConfig.partnerCode}&requestId=${requestId}`;
  const signature = createSignature(rawSignature);

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    requestId,
    orderId,
    signature,
    lang: "vi",
  };

  try {
    const response = await axios.post(
      momoConfig.endpoint.replace("/create", "/query"),
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "MoMo status check error:",
      error.response?.data || error.message,
    );
    throw new Error("Không thể kiểm tra trạng thái giao dịch MoMo");
  }
};

/**
 * Xử lý kết quả thanh toán MoMo
 * @param {Object} callbackData - Dữ liệu từ callback
 * @returns {Object} - Kết quả xử lý
 */
export const handlePaymentResult = (callbackData) => {
  const { resultCode, message, orderId, transId, amount, extraData } =
    callbackData;

  // Verify signature trước
  if (!verifySignature(callbackData)) {
    return {
      success: false,
      message: "Chữ ký không hợp lệ",
      orderId,
    };
  }

  // Parse extraData nếu có
  let userInfo = {};
  if (extraData) {
    try {
      userInfo = JSON.parse(Buffer.from(extraData, "base64").toString("utf-8"));
    } catch (error) {
      console.error("Error parsing extraData:", error);
    }
  }

  // resultCode = 0 hoặc '0' nghĩa là thành công
  // MoMo có thể trả về string hoặc number tùy endpoint
  const isSuccess = String(resultCode) === "0";

  console.log("MoMo handlePaymentResult:", {
    resultCode,
    resultCodeType: typeof resultCode,
    isSuccess,
  });

  return {
    success: isSuccess,
    message: message,
    orderId,
    transactionId: transId,
    amount,
    userInfo,
    resultCode,
  };
};

export default {
  createPaymentRequest,
  verifySignature,
  checkTransactionStatus,
  handlePaymentResult,
};
