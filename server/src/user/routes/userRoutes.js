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
  router.get("/api/user/wallet", requireUser, verifyToken, getUserWallet);

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
    requireUser,
    verifyToken,
    getUserActiveSubscription,
  );
  router.get(
    "/api/user/subscriptions",
    requireUser,
    verifyToken,
    getUserSubscriptions,
  );
  router.get(
    "/api/user/subscriptions/:subscriptionId",
    requireUser,
    verifyToken,
    getSubscriptionById,
  );
  router.post(
    "/api/user/subscriptions",
    requireUser,
    verifyToken,
    subscribeToplan,
  );
  router.patch(
    "/api/user/subscriptions/:subscriptionId/cancel",
    requireUser,
    verifyToken,
    cancelSubscription,
  );

  // ===========User Order Routes===========
  router.get("/api/user/orders", requireUser, verifyToken, getUserOrders);
  router.get(
    "/api/user/orders/:orderId",
    requireUser,
    verifyToken,
    getOrderById,
  );
  router.post("/api/user/orders", requireUser, verifyToken, createOrder);

  // ===========User Payment Routes===========
  router.get("/api/user/payments", requireUser, verifyToken, getUserPayments);
  router.get(
    "/api/user/orders/:orderId/payments",
    requireUser,
    verifyToken,
    getPaymentsByOrderId,
  );
  router.get(
    "/api/user/payments/:paymentId",
    requireUser,
    verifyToken,
    getUserPaymentById,
  );
  router.post(
    "/api/user/orders/:orderId/payments",
    requireUser,
    verifyToken,
    createPayment,
  );
  router.post(
    "/api/user/orders/:orderId/payments/retry",
    requireUser,
    verifyToken,
    retryPayment,
  );

  app.use("/", router);
};

export default initUserRoutes;
