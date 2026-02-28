import db from "../../models/index.js";
import { Op } from "sequelize";

// Helper function để tính giá cuối cùng sau khi áp dụng discount
const calculateFinalPrice = (price, discount_percentage) => {
  if (!discount_percentage || discount_percentage === 0) {
    return price;
  }
  const discount = (price * discount_percentage) / 100;
  return Math.round(price - discount);
};

// Lấy tất cả subscription prices với phân trang
const getSubscriptionPricesPaginated = async ({
  page = 1,
  limit = 20,
  subscription_plan_id = null,
  billing_type = null,
  is_active = null,
}) => {
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Filter theo subscription_plan_id
  if (subscription_plan_id) {
    whereClause.subscription_plan_id = subscription_plan_id;
  }

  // Filter theo billing_type
  if (billing_type) {
    whereClause.billing_type = billing_type;
  }

  // Filter theo is_active
  if (is_active !== null && is_active !== undefined && is_active !== "") {
    whereClause.is_active = is_active === "true" || is_active === true;
  }

  const { count, rows } = await db.Subscription_Price.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.Subscription_Plan,
        attributes: [
          "subscription_plan_id",
          "name",
          "code",
          "monthly_ai_token_quota",
          "features",
        ],
      },
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [["subscription_price_id", "ASC"]],
  });

  // Thêm final_price vào mỗi row
  const rowsWithFinalPrice = rows.map((row) => {
    const rowData = row.toJSON();
    rowData.final_price = calculateFinalPrice(
      rowData.price,
      rowData.discount_percentage,
    );
    return rowData;
  });

  return {
    subscriptionPrices: rowsWithFinalPrice,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy subscription prices theo plan ID
const getSubscriptionPricesByPlanId = async (subscription_plan_id) => {
  const prices = await db.Subscription_Price.findAll({
    where: { subscription_plan_id },
    order: [["billing_type", "ASC"]],
  });

  // Thêm final_price vào mỗi price
  const pricesWithFinalPrice = prices.map((price) => {
    const priceData = price.toJSON();
    priceData.final_price = calculateFinalPrice(
      priceData.price,
      priceData.discount_percentage,
    );
    return priceData;
  });

  return pricesWithFinalPrice;
};

// Lấy subscription price theo ID
const getSubscriptionPriceById = async (subscription_price_id) => {
  const subscriptionPrice = await db.Subscription_Price.findOne({
    where: { subscription_price_id },
    include: [
      {
        model: db.Subscription_Plan,
        attributes: [
          "subscription_plan_id",
          "name",
          "code",
          "monthly_ai_token_quota",
          "features",
        ],
      },
    ],
  });

  if (!subscriptionPrice) {
    return null;
  }

  const priceData = subscriptionPrice.toJSON();
  priceData.final_price = calculateFinalPrice(
    priceData.price,
    priceData.discount_percentage,
  );

  return priceData;
};

// Cập nhật subscription price
const updateSubscriptionPrice = async (subscription_price_id, data) => {
  const subscriptionPrice = await db.Subscription_Price.findByPk(
    subscription_price_id,
  );

  if (!subscriptionPrice) {
    throw new Error("Subscription price not found");
  }

  // Validate billing_type nếu có thay đổi
  if (data.billing_type) {
    const validBillingTypes = ["monthly", "yearly", "weekly"];
    if (!validBillingTypes.includes(data.billing_type)) {
      throw new Error(
        "Invalid billing_type. Must be: monthly, yearly, or weekly",
      );
    }

    // Kiểm tra xem billing_type mới có bị trùng với price khác của cùng plan không
    if (data.billing_type !== subscriptionPrice.billing_type) {
      const existingPrice = await db.Subscription_Price.findOne({
        where: {
          subscription_plan_id: subscriptionPrice.subscription_plan_id,
          billing_type: data.billing_type,
          subscription_price_id: { [Op.ne]: subscription_price_id },
        },
      });

      if (existingPrice) {
        throw new Error(
          "A price with this billing type already exists for this plan",
        );
      }
    }
  }

  await subscriptionPrice.update(data);

  const updatedPrice = await db.Subscription_Price.findByPk(
    subscription_price_id,
  );
  const priceData = updatedPrice.toJSON();
  priceData.final_price = calculateFinalPrice(
    priceData.price,
    priceData.discount_percentage,
  );

  return priceData;
};

// Xóa subscription price
const deleteSubscriptionPrice = async (subscription_price_id) => {
  const subscriptionPrice = await db.Subscription_Price.findByPk(
    subscription_price_id,
  );

  if (!subscriptionPrice) {
    throw new Error("Subscription price not found");
  }

  // Kiểm tra xem có user subscriptions nào đang sử dụng price này không
  const subscriptionsCount = await db.User_Subscription.count({
    where: { subscription_price_id },
  });

  if (subscriptionsCount > 0) {
    throw new Error(
      "Cannot delete subscription price that is currently in use by user subscriptions",
    );
  }

  await subscriptionPrice.destroy();

  return { message: "Subscription price deleted successfully" };
};

// Toggle is_active status
const toggleSubscriptionPriceStatus = async (subscription_price_id) => {
  const subscriptionPrice = await db.Subscription_Price.findByPk(
    subscription_price_id,
  );

  if (!subscriptionPrice) {
    throw new Error("Subscription price not found");
  }

  await subscriptionPrice.update({ is_active: !subscriptionPrice.is_active });

  const priceData = subscriptionPrice.toJSON();
  priceData.final_price = calculateFinalPrice(
    priceData.price,
    priceData.discount_percentage,
  );

  return priceData;
};

export default {
  getSubscriptionPricesPaginated,
  getSubscriptionPricesByPlanId,
  getSubscriptionPriceById,
  updateSubscriptionPrice,
  deleteSubscriptionPrice,
  toggleSubscriptionPriceStatus,
  calculateFinalPrice, // Export để có thể sử dụng ở controller nếu cần
};
