import express from "express";
import {
  verifyToken,
  requireAdmin,
  requireAuth,
  requireUser,
  requireRole,
} from "../../middleware/authMiddleware.js";
import passport from "../services/passportService.js";
// ===========Auth Controllers===========
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  socialLoginCallBack,
} from "../controllers/authController.js";

const router = express.Router();

const initSharedRoutes = (app) => {
  //===========Auth Routes===========
  router.post("/api/auth/register", register);
  router.post("/api/auth/login", login);
  router.post("/api/auth/refresh-token", refreshToken);
  router.post("/api/auth/logout", logout);
  router.post("/api/auth/forgot-password", forgotPassword);
  router.post("/api/auth/verify-otp", verifyOTP);
  router.post("/api/auth/reset-password", resetPassword);
  // Social Auth Routes - Google
  router.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    socialLoginCallBack
  );
  // Social Auth Routes - Facebook
  router.get(
    "/api/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );
  router.get(
    "/api/auth/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
      failureRedirect: "/login",
    }),
    socialLoginCallBack
  );

  app.use("/", router);
};

export default initSharedRoutes;
