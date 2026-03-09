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

  // Tạo request ID duy nhất
  const requestId = `${momoConfig.partnerCode}_${Date.now()}`;
  const requestType = "payWithMethod";
  const extraData = userInfo
    ? Buffer.from(JSON.stringify(userInfo)).toString("base64")
    : "";

  // Tạo raw signature string theo yêu cầu của MoMo
  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderDescription}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = createSignature(rawSignature);

  // Request body gửi đến MoMo
  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    partnerName: "E-Learning Platform",
    storeId: momoConfig.partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo: orderDescription,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    lang: language,
    requestType,
    autoCapture: true,
    extraData,
    signature,
  };

  try {
    const response = await axios.post(momoConfig.endpoint, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "MoMo payment request error:",
      error.response?.data || error.message,
    );
    throw new Error("Không thể tạo yêu cầu thanh toán MoMo");
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

  // Tạo raw signature string để verify
  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const calculatedSignature = createSignature(rawSignature);

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

  // resultCode = 0 nghĩa là thành công
  const isSuccess = resultCode === 0;

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
