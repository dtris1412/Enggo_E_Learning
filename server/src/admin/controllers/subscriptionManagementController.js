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

// Refresh free tokens for ALL free plan users (batch)
export const triggerRefreshAllFreeTokens = async (req, res) => {
  try {
    console.log(
      "Admin triggered refresh all free users tokens at:",
      new Date().toISOString(),
    );

    // Get all users with active free subscriptions
    const activeUsers = await userSubscriptionService.getActiveFreePlanUsers();

    if (!activeUsers || activeUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active free plan users found",
        data: { processed: 0, results: [] },
      });
    }

    console.log(
      `Found ${activeUsers.length} active free plan users to refresh`,
    );

    const results = [];

    // Process each user's free subscription renewal
    for (const user of activeUsers) {
      try {
        const result = await userSubscriptionService.refreshFreeTokensForUser(
          user.user_id,
        );
        results.push({
          user_id: user.user_id,
          success: result.success,
          ...result,
        });
        console.log(
          `Refreshed free tokens for user ${user.user_id}: ${result.message}`,
        );
      } catch (error) {
        console.error(
          `Error refreshing tokens for user ${user.user_id}:`,
          error,
        );
        results.push({
          user_id: user.user_id,
          success: false,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Refreshed tokens for ${activeUsers.length} free plan users`,
      data: {
        processed: activeUsers.length,
        results,
      },
    });
  } catch (error) {
    console.error("Error refreshing all free tokens:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error refreshing all free tokens",
    });
  }
};

// Process retroactively expired subscriptions (admin endpoint)
export const triggerRetroactiveExpiredProcessing = async (req, res) => {
  try {
    console.log(
      "Admin triggered retroactive expired subscriptions processing at:",
      new Date().toISOString(),
    );

    const result =
      await userSubscriptionService.processExpiredSubscriptionsRetroactively();

    res.status(200).json({
      success: true,
      message: "Retroactive subscription processing completed",
      data: result,
    });
  } catch (error) {
    console.error("Error in retroactive subscription processing:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error in retroactive subscription processing",
    });
  }
};
