import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import initSharedRoutes from "./shared/routes/sharedRoute.js";
import initAdminRoutes from "./admin/routes/adminRoutes.js";
import initUserRoutes from "./user/routes/userRoutes.js";
import uploadRoutes from "./shared/routes/uploadRoute.js";
import connectDB from "./config/connectDB.js";
import cors from "cors";
// import passport from "./shared/services/passportService.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Health check (Railway dùng để kiểm tra service đã sẵn sàng chưa)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});
// Serve uploaded files
app.use("/api/upload", uploadRoutes);

// ============================================
// API ROUTES - Phải đặt TRƯỚC static files
// ============================================
initSharedRoutes(app); // /api/*
initAdminRoutes(app); // /api/admin/*
initUserRoutes(app); // /api/user/*

// ============================================
// SERVE REACT STATIC FILES (như Nginx)
// ============================================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../client/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // SPA fallback - trả về index.html cho mọi route không phải API
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Khởi động server TRƯỚC, kết nối DB SAU
// → healthcheck của Railway luôn pass ngay cả khi DB đang warmup
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  connectDB();
});
