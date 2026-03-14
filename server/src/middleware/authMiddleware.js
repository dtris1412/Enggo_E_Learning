import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {
  getUserSubscriptionPlan,
  checkContentAccess,
} from "../shared/services/subscriptionAccessService.js";

// Middleware xác thực token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied - No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", {
      user_id: decoded.user_id,
      role: decoded.role,
    });

    // Validate decoded token has required fields
    if (!decoded.user_id || decoded.role === undefined) {
      return res.status(403).json({
        success: false,
        message: "Invalid token - Missing user information",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired - Please login again",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware xác thực token tùy chọn (không reject nếu không có token)
// Dùng cho các endpoint public nhưng có thể personalize nếu user đã login
export const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(
    "[optionalVerifyToken] Auth header:",
    authHeader ? "Present" : "Not present",
  );

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue without user
    console.log(
      "[optionalVerifyToken] No token provided - Proceeding as anonymous",
    );
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("[optionalVerifyToken] Token decoded successfully:", {
      user_id: decoded.user_id,
      role: decoded.role,
    });

    // Validate decoded token has required fields
    if (!decoded.user_id || decoded.role === undefined) {
      // Invalid token, continue without user
      console.log(
        "[optionalVerifyToken] Invalid token structure - Proceeding as anonymous",
      );
      req.user = null;
      return next();
    }

    req.user = decoded;
    console.log(
      "[optionalVerifyToken] Authenticated as user_id:",
      decoded.user_id,
    );
    next();
  } catch (error) {
    // Invalid or expired token, continue without user
    console.log(
      "[optionalVerifyToken] Token verification failed:",
      error.message,
      "- Proceeding as anonymous",
    );
    req.user = null;
    next();
  }
};

// Middleware phân quyền theo role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user information",
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden - You don't have permission to access this resource",
      });
    }

    next();
  };
};

// Middleware shortcut cho admin
export const requireAdmin = (req, res, next) => {
  return requireRole(1)(req, res, next);
};

// Middleware shortcut cho user
export const requireUser = (req, res, next) => {
  return requireRole(2)(req, res, next);
};

// Middleware cho cả admin và user
export const requireAuth = (req, res, next) => {
  return requireRole(1, 2)(req, res, next);
};

// ============================================
// Subscription Access Middleware
// ============================================

/**
 * Middleware to check if user's subscription allows access to content
 * Usage: Add this AFTER verifyToken middleware
 * The resource (course/document) must be attached to req.resource with access_type field
 */
export const checkSubscriptionAccess = async (req, res, next) => {
  try {
    // Admin bypass
    if (req.user && req.user.role === 1) {
      return next();
    }

    // Get resource from request (should be set by previous middleware)
    const resource = req.resource;

    if (!resource || !resource.access_type) {
      return res.status(500).json({
        success: false,
        message: "Resource access type not found",
      });
    }

    // If content is free, allow access
    if (resource.access_type === "free") {
      return next();
    }

    // For premium content, check subscription
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to access premium content",
      });
    }

    const accessCheck = await checkContentAccess(userId, resource.access_type);

    if (!accessCheck.canAccess) {
      return res.status(403).json({
        success: false,
        message: accessCheck.message,
        userPlan: accessCheck.userPlan,
        requiredAccess: resource.access_type,
      });
    }

    // Access granted
    next();
  } catch (error) {
    console.error("Error in checkSubscriptionAccess:", error);
    res.status(500).json({
      success: false,
      message: "Error checking subscription access",
    });
  }
};

/**
 * Middleware factory to check subscription for specific access type
 * Usage: requireSubscription("premium") - will block if user doesn't have premium access
 */
export const requireSubscription = (requiredAccessType = "premium") => {
  return async (req, res, next) => {
    try {
      // Admin bypass
      if (req.user && req.user.role === 1) {
        return next();
      }

      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: `Authentication required. This content requires ${requiredAccessType} subscription.`,
        });
      }

      const accessCheck = await checkContentAccess(userId, requiredAccessType);

      if (!accessCheck.canAccess) {
        return res.status(403).json({
          success: false,
          message: accessCheck.message,
          userPlan: accessCheck.userPlan,
          requiredAccess: requiredAccessType,
        });
      }

      // Access granted
      next();
    } catch (error) {
      console.error("Error in requireSubscription:", error);
      res.status(500).json({
        success: false,
        message: "Error checking subscription",
      });
    }
  };
};

/**
 * Middleware to attach user's subscription info to request
 * Usage: Add after verifyToken to have req.subscription available
 */
export const attachSubscriptionInfo = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      req.subscription = null;
      return next();
    }

    const planCode = await getUserSubscriptionPlan(userId);
    req.subscriptionPlan = planCode;

    next();
  } catch (error) {
    console.error("Error in attachSubscriptionInfo:", error);
    req.subscriptionPlan = "free";
    next();
  }
};

// ============================================
// Resource Loading Middleware
// ============================================

/**
 * Middleware to load document and attach to req.resource for subscription check
 */
export const loadDocumentMiddleware = async (req, res, next) => {
  try {
    const { document_id } = req.params;
    const document = await db.Document.findByPk(document_id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Attach document to request for subscription check
    req.resource = document;
    next();
  } catch (error) {
    console.error("Error loading document:", error);
    res.status(500).json({
      success: false,
      message: "Error loading document",
    });
  }
};
