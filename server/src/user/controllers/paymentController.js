import * as paymentService from "../services/paymentService.js";
import * as momoService from "../services/momoService.js";
import * as vnpayService from "../services/vnpayService.js";
import db from "../../models/index.js";

const { Order, Payment } = db;

// Get user's all payments
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const result = await paymentService.getUserPayments(
      userId,
      page,
      limit,
      status,
    );

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: result.payments,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payments by order ID
export const getPaymentsByOrderId = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;

    const payments = await paymentService.getPaymentsByOrderId(orderId, userId);

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { paymentId } = req.params;

    const payment = await paymentService.getPaymentById(paymentId, userId);

    res.status(200).json({
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Create payment for order
export const createPayment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;
    const { payment_method, provider } = req.body;

    if (!payment_method || !provider) {
      return res.status(400).json({
        success: false,
        message: "payment_method and provider are required",
      });
    }

    const paymentData = {
      payment_method,
      provider,
    };

    const payment = await paymentService.createPayment(
      orderId,
      userId,
      paymentData,
    );

    res.status(201).json({
      success: true,
      message: "Payment created successfully. Please complete the payment.",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Retry payment for failed order
export const retryPayment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;
    const { payment_method, provider } = req.body;

    if (!payment_method || !provider) {
      return res.status(400).json({
        success: false,
        message: "payment_method and provider are required",
      });
    }

    const paymentData = {
      payment_method,
      provider,
    };

    const payment = await paymentService.retryPayment(
      orderId,
      userId,
      paymentData,
    );

    res.status(201).json({
      success: true,
      message:
        "Payment retry initiated successfully. Please complete the payment.",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============= MoMo Payment Controllers =============

// Create MoMo payment request
export const createMomoPayment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you don't have permission",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order already completed",
      });
    }

    // Check for existing pending payment
    const existingPayment = await Payment.findOne({
      where: {
        order_id: orderId,
        status: ["pending", "completed"],
      },
    });

    if (existingPayment && existingPayment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order already has a completed payment",
      });
    }

    // Create MoMo payment request
    const orderInfo = {
      orderId: order.order_id,
      amount: order.amount,
      orderDescription: order.content || `Payment for order #${order.order_id}`,
      userInfo: {
        userId: userId,
        orderId: order.order_id,
      },
    };

    const momoResponse = await momoService.createPaymentRequest(orderInfo);

    console.log("MoMo response:", momoResponse);

    if (momoResponse.resultCode === 0) {
      // Create or update payment record
      let payment;
      if (existingPayment) {
        payment = await existingPayment.update({
          provider: "momo",
          payment_method: "momo",
          status: "pending",
          payment_date: new Date(),
        });
      } else {
        payment = await Payment.create({
          order_id: orderId,
          payment_method: "momo",
          provider: "momo",
          transaction_code: momoResponse.orderId,
          amount: order.amount,
          payment_date: new Date(),
          content: orderInfo.orderDescription,
          status: "pending",
        });
      }

      res.status(200).json({
        success: true,
        message: "MoMo payment URL created successfully",
        data: {
          payUrl: momoResponse.payUrl,
          orderId: order.order_id,
          amount: order.amount,
          deeplink: momoResponse.deeplink,
          qrCodeUrl: momoResponse.qrCodeUrl,
        },
      });
    } else {
      console.error("MoMo error response:", momoResponse);
      res.status(400).json({
        success: false,
        message:
          momoResponse.message || `MoMo error: ${momoResponse.resultCode}`,
        error: momoResponse,
      });
    }
  } catch (error) {
    console.error("Create MoMo payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Handle MoMo callback (Return URL)
export const momoCallback = async (req, res) => {
  try {
    const callbackData = req.query;

    // Handle payment result
    const result = momoService.handlePaymentResult(callbackData);

    if (!result.success) {
      // Update payment status to failed
      await Payment.update(
        { status: "failed" },
        {
          where: {
            order_id: result.orderId,
            provider: "momo",
          },
        },
      );

      // Redirect to frontend with error
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/result?success=false&message=${encodeURIComponent(result.message)}`,
      );
    }

    // Update payment record
    const payment = await Payment.findOne({
      where: {
        order_id: result.orderId,
        provider: "momo",
      },
    });

    if (payment) {
      await payment.update({
        status: "completed",
        transaction_code: result.transactionId,
      });
    }

    // Process successful payment: create subscription and grant tokens
    try {
      const processResult = await paymentService.processSuccessfulPayment(
        result.orderId,
        result.transactionId,
      );

      console.log("Payment processed successfully:", {
        orderId: result.orderId,
        tokensGranted: processResult.tokensGranted,
        alreadyProcessed: processResult.alreadyProcessed,
      });
    } catch (error) {
      console.error("Error processing payment success:", error);
      // Even if subscription creation fails, still redirect with success
      // Admin can manually create subscription later
    }

    // Redirect to frontend with success
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?success=true&orderId=${result.orderId}&amount=${result.amount}`,
    );
  } catch (error) {
    console.error("MoMo callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?success=false&message=${encodeURIComponent("Payment processing error")}`,
    );
  }
};

// Handle MoMo IPN (Instant Payment Notification)
export const momoIPN = async (req, res) => {
  try {
    const ipnData = req.body;

    // Handle payment result
    const result = momoService.handlePaymentResult(ipnData);

    if (!result.success) {
      return res.status(200).json({
        resultCode: 1,
        message: result.message,
      });
    }

    // Update payment record
    const payment = await Payment.findOne({
      where: {
        order_id: result.orderId,
        provider: "momo",
      },
    });

    if (payment && payment.status !== "completed") {
      await payment.update({
        status: "completed",
        transaction_code: result.transactionId,
      });

      // Process successful payment: create subscription and grant tokens
      try {
        await paymentService.processSuccessfulPayment(
          result.orderId,
          result.transactionId,
        );
      } catch (error) {
        console.error("Error processing payment in IPN:", error);
        // Log error but still respond success to MoMo
      }
    }

    // Respond to MoMo
    res.status(200).json({
      resultCode: 0,
      message: "Success",
    });
  } catch (error) {
    console.error("MoMo IPN error:", error);
    res.status(200).json({
      resultCode: 1,
      message: "Error processing IPN",
    });
  }
};

// ============= VNPay Payment Controllers =============

// Create VNPay payment URL
export const createVnpayPayment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;
    const { bankCode, language } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you don't have permission",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order already completed",
      });
    }

    // Check for existing pending payment
    const existingPayment = await Payment.findOne({
      where: {
        order_id: orderId,
        status: ["pending", "completed"],
      },
    });

    if (existingPayment && existingPayment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order already has a completed payment",
      });
    }

    // Get client IP address
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    // Handle IPv6 localhost
    if (ipAddr === "::1" || ipAddr === "::ffff:127.0.0.1") {
      ipAddr = "127.0.0.1";
    }

    // Remove IPv6 prefix if exists
    if (ipAddr.startsWith("::ffff:")) {
      ipAddr = ipAddr.replace("::ffff:", "");
    }

    // Create VNPay payment URL
    const orderInfo = {
      orderId: order.order_id,
      amount: parseFloat(order.amount), // Ensure it's a number
      orderDescription: order.content || `Payment for order #${order.order_id}`,
      bankCode: bankCode || "",
      language: language || "vn",
    };

    console.log("Creating VNPay payment with:", {
      orderId: orderInfo.orderId,
      amount: orderInfo.amount,
      ipAddr,
    });

    // Log VNPay config for debugging
    vnpayService.logVNPayConfig();

    const paymentUrl = vnpayService.createPaymentUrl(orderInfo, ipAddr);

    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = await existingPayment.update({
        provider: "vnpay",
        payment_method: "vnpay",
        status: "pending",
        payment_date: new Date(),
      });
    } else {
      payment = await Payment.create({
        order_id: orderId,
        payment_method: "vnpay",
        provider: "vnpay",
        transaction_code: order.order_id,
        amount: order.amount,
        payment_date: new Date(),
        content: orderInfo.orderDescription,
        status: "pending",
      });
    }

    res.status(200).json({
      success: true,
      message: "VNPay payment URL created successfully",
      data: {
        paymentUrl,
        orderId: order.order_id,
        amount: order.amount,
      },
    });
  } catch (error) {
    console.error("Create VNPay payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Handle VNPay callback (Return URL)
export const vnpayCallback = async (req, res) => {
  try {
    const vnpParams = req.query;

    // Handle return URL
    const result = vnpayService.handleReturnUrl(vnpParams);

    if (!result.success) {
      // Update payment status to failed
      await Payment.update(
        { status: "failed" },
        {
          where: {
            order_id: result.orderId,
            provider: "vnpay",
          },
        },
      );

      // Redirect to frontend with error
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/result?success=false&message=${encodeURIComponent(result.message)}`,
      );
    }

    // Update payment record
    const payment = await Payment.findOne({
      where: {
        order_id: result.orderId,
        provider: "vnpay",
      },
    });

    if (payment) {
      await payment.update({
        status: "completed",
        transaction_code: result.transactionNo,
      });
    }

    // Process successful payment: create subscription and grant tokens
    try {
      const processResult = await paymentService.processSuccessfulPayment(
        result.orderId,
        result.transactionNo,
      );

      console.log("Payment processed successfully:", {
        orderId: result.orderId,
        tokensGranted: processResult.tokensGranted,
        alreadyProcessed: processResult.alreadyProcessed,
      });
    } catch (error) {
      console.error("Error processing payment success:", error);
      // Even if subscription creation fails, still redirect with success
    }

    // Redirect to frontend with success
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?success=true&orderId=${result.orderId}&amount=${result.amount}`,
    );
  } catch (error) {
    console.error("VNPay callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?success=false&message=${encodeURIComponent("Payment processing error")}`,
    );
  }
};

// Handle VNPay IPN (Instant Payment Notification)
export const vnpayIPN = async (req, res) => {
  try {
    const vnpParams = req.query;

    // Handle IPN
    const result = vnpayService.handleIPN(vnpParams);

    if (result.RspCode !== "00") {
      return res.status(200).json(result);
    }

    // Update payment record
    const payment = await Payment.findOne({
      where: {
        order_id: result.orderId,
        provider: "vnpay",
      },
    });

    if (payment && payment.status !== "completed") {
      await payment.update({
        status: "completed",
        transaction_code: result.transactionNo,
      });

      // Process successful payment: create subscription and grant tokens
      try {
        await paymentService.processSuccessfulPayment(
          result.orderId,
          result.transactionNo,
        );
      } catch (error) {
        console.error("Error processing payment in IPN:", error);
        // Log error but still respond success to VNPay
      }
    }

    // Respond to VNPay
    res.status(200).json(result);
  } catch (error) {
    console.error("VNPay IPN error:", error);
    res.status(200).json({
      RspCode: "99",
      Message: "Error processing IPN",
    });
  }
};
