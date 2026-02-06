import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface EditExamContainerModalProps {
  isOpen: boolean;
  container: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditExamContainerModal = ({
  isOpen,
  container,
  onClose,
  onSuccess,
}: EditExamContainerModalProps) => {
  const { updateExamContainer, uploadExamAudio, loading, error } = useExam();

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
    time_limit: 0,
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    if (container) {
      setFormData({
        skill: container.skill || "",
        type: container.type || "toeic_group",
        order: container.order || 1,
        content: container.content || "",
        instruction: container.instruction || "",
        audio_url: container.audio_url || "",
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
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "order" || name === "time_limit"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedAudioUrl = formData.audio_url;

    // Upload audio file if selected
    if (audioFile) {
      uploadedAudioUrl = (await uploadExamAudio(audioFile)) || "";
    }

    const success = await updateExamContainer(container.container_id, {
      skill: formData.skill || undefined,
      type: formData.type,
      order: formData.order,
      content: formData.content,
      instruction: formData.instruction || undefined,
      audio_url: uploadedAudioUrl || undefined,
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
                Kỹ năng
              </label>
              <select
                name="skill"
                value={formData.skill}
                onChange={handleChange}
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
                <option value="ielts_passage">IELTS Passage</option>
                <option value="writing_task">Writing Task</option>
                <option value="speaking_part">Speaking Part</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung (Đoạn văn/Hội thoại...){" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập nội dung cho phần thi này..."
              />
            </div>

            {/* Instruction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hướng dẫn
              </label>
              <textarea
                name="instruction"
                value={formData.instruction}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập hướng dẫn cho Part (VD: Questions 1-5)..."
              />
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audio (Part Listening)
              </label>
              {formData.audio_url && !audioFile && (
                <p className="mb-2 text-sm text-green-600">
                  Audio hiện tại: {formData.audio_url}
                </p>
              )}
              <input
                type="file"
                accept=".mp3,.wav,.ogg"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {audioFile && (
                <p className="mt-1 text-sm text-gray-500">
                  Mới: {audioFile.name}
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
