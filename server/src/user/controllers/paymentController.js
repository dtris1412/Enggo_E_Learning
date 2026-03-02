import * as paymentService from "../services/paymentService.js";

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
