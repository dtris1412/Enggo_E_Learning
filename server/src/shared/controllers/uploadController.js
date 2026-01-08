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
        uploadService.uploadLessonImage(file)
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
