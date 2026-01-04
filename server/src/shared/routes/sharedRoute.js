import express from "express";

// ===========Auth Controllers===========
import { register, login } from "../controllers/authController.js";

const router = express.Router();

const initSharedRoutes = (app) => {
  //===========Auth Routes===========
  router.post("/api/register", register);
  router.post("/api/login", login);
  app.use("/", router);
};

export default initSharedRoutes;
