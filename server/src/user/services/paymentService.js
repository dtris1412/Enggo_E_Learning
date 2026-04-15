import db from "../../models/index.js";
import * as userSubscriptionService from "./userSubscriptionService.js";
import * as userTokenWalletService from "../../admin/services/userTokenWalletService.js";
import * as userTokenTransactionService from "../../admin/services/userTokenTransactionService.js";
import { sendInvoiceEmail } from "../../shared/services/emailService.js";

const { Payment, Order, Subscription_Price, Subscription_Plan } = db;

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

/**
 * Process successful payment:
 * - Update order status to 'completed'
 * - Create user subscription
 * - Grant AI tokens to user wallet
 * - Create token transaction record
 */
export const processSuccessfulPayment = async (
  orderId,
  transactionId = null,
) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Get order with subscription price and plan info
    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: Subscription_Price,
          include: [
            {
              model: Subscription_Plan,
              attributes: [
                "subscription_plan_id",
                "name",
                "monthly_ai_token_quota",
              ],
            },
          ],
        },
      ],
      transaction,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Check if order is already completed
    if (order.status === "completed") {
      // Already processed, return existing subscription
      const existingSubscription = await db.User_Subscription.findOne({
        where: { order_id: orderId },
        transaction,
      });
      await transaction.commit();
      return {
        alreadyProcessed: true,
        subscription: existingSubscription,
      };
    }

    // Update order status to completed
    await order.update({ status: "completed" }, { transaction });

    // Check if user already has an active subscription
    const activeSubscription =
      await userSubscriptionService.getUserActiveSubscription(order.user_id);

    let subscription;

    if (activeSubscription) {
      // User already has a subscription (free or paid) → UPDATE it
      console.log("Updating existing subscription:", {
        oldPriceId: activeSubscription.subscription_price_id,
        newPriceId: order.subscription_price_id,
      });

      // Calculate new dates
      const startedAt = new Date();
      let expiredAt;

      const subscriptionPrice = order.Subscription_Price;
      if (subscriptionPrice.billing_type === "free") {
        expiredAt = null;
      } else {
        expiredAt = new Date();
        expiredAt.setDate(
          expiredAt.getDate() + subscriptionPrice.duration_days,
        );
      }

      // Update existing subscription
      subscription = await activeSubscription.update(
        {
          subscription_price_id: order.subscription_price_id,
          order_id: order.order_id,
          started_at: startedAt,
          expired_at: expiredAt,
          status: "active",
        },
        { transaction },
      );
    } else {
      // User doesn't have any subscription → CREATE new
      console.log("Creating new subscription for user:", order.user_id);

      subscription = await userSubscriptionService.createSubscription(
        order.user_id,
        order.subscription_price_id,
        order.order_id,
        transaction,
      );
    }

    // Grant AI tokens if the plan has monthly quota
    const monthlyTokens =
      order.Subscription_Price?.Subscription_Plan?.monthly_ai_token_quota || 0;

    let tokensGranted = 0;
    if (monthlyTokens > 0) {
      // Add tokens to user wallet
      await userTokenWalletService.addTokensToWallet(
        order.user_id,
        monthlyTokens,
        transaction,
      );

      // Create token transaction record
      await userTokenTransactionService.createTransaction(
        order.user_id,
        monthlyTokens,
        "subscription_grant",
        subscription.user_subscription_id,
        transaction,
      );

      tokensGranted = monthlyTokens;
    }

    await transaction.commit();

    // Send invoice email (non-blocking)
    try {
      const user = await db.User.findByPk(order.user_id);
      if (user) {
        await sendInvoiceEmail({
          user_email: user.user_email,
          full_name: user.full_name || user.user_name,
          order_id: order.order_id,
          total_amount: order.amount,
          billing_type: order.Subscription_Price?.billing_type || "monthly",
          plan_name:
            order.Subscription_Price?.Subscription_Plan?.name || "Plan",
          created_at: order.created_at,
          subscription_expires_at:
            subscription.expired_at ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        console.log(`✅ Invoice email sent to ${user.user_email}`);
      }
    } catch (emailError) {
      console.error(
        `⚠️ Failed to send invoice email for order ${order.order_id}:`,
        emailError.message,
      );
      // Don't block payment process if email fails
    }

    console.log("✅ Payment processed successfully:", {
      orderId: order.order_id,
      userId: order.user_id,
      subscriptionId: subscription.user_subscription_id,
      tokensGranted,
    });

    return {
      alreadyProcessed: false,
      subscription,
      order,
      tokensGranted,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error processing successful payment: ${error.message}`);
  }
};
