import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import db from "../../models/index.js";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Tìm hoặc tạo user trong DB
      let user = await db.User.findOne({ where: { google_id: profile.id } });
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
      }
      return done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await db.User.findOne({ where: { facebook_id: profile.id } });
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
      }
      return done(null, user);
    }
  )
);

export default passport;
