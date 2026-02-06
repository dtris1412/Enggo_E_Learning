import { useState } from "react";
import { X } from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface AddQuestionModalProps {
  isOpen: boolean;
  containerId: number;
  onClose: () => void;
  onSuccess: (questionId: number, containerQuestionId: number) => void;
}

const AddQuestionModal = ({
  isOpen,
  containerId,
  onClose,
  onSuccess,
}: AddQuestionModalProps) => {
  const {
    createQuestion,
    addQuestionToContainer,
    uploadExamImages,
    loading,
    error,
  } = useExam();

  const [formData, setFormData] = useState({
    question_content: "",
    explanation: "",
    order: 1,
    score: 1.0,
    image_url: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "order"
          ? parseInt(value) || 1
          : name === "score"
            ? parseFloat(value) || 1.0
            : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrl = formData.image_url;

    // Upload image file if selected
    if (imageFile) {
      const urls = await uploadExamImages([imageFile]);
      if (urls && urls.length > 0) {
        uploadedImageUrl = urls[0];
      }
    }

    // Step 1: Create the question
    const questionId = await createQuestion({
      question_content: formData.question_content,
      explanation: formData.explanation || undefined,
    });

    if (questionId) {
      // Step 2: Add question to container
      const containerQuestionId = await addQuestionToContainer({
        container_id: containerId,
        question_id: questionId,
        order: formData.order,
        image_url: uploadedImageUrl || undefined,
        score: formData.score,
      });

      if (containerQuestionId) {
        onSuccess(questionId, containerQuestionId);
        setFormData({
          question_content: "",
          explanation: "",
          order: 1,
          score: 1.0,
          image_url: "",
        });
        setImageFile(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thêm câu hỏi mới</h2>
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
            {/* Question Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question_content"
                value={formData.question_content}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giải thích
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Giải thích đáp án (tùy chọn)..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh (TOEIC Part 1)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imageFile && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            {/* Order and Score */}
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
                  Điểm số <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
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
              {loading ? "Đang thêm..." : "Thêm câu hỏi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
