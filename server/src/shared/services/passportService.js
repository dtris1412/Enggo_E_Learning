import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import db from "../../models/index.js";
import { createSubscription } from "../../user/services/userSubscriptionService.js";
import { sendWelcomeEmail } from "./emailService.js";

/**
 * Create wallet + subscription + welcome email
 */
async function createFreeResources(user) {
  try {
    console.log(
      "[Auth] Starting wallet/subscription creation for user:",
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

    if (freePrice) {
      const monthlyQuota = freePrice.Subscription_Plan.monthly_ai_token_quota;

      const wallet = await db.User_Token_Wallet.create({
        user_id: user.user_id,
        token_balance: monthlyQuota,
        updated_at: new Date(),
      });

      console.log("[Auth] Wallet created:", wallet.id);

      await createSubscription(
        user.user_id,
        freePrice.subscription_price_id,
        null,
      );

      console.log("[Auth] Subscription created");

      try {
        await sendWelcomeEmail({
          user_email: user.user_email,
          full_name: user.full_name || user.user_name,
        });

        console.log("✅ Welcome email sent to", user.user_email);
      } catch (emailError) {
        console.error("⚠️ Failed to send welcome email:", emailError.message);
      }
    } else {
      console.warn("[Auth] Free plan not found → creating default wallet");

      await db.User_Token_Wallet.create({
        user_id: user.user_id,
        token_balance: 100,
        updated_at: new Date(),
      });
    }
  } catch (error) {
    console.error(
      "[Auth] Error creating wallet/subscription:",
      error.message,
      error.stack,
    );
  }
}

//
// GOOGLE OAUTH
//
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
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
          });

          if (!profile.emails || profile.emails.length === 0) {
            return done(new Error("Google profile does not have email"), null);
          }

          const email = profile.emails[0].value.toLowerCase();

          let user = await db.User.findOne({
            where: { google_id: profile.id },
          });

          // Nếu chưa có google_id → tìm theo email
          if (!user) {
            user = await db.User.findOne({
              where: { user_email: email },
            });

            // Nếu email tồn tại → link google account
            if (user) {
              user.google_id = profile.id;
              await user.save();

              console.log(
                "[Google] Linked Google account with existing user:",
                user.user_id,
              );
            }
          }

          let isNewUser = false;

          // Nếu vẫn chưa có → tạo user mới
          if (!user) {
            try {
              user = await db.User.create({
                user_name: email,
                user_email: email,
                google_id: profile.id,
                full_name: profile.displayName,
                user_status: true,
                user_password: "",
                role: 2,
                created_at: new Date(),
                updated_at: new Date(),
              });

              isNewUser = true;
              console.log("[Google] Created new user:", email);
            } catch (createError) {
              // Handle duplicate email error
              if (
                createError.name === "SequelizeUniqueConstraintError" &&
                createError.errors.some((e) => e.path === "user_email")
              ) {
                console.log(
                  "[Google] Email already exists (unique constraint), linking account:",
                  email,
                );
                // Email exists but google_id wasn't found (race condition)
                // Try to find and link again
                user = await db.User.findOne({
                  where: { user_email: email },
                });
                if (user && !user.google_id) {
                  user.google_id = profile.id;
                  await user.save();
                  console.log(
                    "[Google] Successfully linked Google ID to existing user:",
                    user.user_id,
                  );
                }
              } else {
                throw createError; // Re-throw other errors
              }
            }
          }

          if (isNewUser) {
            await createFreeResources(user);
          }

          return done(null, user);
        } catch (error) {
          console.error("[Google] OAuth error:", error.message, error.stack);
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

//
// FACEBOOK OAUTH
//
if (process.env.FB_APP_ID && process.env.FB_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
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
          });

          if (!profile.emails || profile.emails.length === 0) {
            return done(
              new Error("Facebook profile does not have email"),
              null,
            );
          }

          const email = profile.emails[0].value.toLowerCase();

          let user = await db.User.findOne({
            where: { facebook_id: profile.id },
          });

          // Nếu chưa có facebook_id → tìm theo email
          if (!user) {
            user = await db.User.findOne({
              where: { user_email: email },
            });

            if (user) {
              user.facebook_id = profile.id;
              await user.save();

              console.log(
                "[Facebook] Linked Facebook account with existing user:",
                user.user_id,
              );
            }
          }

          let isNewUser = false;

          if (!user) {
            try {
              user = await db.User.create({
                user_name: email,
                user_email: email,
                facebook_id: profile.id,
                full_name: profile.displayName,
                user_status: true,
                user_password: "",
                role: 2,
                created_at: new Date(),
                updated_at: new Date(),
              });

              isNewUser = true;
              console.log("[Facebook] Created new user:", email);
            } catch (createError) {
              // Handle duplicate email error
              if (
                createError.name === "SequelizeUniqueConstraintError" &&
                createError.errors.some((e) => e.path === "user_email")
              ) {
                console.log(
                  "[Facebook] Email already exists (unique constraint), linking account:",
                  email,
                );
                // Email exists but facebook_id wasn't found (race condition)
                // Try to find and link again
                user = await db.User.findOne({
                  where: { user_email: email },
                });
                if (user && !user.facebook_id) {
                  user.facebook_id = profile.id;
                  await user.save();
                  console.log(
                    "[Facebook] Successfully linked Facebook ID to existing user:",
                    user.user_id,
                  );
                }
              } else {
                throw createError; // Re-throw other errors
              }
            }
          }

          if (isNewUser) {
            await createFreeResources(user);
          }

          return done(null, user);
        } catch (error) {
          console.error("[Facebook] OAuth error:", error.message, error.stack);
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
