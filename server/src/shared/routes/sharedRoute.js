import express from "express";

// ===========Auth Controllers===========
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

const initSharedRoutes = (app) => {
  //===========Auth Routes===========
  router.post("/api/register", register);
  router.post("/api/login", login);
  router.post("/api/refresh-token", refreshToken);
  router.post("/api/logout", logout);
  app.use("/", router);
};

export default initSharedRoutes;
