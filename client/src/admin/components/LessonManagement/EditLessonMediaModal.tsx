import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useLessonMedia, LessonMedia } from "../../contexts/lessonMediaContext";

interface EditLessonMediaModalProps {
  isOpen: boolean;
  media: LessonMedia | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditLessonMediaModal: React.FC<EditLessonMediaModalProps> = ({
  isOpen,
  media,
  onClose,
  onSuccess,
}) => {
  const { updateMedia, uploadFile, uploadingFile } = useLessonMedia();

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

  useEffect(() => {
    if (isOpen && media) {
      setFormData({
        order_index: media.order_index,
        description: media.description || "",
        media_type: media.media_type,
        media_url: media.media_url,
        transcription: media.transcription || "",
      });
      setErrors({});
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [isOpen, media]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.media_url.trim()) {
      newErrors.media_url = "Media URL/Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store file for later upload
    setSelectedFile(file);

    // Create local preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!media || !validateForm()) return;

    let uploadedUrl = formData.media_url;

    // Upload new file if selected (all types including text)
    if (selectedFile) {
      uploadedUrl = await uploadFile(
        selectedFile,
        formData.media_type as "video" | "audio" | "image" | "text",
      );
      if (!uploadedUrl) {
        // Upload failed
        return;
      }
    }

    const success = await updateMedia(media.media_id, {
      ...formData,
      media_url: uploadedUrl,
    });

    if (success) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen || !media) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Chỉnh sửa Media</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
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
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Image</option>
            </select>
          </div>

          {/* File Upload for All Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File mới (tùy chọn)
            </label>
            <input
              type="file"
              accept={
                formData.media_type === "video"
                  ? "video/*"
                  : formData.media_type === "audio"
                    ? "audio/*"
                    : formData.media_type === "image"
                      ? "image/*"
                      : ".txt,.doc,.docx"
              }
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedFile && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Đã chọn file mới: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Để trống nếu không muốn thay đổi file
            </p>

            {/* Preview Section for new file */}
            {previewUrl && formData.media_type !== "text" && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview file mới:
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
                File text mới sẽ thay thế file hiện tại
              </p>
            )}

            {/* Current file preview */}
            {!previewUrl &&
              formData.media_url &&
              formData.media_type !== "text" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    File hiện tại:
                  </p>
                  {formData.media_type === "video" && (
                    <video
                      src={formData.media_url}
                      controls
                      className="w-full max-h-60 rounded"
                    />
                  )}
                  {formData.media_type === "audio" && (
                    <audio
                      src={formData.media_url}
                      controls
                      className="w-full"
                    />
                  )}
                  {formData.media_type === "image" && (
                    <img
                      src={formData.media_url}
                      alt="Current"
                      className="w-full max-h-60 object-cover rounded"
                    />
                  )}
                </div>
              )}

            {/* Current text file info */}
            {!selectedFile &&
              formData.media_type === "text" &&
              formData.media_url && (
                <p className="text-sm text-gray-600 mt-1">
                  File text hiện tại: {formData.media_url.split("/").pop()}
                </p>
              )}
          </div>

          {/* Media URL - Hidden */}
          <input type="hidden" value={formData.media_url} />

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

          {/* Transcription for Video/Audio */}
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
            disabled={!formData.media_url || uploadingFile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>{uploadingFile ? "Đang upload..." : "Cập nhật"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLessonMediaModal;
