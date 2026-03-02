import * as userSubscriptionService from "../services/userSubscriptionService.js";

// Get all subscriptions (admin)
export const getAllSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const result = await userSubscriptionService.getAllSubscriptions(
      page,
      limit,
      status,
    );

    res.status(200).json({
      success: true,
      message: "All subscriptions fetched successfully",
      data: result.subscriptions,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update expired subscriptions (admin)
export const updateExpiredSubscriptions = async (req, res) => {
  try {
    const count = await userSubscriptionService.updateExpiredSubscriptions();

    res.status(200).json({
      success: true,
      message: `${count} subscription(s) updated to expired status`,
      data: { updatedCount: count },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
