import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import db from "../../models/index.js";
import { createSubscription } from "../../user/services/userSubscriptionService.js";

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
          // Tìm hoặc tạo user trong DB
          let user = await db.User.findOne({
            where: { google_id: profile.id },
          });
          if (!user) {
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

            // Create free subscription for new social login user
            try {
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
                await createSubscription(
                  user.user_id,
                  freePrice.subscription_price_id,
                  null, // No order_id for free plan
                );
              }
            } catch (subscriptionError) {
              console.error(
                "Error creating free subscription for Google user:",
                subscriptionError,
              );
              // Continue even if subscription creation fails
            }
          }
          return done(null, user);
        } catch (error) {
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
          let user = await db.User.findOne({
            where: { facebook_id: profile.id },
          });
          if (!user) {
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

            // Create free subscription for new social login user
            try {
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
                await createSubscription(
                  user.user_id,
                  freePrice.subscription_price_id,
                  null, // No order_id for free plan
                );
              }
            } catch (subscriptionError) {
              console.error(
                "Error creating free subscription for Facebook user:",
                subscriptionError,
              );
              // Continue even if subscription creation fails
            }
          }
          return done(null, user);
        } catch (error) {
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
