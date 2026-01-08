import multer from "multer";

// Lưu file vào memory
const storage = multer.memoryStorage();

// File filter theo loại
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"],
    audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"],
  };

  const allAllowed = Object.values(allowedMimes).flat();

  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Cấu hình multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// Middleware xử lý lỗi multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large (max 100MB)" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};
