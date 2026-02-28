import subscriptionPlanService from "../services/subscriptionPlanService.js";

// Lấy danh sách subscription plans với phân trang
const getSubscriptionPlansPaginated = async (req, res) => {
  try {
    const { page, limit, is_active, search } = req.query;

    const result = await subscriptionPlanService.getSubscriptionPlansPaginated({
      page,
      limit,
      is_active,
      search,
    });

    return res.status(200).json({
      success: true,
      message: "Subscription plans retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get subscription plans error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscription plans",
      error: error.message,
    });
  }
};

// Lấy subscription plan theo ID
const getSubscriptionPlanById = async (req, res) => {
  try {
    const { subscription_plan_id } = req.params;

    const subscriptionPlan =
      await subscriptionPlanService.getSubscriptionPlanById(
        subscription_plan_id,
      );

    if (!subscriptionPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription plan retrieved successfully",
      data: subscriptionPlan,
    });
  } catch (error) {
    console.error("Get subscription plan error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscription plan",
      error: error.message,
    });
  }
};

// Cập nhật subscription plan
const updateSubscriptionPlan = async (req, res) => {
  try {
    const { subscription_plan_id } = req.params;
    const { name, features, monthly_ai_token_quota, code, is_active } =
      req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (features !== undefined) updateData.features = features;
    if (monthly_ai_token_quota !== undefined) {
      if (isNaN(monthly_ai_token_quota) || monthly_ai_token_quota < 0) {
        return res.status(400).json({
          success: false,
          message: "monthly_ai_token_quota must be a positive number",
        });
      }
      updateData.monthly_ai_token_quota = parseInt(monthly_ai_token_quota);
    }
    if (code) updateData.code = code;
    if (is_active !== undefined) updateData.is_active = is_active;

    const subscriptionPlan =
      await subscriptionPlanService.updateSubscriptionPlan(
        subscription_plan_id,
        updateData,
      );

    return res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
      data: subscriptionPlan,
    });
  } catch (error) {
    console.error("Update subscription plan error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update subscription plan",
      error: error.message,
    });
  }
};

// Xóa subscription plan
const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { subscription_plan_id } = req.params;

    await subscriptionPlanService.deleteSubscriptionPlan(subscription_plan_id);

    return res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete subscription plan error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete subscription plan",
      error: error.message,
    });
  }
};

// Toggle is_active status
const toggleSubscriptionPlanStatus = async (req, res) => {
  try {
    const { subscription_plan_id } = req.params;

    const subscriptionPlan =
      await subscriptionPlanService.toggleSubscriptionPlanStatus(
        subscription_plan_id,
      );

    return res.status(200).json({
      success: true,
      message: "Subscription plan status toggled successfully",
      data: subscriptionPlan,
    });
  } catch (error) {
    console.error("Toggle subscription plan status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle subscription plan status",
      error: error.message,
    });
  }
};

export {
  getSubscriptionPlansPaginated,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  toggleSubscriptionPlanStatus,
};
