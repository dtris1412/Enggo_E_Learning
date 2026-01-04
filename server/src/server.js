import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import initSharedRoutes from "./shared/routes/sharedRoute.js";
import connectDB from "./config/connectDB.js";
import cors from "cors";

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

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ============================================
// API ROUTES - Phải đặt TRƯỚC static files
// ============================================
initSharedRoutes(app); // /api/*

// ============================================
// SERVE REACT STATIC FILES (như Nginx)
// ============================================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../client/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // SPA fallback - trả về index.html cho mọi route không phải API
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
