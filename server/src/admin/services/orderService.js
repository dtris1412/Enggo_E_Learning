import db from "../../models/index.js";

const { Order, User, Subscription_Price, Subscription_Plan, Payment } = db;

// Get all orders (admin)
export const getAllOrders = async (
  page = 1,
  limit = 10,
  status = "",
  search = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== "") {
      where.status = status;
    }

    // Search by user name, email or order content
    let include = [
      {
        model: User,
        attributes: ["user_id", "user_name", "full_name", "user_email"],
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
            attributes: ["subscription_plan_id", "name", "code"],
          },
        ],
      },
    ];

    if (search) {
      include[0].where = {
        [db.Sequelize.Op.or]: [
          { user_name: { [db.Sequelize.Op.like]: `%${search}%` } },
          { full_name: { [db.Sequelize.Op.like]: `%${search}%` } },
          { user_email: { [db.Sequelize.Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include,
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
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
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
            "transaction_code",
            "amount",
            "payment_date",
            "status",
          ],
        },
      ],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

// Create order
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

    return order;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    return order;
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

// Get order statistics (admin)
export const getOrderStatistics = async () => {
  try {
    const stats = await Order.findAll({
      attributes: [
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("order_id")), "count"],
        [db.sequelize.fn("SUM", db.sequelize.col("amount")), "total_amount"],
      ],
      group: ["status"],
      raw: true,
    });

    return stats;
  } catch (error) {
    throw new Error(`Error fetching order statistics: ${error.message}`);
  }
};
