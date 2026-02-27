import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";

interface EditFlashcardSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcardSet: any;
  onSuccess: () => void;
}

const EditFlashcardSetModal: React.FC<EditFlashcardSetModalProps> = ({
  isOpen,
  onClose,
  flashcardSet,
  onSuccess,
}) => {
  const { updateFlashcardSet, loading } = useFlashcard();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    source_type: "manual",
    source_id: "",
    visibility: "public",
  });

  useEffect(() => {
    if (flashcardSet) {
      setFormData({
        title: flashcardSet.title || "",
        description: flashcardSet.description || "",
        source_type: flashcardSet.source_type || "manual",
        source_id: flashcardSet.source_id ? String(flashcardSet.source_id) : "",
        visibility: flashcardSet.visibility || "public",
      });
    }
  }, [flashcardSet]);

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

    const dataToSubmit = {
      title: formData.title,
      description: formData.description,
      source_type: formData.source_type,
      source_id: formData.source_id ? parseInt(formData.source_id) : null,
      visibility: formData.visibility,
    };

    const success = await updateFlashcardSet(
      flashcardSet.flashcard_set_id,
      dataToSubmit,
    );

    if (success) {
      showToast("success", "Flashcard set updated successfully");
      onSuccess();
    } else {
      showToast("error", "Failed to update flashcard set");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Flashcard Set
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ID: #{flashcardSet?.flashcard_set_id}
            </p>
          </div>
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
              Source Type
            </label>
            <select
              name="source_type"
              value={formData.source_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="manual">Manual</option>
              <option value="lesson">Lesson</option>
              <option value="exam">Exam</option>
              <option value="document">Document</option>
              <option value="AI">AI Generated</option>
            </select>
          </div>

          {/* Source ID */}
          {formData.source_type !== "manual" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source ID
              </label>
              <input
                type="number"
                name="source_id"
                value={formData.source_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter source ID"
              />
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

          {/* Metadata Info (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Metadata (Read-only)
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Owner User ID:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {flashcardSet?.user_id || "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Created By:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {flashcardSet?.created_by_type || "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Cards:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {flashcardSet?.total_cards || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {flashcardSet?.created_at
                    ? new Date(flashcardSet.created_at).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>

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
                  Updating...
                </>
              ) : (
                "Update Set"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlashcardSetModal;
