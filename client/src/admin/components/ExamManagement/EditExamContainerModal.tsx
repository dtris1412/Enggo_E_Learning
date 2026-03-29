import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface EditExamContainerModalProps {
  isOpen: boolean;
  container: any;
  examType?: "TOEIC" | "IELTS";
  onClose: () => void;
  onSuccess: () => void;
}

// Map IELTS skill → container type
const getIeltsTypeFromSkill = (
  skill: string,
): "ielts_passage" | "writing_task" | "speaking_part" => {
  if (skill === "writing") return "writing_task";
  if (skill === "speaking") return "speaking_part";
  return "ielts_passage";
};

const EditExamContainerModal = ({
  isOpen,
  container,
  examType = "TOEIC",
  onClose,
  onSuccess,
}: EditExamContainerModalProps) => {
  const isIelts = examType === "IELTS";
  const {
    updateExamContainer,
    uploadExamAudio,
    uploadExamImages,
    loading,
    error,
  } = useExam();

  const [formData, setFormData] = useState({
    skill: "" as "listening" | "reading" | "writing" | "speaking" | "",
    type: "toeic_group" as
      | "toeic_group"
      | "toeic_single"
      | "ielts_passage"
      | "writing_task"
      | "speaking_part",
    order: 1,
    content: "",
    instruction: "",
    audio_url: "",
    image_url: "",
    time_limit: 0,
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (container) {
      setFormData({
        skill: container.skill || "",
        type: container.type || "toeic_group",
        order: container.order || 1,
        content: container.content || "",
        instruction: container.instruction || "",
        audio_url: container.audio_url || "",
        image_url: container.image_url || "",
        time_limit: container.time_limit || 0,
      });
    }
  }, [container]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "skill" && isIelts && value) {
      setFormData((prev) => ({
        ...prev,
        skill: value as "listening" | "reading" | "writing" | "speaking",
        type: getIeltsTypeFromSkill(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "order" || name === "time_limit"
            ? parseInt(value) || 0
            : value,
      }));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedAudioUrl = formData.audio_url;
    let uploadedImageUrl = formData.image_url;

    // Upload audio file if selected
    if (audioFile) {
      uploadedAudioUrl = (await uploadExamAudio(audioFile)) || "";
    }

    // Upload image file if selected
    if (imageFile) {
      const imageUrls = await uploadExamImages([imageFile]);
      if (imageUrls && imageUrls.length > 0) {
        uploadedImageUrl = imageUrls[0];
      }
    }

    const success = await updateExamContainer(container.container_id, {
      skill: formData.skill || undefined,
      type: formData.type,
      order: formData.order,
      content: formData.content,
      instruction: formData.instruction || undefined,
      audio_url: uploadedAudioUrl || undefined,
      image_url: uploadedImageUrl || undefined,
      time_limit: formData.time_limit || undefined,
    });

    if (success) {
      onSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Chỉnh sửa phần thi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ năng {isIelts && <span className="text-red-500">*</span>}
              </label>
              <select
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                required={isIelts}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn kỹ năng --</option>
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
            </div>

            {/* Type */}
            {isIelts ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại container (tự động)
                </label>
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">
                  {formData.skill === "listening" &&
                    "ielts_passage — Section (Listening)"}
                  {formData.skill === "reading" &&
                    "ielts_passage — Passage (Reading)"}
                  {formData.skill === "writing" &&
                    "writing_task — Writing Task"}
                  {formData.skill === "speaking" &&
                    "speaking_part — Speaking Part"}
                  {!formData.skill && "Chọn kỹ năng để xác định loại"}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="toeic_group">
                    TOEIC Group (Part 3, 4, 6, 7)
                  </option>
                  <option value="toeic_single">
                    TOEIC Single (Part 1, 2, 5)
                  </option>
                </select>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isIelts
                  ? formData.skill === "writing"
                    ? "Đề bài / Prompt"
                    : formData.skill === "speaking"
                      ? "Nội dung Part (Cue card / Câu hỏi)"
                      : formData.skill === "listening"
                        ? "Mô tả Section (tiêu đề / context)"
                        : "Nội dung Passage (đoạn văn đọc)"
                  : "Nội dung (Đoạn văn/Hội thoại...)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  isIelts
                    ? formData.skill === "writing"
                      ? "Nhập đề bài (describe the chart / write an essay...)"
                      : formData.skill === "speaking"
                        ? "Nhập nội dung cue card / câu hỏi part..."
                        : formData.skill === "listening"
                          ? "Nhập tiêu đề section hoặc script audio..."
                          : "Nhập đoạn văn đọc hiểu..."
                    : "Nhập nội dung cho phần thi này..."
                }
              />
            </div>

            {/* Instruction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hướng dẫn / Tiêu đề
              </label>
              <textarea
                name="instruction"
                value={formData.instruction}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  isIelts
                    ? formData.skill === "listening"
                      ? "VD: Section 1 — Questions 1–10"
                      : formData.skill === "reading"
                        ? "VD: Passage 1 — Reading Passage 1"
                        : formData.skill === "writing"
                          ? "VD: Task 1 — Writing Task 1"
                          : "VD: Part 1 — Interview"
                    : "Nhập hướng dẫn cho Part (VD: Questions 1-5)..."
                }
              />
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audio
                {isIelts && formData.skill === "listening"
                  ? " (Bắt buộc cho Section Listening)"
                  : " (Part Listening)"}
              </label>
              {formData.audio_url && !audioFile && (
                <p className="mb-2 text-sm text-green-600">
                  Audio hiện tại: {formData.audio_url}
                </p>
              )}
              <input
                type="file"
                accept=".mp3,.wav,.ogg"
                onChange={handleAudioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {audioFile && (
                <p className="mt-1 text-sm text-gray-500">
                  Mới: {audioFile.name}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (Part 4, 6, 7...)
              </label>
              {formData.image_url && !imageFile && (
                <p className="mb-2 text-sm text-green-600">
                  Image hiện tại: {formData.image_url}
                </p>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imageFile && (
                <p className="mt-1 text-sm text-gray-500">
                  Mới: {imageFile.name}
                </p>
              )}
            </div>

            {/* Order and Time Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn thời gian (phút)
                </label>
                <input
                  type="number"
                  name="time_limit"
                  value={formData.time_limit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamContainerModal;
