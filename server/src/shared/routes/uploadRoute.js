import express from "express";
import {
  upload,
  handleMulterError,
} from "../../middleware/multerMiddleware.js";
import uploadController from "../controllers/uploadController.js";
import {
  requireAuth,
  requireAdmin,
  verifyToken,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// Upload avatar (user và admin đều được phép)
router.post(
  "/avatar",
  verifyToken,
  requireAuth, // Cho phép cả user (role=2) và admin (role=1)
  upload.single("avatar"),
  handleMulterError,
  uploadController.uploadAvatar,
);

// Upload ảnh bài học (chỉ admin)
router.post(
  "/lesson/images",
  verifyToken,
  requireAdmin, // Chỉ admin (role=1)
  upload.array("images", 10),
  handleMulterError,
  uploadController.uploadLessonImages,
);

// Upload audio (chỉ admin)
router.post(
  "/lesson/audio",
  verifyToken,
  requireAdmin,
  upload.single("audio"),
  handleMulterError,
  uploadController.uploadAudio,
);

// Upload video (chỉ admin)
router.post(
  "/lesson/video",
  verifyToken,
  requireAdmin,
  upload.single("video"),
  handleMulterError,
  uploadController.uploadVideo,
);

// Upload text file (chỉ admin)
router.post(
  "/lesson/text",
  verifyToken,
  requireAdmin,
  upload.single("textFile"),
  handleMulterError,
  uploadController.uploadTextFile,
);

// Upload file bài kiểm tra (chỉ admin)
router.post(
  "/exam/file",
  verifyToken,
  requireAdmin,
  upload.single("file"),
  handleMulterError,
  uploadController.uploadExamFile,
);

// Upload exam audio (chỉ admin)
router.post(
  "/exam/audio",
  verifyToken,
  requireAdmin,
  upload.single("audio"),
  handleMulterError,
  uploadController.uploadExamAudio,
);

// Upload exam images (single or multiple) (chỉ admin)
router.post(
  "/exam/images",
  verifyToken,
  requireAdmin,
  upload.array("images", 20),
  handleMulterError,
  uploadController.uploadExamImages,
);

// Upload document (docx, pdf, audio) (chỉ admin)
router.post(
  "/document",
  verifyToken,
  requireAdmin,
  upload.single("document"),
  handleMulterError,
  uploadController.uploadDocument,
);

// Xóa file (chỉ admin)
router.delete(
  "/:publicId",
  verifyToken,
  requireAdmin,
  uploadController.deleteFile,
);

export default router;
