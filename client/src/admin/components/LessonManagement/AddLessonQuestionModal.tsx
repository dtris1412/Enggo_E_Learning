import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useLessonQuestion } from "../../contexts/lessonQuestionContext.tsx";

interface AddLessonQuestionModalProps {
  isOpen: boolean;
  lessonId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLessonQuestionModal: React.FC<AddLessonQuestionModalProps> = ({
  isOpen,
  lessonId,
  onClose,
  onSuccess,
}) => {
  const { createQuestion, loading } = useLessonQuestion();

  const [formData, setFormData] = useState({
    order_index: 0,
    question_type: "multiple_choice",
    content: "",
    correct_answer: "",
    explaination: "",
    difficulty_level: "beginner",
    options: "",
    ai_model: "",
    status: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      order_index: 0,
      question_type: "multiple_choice",
      content: "",
      correct_answer: "",
      explaination: "",
      difficulty_level: "beginner",
      options: "",
      ai_model: "",
      status: true,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung câu hỏi là bắt buộc";
    }

    if (!formData.correct_answer.trim()) {
      newErrors.correct_answer = "Đáp án đúng là bắt buộc";
    }

    if (
      (formData.question_type === "multiple_choice" ||
        formData.question_type === "true_false") &&
      !formData.options.trim()
    ) {
      newErrors.options = "Các lựa chọn là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const success = await createQuestion({
      lesson_id: lessonId,
      ...formData,
    });

    if (success) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Thêm câu hỏi mới</h3>
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
              Thứ tự hiển thị
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

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại câu hỏi <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.question_type}
              onChange={(e) =>
                setFormData({ ...formData, question_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="true_false">Đúng/Sai</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập nội dung câu hỏi..."
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          {/* Options (for multiple choice and true/false) */}
          {(formData.question_type === "multiple_choice" ||
            formData.question_type === "true_false") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Các lựa chọn (JSON format){" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.options}
                onChange={(e) =>
                  setFormData({ ...formData, options: e.target.value })
                }
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.options ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  formData.question_type === "true_false"
                    ? '{"A": "Đúng", "B": "Sai"}'
                    : '{"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}'
                }
              />
              {errors.options && (
                <p className="text-sm text-red-500 mt-1">{errors.options}</p>
              )}
            </div>
          )}

          {/* Correct Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đáp án đúng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.correct_answer}
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.correct_answer ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={
                formData.question_type === "multiple_choice" ||
                formData.question_type === "true_false"
                  ? "A, B, C, hoặc D"
                  : "Nhập đáp án đúng"
              }
            />
            {errors.correct_answer && (
              <p className="text-sm text-red-500 mt-1">
                {errors.correct_answer}
              </p>
            )}
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giải thích (tùy chọn)
            </label>
            <textarea
              value={formData.explaination}
              onChange={(e) =>
                setFormData({ ...formData, explaination: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Giải thích đáp án..."
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ khó
            </label>
            <select
              value={formData.difficulty_level}
              onChange={(e) =>
                setFormData({ ...formData, difficulty_level: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
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
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? "Đang lưu..." : "Thêm"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLessonQuestionModal;
