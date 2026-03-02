import db from "../../models/index.js";
import * as orderService from "./orderService.js";
import * as userSubscriptionService from "./userSubscriptionService.js";
import * as userTokenWalletService from "./userTokenWalletService.js";
import * as userTokenTransactionService from "./userTokenTransactionService.js";

const { Payment, Order, User, Subscription_Price, Subscription_Plan } = db;

// Get all payments (admin)
export const getAllPayments = async (
  page = 1,
  limit = 10,
  status = "",
  paymentMethod = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== "") {
      where.status = status;
    }

    if (paymentMethod && paymentMethod !== "") {
      where.payment_method = paymentMethod;
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          attributes: [
            "order_id",
            "user_id",
            "subscription_price_id",
            "status",
            "amount",
            "content",
          ],
          include: [
            {
              model: User,
              attributes: ["user_id", "user_name", "full_name", "user_email"],
            },
            {
              model: Subscription_Price,
              attributes: ["subscription_price_id", "billing_type"],
              include: [
                {
                  model: Subscription_Plan,
                  attributes: ["subscription_plan_id", "name", "code"],
                },
              ],
            },
          ],
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
    throw new Error(`Error fetching payments: ${error.message}`);
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Order,
          attributes: [
            "order_id",
            "user_id",
            "subscription_price_id",
            "status",
            "amount",
            "content",
            "order_date",
          ],
          include: [
            {
              model: User,
              attributes: ["user_id", "user_name", "full_name", "user_email"],
            },
            {
              model: Subscription_Price,
              attributes: [
                "subscription_price_id",
                "billing_type",
                "duration_days",
                "price",
                "discount_percentage",
              ],
              include: [
                {
                  model: Subscription_Plan,
                  attributes: [
                    "subscription_plan_id",
                    "name",
                    "code",
                    "monthly_ai_token_quota",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  } catch (error) {
    throw new Error(`Error fetching payment: ${error.message}`);
  }
};

// Create payment
export const createPayment = async (orderId, paymentData) => {
  try {
    const { payment_method, provider, transaction_code } = paymentData;

    // Validate order exists and is pending
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found");
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

// Update payment status
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Order,
          include: [
            {
              model: Subscription_Price,
              include: [
                {
                  model: Subscription_Plan,
                  attributes: ["monthly_ai_token_quota"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = status;
    await payment.save();

    // If payment completed, process the subscription
    if (status === "completed") {
      await processCompletedPayment(payment);
    }

    // Update order status
    if (status === "completed") {
      await orderService.updateOrderStatus(payment.order_id, "completed");
    } else if (status === "failed") {
      await orderService.updateOrderStatus(payment.order_id, "failed");
    }

    return payment;
  } catch (error) {
    throw new Error(`Error updating payment status: ${error.message}`);
  }
};

// Process completed payment (create subscription + add tokens)
const processCompletedPayment = async (payment) => {
  try {
    const order = payment.Order;
    const userId = order.user_id;
    const subscriptionPriceId = order.subscription_price_id;

    // Check if subscription already created for this order
    const existingSubscription = await db.User_Subscription.findOne({
      where: { order_id: order.order_id },
    });

    if (existingSubscription) {
      console.log(`Subscription already exists for order ${order.order_id}`);
      return;
    }

    // Cancel any active subscription
    const activeSubscription =
      await userSubscriptionService.getUserActiveSubscription(userId);
    if (activeSubscription) {
      await userSubscriptionService.cancelSubscription(
        activeSubscription.user_subscription_id,
      );
    }

    // Create new subscription
    const subscription = await userSubscriptionService.createSubscription(
      userId,
      subscriptionPriceId,
    );

    // Update subscription with order_id
    subscription.order_id = order.order_id;
    await subscription.save();

    // Add tokens to wallet
    const monthlyTokens =
      order.Subscription_Price.Subscription_Plan.monthly_ai_token_quota;
    await userTokenWalletService.addTokensToWallet(userId, monthlyTokens);

    // Create token transaction record
    await userTokenTransactionService.createTransaction(
      userId,
      monthlyTokens,
      "subscription_grant",
      subscription.user_subscription_id,
    );

    console.log(
      `Subscription created successfully for order ${order.order_id}`,
    );
  } catch (error) {
    throw new Error(`Error processing completed payment: ${error.message}`);
  }
};

// Get payment statistics (admin)
export const getPaymentStatistics = async () => {
  try {
    const stats = await Payment.findAll({
      attributes: [
        "status",
        "payment_method",
        [db.sequelize.fn("COUNT", db.sequelize.col("payment_id")), "count"],
        [db.sequelize.fn("SUM", db.sequelize.col("amount")), "total_amount"],
      ],
      group: ["status", "payment_method"],
      raw: true,
    });

    return stats;
  } catch (error) {
    throw new Error(`Error fetching payment statistics: ${error.message}`);
  }
};

// Get payments by order ID
export const getPaymentsByOrderId = async (orderId) => {
  try {
    const payments = await Payment.findAll({
      where: { order_id: orderId },
      order: [["payment_date", "DESC"]],
    });

    return payments;
  } catch (error) {
    throw new Error(`Error fetching payments for order: ${error.message}`);
  }
};
