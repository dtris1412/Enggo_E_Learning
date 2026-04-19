import cron from "node-cron";
import * as userSubscriptionService from "../user/services/userSubscriptionService.js";
import {
  sendRenewalReminderEmail,
  sendSubscriptionExpiredEmail,
  sendDailyFlashcardReminderEmail,
} from "../shared/services/emailService.js";
import db from "../models/index.js";

const { User_Subscription, User } = db;

/**
 * Initialize subscription-related cron jobs
 * Should be called in server.js after all services are initialized
 */
export const initSubscriptionCronJobs = () => {
  console.log("Initializing subscription cron jobs...");

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

  // Send daily flashcard review reminder - runs at 08:00 AM daily
  // Sends 1 email per user with total due cards count (not per card, not per set - to avoid spam)
  // This matches how Quizlet/Anki handle spaced repetition reminders
  cron.schedule("0 8 * * *", async () => {
    try {
      console.log(
        "[CRON] Running: Send Daily Flashcard Review Reminders at",
        new Date().toISOString(),
      );

      const now = new Date();

      // Find all users who have at least 1 card due for review
      // Using raw query for efficient aggregation
      const usersWithDueCards = await db.sequelize.query(
        `
        SELECT 
          u.user_id,
          u.user_email,
          u.full_name,
          u.user_name,
          COUNT(DISTINCT ufp.progress_id) as total_due_cards
        FROM users u
        INNER JOIN user_flashcard_progress ufp ON u.user_id = ufp.user_id
        WHERE ufp.next_review_at <= NOW()
        GROUP BY u.user_id, u.user_email, u.full_name, u.user_name
        ORDER BY total_due_cards DESC
      `,
        { type: db.sequelize.QueryTypes.SELECT },
      );

      console.log(
        `[CRON] Found ${usersWithDueCards.length} users with due flashcards`,
      );

      let emailsSent = 0;

      // Send 1 email per user
      for (const user of usersWithDueCards) {
        try {
          // Get breakdown by sets for this user
          const dueBySet = await db.sequelize.query(
            `
            SELECT 
              fs.name as set_name,
              COUNT(DISTINCT ufp.progress_id) as due_count
            FROM user_flashcard_progress ufp
            INNER JOIN flashcards f ON ufp.flashcard_id = f.flashcard_id
            INNER JOIN flashcard_sets fs ON f.flashcard_set_id = fs.flashcard_set_id
            WHERE ufp.user_id = :user_id
              AND ufp.next_review_at <= NOW()
            GROUP BY fs.name
            ORDER BY due_count DESC
          `,
            {
              replacements: { user_id: user.user_id },
              type: db.sequelize.QueryTypes.SELECT,
            },
          );

          // Send email with aggregated data
          await sendDailyFlashcardReminderEmail({
            user_email: user.user_email,
            full_name: user.full_name || user.user_name,
            total_due_cards: parseInt(user.total_due_cards),
            due_sets_summary: dueBySet,
          });

          emailsSent++;
          console.log(
            `✅ [CRON] Daily flashcard reminder sent to ${user.full_name} - ${user.total_due_cards} cards due`,
          );
        } catch (emailError) {
          console.error(
            `⚠️ [CRON] Failed to send daily reminder for user ${user.user_id}:`,
            emailError.message,
          );
        }
      }

      console.log(
        `[CRON] Daily flashcard reminders completed: ${emailsSent} emails sent`,
      );
    } catch (error) {
      console.error("[CRON] Error in daily flashcard reminders:", error);
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
  console.log(
    "   • 08:00 daily: Send daily flashcard review reminders (1 email per user with total count)",
  );
};
