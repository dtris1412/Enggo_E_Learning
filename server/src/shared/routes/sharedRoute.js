import express from "express";

// ===========Auth Controllers===========
import {
  register,
  login,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

const initSharedRoutes = (app) => {
  //===========Auth Routes===========
  router.post("/api/register", register);
  router.post("/api/login", login);
  router.post("/api/refresh-token", refreshToken);
  app.use("/", router);
};

export default initSharedRoutes;
