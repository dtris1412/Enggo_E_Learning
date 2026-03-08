import db from "../../models/index.js";

/**
 * Get all subscription plans with their prices
 * @param {string} billing_type - Optional filter: 'monthly', 'yearly', or 'weekly'
 * @returns {object} - { success, data, message }
 */
const getAllSubscriptionPlans = async (billing_type = null) => {
  try {
    // Build where clause for Subscription_Price if billing_type is provided
    const priceWhere = billing_type
      ? { billing_type, is_active: true }
      : { is_active: true };

    const subscriptionPlans = await db.Subscription_Plan.findAll({
      where: { is_active: true },
      attributes: [
        "subscription_plan_id",
        "name",
        "features",
        "monthly_ai_token_quota",
        "code",
        "is_active",
      ],
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
          where: priceWhere,
          required: false, // Use LEFT JOIN to include plans even if no matching prices
        },
      ],
      order: [
        ["subscription_plan_id", "ASC"],
        [db.Subscription_Price, "billing_type", "ASC"],
      ],
    });

    // Format response data
    const formattedData = subscriptionPlans.map((plan) => {
      const planData = plan.toJSON();

      // Ensure features is an object
      // The getter in the model should handle this, but double-check here
      if (typeof planData.features === "string") {
        try {
          planData.features = JSON.parse(planData.features);
        } catch (e) {
          console.error(
            "Error parsing features JSON for plan:",
            planData.name,
            e,
          );
          planData.features = {};
        }
      } else if (!planData.features) {
        // If features is null or undefined, set to empty object
        planData.features = {};
      }

      return planData;
    });

    return {
      success: true,
      data: formattedData,
      count: formattedData.length,
      message: billing_type
        ? `Successfully retrieved ${formattedData.length} subscription plan(s) with ${billing_type} billing.`
        : `Successfully retrieved ${formattedData.length} subscription plan(s).`,
    };
  } catch (error) {
    console.error("Error in getAllSubscriptionPlans service:", error);
    return {
      success: false,
      message: "Failed to retrieve subscription plans.",
      error: error.message,
    };
  }
};

export { getAllSubscriptionPlans };
