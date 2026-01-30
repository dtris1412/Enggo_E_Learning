import crypto from "crypto";

// In-memory store (thay bằng Redis trong production)
// Structure: { "blog:1:hash123": timestamp }
const viewStore = new Map();

// Cleanup expired entries mỗi 1 giờ
setInterval(
  () => {
    const now = Date.now();
    for (const [key, timestamp] of viewStore.entries()) {
      if (now - timestamp > 24 * 60 * 60 * 1000) {
        viewStore.delete(key);
      }
    }
  },
  60 * 60 * 1000,
);

/**
 * Lấy IP thật từ request (xử lý proxy)
 */
const getRealIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

/**
 * Tạo hash từ IP + User-Agent
 */
const createViewHash = (ip, userAgent) => {
  const combined = `${ip}:${userAgent}`;
  return crypto.createHash("md5").update(combined).digest("hex").slice(0, 12);
};

/**
 * Kiểm tra xem user đã view blog trong 24h chưa
 * @param {number} blogId - ID của blog
 * @param {string} ip - IP address
 * @param {string} userAgent - User-Agent string
 * @returns {boolean} - true nếu chưa view (cho phép tăng view)
 */
const canIncrementView = (blogId, ip, userAgent) => {
  const hash = createViewHash(ip, userAgent);
  const key = `blog:${blogId}:${hash}`;

  const lastView = viewStore.get(key);
  const now = Date.now();

  // Nếu chưa có hoặc đã quá 24h
  if (!lastView || now - lastView > 24 * 60 * 60 * 1000) {
    viewStore.set(key, now);
    return true;
  }

  return false;
};

/**
 * Tạo identifier từ request (ưu tiên: user_id > cookie > IP)
 */
const getViewIdentifier = (req) => {
  const ip = getRealIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";

  // Nếu user đã login, dùng user_id
  if (req.user?.user_id) {
    return {
      type: "user",
      id: req.user.user_id,
      ip,
      userAgent,
    };
  }

  // Nếu có session/cookie
  if (req.session?.id) {
    return {
      type: "session",
      id: req.session.id,
      ip,
      userAgent,
    };
  }

  // Fallback: dùng IP + User-Agent
  return {
    type: "ip",
    id: ip,
    ip,
    userAgent,
  };
};

/**
 * Kiểm tra và record view cho blog
 * @param {Object} req - Express request object
 * @param {number} blogId - ID của blog
 * @returns {boolean} - true nếu được phép tăng view count
 */
const trackView = (req, blogId) => {
  const identifier = getViewIdentifier(req);

  // Nếu user đã login, dùng user_id thay vì IP
  const viewKey = identifier.type === "user" ? identifier.id : identifier.ip;

  return canIncrementView(blogId, viewKey, identifier.userAgent);
};

/**
 * Get statistics (for debugging)
 */
const getStats = () => {
  const now = Date.now();
  const active = Array.from(viewStore.entries()).filter(
    ([, timestamp]) => now - timestamp <= 24 * 60 * 60 * 1000,
  ).length;

  return {
    totalEntries: viewStore.size,
    activeViews: active,
    expiredViews: viewStore.size - active,
  };
};

/**
 * Clear all tracking data (for testing)
 */
const clearAll = () => {
  viewStore.clear();
};

export default {
  trackView,
  getRealIP,
  getViewIdentifier,
  getStats,
  clearAll,
};
