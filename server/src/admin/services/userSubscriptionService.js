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

// Get all subscriptions (admin)
export const getAllSubscriptions = async (
  page = 1,
  limit = 10,
  status = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== "") {
      where.status = status;
    }

    const { count, rows } = await User_Subscription.findAndCountAll({
      where,
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
    throw new Error(`Error fetching subscriptions: ${error.message}`);
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
export const createSubscription = async (userId, subscriptionPriceId) => {
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
      },
    );

    if (!subscriptionPrice) {
      throw new Error("Subscription price not found");
    }

    // Calculate dates
    const startedAt = new Date();
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + subscriptionPrice.duration_days);

    // Create subscription
    const subscription = await User_Subscription.create({
      user_id: userId,
      subscription_price_id: subscriptionPriceId,
      started_at: startedAt,
      expired_at: expiredAt,
      status: "active",
    });

    return subscription;
  } catch (error) {
    throw new Error(`Error creating subscription: ${error.message}`);
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await User_Subscription.findByPk(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "canceled") {
      throw new Error("Subscription is already canceled");
    }

    subscription.status = "canceled";
    await subscription.save();

    return subscription;
  } catch (error) {
    throw new Error(`Error canceling subscription: ${error.message}`);
  }
};

// Check and update expired subscriptions
export const updateExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    const expiredSubscriptions = await User_Subscription.findAll({
      where: {
        status: "active",
        expired_at: { [db.sequelize.Op.lt]: now },
      },
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = "expired";
      await subscription.save();
    }

    return {
      updatedCount: expiredSubscriptions.length,
    };
  } catch (error) {
    throw new Error(`Error updating subscriptions: ${error.message}`);
  }
};
