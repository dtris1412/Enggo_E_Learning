import db from "../../models/index.js";

const { Order, Subscription_Price, Subscription_Plan, Payment } = db;

// Get user's orders
export const getUserOrders = async (
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

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
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
                "features",
              ],
            },
          ],
        },
        {
          model: Payment,
          attributes: [
            "payment_id",
            "payment_method",
            "status",
            "payment_date",
          ],
        },
      ],
      offset,
      limit,
      order: [["order_date", "DESC"]],
    });

    return {
      orders: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};

// Get order by ID (with ownership check)
export const getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
      include: [
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
                "features",
              ],
            },
          ],
        },
        {
          model: Payment,
          attributes: [
            "payment_id",
            "payment_method",
            "provider",
            "amount",
            "payment_date",
            "status",
          ],
        },
      ],
    });

    if (!order) {
      throw new Error(
        "Order not found or you don't have permission to view it",
      );
    }

    return order;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

// Create order for user
export const createOrder = async (userId, subscriptionPriceId) => {
  try {
    // Get subscription price to calculate amount
    const subscriptionPrice = await Subscription_Price.findByPk(
      subscriptionPriceId,
      {
        include: [
          {
            model: Subscription_Plan,
            attributes: ["name"],
          },
        ],
      },
    );

    if (!subscriptionPrice) {
      throw new Error("Subscription price not found");
    }

    if (!subscriptionPrice.is_active) {
      throw new Error("This subscription price is not active");
    }

    // Calculate final amount
    const price = subscriptionPrice.price;
    const discount = subscriptionPrice.discount_percentage || 0;
    const amount = price - (price * discount) / 100;

    // Create order
    const order = await Order.create({
      user_id: userId,
      subscription_price_id: subscriptionPriceId,
      status: "pending",
      amount: amount,
      content: `Subscription: ${subscriptionPrice.Subscription_Plan.name} - ${subscriptionPrice.billing_type}`,
      order_date: new Date(),
    });

    // Return order with full details
    const fullOrder = await Order.findByPk(order.order_id, {
      include: [
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
                "features",
              ],
            },
          ],
        },
      ],
    });

    return fullOrder;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};
