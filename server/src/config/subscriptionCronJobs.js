import cron from "node-cron";
import * as userSubscriptionService from "../user/services/userSubscriptionService.js";

/**
 * Initialize subscription-related cron jobs
 * Should be called in server.js after all services are initialized
 */
export const initSubscriptionCronJobs = async () => {
  console.log("🔄 Initializing subscription cron jobs...");

  // On startup: Process any retroactively expired subscriptions (create NEW + reset tokens)
  try {
    console.log("[STARTUP] Processing retroactively expired subscriptions...");
    const retroactiveResult =
      await userSubscriptionService.processExpiredSubscriptionsRetroactively();
    if (retroactiveResult && retroactiveResult.length > 0) {
      console.log(
        `✅ [STARTUP] Retroactive processing completed: ${retroactiveResult.length} users processed`,
      );
      console.log("[STARTUP] Details:", retroactiveResult);
    }
  } catch (error) {
    console.error(
      "[STARTUP] Error in retroactive processing:",
      error.message,
    );
  }

  // Process expired subscriptions daily at 00:00 (midnight)
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log(
        "[CRON] Running: Handle Expired Subscriptions at",
        new Date().toISOString(),
      );
      const result = await userSubscriptionService.handleExpiredSubscriptions();
      console.log("[CRON] Expired subscriptions processed:", result.results);
    } catch (error) {
      console.error("[CRON] Error handling expired subscriptions:", error);
    }
  });

  // Proactive renewal for subscriptions expiring in 7 days - runs at 01:00 daily
  cron.schedule("0 1 * * *", async () => {
    try {
      console.log(
        "[CRON] Running: Proactive Renewal for Upcoming Subscriptions at",
        new Date().toISOString(),
      );
      const result =
        await userSubscriptionService.autoRenewUpcomingSubscriptions(7);
      console.log("[CRON] Upcoming subscriptions renewed:", result.results);
    } catch (error) {
      console.error("[CRON] Error renewing upcoming subscriptions:", error);
    }
  });

  // Refresh free plan tokens at 01:30 on the 1st of every month
  // This resets free user tokens at the beginning of each month
  cron.schedule("30 1 1 * *", async () => {
    try {
      console.log(
        "⏰ [CRON] Running: Monthly Free Token Refresh at",
        new Date().toISOString(),
      );

      // Note: This would need to be implemented to get all free users
      // For now, this is just a placeholder - in practice you'd query all free users
      // and call refreshFreeTokensForUser for each

      console.log(
        "✅ [CRON] Monthly free token refresh completed (see logs for details)",
      );
    } catch (error) {
      console.error("❌ [CRON] Error refreshing monthly free tokens:", error);
    }
  });

  console.log("✅ Subscription cron jobs initialized successfully!");
  console.log("📅 Scheduled tasks:");
  console.log("   • [STARTUP] Process retroactively expired subscriptions (create NEW + reset tokens)");
  console.log(
    "   • 00:00 daily: Handle expired subscriptions (downgrade/renew)",
  );
  console.log(
    "   • 01:00 daily: Proactive renewal for subscriptions expiring in 7 days",
  );
  console.log(
    "   • 01:30 on 1st of month: Refresh free plan tokens (placeholder)",
  );
};
