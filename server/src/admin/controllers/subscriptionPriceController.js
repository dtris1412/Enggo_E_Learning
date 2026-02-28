import subscriptionPriceService from "../services/subscriptionPriceService.js";

// Lấy danh sách subscription prices với phân trang
const getSubscriptionPricesPaginated = async (req, res) => {
  try {
    const { page, limit, subscription_plan_id, billing_type, is_active } =
      req.query;

    const result =
      await subscriptionPriceService.getSubscriptionPricesPaginated({
        page,
        limit,
        subscription_plan_id,
        billing_type,
        is_active,
      });

    return res.status(200).json({
      success: true,
      message: "Subscription prices retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get subscription prices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscription prices",
      error: error.message,
    });
  }
};

// Lấy subscription prices theo plan ID
const getSubscriptionPricesByPlanId = async (req, res) => {
  try {
    const { subscription_plan_id } = req.params;

    const prices =
      await subscriptionPriceService.getSubscriptionPricesByPlanId(
        subscription_plan_id,
      );

    return res.status(200).json({
      success: true,
      message: "Subscription prices retrieved successfully",
      data: prices,
    });
  } catch (error) {
    console.error("Get subscription prices by plan error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscription prices",
      error: error.message,
    });
  }
};

// Lấy subscription price theo ID
const getSubscriptionPriceById = async (req, res) => {
  try {
    const { subscription_price_id } = req.params;

    const subscriptionPrice =
      await subscriptionPriceService.getSubscriptionPriceById(
        subscription_price_id,
      );

    if (!subscriptionPrice) {
      return res.status(404).json({
        success: false,
        message: "Subscription price not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription price retrieved successfully",
      data: subscriptionPrice,
    });
  } catch (error) {
    console.error("Get subscription price error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscription price",
      error: error.message,
    });
  }
};

// Cập nhật subscription price
const updateSubscriptionPrice = async (req, res) => {
  try {
    const { subscription_price_id } = req.params;
    const {
      billing_type,
      duration_days,
      price,
      discount_percentage,
      is_active,
    } = req.body;

    const updateData = {};

    // Validate và thêm billing_type nếu có
    if (billing_type) {
      const validBillingTypes = ["monthly", "yearly", "weekly"];
      if (!validBillingTypes.includes(billing_type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid billing_type. Must be: monthly, yearly, or weekly",
        });
      }
      updateData.billing_type = billing_type;
    }

    // Validate và thêm duration_days nếu có
    if (duration_days !== undefined) {
      if (isNaN(duration_days) || duration_days <= 0) {
        return res.status(400).json({
          success: false,
          message: "duration_days must be a positive number",
        });
      }
      updateData.duration_days = parseInt(duration_days);
    }

    // Validate và thêm price nếu có
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "price must be a non-negative number",
        });
      }
      updateData.price = parseInt(price);
    }

    // Validate và thêm discount_percentage nếu có
    if (discount_percentage !== undefined) {
      if (discount_percentage === null || discount_percentage === "") {
        updateData.discount_percentage = null;
      } else if (
        isNaN(discount_percentage) ||
        discount_percentage < 0 ||
        discount_percentage > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "discount_percentage must be between 0 and 100",
        });
      } else {
        updateData.discount_percentage = parseFloat(discount_percentage);
      }
    }

    if (is_active !== undefined) updateData.is_active = is_active;

    const subscriptionPrice =
      await subscriptionPriceService.updateSubscriptionPrice(
        subscription_price_id,
        updateData,
      );

    return res.status(200).json({
      success: true,
      message: "Subscription price updated successfully",
      data: subscriptionPrice,
    });
  } catch (error) {
    console.error("Update subscription price error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update subscription price",
      error: error.message,
    });
  }
};

// Xóa subscription price
const deleteSubscriptionPrice = async (req, res) => {
  try {
    const { subscription_price_id } = req.params;

    await subscriptionPriceService.deleteSubscriptionPrice(
      subscription_price_id,
    );

    return res.status(200).json({
      success: true,
      message: "Subscription price deleted successfully",
    });
  } catch (error) {
    console.error("Delete subscription price error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete subscription price",
      error: error.message,
    });
  }
};

// Toggle is_active status
const toggleSubscriptionPriceStatus = async (req, res) => {
  try {
    const { subscription_price_id } = req.params;

    const subscriptionPrice =
      await subscriptionPriceService.toggleSubscriptionPriceStatus(
        subscription_price_id,
      );

    return res.status(200).json({
      success: true,
      message: "Subscription price status toggled successfully",
      data: subscriptionPrice,
    });
  } catch (error) {
    console.error("Toggle subscription price status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle subscription price status",
      error: error.message,
    });
  }
};

export {
  getSubscriptionPricesPaginated,
  getSubscriptionPricesByPlanId,
  getSubscriptionPriceById,
  updateSubscriptionPrice,
  deleteSubscriptionPrice,
  toggleSubscriptionPriceStatus,
};
