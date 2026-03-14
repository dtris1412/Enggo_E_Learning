import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Flashcard {
  flashcard_id: number;
  front_content: string;
  back_content: string;
  example?: string | null;
  difficulty_level?: "easy" | "medium" | "hard" | null;
  pronunciation?: string | null;
}

interface EditFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcard: Flashcard;
  onSave: (data: {
    front_content: string;
    back_content: string;
    example?: string;
    difficulty_level?: "easy" | "medium" | "hard" | null;
    pronunciation?: string;
  }) => Promise<void>;
}

const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({
  isOpen,
  onClose,
  flashcard,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    front_content: "",
    back_content: "",
    example: "",
    difficulty_level: "",
    pronunciation: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (flashcard && isOpen) {
      setFormData({
        front_content: flashcard.front_content || "",
        back_content: flashcard.back_content || "",
        example: flashcard.example || "",
        difficulty_level: flashcard.difficulty_level || "",
        pronunciation: flashcard.pronunciation || "",
      });
      setErrors({});
    }
  }, [flashcard, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.front_content.trim()) {
      newErrors.front_content = "Mặt trước là bắt buộc";
    }

    if (!formData.back_content.trim()) {
      newErrors.back_content = "Mặt sau là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
        front_content: formData.front_content.trim(),
        back_content: formData.back_content.trim(),
        example: formData.example.trim() || undefined,
        difficulty_level:
          (formData.difficulty_level as "easy" | "medium" | "hard") ||
          undefined,
        pronunciation: formData.pronunciation.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error updating flashcard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Chỉnh sửa Flashcard</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Front Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mặt trước <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.front_content}
              onChange={(e) =>
                setFormData({ ...formData, front_content: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                errors.front_content ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Nhập nội dung mặt trước (ví dụ: từ tiếng Anh)"
            />
            {errors.front_content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.front_content}
              </p>
            )}
          </div>

          {/* Back Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mặt sau <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.back_content}
              onChange={(e) =>
                setFormData({ ...formData, back_content: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                errors.back_content ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Nhập nội dung mặt sau (ví dụ: nghĩa tiếng Việt)"
            />
            {errors.back_content && (
              <p className="text-red-500 text-sm mt-1">{errors.back_content}</p>
            )}
          </div>

          {/* Pronunciation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phát âm (tùy chọn)
            </label>
            <input
              type="text"
              value={formData.pronunciation}
              onChange={(e) =>
                setFormData({ ...formData, pronunciation: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ví dụ: /ˈhæpi/"
            />
          </div>

          {/* Example */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ví dụ (tùy chọn)
            </label>
            <textarea
              value={formData.example}
              onChange={(e) =>
                setFormData({ ...formData, example: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={2}
              placeholder="Câu ví dụ sử dụng từ này"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ khó (tùy chọn)
            </label>
            <select
              value={formData.difficulty_level}
              onChange={(e) =>
                setFormData({ ...formData, difficulty_level: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Chưa xác định</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlashcardModal;
