import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import db from "../../models/index.js";
import { createSubscription } from "../../user/services/userSubscriptionService.js";
import { sendWelcomeEmail } from "./emailService.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("[Google] Profile received:", {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? profile.emails.length : 0,
          });

          // Check if email exists
          if (!profile.emails || profile.emails.length === 0) {
            return done(new Error("Google profile does not have email"), null);
          }

          // Tìm hoặc tạo user trong DB
          let user = await db.User.findOne({
            where: { google_id: profile.id },
          });

          if (!user) {
            console.log(
              "[Google] Creating new user with email:",
              profile.emails[0].value,
            );
            user = await db.User.create({
              user_name: profile.emails[0].value,
              user_email: profile.emails[0].value,
              google_id: profile.id,
              full_name: profile.displayName,
              user_status: true,
              user_password: "",
              role: 2,
              created_at: new Date(),
              updated_at: new Date(),
            });
            console.log("[Google] User created:", {
              user_id: user.user_id,
              email: user.user_email,
              dataValues: user.dataValues,
            });

            // Create free subscription for new social login user
            try {
              console.log(
                "[Google] Starting wallet/subscription creation for user:",
                user.user_id,
              );
              const freePrice = await db.Subscription_Price.findOne({
                include: [
                  {
                    model: db.Subscription_Plan,
                    where: { code: "free" },
                  },
                ],
                where: { billing_type: "free" },
              });
              console.log("[Google] Free price found:", !!freePrice);

              if (freePrice) {
                // Step 1: Create wallet FIRST with tokens
                const monthlyQuota =
                  freePrice.Subscription_Plan.monthly_ai_token_quota;
                console.log(
                  "[Google] Creating wallet with quota:",
                  monthlyQuota,
                  "for user:",
                  user.user_id,
                );

                const wallet = await db.User_Token_Wallet.create({
                  user_id: user.user_id,
                  token_balance: monthlyQuota,
                  updated_at: new Date(),
                });
                console.log("[Google] Wallet created successfully:", {
                  wallet_id: wallet.id,
                  user_id: wallet.user_id,
                  balance: wallet.token_balance,
                });

                // Step 2: Create free subscription
                await createSubscription(
                  user.user_id,
                  freePrice.subscription_price_id,
                  null, // No order_id for free plan
                );
                console.log("[Google] Subscription created successfully");

                // Step 3: Send welcome email (non-blocking)
                try {
                  await sendWelcomeEmail({
                    user_email: user.user_email,
                    full_name: user.full_name || user.user_name,
                  });
                  console.log(
                    `✅ Welcome email sent to ${user.user_email} (Google)`,
                  );
                } catch (emailError) {
                  console.error(
                    `⚠️ Failed to send welcome email for Google user:`,
                    emailError.message,
                  );
                }
              } else {
                console.warn(
                  "Free subscription price not found for Google user",
                );
                // Create wallet with default quota
                const defaultQuota = 100;
                console.log(
                  "[Google] Creating fallback wallet with quota:",
                  defaultQuota,
                );
                const wallet = await db.User_Token_Wallet.create({
                  user_id: user.user_id,
                  token_balance: defaultQuota,
                  updated_at: new Date(),
                });
                console.log("[Google] Fallback wallet created:", wallet.id);
              }
            } catch (subscriptionError) {
              console.error(
                "Error creating free subscription/wallet for Google user:",
                subscriptionError.message,
                subscriptionError.stack,
              );
              // Create wallet even if subscription fails
              try {
                const defaultQuota = 100;
                console.log(
                  "[Google] Fallback catch block - creating wallet with quota:",
                  defaultQuota,
                  "for user:",
                  user.user_id,
                );
                const wallet = await db.User_Token_Wallet.create({
                  user_id: user.user_id,
                  token_balance: defaultQuota,
                  updated_at: new Date(),
                });
                console.log(
                  `Fallback: Created wallet for Google user ${user.user_id}, wallet_id:`,
                  wallet.id,
                );
              } catch (walletError) {
                console.error(
                  "Error creating wallet for Google user:",
                  walletError.message,
                  walletError.stack,
                );
              }
            }
          }
          return done(null, user);
        } catch (error) {
          console.error(
            "[Google] Error in Google OAuth callback:",
            error.message,
            error.stack,
          );
          return done(error, null);
        }
      },
    ),
  );
} else {
  console.warn(
    "[Passport] Google OAuth disabled: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set",
  );
}

