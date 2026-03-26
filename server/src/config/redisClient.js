/**
 * Redis Client với in-memory fallback
 * - Nếu REDIS_URL được cấu hình và kết nối thành công → dùng Redis
 * - Nếu không → tự động fallback sang Map-based in-memory cache
 *   (phù hợp cho development, không cần setup Redis)
 */
import dotenv from "dotenv";
dotenv.config();

let ioredis;
try {
  ioredis = (await import("ioredis")).default;
} catch {
  // ioredis not installed, will use memory fallback
}

// ─────────────────────────────────────────────
// In-memory fallback (Map with TTL)
// ─────────────────────────────────────────────
const memStore = new Map();

// Dọn expired entries định kỳ mỗi 5 phút
setInterval(
  () => {
    const now = Date.now();
    for (const [key, item] of memStore) {
      if (item.expiresAt && now > item.expiresAt) {
        memStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

const memCache = {
  async get(key) {
    const item = memStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memStore.delete(key);
      return null;
    }
    return item.value;
  },
  async set(key, value, ttlSeconds = 86400) {
    memStore.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },
  async del(key) {
    memStore.delete(key);
  },
  async exists(key) {
    const item = memStore.get(key);
    if (!item) return false;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memStore.delete(key);
      return false;
    }
    return true;
  },
  isMemory: true,
};

// ─────────────────────────────────────────────
// Redis client wrapper
// ─────────────────────────────────────────────
let redisInstance = null;

const buildRedisClient = () => {
  if (!ioredis || !process.env.REDIS_URL) return null;

  const client = new ioredis(process.env.REDIS_URL, {
    lazyConnect: true,
    connectTimeout: 3000,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    // Dừng retry ngay khi gặp lỗi protocol (sai URL/port)
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn(
          "[Redis] Max retries reached - switching to in-memory cache",
        );
        return null; // Ngừng retry
      }
      return Math.min(times * 500, 2000);
    },
    reconnectOnError: () => false, // Không reconnect khi gặp lỗi protocol
  });

  client.on("connect", () => {
    console.log("[Redis] Connected ✓");
  });

  client.on("error", (err) => {
    // Không crash app, just log
    console.warn(
      "[Redis] Connection error - using in-memory fallback:",
      err.message,
    );
  });

  return client;
};

// ─────────────────────────────────────────────
// Export cache instance

// ─────────────────────────────────────────────
const initRedis = () => {
  if (!process.env.REDIS_URL || !ioredis) {
    console.log("[Cache] REDIS_URL not set - using in-memory cache");
    return memCache;
  }

  try {
    redisInstance = buildRedisClient();

    // Smart wrapper: tự động chuyển sang memCache khi Redis vĩnh viễn fail
    let permanentlyFailed = false;

    redisInstance.on("end", () => {
      if (!permanentlyFailed) {
        permanentlyFailed = true;
        console.warn(
          "[Redis] Permanently disconnected - all operations routed to in-memory cache",
        );
      }
    });

    const smartWrapper = {
      async get(key) {
        if (permanentlyFailed) return memCache.get(key);
        try {
          return await redisInstance.get(key);
        } catch {
          return memCache.get(key);
        }
      },
      async set(key, value, ttlSeconds = 86400) {
        if (permanentlyFailed) return memCache.set(key, value, ttlSeconds);
        try {
          await redisInstance.set(key, value, "EX", ttlSeconds);
        } catch {
          await memCache.set(key, value, ttlSeconds);
        }
      },
      async del(key) {
        if (permanentlyFailed) return memCache.del(key);
        try {
          await redisInstance.del(key);
        } catch {
          await memCache.del(key);
        }
      },
      async exists(key) {
        if (permanentlyFailed) return memCache.exists(key);
        try {
          const result = await redisInstance.exists(key);
          return result === 1;
        } catch {
          return memCache.exists(key);
        }
      },
      get isMemory() {
        return permanentlyFailed;
      },
    };

    redisInstance.connect().catch(() => {
      // Lỗi connect sẽ được xử lý bởi retryStrategy và event "end"
    });

    return smartWrapper;
  } catch {
    console.warn("[Redis] Failed to init - using in-memory fallback");
    return memCache;
  }
};

export const cache = initRedis();
export default cache;
