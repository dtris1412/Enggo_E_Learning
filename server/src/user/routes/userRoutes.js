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

// ===========Roadmap Controllers===========
import {
  getRoadmapsPaginated,
  getRoadmapById,
} from "../controllers/roadmapController.js";

// ===========Course Controllers===========
import {
  getCoursesPaginated,
  getCourseById,
} from "../controllers/courseController.js";

// ===========Lesson Controllers===========
import { getLessonById } from "../controllers/lessonController.js";

// ===========Progress Controllers===========
import {
  startCourse,
  startRoadmap,
  updateLessonProgress,
  getCourseProgress,
  getRoadmapProgress,
  getLessonProgress,
  getEnrolledCourses,
} from "../controllers/progressController.js";

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

// ===========Blog Controllers===========
import {
  getBlogsPaginated,
  getBlogById,
  getBlogBySlug,
} from "../controllers/blogController.js";

// ===========Blog Like Controllers===========
import {
  toggleLike,
  getLikeCount,
  checkUserLiked,
  getBlogLikes,
} from "../controllers/blogLikeController.js";

// ===========Blog Comment Controllers===========
import {
  getCommentsByBlogId,
  getRepliesByCommentId,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
} from "../controllers/blogCommentController.js";

// ===========Flashcard Controllers===========
import {
  getFlashcardSetsPaginated,
  getMyFlashcardSets,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  getFlashcardsBySetId,
  getFlashcardById,
  createFlashcard,
  createMultipleFlashcards,
  updateFlashcard,
  deleteFlashcard,
  deleteMultipleFlashcards,
} from "../controllers/flashcardController.js";

