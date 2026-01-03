import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Đọc từ environment variables, fallback về local dev
const sequelize = new Sequelize(
  process.env.DB_NAME || "enggo",
  process.env.DB_USER || "enggo",
  process.env.DB_PASS || null,
  {
    host: process.env.DB_HOST || "172.18.0.1",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,

    // Connection pool
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    // SSL cho production (nếu cần)
    dialectOptions:
      process.env.NODE_ENV === "production" && process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    console.log(`   Database: ${process.env.DB_NAME || "enggo"}`);
    console.log(`   Host: ${process.env.DB_HOST || "172.18.0.1"}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (err) {
    console.error("❌ Unable to connect to database:", err.message);
    // Không exit process khi test local
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
export { sequelize };
