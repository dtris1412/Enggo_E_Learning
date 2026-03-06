import db from "../../models/index.js";

const { User_Subscription, Subscription_Price, Subscription_Plan } = db;

/**
 * Get user's current subscription plan code
 * @param {number} userId - User ID
 * @returns {Promise<string>} Plan code: "free", "pro", "premium", etc.
 */
export const getUserSubscriptionPlan = async (userId) => {
  try {
    if (!userId) {
      return "free"; // Default to free if no user
    }

    const subscription = await User_Subscription.findOne({
      where: {
        user_id: userId,
        status: "active",
      },
      include: [
        {
          model: Subscription_Price,
          attributes: ["subscription_price_id"],
          include: [
            {
              model: Subscription_Plan,
              attributes: ["code", "name"],
            },
          ],
        },
      ],
      order: [["expired_at", "DESC"]],
    });

    // Check if subscription exists and not expired
    if (
      subscription &&
      subscription.expired_at &&
      new Date(subscription.expired_at) > new Date()
    ) {
      return subscription.Subscription_Price?.Subscription_Plan?.code || "free";
    }

    // No active subscription or expired
    return "free";
  } catch (error) {
    console.error("Error fetching user subscription plan:", error);
    return "free"; // Default to free on error
  }
};

/**
 * Check if user can access content based on their subscription
 * @param {number} userId - User ID
 * @param {string} requiredAccessType - Required access type: "free", "premium"
 * @returns {Promise<{canAccess: boolean, userPlan: string, message?: string}>}
 */
export const checkContentAccess = async (userId, requiredAccessType) => {
  try {
    const userPlan = await getUserSubscriptionPlan(userId);

    // Define access hierarchy
    const accessLevels = {
      free: ["free"],
      pro: ["free", "premium"], // Pro can access free and premium content
      premium: ["free", "premium"], // Premium can access all
    };

    const allowedAccess = accessLevels[userPlan] || ["free"];

    const canAccess = allowedAccess.includes(requiredAccessType);

    return {
      canAccess,
      userPlan,
      message: canAccess
        ? "Access granted"
        : `This content requires ${requiredAccessType} access. Your plan: ${userPlan}`,
    };
  } catch (error) {
    console.error("Error checking content access:", error);
    return {
      canAccess: false,
      userPlan: "unknown",
      message: "Error checking access permissions",
    };
  }
};

/**
 * Get detailed subscription info
 * @param {number} userId - User ID
 * @returns {Promise<object|null>}
 */
export const getUserSubscriptionInfo = async (userId) => {
  try {
    if (!userId) {
      return null;
    }

    const subscription = await User_Subscription.findOne({
      where: {
        user_id: userId,
        status: "active",
      },
      include: [
        {
          model: Subscription_Price,
          include: [
            {
              model: Subscription_Plan,
            },
          ],
        },
      ],
      order: [["expired_at", "DESC"]],
    });

    if (!subscription) {
      return null;
    }

    // Check if expired
    const isExpired =
      subscription.expired_at && new Date(subscription.expired_at) < new Date();

    if (isExpired) {
      return null;
    }

    return {
      user_subscription_id: subscription.user_subscription_id,
      plan_code: subscription.Subscription_Price?.Subscription_Plan?.code,
      plan_name: subscription.Subscription_Price?.Subscription_Plan?.name,
      started_at: subscription.started_at,
      expired_at: subscription.expired_at,
      status: subscription.status,
      billing_type: subscription.Subscription_Price?.billing_type,
      monthly_ai_token_quota:
        subscription.Subscription_Price?.Subscription_Plan
          ?.monthly_ai_token_quota,
    };
  } catch (error) {
    console.error("Error fetching user subscription info:", error);
    return null;
  }
};