// ===========Flashcard Progress Controllers===========
import {
  startFlashcardSet,
  reviewFlashcard,
  getFlashcardSetProgress,
  getNextCard,
  getDailyReviewQueue,
  getActiveSets,
} from "../controllers/flashcardProgressController.js";

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

  // ===========Roadmap Routes===========
  // List all roadmaps (public)
  router.get("/api/user/roadmaps", getRoadmapsPaginated);

  // View roadmap by ID with full details (phases, courses, documents)
  router.get("/api/user/roadmaps/:roadmap_id", getRoadmapById);

  // ===========Course Routes===========
  // List all courses (public)
  // Can filter by roadmap_id, phase_id, course_level, access_type, tag
  router.get("/api/user/courses", getCoursesPaginated);

  // Get all enrolled courses for authenticated user (MUST be before :course_id)
  router.get(
    "/api/user/courses/enrolled",
    verifyToken,
    requireUser,
    getEnrolledCourses,
  );

  // View course by ID with full details (modules, lessons)
  router.get("/api/user/courses/:course_id", getCourseById);

  // ===========Lesson Routes===========
  // Get lesson detail with media and questions
  router.get("/api/user/lessons/:id", getLessonById);

  // ===========Progress Tracking Routes===========
  // Start a course (create user_course record)
  router.post(
    "/api/user/courses/:id/start",
    verifyToken,
    requireUser,
    startCourse,
  );

  // Start a roadmap (create user_roadmap record)
  router.post(
    "/api/user/roadmaps/:id/start",
    verifyToken,
    requireUser,
    startRoadmap,
  );

  // Update lesson progress
  router.put(
    "/api/user/lessons/:id/progress",
    verifyToken,
    requireUser,
    updateLessonProgress,
  );

  // Get course progress
  router.get(
    "/api/user/courses/:id/progress",
    verifyToken,
    requireUser,
    getCourseProgress,
  );

  // Get roadmap progress
  router.get(
    "/api/user/roadmaps/:id/progress",
    verifyToken,
    requireUser,
    getRoadmapProgress,
  );

  // Get lesson progress
  router.get(
    "/api/user/lessons/:id/progress",
    verifyToken,
    requireUser,
    getLessonProgress,
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

  // ===========Blog Routes===========
  // List all blogs (public)
  router.get("/api/user/blogs", getBlogsPaginated);

  // Get blog by ID (public, optional auth to check if user liked)
  router.get("/api/user/blogs/:blog_id", optionalVerifyToken, getBlogById);

  // Get blog by slug (public, optional auth to check if user liked)
  router.get("/api/user/blogs/slug/:slug", optionalVerifyToken, getBlogBySlug);

  // ===========Blog Like Routes===========
  // Toggle like/unlike (auth required)
  router.post(
    "/api/user/blogs/:blog_id/like",
    verifyToken,
    requireUser,
    toggleLike,
  );

  // Get all likes for a blog (public)
  router.get("/api/user/blogs/:blog_id/likes", getBlogLikes);

  // Get like count for a blog (public)
  router.get("/api/user/blogs/:blog_id/likes/count", getLikeCount);

  // Check if current user liked a blog (auth required)
  router.get(
    "/api/user/blogs/:blog_id/likes/check",
    verifyToken,
    requireUser,
    checkUserLiked,
  );

  // ===========Blog Comment Routes===========
  // Get all comments for a blog (public)
  router.get("/api/user/blogs/:blog_id/comments", getCommentsByBlogId);

  // Create a comment or reply (auth required)
  router.post(
    "/api/user/blogs/:blog_id/comments",
    verifyToken,
    requireUser,
    createComment,
  );

  // Get comment by ID (public)
  router.get("/api/user/comments/:comment_id", getCommentById);

  // Get replies for a comment (public)
  router.get("/api/user/comments/:comment_id/replies", getRepliesByCommentId);

  // Update a comment (auth required, owner only)
  router.patch(
    "/api/user/comments/:comment_id",
    verifyToken,
    requireUser,
    updateComment,
  );

  // Delete a comment (auth required, owner only)
  router.delete(
    "/api/user/comments/:comment_id",
    verifyToken,
    requireUser,
    deleteComment,
  );

  // ===========Flashcard Set Routes===========
  // List all flashcard sets (public sets and user's own sets if logged in)
  router.get(
    "/api/user/flashcard-sets",
    optionalVerifyToken,
    getFlashcardSetsPaginated,
  );

  // Get my flashcard sets (auth required)
  router.get(
    "/api/user/flashcard-sets/my-sets",
    verifyToken,
    requireUser,
    getMyFlashcardSets,
  );

  // Get flashcard set by ID (public if visibility is public, or owner)
  router.get(
    "/api/user/flashcard-sets/:flashcard_set_id",
    optionalVerifyToken,
    getFlashcardSetById,
  );

  // Create flashcard set (auth required)
  router.post(
    "/api/user/flashcard-sets",
    verifyToken,
    requireUser,
    createFlashcardSet,
  );

  // Update flashcard set (auth required, owner only)
  router.patch(
    "/api/user/flashcard-sets/:flashcard_set_id",
    verifyToken,
    requireUser,
    updateFlashcardSet,
  );

  // Delete flashcard set (auth required, owner only)
  router.delete(
    "/api/user/flashcard-sets/:flashcard_set_id",
    verifyToken,
    requireUser,
    deleteFlashcardSet,
  );

  // ===========Flashcard Routes===========
  // Get all flashcards in a set (public if set is public, or owner)
  router.get(
    "/api/user/flashcard-sets/:flashcard_set_id/flashcards",
    optionalVerifyToken,
    getFlashcardsBySetId,
  );

  // ===========Flashcard Progress Routes (SM-2 - Specific routes MUST come before parameterized routes)===========
  // Get daily review queue (all sets) (auth required)
  router.get(
    "/api/user/flashcards/review-queue",
    verifyToken,
    requireUser,
    getDailyReviewQueue,
  );

  // Get active learning sets (auth required)
  router.get(
    "/api/user/flashcards/active-sets",
    verifyToken,
    requireUser,
    getActiveSets,
  );

  // Get flashcard by ID (public if set is public, or owner)
  router.get(
    "/api/user/flashcards/:flashcard_id",
    optionalVerifyToken,
    getFlashcardById,
  );

  // Create flashcard in a set (auth required, owner only)
  router.post(
    "/api/user/flashcard-sets/:flashcard_set_id/flashcards",
    verifyToken,
    requireUser,
    createFlashcard,
  );

  // Create multiple flashcards in a set (auth required, owner only)
  router.post(
    "/api/user/flashcard-sets/:flashcard_set_id/flashcards/bulk",
    verifyToken,
    requireUser,
    createMultipleFlashcards,
  );

  // Update flashcard (auth required, owner only)
  router.patch(
    "/api/user/flashcards/:flashcard_id",
    verifyToken,
    requireUser,
    updateFlashcard,
  );

  // Delete flashcard (auth required, owner only)
  router.delete(
    "/api/user/flashcards/:flashcard_id",
    verifyToken,
    requireUser,
    deleteFlashcard,
  );

  // Delete multiple flashcards (auth required, owner only)
  router.post(
    "/api/user/flashcards/bulk-delete",
    verifyToken,
    requireUser,
    deleteMultipleFlashcards,
  );

  // ===========Flashcard Progress Routes (SM-2 Spaced Repetition - Parameterized routes)===========
  // Start learning a flashcard set (auth required)
  router.post(
    "/api/user/flashcard-sets/:flashcard_set_id/start",
    verifyToken,
    requireUser,
    startFlashcardSet,
  );

  // Review a flashcard (auth required)
  // Body: { quality: "again" | "hard" | "good" | "easy" }
  router.post(
    "/api/user/flashcards/:flashcard_id/review",
    verifyToken,
    requireUser,
    reviewFlashcard,
  );

  // Get progress of a flashcard set (auth required)
  router.get(
    "/api/user/flashcard-sets/:flashcard_set_id/progress",
    verifyToken,
    requireUser,
    getFlashcardSetProgress,
  );

  // Get next card to study in a set (auth required)
  router.get(
    "/api/user/flashcard-sets/:flashcard_set_id/next-card",
    verifyToken,
    requireUser,
    getNextCard,
  );

  app.use("/", router);
};

export default initUserRoutes;
