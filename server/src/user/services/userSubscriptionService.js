import db from "../../models/index.js";

const { User_Subscription, User, Subscription_Price, Subscription_Plan } = db;

// Get user's active subscription
export const getUserActiveSubscription = async (userId) => {
  try {
    const subscription = await User_Subscription.findOne({
      where: {
        user_id: userId,
        status: "active",
      },
      attributes: [
        "user_subscription_id",
        "user_id",
        "subscription_price_id",
        "order_id",
        "started_at",
        "expired_at",
        "status",
      ],
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name"],
        },
        {
          model: Subscription_Price,
          attributes: [
            "subscription_price_id",
            "billing_type",
            "price",
            "discount_percentage",
            "duration_days",
          ],
          include: [
            {
              model: Subscription_Plan,
              attributes: [
                "subscription_plan_id",
                "name",
                "code",
                "monthly_ai_token_quota",
                "features",
              ],
            },
          ],
        },
      ],
      order: [["expired_at", "DESC"]],
    });
    return subscription;
  } catch (error) {
    throw new Error(`Error fetching user subscription: ${error.message}`);
  }
};

// Get user's all subscriptions
export const getUserSubscriptions = async (
  userId,
  page = 1,
  limit = 10,
  status = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    if (status && status !== "") {
      where.status = status;
    }

    const { count, rows } = await User_Subscription.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name"],
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
      offset,
      limit,
      order: [["started_at", "DESC"]],
    });

    return {
      subscriptions: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching user subscriptions: ${error.message}`);
  }
};

// Get subscription by ID
export const getSubscriptionById = async (subscriptionId) => {
  try {
    const subscription = await User_Subscription.findByPk(subscriptionId, {
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
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return subscription;
  } catch (error) {
    throw new Error(`Error fetching subscription: ${error.message}`);
  }
};

// Create subscription
export const createSubscription = async (
  userId,
  subscriptionPriceId,
  order_id,
  transaction = null,
) => {
  try {
    // Get subscription price with plan info
    const subscriptionPrice = await Subscription_Price.findByPk(
      subscriptionPriceId,
      {
        include: [
          {
            model: Subscription_Plan,
            attributes: ["subscription_plan_id", "monthly_ai_token_quota"],
          },
        ],
        transaction,
      },
    );

    if (!subscriptionPrice) {
      throw new Error("Subscription price not found");
    }

    // Calculate dates
    const startedAt = new Date();
    let expiredAt;

    if (subscriptionPrice.billing_type === "free") {
      // For free plans, set expired_at to 1 month later for automatic token reset
      expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + 30); // 1 month for free plan
    } else {
      // For paid plans, calculate expiration date based on duration_days
      expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + subscriptionPrice.duration_days);
    }

    // Create subscription
    const subscription = await User_Subscription.create(
      {
        user_id: userId,
        subscription_price_id: subscriptionPriceId,
        order_id: order_id || null,
        started_at: startedAt,
        expired_at: expiredAt,
        status: "active",
      },
      { transaction },
    );

    return subscription;
  } catch (error) {
    throw new Error(`Error creating subscription: ${error.message}`);
  }
};

// Cancel subscription - immediate downgrade if already expired
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await User_Subscription.findByPk(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "canceled") {
      throw new Error("Subscription is already canceled");
    }

    const userId = subscription.user_id;
    const now = new Date();

    // Check if subscription is already expired
    if (
      subscription.expired_at &&
      new Date(subscription.expired_at) <= now &&
      subscription.status === "active"
    ) {
      // Already expired - downgrade to free immediately
      console.log(
        `Subscription ${subscriptionId} already expired - downgrading to free`,
      );

      // Mark current subscription as expired
      subscription.status = "expired";
      await subscription.save();

      // Find free plan
      const freePrice = await Subscription_Price.findOne({
        include: [
          {
            model: Subscription_Plan,
            where: { code: "free" },
          },
        ],
        where: { billing_type: "free" },
      });

      if (freePrice) {
        // Create new free subscription
        const freeSubscription = await createSubscription(
          userId,
          freePrice.subscription_price_id,
          null,
        );

        // Reset tokens to free plan quota
        const monthlyQuota = freePrice.Subscription_Plan.monthly_ai_token_quota;
        let wallet = await db.User_Token_Wallet.findOne({
          where: { user_id: userId },
        });

        if (!wallet) {
          // Create new wallet with free tokens
          wallet = await db.User_Token_Wallet.create({
            user_id: userId,
            token_balance: monthlyQuota,
            updated_at: new Date(),
          });
          console.log(
            `Created new wallet for user ${userId} with ${monthlyQuota} free tokens`,
          );
        } else {
          // Update existing wallet to free token quota
          await db.User_Token_Wallet.update(
            { token_balance: monthlyQuota, updated_at: new Date() },
            { where: { user_id: userId } },
          );
          console.log(
            `Updated wallet for user ${userId}: reset to ${monthlyQuota} free tokens`,
          );
        }

        return {
          success: true,
          message: "Gói đã hết hạn, đã chuyển về gói Free",
          subscription: freeSubscription,
          action: "downgraded_to_free",
        };
      } else {
        throw new Error("Free plan not found in system");
      }
    } else {
      // Still active - mark as canceled (will downgrade on expiry)
      subscription.status = "canceled";
      await subscription.save();

      console.log(`Subscription ${subscriptionId} marked as canceled`);

      return {
        success: true,
        message: `Hủy đăng ký thành công. Bạn vẫn có thể sử dụng gói đến hết hạn ${new Date(subscription.expired_at).toLocaleDateString("vi-VN")}`,
        subscription,
        action: "canceled",
      };
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw new Error(`Error canceling subscription: ${error.message}`);
  }
};

// Refresh free plan tokens for user (call periodically - daily/monthly)
export const refreshFreeTokensForUser = async (userId) => {
  try {
    // Get user's active free subscription
    const subscription = await User_Subscription.findOne({
      where: {
        user_id: userId,
        status: "active",
      },
      include: [
        {
          model: Subscription_Price,
          attributes: ["subscription_price_id", "billing_type"],
          include: [
            {
              model: Subscription_Plan,
              attributes: [
                "subscription_plan_id",
                "code",
                "monthly_ai_token_quota",
              ],
              where: { code: "free" },
            },
          ],
        },
      ],
    });

    if (!subscription || !subscription.Subscription_Price) {
      return { success: false, message: "No active free subscription found" };
    }

    const monthlyQuota =
      subscription.Subscription_Price.Subscription_Plan.monthly_ai_token_quota;

    // Get or create wallet
    let wallet = await db.User_Token_Wallet.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = await db.User_Token_Wallet.create({
        user_id: userId,
        token_balance: monthlyQuota,
        updated_at: new Date(),
      });
    } else {
      // RESET to monthly quota (not add)
      await db.User_Token_Wallet.update(
        { token_balance: monthlyQuota, updated_at: new Date() },
        { where: { user_id: userId } },
      );
    }

    console.log(
      `Refreshed free tokens for user ${userId}: reset to ${monthlyQuota} tokens`,
    );
    return {
      success: true,
      message: "Free tokens refreshed",
      tokens: monthlyQuota,
    };
  } catch (error) {
    console.error("Error refreshing free tokens:", error);
    throw new Error(`Error refreshing free tokens: ${error.message}`);
  }
};

// Handle subscription expiry - auto-renew or downgrade to free
export const handleExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    const { Op } = require("sequelize");

    // Find all active subscriptions that have expired
    const expiredSubscriptions = await User_Subscription.findAll({
      where: {
        status: "active",
        expired_at: { [Op.lte]: now },
      },
      include: [
        {
          model: Subscription_Price,
          attributes: [
            "subscription_price_id",
            "billing_type",
            "duration_days",
          ],
          include: [
            {
              model: Subscription_Plan,
              attributes: [
                "subscription_plan_id",
                "code",
                "monthly_ai_token_quota",
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["user_id", "user_name"],
        },
      ],
    });

    console.log(
      `Found ${expiredSubscriptions.length} expired subscriptions to process`,
    );
    const results = [];

    for (const subscription of expiredSubscriptions) {
      try {
        const userId = subscription.user_id;

        // Check if user canceled this subscription
        const canceledSubscription = await User_Subscription.findOne({
          where: {
            user_id: userId,
            subscription_price_id: subscription.subscription_price_id,
            status: "canceled",
          },
          order: [["created_at", "DESC"]],
        });

        // Mark current subscription as expired
        subscription.status = "expired";
        await subscription.save();

        if (canceledSubscription) {
          // User canceled - downgrade to free plan
          console.log(`User ${userId} canceled - downgrading to free plan`);

          const freePrice = await Subscription_Price.findOne({
            include: [
              {
                model: Subscription_Plan,
                where: { code: "free" },
              },
            ],
            where: { billing_type: "free" },
          });

          if (freePrice) {
            // Create new free subscription
            await createSubscription(
              userId,
              freePrice.subscription_price_id,
              null,
            );

            // Reset tokens to free plan quota
            const monthlyQuota =
              freePrice.Subscription_Plan.monthly_ai_token_quota;
            let wallet = await db.User_Token_Wallet.findOne({
              where: { user_id: userId },
            });

            if (!wallet) {
              await db.User_Token_Wallet.create({
                user_id: userId,
                token_balance: monthlyQuota,
                updated_at: new Date(),
              });
              console.log(
                `Created wallet for user ${userId} with ${monthlyQuota} free tokens`,
              );
            } else {
              // RESET to free tokens quota (discard previous balance)
              await db.User_Token_Wallet.update(
                { token_balance: monthlyQuota, updated_at: new Date() },
                { where: { user_id: userId } },
              );
              console.log(
                `Updated wallet for user ${userId}: reset to ${monthlyQuota} free tokens`,
              );
            }

            results.push({
              user_id: userId,
              action: "downgraded_to_free",
              tokens_reset_to: monthlyQuota,
            });
          }
        } else {
          // No cancellation - auto-renew the subscription
          console.log(`User ${userId} - auto-renewing subscription`);

          const newSubscription = await createSubscription(
            userId,
            subscription.subscription_price_id,
            subscription.order_id,
          );

          // Don't add tokens for paid plans - token consumption continues
          results.push({
            user_id: userId,
            action: "auto_renewed",
            new_subscription_id: newSubscription.user_subscription_id,
            renewed_until: newSubscription.expired_at,
          });
        }
      } catch (error) {
        console.error(
          `Error processing subscription ${subscription.user_subscription_id}:`,
          error,
        );
        results.push({
          user_id: subscription.user_id,
          action: "error",
          error: error.message,
        });
      }
    }

    console.log(`Processed ${results.length} expired subscriptions`);
    return {
      success: true,
      message: `Processed ${results.length} expired subscriptions`,
      results,
    };
  } catch (error) {
    console.error("Error handling expired subscriptions:", error);
    throw new Error(`Error handling expired subscriptions: ${error.message}`);
  }
};

// Auto-renew active subscriptions before expiry (optional - proactive renewal)
export const autoRenewUpcomingSubscriptions = async (daysBeforeExpiry = 7) => {
  try {
    const { Op } = require("sequelize");
    const now = new Date();
    const renewalDate = new Date(
      now.getTime() + daysBeforeExpiry * 24 * 60 * 60 * 1000,
    );

    // Find active subscriptions expiring soon that aren't canceled
    const upcomingSubscriptions = await User_Subscription.findAll({
      where: {
        status: "active",
        expired_at: {
          [Op.gt]: now,
          [Op.lte]: renewalDate,
        },
      },
      include: [
        {
          model: Subscription_Price,
          include: [
            {
              model: Subscription_Plan,
              attributes: ["code"],
            },
          ],
        },
      ],
    });

    const results = [];

    for (const subscription of upcomingSubscriptions) {
      try {
        // Check if subscription is marked as canceled
        if (subscription.status !== "canceled") {
          // Create renewal subscription proactively
          const newSubscription = await createSubscription(
            subscription.user_id,
            subscription.subscription_price_id,
            subscription.order_id,
          );

          results.push({
            user_id: subscription.user_id,
            action: "proactive_renewal",
            new_subscription_id: newSubscription.user_subscription_id,
          });
        }
      } catch (error) {
        console.error(
          `Error renewing subscription ${subscription.user_subscription_id}:`,
          error,
        );
      }
    }

    console.log(`Proactively renewed ${results.length} subscriptions`);
    return {
      success: true,
      message: `Proactively renewed ${results.length} subscriptions`,
      results,
    };
  } catch (error) {
    console.error("Error in auto-renew upcoming subscriptions:", error);
    throw new Error(
      `Error in auto-renew upcoming subscriptions: ${error.message}`,
    );
  }
};
