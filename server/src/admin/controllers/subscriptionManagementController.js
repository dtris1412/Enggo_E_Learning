import * as userSubscriptionService from "../../user/services/userSubscriptionService.js";

// Trigger processing of expired subscriptions (admin endpoint)
export const triggerExpiredSubscriptionsHandling = async (req, res) => {
  try {
    console.log(
      "Admin triggered expired subscriptions handling at:",
      new Date().toISOString(),
    );

    const result = await userSubscriptionService.handleExpiredSubscriptions();

    res.status(200).json({
      success: true,
      message: "Expired subscriptions processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing expired subscriptions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error processing expired subscriptions",
    });
  }
};

// Trigger proactive renewal of upcoming subscriptions (admin endpoint)
export const triggerUpcomingSubscriptionsRenewal = async (req, res) => {
  try {
    const { daysBeforeExpiry } = req.body || {};
    const days = daysBeforeExpiry || 7;

    console.log(
      `Admin triggered proactive renewal for subscriptions expiring in ${days} days at:`,
      new Date().toISOString(),
    );

    const result =
      await userSubscriptionService.autoRenewUpcomingSubscriptions(days);

    res.status(200).json({
      success: true,
      message: "Upcoming subscriptions renewal triggered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error renewing upcoming subscriptions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error renewing upcoming subscriptions",
    });
  }
};

// Refresh free tokens for a specific user (admin endpoint)
export const refreshUserFreeTokens = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    console.log(`Admin triggered token refresh for user ${userId}`);

    const result = await userSubscriptionService.refreshFreeTokensForUser(
      parseInt(userId),
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      message: "Free tokens refreshed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error refreshing free tokens:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error refreshing free tokens",
    });
  }
};
