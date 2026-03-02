import express, { Router } from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";

// ===========User Token Wallet Controllers===========
import { getUserWallet } from "../controllers/userTokenWalletController.js";

// ===========User Token Transaction Controllers===========
import {
  getUserTransactions,
  getTransactionById,
} from "../controllers/userTokenTransactionController.js";

// ===========User Subscription Controllers===========
import {
  getUserActiveSubscription,
  getUserSubscriptions,
  getSubscriptionById,
  subscribeToplan,
  cancelSubscription,
} from "../controllers/userSubscriptionController.js";

// ===========Order Controllers===========
import {
  getUserOrders,
  getOrderById,
  createOrder,
} from "../controllers/orderController.js";

// ===========Payment Controllers===========
import {
  getUserPayments,
  getPaymentsByOrderId,
  getPaymentById as getUserPaymentById,
  createPayment,
  retryPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

const initUserRoutes = (app) => {
  // ===========User Token Wallet Routes===========
  router.get("/api/user/wallet", verifyToken, getUserWallet);

  // ===========User Token Transaction Routes===========
  router.get("/api/user/transactions", verifyToken, getUserTransactions);
  router.get(
    "/api/user/transactions/:transactionId",
    verifyToken,
    getTransactionById,
  );

  // ===========User Subscription Routes===========
  router.get(
    "/api/user/subscriptions/active",
    verifyToken,
    getUserActiveSubscription,
  );
  router.get("/api/user/subscriptions", verifyToken, getUserSubscriptions);
  router.get(
    "/api/user/subscriptions/:subscriptionId",
    verifyToken,
    getSubscriptionById,
  );
  router.post("/api/user/subscriptions", verifyToken, subscribeToplan);
  router.patch(
    "/api/user/subscriptions/:subscriptionId/cancel",
    verifyToken,
    cancelSubscription,
  );

  // ===========User Order Routes===========
  router.get("/api/user/orders", verifyToken, getUserOrders);
  router.get("/api/user/orders/:orderId", verifyToken, getOrderById);
  router.post("/api/user/orders", verifyToken, createOrder);

  // ===========User Payment Routes===========
  router.get("/api/user/payments", verifyToken, getUserPayments);
  router.get(
    "/api/user/orders/:orderId/payments",
    verifyToken,
    getPaymentsByOrderId,
  );
  router.get("/api/user/payments/:paymentId", verifyToken, getUserPaymentById);
  router.post("/api/user/orders/:orderId/payments", verifyToken, createPayment);
  router.post(
    "/api/user/orders/:orderId/payments/retry",
    verifyToken,
    retryPayment,
  );

  app.use("/", router);
};

export default initUserRoutes;
