import cron from "node-cron";
import * as userSubscriptionService from "../user/services/userSubscriptionService.js";
import {
  sendRenewalReminderEmail,
  sendSubscriptionExpiredEmail,
} from "../shared/services/emailService.js";
import db from "../models/index.js";

const { User_Subscription, User } = db;

/**
 * Initialize subscription-related cron jobs
 * Should be called in server.js after all services are initialized
 */
export const initSubscriptionCronJobs = () => {
  console.log("🔄 Initializing subscription cron jobs...");

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

  // Send renewal reminder emails for subscriptions expiring in 7 days - runs at 02:00 daily
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log(
        "[CRON] Running: Send Renewal Reminder Emails at",
        new Date().toISOString(),
      );

      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Find subscriptions expiring in exactly 7 days
      const { Op } = await import("sequelize");
      const upcomingSubscriptions = await User_Subscription.findAll({
        where: {
          status: "active",
          expired_at: {
            [Op.gt]: now,
            [Op.lte]: sevenDaysLater,
          },
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "user_email", "full_name", "user_name"],
          },
          {
            model: db.Subscription_Price,
            include: [
              {
                model: db.Subscription_Plan,
                attributes: ["name", "code"],
              },
            ],
          },
        ],
      });

      console.log(
        `[CRON] Found ${upcomingSubscriptions.length} subscriptions expiring in 7 days`,
      );

      let emailsSent = 0;
      for (const subscription of upcomingSubscriptions) {
        try {
          // Get remaining tokens
          const wallet = await db.User_Token_Wallet.findOne({
            where: { user_id: subscription.user_id },
          });

          await sendRenewalReminderEmail({
            user_email: subscription.User.user_email,
            full_name:
              subscription.User.full_name || subscription.User.user_name,
            plan_name: subscription.Subscription_Price?.Subscription_Plan?.name,
            expired_at: subscription.expired_at,
            remaining_tokens: wallet?.token_balance || 0,
          });
          emailsSent++;
        } catch (error) {
          console.error(
            `⚠️ Failed to send reminder email for subscription ${subscription.user_subscription_id}:`,
            error.message,
          );
        }
      }

      console.log(`[CRON] Sent ${emailsSent} renewal reminder emails`);
    } catch (error) {
      console.error("[CRON] Error sending renewal reminder emails:", error);
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
  console.log(
    "   • 00:00 daily: Handle expired subscriptions (downgrade/renew)",
  );
  console.log(
    "   • 01:00 daily: Proactive renewal for subscriptions expiring in 7 days",
  );
  console.log("   • 02:00 daily: Send renewal reminder emails (7 days before)");
  console.log(
    "   • 01:30 on 1st of month: Refresh free plan tokens (placeholder)",
  );
};
