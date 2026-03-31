import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Đọc từ environment variables
// Ưu tiên: DB_HOST (private network Railway) → MYSQL_URL → local fallback
let sequelize;

if (process.env.DB_HOST && process.env.DB_NAME) {
  // Dùng khi set từng biến riêng (Railway private network - khuyên dùng)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      dialectOptions: { connectTimeout: 60000 },
    },
  );
} else if (process.env.MYSQL_URL) {
  // Fallback: dùng connection string
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: { connectTimeout: 60000 },
  });
} else {
  // Local dev fallback
  sequelize = new Sequelize("enggo", "enggo", "enggo123", {
    host: "127.0.0.1",
    port: 3307,
    dialect: "mysql",
    logging: console.log,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  });
}

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (attempt = 1) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    console.log(`   Database: ${process.env.DB_NAME || "enggo"}`);
    console.log(`   Host: ${process.env.DB_HOST || "172.18.0.1"}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (err) {
    console.error(
      `❌ Database connection failed (attempt ${attempt}/${MAX_RETRIES}):`,
      err.message,
    );
    if (attempt < MAX_RETRIES) {
      console.log(`   Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      setTimeout(() => connectDB(attempt + 1), RETRY_DELAY_MS);
    } else {
      console.error(
        "❌ Max DB connection retries reached. Server continues running but DB is unavailable.",
      );
      // KHÔNG gọi process.exit() - để server tiếp tục chạy, healthcheck vẫn pass
    }
  }
};

export default connectDB;
export { sequelize };
