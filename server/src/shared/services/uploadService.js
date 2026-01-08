import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

class UploadService {
  /**
   * Upload file lên Cloudinary
   * @param {Buffer} fileBuffer - File buffer từ multer
   * @param {string} folder - Thư mục lưu trên Cloudinary
   * @param {string} resourceType - 'image' | 'video' | 'raw' | 'auto'
   */
  async uploadToCloudinary(
    fileBuffer,
    folder = "uploads",
    resourceType = "auto"
  ) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `enggo/${folder}`,
          resource_type: resourceType,
          transformation:
            resourceType === "image"
              ? [{ quality: "auto", fetch_format: "auto" }]
              : undefined,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  // Upload avatar
  async uploadAvatar(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "avatars",
      "image"
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
      "image"
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  // Upload audio
  async uploadAudio(file) {
    const result = await this.uploadToCloudinary(
      file.buffer,
      "lessons/audios",
      "video"
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
      "video"
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
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
