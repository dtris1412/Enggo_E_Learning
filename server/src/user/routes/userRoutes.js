import express, { Router } from "express";
import {
  requireAdmin,
  requireAuth,
  requireRole,
  requireUser,
  verifyToken,
  optionalVerifyToken,
  checkSubscriptionAccess,
  loadDocumentMiddleware,
} from "../../middleware/authMiddleware.js";
// ===========Document Controllers===========
import {
  getDocumentsPaginated,
  getDocumentById,
  downloadDocument,
} from "../controllers/documentController.js";

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

// ===========Subscription Plan Controllers===========
import { getAllSubscriptionPlans } from "../controllers/subscriptionPlanController.js";

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
  createMomoPayment,
  momoCallback,
  momoIPN,
  createVnpayPayment,
  vnpayCallback,
  vnpayIPN,
} from "../controllers/paymentController.js";

const router = express.Router();

const initUserRoutes = (app) => {
  // ===========Document Routes===========
  // List all documents (public)
  router.get("/api/user/documents", getDocumentsPaginated);

  // View document by ID
  // - Free documents: Anyone can view (no login required)
  // - Premium documents: Requires premium subscription (will show 401 if not logged in)
  router.get(
    "/api/user/documents/:document_id",
    optionalVerifyToken, // Parse token if available, but don't reject if missing
    loadDocumentMiddleware, // Load document and attach to req.resource
    checkSubscriptionAccess, // Check subscription based on document.acess_type
    getDocumentById,
  );

  // Download document
  // - Free documents: Login required
  // - Premium documents: Premium subscription required
  router.get(
    "/api/user/documents/:document_id/download",
    verifyToken, // Authentication required for download
    loadDocumentMiddleware, // Load document
    checkSubscriptionAccess, // Check subscription access
    downloadDocument,
  );

  // ===========User Token Wallet Routes===========
  router.get("/api/user/wallet", verifyToken, requireUser, getUserWallet);

  // ===========User Token Transaction Routes===========
  router.get(
    "/api/user/transactions",
    requireUser,
    verifyToken,
    getUserTransactions,
  );
  router.get(
    "/api/user/transactions/:transactionId",
    requireUser,
    verifyToken,
    getTransactionById,
  );

  // ===========User Subscription Routes===========
  router.get(
    "/api/user/subscriptions/active",
    verifyToken,
    requireUser,
    getUserActiveSubscription,
  );
  router.get(
    "/api/user/subscriptions",
    verifyToken,
    requireUser,
    getUserSubscriptions,
  );
  router.get(
    "/api/user/subscriptions/:subscriptionId",
    verifyToken,
    requireUser,
    getSubscriptionById,
  );
  router.post(
    "/api/user/subscriptions",
    verifyToken,
    requireUser,
    subscribeToplan,
  );
  router.patch(
    "/api/user/subscriptions/:subscriptionId/cancel",
    verifyToken,
    requireUser,
    cancelSubscription,
  );

  // ===========Subscription Plan Routes===========
  // Public endpoint - anyone can view subscription plans and pricing
  router.get("/api/user/subscription-plans", getAllSubscriptionPlans);

  // ===========User Order Routes===========
  router.get("/api/user/orders", verifyToken, requireUser, getUserOrders);
  router.get(
    "/api/user/orders/:orderId",
    verifyToken,
    requireUser,
    getOrderById,
  );
  router.post("/api/user/orders", verifyToken, requireUser, createOrder);

  // ===========User Payment Routes===========
  router.get("/api/user/payments", verifyToken, requireUser, getUserPayments);
  router.get(
    "/api/user/orders/:orderId/payments",
    verifyToken,
    requireUser,
    getPaymentsByOrderId,
  );
  router.get(
    "/api/user/payments/:paymentId",
    verifyToken,
    requireUser,
    getUserPaymentById,
  );
  router.post(
    "/api/user/orders/:orderId/payments",
    verifyToken,
    requireUser,
    createPayment,
  );
  router.post(
    "/api/user/orders/:orderId/payments/retry",
    verifyToken,
    requireUser,
    retryPayment,
  );

  // ===========MoMo Payment Routes===========
  router.post(
    "/api/payment/momo/:orderId",
    verifyToken,
    requireUser,
    createMomoPayment,
  );
  router.get("/api/payment/momo/callback", momoCallback);
  router.post("/api/payment/momo/ipn", momoIPN);

  // ===========VNPay Payment Routes===========
  router.post(
    "/api/payment/vnpay/:orderId",
    verifyToken,
    requireUser,
    createVnpayPayment,
  );
  router.get("/api/payment/vnpay/callback", vnpayCallback);
  router.get("/api/payment/vnpay/ipn", vnpayIPN);

  app.use("/", router);
};

export default initUserRoutes;
