import * as userSubscriptionService from "../services/userSubscriptionService.js";
import * as adminTokenWalletService from "../../admin/services/userTokenWalletService.js";
import * as adminTokenTransactionService from "../../admin/services/userTokenTransactionService.js";
import db from "../../config/connectDB.js";

const { Subscription_Price, Subscription_Plan } = db;

// Get user's active subscription
export const getUserActiveSubscription = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const subscription =
      await userSubscriptionService.getUserActiveSubscription(userId);

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: "No active subscription found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Active subscription fetched successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const result = await userSubscriptionService.getUserSubscriptions(
      userId,
      page,
      limit,
      status,
    );

    res.status(200).json({
      success: true,
      message: "User subscriptions fetched successfully",
      data: result.subscriptions,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription =
      await userSubscriptionService.getSubscriptionById(subscriptionId);

    res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Subscribe to a plan
export const subscribeToplan = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { subscriptionPriceId } = req.body;

    // Validation
    if (!subscriptionPriceId) {
      return res.status(400).json({
        success: false,
        message: "subscriptionPriceId is required",
      });
    }

    // Get subscription price with plan info
    const subscriptionPrice = await Subscription_Price.findByPk(
      subscriptionPriceId,
      {
        include: [
          {
            model: Subscription_Plan,
            attributes: ["monthly_ai_token_quota"],
          },
        ],
      },
    );

    if (!subscriptionPrice) {
      return res.status(404).json({
        success: false,
        message: "Subscription price not found",
      });
    }

    // Check if user already has active subscription
    const activeSubscription =
      await userSubscriptionService.getUserActiveSubscription(userId);
    if (activeSubscription) {
      // Optional: cancel existing subscription first or reject
      await userSubscriptionService.cancelSubscription(
        activeSubscription.user_subscription_id,
      );
    }

    // Create subscription
    const subscription = await userSubscriptionService.createSubscription(
      userId,
      subscriptionPriceId,
    );

    // Add tokens to wallet based on plan
    const monthlyTokens =
      subscriptionPrice.Subscription_Plan.monthly_ai_token_quota;
    await adminTokenWalletService.addTokensToWallet(userId, monthlyTokens);

    // Create token transaction record
    await adminTokenTransactionService.createTransaction(
      userId,
      monthlyTokens,
      "subscription_grant",
      subscription.user_subscription_id,
    );

    res.status(201).json({
      success: true,
      message: "Subscription created successfully and tokens added",
      data: subscription,
      tokensAdded: monthlyTokens,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.user_id;

    // Check ownership
    const subscription =
      await userSubscriptionService.getSubscriptionById(subscriptionId);

    if (subscription.user_id !== userId && req.user.role !== 1) {
      // role 1 = admin
      return res.status(403).json({
        success: false,
        message: "You do not have permission to cancel this subscription",
      });
    }

    const canceledSubscription =
      await userSubscriptionService.cancelSubscription(subscriptionId);

    res.status(200).json({
      success: true,
      message: "Subscription canceled successfully",
      data: canceledSubscription,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
