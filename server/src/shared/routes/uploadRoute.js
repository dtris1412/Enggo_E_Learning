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
  uploadController.uploadAvatar
);

// Upload ảnh bài học (chỉ admin)
router.post(
  "/lesson/images",
  requireAdmin, // Chỉ admin (role=1)
  upload.array("images", 10),
  handleMulterError,
  uploadController.uploadLessonImages
);

// Upload audio (chỉ admin)
router.post(
  "/lesson/audio",
  requireAdmin,
  upload.single("audio"),
  handleMulterError,
  uploadController.uploadAudio
);

// Upload video (chỉ admin)
router.post(
  "/lesson/video",
  requireAdmin,
  upload.single("video"),
  handleMulterError,
  uploadController.uploadVideo
);

// Upload file bài kiểm tra (chỉ admin)
router.post(
  "/exam/file",
  requireAdmin,
  upload.single("file"),
  handleMulterError,
  uploadController.uploadExamFile
);

// Xóa file (chỉ admin)
router.delete("/:publicId", requireAdmin, uploadController.deleteFile);

export default router;
