import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useLessonMedia } from "../../contexts/lessonMediaContext";

interface AddLessonMediaModalProps {
  isOpen: boolean;
  lessonId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLessonMediaModal: React.FC<AddLessonMediaModalProps> = ({
  isOpen,
  lessonId,
  onClose,
  onSuccess,
}) => {
  const { createMedia, uploadFile, uploadingFile } = useLessonMedia();

  const [formData, setFormData] = useState({
    order_index: 0,
    description: "",
    media_type: "text",
    media_url: "",
    transcription: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      order_index: 0,
      description: "",
      media_type: "text",
      media_url: "",
      transcription: "",
    });
    setErrors({});
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // Danh sách định dạng file được phép theo loại media
  const getAllowedTypes = (mediaType: string): string[] => {
    switch (mediaType) {
      case "video":
        return ["video/mp4", "video/webm", "video/ogg"];
      case "audio":
        return [
          "audio/mpeg",
          "audio/mp3",
          "audio/wav",
          "audio/ogg",
          "audio/webm",
        ];
      case "image":
        return ["image/jpeg", "image/png", "image/gif", "image/webp"];
      case "text":
        return []; // Sẽ kiểm tra extension riêng
      default:
        return [];
    }
  };

  const validateFile = (file: File, mediaType: string): string | null => {
    // Kiểm tra dung lượng
    if (file.size > MAX_FILE_SIZE) {
      return "Dung lượng file không được vượt quá 50MB";
    }

    // Kiểm tra định dạng
    if (mediaType === "text") {
      const allowedExt = [".txt", ".doc", ".docx"];
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedExt.includes(fileExt)) {
        return "Chỉ chấp nhận file .txt, .doc, .docx cho loại Text";
      }
    } else {
      const allowedTypes = getAllowedTypes(mediaType);
      if (!allowedTypes.includes(file.type)) {
        return `Chỉ chấp nhận các định dạng: ${allowedTypes.join(", ")}`;
      }
    }

    return null; // Hợp lệ
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const errorMessage = validateFile(file, formData.media_type);

    if (errorMessage) {
      setErrors((prev) => ({ ...prev, file: errorMessage }));
      e.target.value = ""; // Xóa input file khi không hợp lệ
      return;
    }

    // File hợp lệ
    setSelectedFile(file);
    setErrors((prev) => ({ ...prev, file: "" }));

    // Tạo preview URL (chỉ cho media không phải text)
    if (formData.media_type !== "text") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedFile) {
      newErrors.file = "Vui lòng chọn file để thêm media";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let uploadedUrl = "";

    if (selectedFile) {
      uploadedUrl = await uploadFile(
        selectedFile,
        formData.media_type as "video" | "audio" | "image" | "text",
      );

      if (!uploadedUrl) {
        setErrors((prev) => ({
          ...prev,
          file: "Upload file thất bại. Vui lòng thử lại.",
        }));
        return;
      }
    }

    const success = await createMedia(lessonId, {
      ...formData,
      media_url: uploadedUrl,
    });

    if (success) {
      onSuccess();
      onClose();
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Thêm Media mới</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Order Index */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự hiển thị <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại Media <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.media_type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  media_type: e.target.value,
                });
                clearFileSelection(); // Reset file khi đổi loại
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Image</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept={
                formData.media_type === "video"
                  ? "video/mp4,video/webm,video/ogg"
                  : formData.media_type === "audio"
                    ? "audio/*"
                    : formData.media_type === "image"
                      ? "image/*"
                      : ".txt,.doc,.docx"
              }
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file}</p>
            )}

            {selectedFile && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Đã chọn: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Tối đa 50MB. Vui lòng chọn file đúng định dạng.
            </p>

            {/* Preview for non-text */}
            {previewUrl && formData.media_type !== "text" && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                {formData.media_type === "video" && (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-60 rounded"
                  />
                )}
                {formData.media_type === "audio" && (
                  <audio src={previewUrl} controls className="w-full" />
                )}
                {formData.media_type === "image" && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-60 object-cover rounded"
                  />
                )}
              </div>
            )}

            {/* Text file info */}
            {selectedFile && formData.media_type === "text" && (
              <p className="text-sm text-gray-600 mt-1">
                File text sẽ được upload và hiển thị trong bài học
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả về media này..."
            />
          </div>

          {/* Transcription */}
          {["video", "audio"].includes(formData.media_type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transcription (tùy chọn)
              </label>
              <textarea
                value={formData.transcription}
                onChange={(e) =>
                  setFormData({ ...formData, transcription: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nội dung transcript của video/audio..."
              />
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploadingFile || !selectedFile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>{uploadingFile ? "Đang upload..." : "Thêm Media"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLessonMediaModal;
