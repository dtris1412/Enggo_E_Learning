import { getAllSubscriptionPlans as getAllSubscriptionPlansService } from "../services/subscriptionPlanService.js";

/**
 * Get all subscription plans with their prices
 * Optional query parameter: billing_type (monthly, yearly, weekly)
 */
const getAllSubscriptionPlans = async (req, res) => {
  try {
    const { billing_type } = req.query;

    // Validate billing_type if provided
    if (
      billing_type &&
      !["monthly", "yearly", "weekly"].includes(billing_type)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid billing_type. Must be 'monthly', 'yearly', or 'weekly'.",
      });
    }

    const result = await getAllSubscriptionPlansService(billing_type);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in getAllSubscriptionPlans controller:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching subscription plans.",
    });
  }
};

export { getAllSubscriptionPlans };
