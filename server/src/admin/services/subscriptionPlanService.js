import db from "../../models/index.js";
import { Op } from "sequelize";

// Lấy tất cả subscription plans với phân trang
const getSubscriptionPlansPaginated = async ({
  page = 1,
  limit = 20,
  is_active = null,
  search = "",
}) => {
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Filter theo is_active
  if (is_active !== null && is_active !== undefined && is_active !== "") {
    whereClause.is_active = is_active === "true" || is_active === true;
  }

  // Search theo name hoặc code
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { code: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await db.Subscription_Plan.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.Subscription_Price,
        attributes: [
          "subscription_price_id",
          "billing_type",
          "duration_days",
          "price",
          "discount_percentage",
          "is_active",
        ],
      },
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [["subscription_plan_id", "ASC"]],
  });

  return {
    subscriptionPlans: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy subscription plan theo ID
const getSubscriptionPlanById = async (subscription_plan_id) => {
  const subscriptionPlan = await db.Subscription_Plan.findOne({
    where: { subscription_plan_id },
    include: [
      {
        model: db.Subscription_Price,
        attributes: [
          "subscription_price_id",
          "billing_type",
          "duration_days",
          "price",
          "discount_percentage",
          "is_active",
        ],
      },
    ],
  });

  return subscriptionPlan;
};

// Cập nhật subscription plan
const updateSubscriptionPlan = async (subscription_plan_id, data) => {
  const subscriptionPlan =
    await db.Subscription_Plan.findByPk(subscription_plan_id);

  if (!subscriptionPlan) {
    throw new Error("Subscription plan not found");
  }

  // Nếu cập nhật code, kiểm tra code mới có bị trùng không
  if (data.code && data.code !== subscriptionPlan.code) {
    const existingPlan = await db.Subscription_Plan.findOne({
      where: {
        code: data.code,
        subscription_plan_id: { [Op.ne]: subscription_plan_id },
      },
    });

    if (existingPlan) {
      throw new Error("Subscription plan with this code already exists");
    }
  }

  await subscriptionPlan.update(data);

  return subscriptionPlan;
};

// Xóa subscription plan
const deleteSubscriptionPlan = async (subscription_plan_id) => {
  const subscriptionPlan =
    await db.Subscription_Plan.findByPk(subscription_plan_id);

  if (!subscriptionPlan) {
    throw new Error("Subscription plan not found");
  }

  // Kiểm tra xem có subscription prices nào liên quan không
  const pricesCount = await db.Subscription_Price.count({
    where: { subscription_plan_id },
  });

  if (pricesCount > 0) {
    throw new Error(
      "Cannot delete subscription plan that has associated prices. Please delete all prices first.",
    );
  }

  await subscriptionPlan.destroy();

  return { message: "Subscription plan deleted successfully" };
};

// Toggle is_active status
const toggleSubscriptionPlanStatus = async (subscription_plan_id) => {
  const subscriptionPlan =
    await db.Subscription_Plan.findByPk(subscription_plan_id);

  if (!subscriptionPlan) {
    throw new Error("Subscription plan not found");
  }

  await subscriptionPlan.update({ is_active: !subscriptionPlan.is_active });

  return subscriptionPlan;
};

export default {
  getSubscriptionPlansPaginated,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  toggleSubscriptionPlanStatus,
};
