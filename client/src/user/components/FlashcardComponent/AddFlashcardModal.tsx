import React, { useState } from "react";
import { X, Save, FileText, Volume2 } from "lucide-react";

interface AddFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    front_content: string;
    back_content: string;
    example?: string;
    difficulty_level?: "easy" | "medium" | "hard" | null;
    pronunciation?: string;
  }) => Promise<void>;
  loading?: boolean;
}

const AddFlashcardModal: React.FC<AddFlashcardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    front_content: "",
    back_content: "",
    example: "",
    difficulty_level: "" as "" | "easy" | "medium" | "hard",
    pronunciation: "",
  });

  const [errors, setErrors] = useState({
    front_content: "",
    back_content: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { front_content: "", back_content: "" };
    let isValid = true;

    if (!formData.front_content.trim()) {
      newErrors.front_content = "Mặt trước không được để trống";
      isValid = false;
    }

    if (!formData.back_content.trim()) {
      newErrors.back_content = "Mặt sau không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      front_content: formData.front_content.trim(),
      back_content: formData.back_content.trim(),
      example: formData.example.trim() || undefined,
      difficulty_level: formData.difficulty_level || null,
      pronunciation: formData.pronunciation.trim() || undefined,
    };

    await onSubmit(submitData);

    // Reset form
    setFormData({
      front_content: "",
      back_content: "",
      example: "",
      difficulty_level: "",
      pronunciation: "",
    });
    setErrors({ front_content: "", back_content: "" });
  };

  const handleClose = () => {
    setFormData({
      front_content: "",
      back_content: "",
      example: "",
      difficulty_level: "",
      pronunciation: "",
    });
    setErrors({ front_content: "", back_content: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Thêm thẻ mới</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Front Content */}
          <div>
            <label
              htmlFor="front_content"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Mặt trước <span className="text-red-500">*</span>
            </label>
            <textarea
              id="front_content"
              name="front_content"
              value={formData.front_content}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.front_content
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-400"
              }`}
              placeholder="Ví dụ: What is React?"
              disabled={loading}
            />
            {errors.front_content && (
              <p className="mt-2 text-sm text-red-600">
                {errors.front_content}
              </p>
            )}
          </div>

          {/* Back Content */}
          <div>
            <label
              htmlFor="back_content"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Mặt sau <span className="text-red-500">*</span>
            </label>
            <textarea
              id="back_content"
              name="back_content"
              value={formData.back_content}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.back_content
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-indigo-200 focus:border-indigo-400"
              }`}
              placeholder="Ví dụ: A JavaScript library for building user interfaces"
              disabled={loading}
            />
            {errors.back_content && (
              <p className="mt-2 text-sm text-red-600">{errors.back_content}</p>
            )}
          </div>

          {/* Example */}
          <div>
            <label
              htmlFor="example"
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Ví dụ
            </label>
            <textarea
              id="example"
              name="example"
              value={formData.example}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none"
              placeholder="Ví dụ minh họa (tùy chọn)"
              disabled={loading}
            />
          </div>

          {/* Pronunciation */}
          <div>
            <label
              htmlFor="pronunciation"
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Phát âm
            </label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              placeholder="Ví dụ: /riˈækt/"
              disabled={loading}
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label
              htmlFor="difficulty_level"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Độ khó
            </label>
            <select
              id="difficulty_level"
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              disabled={loading}
            >
              <option value="">Chọn độ khó (tùy chọn)</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Thêm thẻ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlashcardModal;
