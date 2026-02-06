import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface QuestionOption {
  question_option_id: number;
  label: string;
  content: string;
  is_correct: boolean;
  order_index: number;
}

interface AddQuestionOptionModalProps {
  isOpen: boolean;
  containerQuestionId: number;
  existingOptions?: QuestionOption[];
  onClose: () => void;
  onSuccess: () => void;
}

const AddQuestionOptionModal = ({
  isOpen,
  containerQuestionId,
  existingOptions = [],
  onClose,
  onSuccess,
}: AddQuestionOptionModalProps) => {
  const { createQuestionOption, loading, error } = useExam();

  // Calculate next available label and order_index
  const getNextLabelAndOrder = () => {
    if (!existingOptions || existingOptions.length === 0) {
      return { label: "A", order_index: 1 };
    }

    const labels = ["A", "B", "C", "D"];
    const usedLabels = existingOptions.map((opt) => opt.label);
    const nextLabel =
      labels.find((label) => !usedLabels.includes(label)) || "A";
    const maxOrder = Math.max(
      ...existingOptions.map((opt) => opt.order_index),
      0,
    );

    return { label: nextLabel, order_index: maxOrder + 1 };
  };

  const [formData, setFormData] = useState({
    label: "A",
    content: "",
    is_correct: false,
    order_index: 1,
  });

  // Update default values when modal opens or existing options change
  useEffect(() => {
    if (isOpen) {
      const { label, order_index } = getNextLabelAndOrder();
      setFormData({
        label,
        content: "",
        is_correct: false,
        order_index,
      });
    }
  }, [isOpen, existingOptions]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "order_index"
            ? parseInt(value) || 1
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if already has 4 options
    if (existingOptions.length >= 4) {
      alert("Mỗi câu hỏi chỉ có tối đa 4 đáp án (A, B, C, D)");
      return;
    }

    const success = await createQuestionOption({
      container_question_id: containerQuestionId,
      ...formData,
    });

    if (success) {
      onSuccess();
      // Reset to next available after current one
      const { label, order_index } = getNextLabelAndOrder();
      setFormData({
        label,
        content: "",
        is_correct: false,
        order_index,
      });
    }
  };

  if (!isOpen) return null;

  const hasCorrectAnswer = existingOptions.some((opt) => opt.is_correct);
  const isFull = existingOptions.length >= 4;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thêm đáp án</h2>
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

          {isFull && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
              ⚠️ Đã đủ 4 đáp án (A, B, C, D). Không thể thêm đáp án mới.
            </div>
          )}

          {existingOptions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              Đã có {existingOptions.length}/4 đáp án:{" "}
              {existingOptions.map((opt) => opt.label).join(", ")}
            </div>
          )}

          <div className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhãn (A/B/C/D) <span className="text-red-500">*</span>
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Option Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung đáp án <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập nội dung đáp án..."
              />
            </div>

            {/* Is Correct */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_correct"
                checked={formData.is_correct}
                onChange={handleChange}
                disabled={hasCorrectAnswer && !formData.is_correct}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Đây là đáp án đúng
                {hasCorrectAnswer && !formData.is_correct && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Đã có đáp án đúng)
                  </span>
                )}
              </label>
            </div>

            {/* Order Index */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="order_index"
                value={formData.order_index}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              disabled={loading || isFull}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Đang thêm..."
                : isFull
                  ? "Đã đủ 4 đáp án"
                  : "Thêm đáp án"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionOptionModal;
