import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";

interface AddFlashcardSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddFlashcardSetModal: React.FC<AddFlashcardSetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createFlashcardSet, loading } = useFlashcard();
  const { exams, fetchExamsPaginated, loading: examsLoading } = useExam();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    source_type: "manual",
    exam_id: "",
    visibility: "public",
    user_id: "",
  });

  // Fetch exams khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchExamsPaginated({ limit: 100 }); // Lấy tất cả exams để chọn
    }
  }, [isOpen, fetchExamsPaginated]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("error", "Title is required");
      return;
    }

    // Validate: nếu chọn exam thì phải chọn exam_id
    if (formData.source_type === "exam" && !formData.exam_id) {
      showToast("error", "Please select an exam");
      return;
    }

    const dataToSubmit: any = {
      title: formData.title,
      description: formData.description,
      source_type: formData.source_type,
      visibility: formData.visibility,
      user_id: formData.user_id ? parseInt(formData.user_id) : undefined,
    };

    // Chỉ gửi exam_id nếu source_type = "exam"
    if (formData.source_type === "exam" && formData.exam_id) {
      dataToSubmit.exam_id = parseInt(formData.exam_id);
    }

    const success = await createFlashcardSet(dataToSubmit);

    if (success) {
      showToast("success", "Flashcard set created successfully");
      setFormData({
        title: "",
        description: "",
        source_type: "manual",
        exam_id: "",
        visibility: "public",
        user_id: "",
      });
      onSuccess();
    } else {
      showToast("error", "Failed to create flashcard set");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Flashcard Set
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter flashcard set title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter flashcard set description"
            />
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creation Method
            </label>
            <select
              name="source_type"
              value={formData.source_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="manual">Manual (Create Empty Set)</option>
              <option value="exam">From Exam (AI Generated)</option>
            </select>
            {formData.source_type === "exam" && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI will automatically generate flashcards from selected exam
              </p>
            )}
          </div>

          {/* Exam Selection - Only show when source_type = "exam" */}
          {formData.source_type === "exam" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exam <span className="text-red-500">*</span>
              </label>
              <select
                name="exam_id"
                value={formData.exam_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Choose an exam --</option>
                {examsLoading ? (
                  <option disabled>Loading exams...</option>
                ) : (
                  exams?.map((exam) => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                      {exam.exam_title} ({exam.exam_type})
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          {/* User ID - Admin can assign to specific user (Only for manual) */}
          {formData.source_type === "manual" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to User ID (Optional)
              </label>
              <input
                type="number"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty to assign to yourself"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to create for yourself. Only admins can assign to
                other users.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Set"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlashcardSetModal;
