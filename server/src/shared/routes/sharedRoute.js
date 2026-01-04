import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
// ===========Auth Controllers===========
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

const initSharedRoutes = (app) => {
  //===========Auth Routes===========
  router.post("/api/register", register);
  router.post("/api/login", login);
  router.post("/api/refresh-token", refreshToken);
  router.post("/api/logout", logout);
  router.post("/api/forgot-password", forgotPassword);
  router.post("/api/reset-password", resetPassword);
  app.use("/", router);
};

export default initSharedRoutes;