if (process.env.FB_APP_ID && process.env.FB_APP_SECRET) {
  passport.use(
    new FacebookStrategy.Strategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL || "/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("[Facebook] Profile received:", {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails ? profile.emails.length : 0,
          });

          // Check if email exists
          if (!profile.emails || profile.emails.length === 0) {
            return done(
              new Error("Facebook profile does not have email"),
              null,
            );
          }

          let user = await db.User.findOne({
            where: { facebook_id: profile.id },
          });

          if (!user) {
            console.log(
              "[Facebook] Creating new user with email:",
              profile.emails[0].value,
            );
            user = await db.User.create({
              user_name: profile.emails[0].value,
              user_email: profile.emails[0].value,
              facebook_id: profile.id,
              full_name: profile.displayName,
              user_status: true,
              user_password: "",
              role: 2,
              created_at: new Date(),
              updated_at: new Date(),
            });
            console.log("[Facebook] User created:", {
              user_id: user.user_id,
              email: user.user_email,
              dataValues: user.dataValues,
            });

            // Create free subscription for new social login user
            try {
              console.log(
                "[Facebook] Starting wallet/subscription creation for user:",
                user.user_id,
              );
              const freePrice = await db.Subscription_Price.findOne({
                include: [
                  {
                    model: db.Subscription_Plan,
                    where: { code: "free" },
                  },
                ],
                where: { billing_type: "free" },
              });
              console.log("[Facebook] Free price found:", !!freePrice);

              if (freePrice) {
                // Step 1: Create wallet FIRST with tokens
                const monthlyQuota =
                  freePrice.Subscription_Plan.monthly_ai_token_quota;
                console.log(
                  "[Facebook] Creating wallet with quota:",
                  monthlyQuota,
                  "for user:",
                  user.user_id,
                );

                const wallet = await db.User_Token_Wallet.create({
                  user_id: user.user_id,
                  token_balance: monthlyQuota,
                  updated_at: new Date(),
                });
                console.log("[Facebook] Wallet created successfully:", {
                  wallet_id: wallet.id,
                  user_id: wallet.user_id,
                  balance: wallet.token_balance,
                });

                // Step 2: Create free subscription
                await createSubscription(
                  user.user_id,
                  freePrice.subscription_price_id,
                  null, // No order_id for free plan
                );
                console.log("[Facebook] Subscription created successfully");

                // Step 3: Send welcome email (non-blocking)
                try {
                  await sendWelcomeEmail({
                    user_email: user.user_email,
                    full_name: user.full_name || user.user_name,
                  });
                  console.log(
                    `✅ Welcome email sent to ${user.user_email} (Facebook)`,
                  );
                } catch (emailError) {
                  console.error(
                    `⚠️ Failed to send welcome email for Facebook user:`,
                    emailError.message,
                  );
                }
              } else {
                console.warn(
                  "Free subscription price not found for Facebook user",
                );
                // Create wallet with default quota
                const defaultQuota = 100;
                console.log(
                  "[Facebook] Creating fallback wallet with quota:",
                  defaultQuota,
                );
                const wallet = await db.User_Token_Wallet.create({
                  user_id: user.user_id,
                  token_balance: defaultQuota,
                  updated_at: new Date(),
                });
                console.log("[Facebook] Fallback wallet created:", wallet.id);
              }
            } catch (subscriptionError) {
              console.error(
                "Error creating free subscription/wallet for Facebook user:",
                subscriptionError.message,
                subscriptionError.stack,
              );
              // Create wallet even if subscription fails
              try {
                const defaultQuota = 100;
                console.log(
                  "[Facebook] Fallback catch block - creating wallet with quota:",
                  defaultQuota,
                  "for user:",
                  user.user_id,
                );
                const wallet = await db.User_Token_Wallet.create({
                  user_id: user.user_id,
                  token_balance: defaultQuota,
                  updated_at: new Date(),
                });
                console.log(
                  `Fallback: Created wallet for Facebook user ${user.user_id}, wallet_id:`,
                  wallet.id,
                );
              } catch (walletError) {
                console.error(
                  "Error creating wallet for Facebook user:",
                  walletError.message,
                  walletError.stack,
                );
              }
            }
          }
          return done(null, user);
        } catch (error) {
          console.error(
            "[Facebook] Error in Facebook OAuth callback:",
            error.message,
            error.stack,
          );
          return done(error, null);
        }
      },
    ),
  );
} else {
  console.warn(
    "[Passport] Facebook OAuth disabled: FB_APP_ID or FB_APP_SECRET not set",
  );
}

export default passport;
