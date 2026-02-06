import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import mammoth from "mammoth";

class UploadService {
  /**
   * Upload file lên Cloudinary
   * @param {Buffer} fileBuffer - File buffer từ multer
   * @param {string} folder - Thư mục lưu trên Cloudinary
   * @param {string} resourceType - 'image' | 'video' | 'raw' | 'auto'
   * @param {Object} options - Tùy chọn upload
   */
  async uploadToCloudinary(
    fileBuffer,
    folder = "uploads",
    resourceType = "auto",
    options = {},
  ) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `enggo/${folder}`,
          resource_type: resourceType,
          // Tối ưu cho tốc độ
          chunk_size: 6000000, // 6MB chunks (tăng tốc upload file lớn)
          timeout: 60000, // 60s timeout
          ...options,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  // Upload avatar
  async uploadAvatar(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "avatars",
      "image",
      {
        // Tối ưu cho avatar
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" }, // Crop về 400x400
          { quality: "auto:good" }, // Tự động chọn quality tốt
          { fetch_format: "auto" }, // Tự động chọn format tốt nhất (webp)
        ],
        eager: [
          { width: 200, height: 200, crop: "fill" }, // Tạo thumbnail 200x200 ngay
        ],
        eager_async: true, // Xử lý eager transformations ở background
      },
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  // Upload ảnh bài học
  async uploadLessonImage(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "lessons/images",
      "image",
      {
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  // Upload blog thumbnail
  async uploadBlogThumbnail(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "blogs/thumbnails",
      "image",
      {
        // Tối ưu cho blog thumbnail
        transformation: [
          { width: 1200, height: 630, crop: "fill" }, // Kích thước chuẩn OG image cho SEO
          { quality: "auto:good" },
          { fetch_format: "auto" }, // Tự động chọn format tốt nhất (webp)
        ],
        eager: [
          { width: 600, height: 315, crop: "fill" }, // Thumbnail nhỏ hơn
          { width: 400, height: 210, crop: "fill" }, // Thumbnail cho list view
        ],
        eager_async: true,
      },
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  // Upload audio
  async uploadAudio(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "lessons/audios",
      "video",
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
    };
  }

  // Upload video
  async uploadVideo(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "lessons/videos",
      "video",
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
    };
  }

  // Upload text file (.txt, .doc, .docx)
  async uploadTextFile(file) {
    let textContent = "";

    // Extract text content based on file type
    if (file.mimetype === "text/plain") {
      // Plain text file
      textContent = file.buffer.toString("utf-8");
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      // .docx or .doc file - convert to HTML
      try {
        const result = await mammoth.convertToHtml({ buffer: file.buffer });
        textContent = result.value; // HTML content
      } catch (error) {
        console.error("Error converting document:", error);
        throw new Error("Failed to convert document to HTML");
      }
    } else {
      throw new Error("Unsupported file type");
    }

    // Upload the extracted text/HTML as a text file to Cloudinary
    const textBuffer = Buffer.from(textContent, "utf-8");
    const result = await this.uploadToCloudinary(
      textBuffer,
      "lessons/texts",
      "raw",
      {
        format: "txt", // Save as .txt
      },
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  }

  // Upload file bài kiểm tra
  async uploadExamFile(file) {
    const result = await this.uploadToCloudinary(file.buffer, "exams", "auto");
    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  }

  // Upload exam audio (for listening sections)
  async uploadExamAudio(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "exams/audios",
      "video",
      {
        resource_type: "video", // Cloudinary uses 'video' for audio
        format: "mp3",
      },
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
      bytes: result.bytes,
    };
  }

  // Upload exam image (for questions/containers)
  async uploadExamImage(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "exams/images",
      "image",
      {
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  // Upload multiple exam images (for batch upload)
  async uploadExamImages(files) {
    const uploadPromises = files.map((file) => this.uploadExamImage(file));
    return await Promise.all(uploadPromises);
  }

  // Upload document (docx, pdf, audio)
  async uploadDocument(file) {
    let resourceType = "raw"; // Default for documents
    let folder = "documents";

    // Determine resource type and folder based on file type
    if (file.mimetype.startsWith("audio/")) {
      resourceType = "video"; // Cloudinary uses 'video' for audio files
      folder = "documents/audios";
    } else if (file.mimetype === "application/pdf") {
      resourceType = "raw";
      folder = "documents/pdfs";
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      resourceType = "raw";
      folder = "documents/docx";
    }

    const result = await this.uploadToCloudinary(
      file.buffer,
      folder,
      resourceType,
      {
        // Keep original filename
        use_filename: true,
        unique_filename: true,
      },
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format || file.mimetype.split("/")[1] || "unknown",
      bytes: result.bytes,
      resourceType: result.resource_type,
      originalFilename: file.originalname,
    };
  }

  // Xóa file
  async deleteFile(publicId, resourceType = "image") {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw error;
    }
  }

  // Xóa nhiều file
  async deleteMultipleFiles(publicIds, resourceType = "image") {
    try {
      const result = await cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error("Cloudinary delete multiple error:", error);
      throw error;
    }
  }
}

export default new UploadService();
