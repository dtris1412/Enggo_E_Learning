import * as paymentService from "../services/paymentService.js";

// Get all payments (admin)
export const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";
    const paymentMethod = req.query.payment_method || "";

    const result = await paymentService.getAllPayments(
      page,
      limit,
      status,
      paymentMethod,
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

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentService.getPaymentById(paymentId);

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

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const payment = await paymentService.updatePaymentStatus(paymentId, status);

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payment statistics
export const getPaymentStatistics = async (req, res) => {
  try {
    const stats = await paymentService.getPaymentStatistics();

    res.status(200).json({
      success: true,
      message: "Payment statistics fetched successfully",
      data: stats,
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
    const { orderId } = req.params;

    const payments = await paymentService.getPaymentsByOrderId(orderId);

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
