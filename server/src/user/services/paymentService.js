import db from "../../models/index.js";

const { Payment, Order } = db;

// Get payments by order ID (for user)
export const getPaymentsByOrderId = async (orderId, userId) => {
  try {
    // First verify order ownership
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
    });

    if (!order) {
      throw new Error(
        "Order not found or you don't have permission to view it",
      );
    }

    const payments = await Payment.findAll({
      where: { order_id: orderId },
      attributes: [
        "payment_id",
        "payment_method",
        "provider",
        "transaction_code",
        "amount",
        "payment_date",
        "status",
        "content",
      ],
      order: [["payment_date", "DESC"]],
    });

    return payments;
  } catch (error) {
    throw new Error(`Error fetching payments: ${error.message}`);
  }
};

// Create payment for order
export const createPayment = async (orderId, userId, paymentData) => {
  try {
    const { payment_method, provider } = paymentData;

    // Validate order exists and belongs to user
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
    });

    if (!order) {
      throw new Error("Order not found or you don't have permission");
    }

    if (order.status === "completed") {
      throw new Error("Order already completed");
    }

    // Check if there's already a pending or completed payment for this order
    const existingPayment = await Payment.findOne({
      where: {
        order_id: orderId,
        status: ["pending", "completed"],
      },
    });

    if (existingPayment) {
      throw new Error("Order already has a pending or completed payment");
    }

    // Generate transaction code (in real app, this would come from payment gateway)
    const transaction_code = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create payment
    const payment = await Payment.create({
      order_id: orderId,
      payment_method,
      provider,
      transaction_code,
      amount: order.amount,
      payment_date: new Date(),
      content: `Payment for order #${orderId}`,
      status: "pending",
    });

    return payment;
  } catch (error) {
    throw new Error(`Error creating payment: ${error.message}`);
  }
};

// Get payment by ID (with ownership check)
export const getPaymentById = async (paymentId, userId) => {
  try {
    const payment = await Payment.findOne({
      where: { payment_id: paymentId },
      include: [
        {
          model: Order,
          where: { user_id: userId },
          attributes: ["order_id", "user_id", "status", "amount", "content"],
        },
      ],
    });

    if (!payment) {
      throw new Error(
        "Payment not found or you don't have permission to view it",
      );
    }

    return payment;
  } catch (error) {
    throw new Error(`Error fetching payment: ${error.message}`);
  }
};

// Retry payment for failed order
export const retryPayment = async (orderId, userId, paymentData) => {
  try {
    // Verify order ownership and status
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
    });

    if (!order) {
      throw new Error("Order not found or you don't have permission");
    }

    if (order.status === "completed") {
      throw new Error("Order already completed");
    }

    // Check for existing pending payment
    const pendingPayment = await Payment.findOne({
      where: {
        order_id: orderId,
        status: "pending",
      },
    });

    if (pendingPayment) {
      throw new Error("There is already a pending payment for this order");
    }

    // Create new payment attempt
    return await createPayment(orderId, userId, paymentData);
  } catch (error) {
    throw new Error(`Error retrying payment: ${error.message}`);
  }
};

// Get user's all payments
export const getUserPayments = async (
  userId,
  page = 1,
  limit = 10,
  status = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const wherePayment = {};

    if (status && status !== "") {
      wherePayment.status = status;
    }

    const { count, rows } = await Payment.findAndCountAll({
      where: wherePayment,
      include: [
        {
          model: Order,
          where: { user_id: userId },
          attributes: ["order_id", "status", "amount", "content", "order_date"],
        },
      ],
      offset,
      limit,
      order: [["payment_date", "DESC"]],
    });

    return {
      payments: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching user payments: ${error.message}`);
  }
};
