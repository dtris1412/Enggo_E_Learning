/**
 * AI Cache Service
 * Quản lý cache cho AI responses để tối ưu chi phí token OpenAI.
 *
 * Cache key strategy:
 *  - contextAssist (có exam + question): ai:ctx:exam_{examId}:q_{questionId}:{messageHash}
 *  - contextAssist (chỉ có question):    ai:ctx:q_{questionId}:{messageHash}
 *  - globalChat:                          ai:chat:{messageHash}
 *
 * Lý do dùng hash thay vì raw message:
 *  - Nhiều user cùng hỏi "Vì sao câu 101 chọn B?" → cùng hash → dùng chung cache
 *  - Tránh key quá dài nếu message có nhiều ký tự
 */

import { createHash } from "crypto";
import cache from "../../config/redisClient.js";

// TTL mặc định (giây)
const TTL = {
  EXPLANATION: parseInt(process.env.REDIS_AI_CACHE_TTL) || 7 * 24 * 3600, // 7 ngày
  CHAT: 24 * 3600, // 1 ngày
  OUT_OF_SCOPE: 30 * 24 * 3600, // 30 ngày (câu từ chối không đổi)
};

/**
 * Normalize message trước khi hash:
 * - Lowercase
 * - Trim + loại bỏ khoảng trắng thừa
 * Giúp "Tại sao chọn B ?" và "tại sao chọn b?" → cùng hash
 */
const normalizeMessage = (msg) => msg.toLowerCase().trim().replace(/\s+/g, " ");

/**
 * Sinh MD5 hash ngắn (16 char) từ message đã normalize
 */
const hashMessage = (msg) =>
  createHash("md5").update(normalizeMessage(msg)).digest("hex").slice(0, 16);

// ─────────────────────────────────────────────
// Key generators
// ─────────────────────────────────────────────

/**
 * Key cho contextAssist (hỏi về câu trong đề thi)
 * Ví dụ: ai:ctx:exam_5:q_101:a3f2b1c4d5e6f7a8
 */
export const buildContextKey = (examId, questionId, message) => {
  const hash = hashMessage(message);
  if (examId && questionId) {
    return `ai:ctx:exam_${examId}:q_${questionId}:${hash}`;
  }
  if (questionId) {
    return `ai:ctx:q_${questionId}:${hash}`;
  }
  return `ai:chat:${hash}`;
};

/**
 * Key cho globalChat (hỏi tự do)
 * Ví dụ: ai:chat:b7e3f1c2a0d4e5f6
 */
export const buildChatKey = (message) => {
  const hash = hashMessage(message);
  return `ai:chat:${hash}`;
};

// ─────────────────────────────────────────────
// Cache operations
// ─────────────────────────────────────────────

/**
 * Lấy cached response
 * @param {string} key
 * @returns {Promise<Object|null>} Parsed object hoặc null nếu không có cache
 */
export const getCachedAIResponse = async (key) => {
  try {
    const raw = await cache.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Lưu AI response vào cache
 * @param {string} key
 * @param {Object} responseData - Object cần cache ({ reply, ... })
 * @param {number} ttl - TTL tính bằng giây
 */
export const setCachedAIResponse = async (
  key,
  responseData,
  ttl = TTL.EXPLANATION,
) => {
  try {
    await cache.set(key, JSON.stringify(responseData), ttl);
  } catch (err) {
    console.error("[AICache] Set error:", err.message);
  }
};

/**
 * Xóa cache theo key (dùng khi nội dung câu hỏi thay đổi)
 */
export const deleteCachedAIResponse = async (key) => {
  try {
    await cache.del(key);
  } catch (err) {
    console.error("[AICache] Delete error:", err.message);
  }
};

export { TTL };
