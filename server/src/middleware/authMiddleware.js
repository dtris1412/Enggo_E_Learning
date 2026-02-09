import jwt from "jsonwebtoken";

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
