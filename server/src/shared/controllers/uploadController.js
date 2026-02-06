import uploadService from "../services/uploadService.js";

class UploadController {
  // Upload avatar
  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await uploadService.uploadAvatar(req.file);

      return res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload ảnh bài học (single hoặc multiple)
  async uploadLessonImages(req, res) {
    try {
      const files = req.files || [req.file];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadPromises = files.map((file) =>
        uploadService.uploadLessonImage(file),
      );

      const results = await Promise.all(uploadPromises);

      return res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: results,
      });
    } catch (error) {
      console.error("Upload lesson images error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload blog thumbnail
  async uploadBlogThumbnail(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await uploadService.uploadBlogThumbnail(req.file);

      return res.status(200).json({
        success: true,
        message: "Blog thumbnail uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload blog thumbnail error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload audio
  async uploadAudio(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No audio file uploaded",
        });
      }

      const result = await uploadService.uploadAudio(req.file);

      return res.status(200).json({
        success: true,
        message: "Audio uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload audio error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload video
  async uploadVideo(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No video file uploaded",
        });
      }

      const result = await uploadService.uploadVideo(req.file);

      return res.status(200).json({
        success: true,
        message: "Video uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload video error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload text file (.txt, .doc, .docx)
  async uploadTextFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No text file uploaded",
        });
      }

      const result = await uploadService.uploadTextFile(req.file);

      return res.status(200).json({
        success: true,
        message: "Text file uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload text file error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload file cho bài kiểm tra
  async uploadExamFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await uploadService.uploadExamFile(req.file);

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload exam file error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload exam audio (for listening sections)
  async uploadExamAudio(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No audio file uploaded",
        });
      }

      // Validate audio file type
      const allowedMimeTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/webm",
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid audio file type. Allowed: mp3, wav, ogg, webm",
        });
      }

      const result = await uploadService.uploadExamAudio(req.file);

      return res.status(200).json({
        success: true,
        message: "Exam audio uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload exam audio error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload exam image (single or multiple)
  async uploadExamImages(req, res) {
    try {
      const files = req.files || [req.file];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
        });
      }

      // Validate image file types
      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      for (const file of files) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `Invalid image file type: ${file.originalname}. Allowed: jpeg, jpg, png, gif, webp`,
          });
        }
      }

      const results =
        files.length === 1
          ? await uploadService.uploadExamImage(files[0])
          : await uploadService.uploadExamImages(files);

      return res.status(200).json({
        success: true,
        message: `Exam image${files.length > 1 ? "s" : ""} uploaded successfully`,
        data: results,
      });
    } catch (error) {
      console.error("Upload exam images error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Upload document (docx, pdf, audio)
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No document file uploaded",
        });
      }

      // Validate file type
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/webm",
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid file type. Only PDF, DOCX, DOC, and audio files are allowed.",
        });
      }

      const result = await uploadService.uploadDocument(req.file);

      return res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload document error:", error);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  // Xóa file
  async deleteFile(req, res) {
    try {
      const { publicId } = req.params;
      const { resourceType = "image" } = req.body;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
      }

      const result = await uploadService.deleteFile(publicId, resourceType);

      return res.status(200).json({
        success: true,
        message: "File deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Delete file error:", error);
      return res.status(500).json({
        success: false,
        message: "Delete failed",
        error: error.message,
      });
    }
  }
}

export default new UploadController();
