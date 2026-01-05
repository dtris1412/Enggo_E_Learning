import jwt from "jsonwebtoken";

// Middleware xác thực token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
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
