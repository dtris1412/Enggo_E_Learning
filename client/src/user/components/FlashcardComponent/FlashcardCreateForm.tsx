import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { ArrowLeft, Save, BookMarked, Globe, LockKeyhole } from "lucide-react";

interface FlashcardCreateFormProps {
  isEditMode?: boolean;
}

const FlashcardCreateForm: React.FC<FlashcardCreateFormProps> = ({
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const { flashcard_set_id } = useParams<{ flashcard_set_id: string }>();
  const {
    createFlashcardSet,
    updateFlashcardSet,
    getFlashcardSetById,
    loading,
  } = useFlashcard();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "private" as "public" | "private",
  });

  const [errors, setErrors] = useState({
    title: "",
  });

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && flashcard_set_id) {
      const loadFlashcardSet = async () => {
        try {
          const data = await getFlashcardSetById(Number(flashcard_set_id));
          if (data) {
            setFormData({
              title: data.title || "",
              description: data.description || "",
              visibility: data.visibility || "private",
            });
          } else {
            showToast("error", "Không tìm thấy flashcard set");
            navigate("/flashcards");
          }
        } catch (error) {
          showToast("error", "Có lỗi xảy ra khi tải dữ liệu");
          navigate("/flashcards");
        }
      };
      loadFlashcardSet();
    }
  }, [isEditMode, flashcard_set_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVisibilityChange = (visibility: "public" | "private") => {
    setFormData((prev) => ({ ...prev, visibility }));
  };

  const validateForm = () => {
    const newErrors = { title: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
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

    let result;

    if (isEditMode && flashcard_set_id) {
      // Update existing set
      result = await updateFlashcardSet(Number(flashcard_set_id), formData);

      if (result.success) {
        showToast("success", "Cập nhật flashcard set thành công!");
        navigate(`/flashcards/${flashcard_set_id}`);
      } else {
        showToast("error", result.message || "Có lỗi xảy ra khi cập nhật");
      }
    } else {
      // Create new set
      result = await createFlashcardSet(formData);

      if (result.success) {
        showToast("success", "Tạo flashcard set thành công!");
        navigate(`/flashcards/${result.data.flashcard_set_id}`);
      } else {
        showToast(
          "error",
          result.message || "Có lỗi xảy ra khi tạo flashcard set",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/flashcards")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditMode
                  ? "Chỉnh sửa Flashcard Set"
                  : "Tạo Flashcard Set Mới"}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {isEditMode
                  ? "Cập nhật thông tin bộ flashcard"
                  : "Tạo bộ flashcard mới để bắt đầu học tập"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-300 focus:ring-violet-200 focus:border-violet-400"
                }`}
                placeholder="Ví dụ: Từ vựng IELTS Band 7+"
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all resize-none"
                placeholder="Mô tả ngắn về bộ flashcard này..."
                disabled={loading}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Quyền riêng tư
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange("private")}
                  disabled={loading}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    formData.visibility === "private"
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <LockKeyhole
                    className={`w-5 h-5 ${
                      formData.visibility === "private"
                        ? "text-violet-600"
                        : "text-slate-400"
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm">Riêng tư</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Chỉ bạn có thể xem
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleVisibilityChange("public")}
                  disabled={loading}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    formData.visibility === "public"
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <Globe
                    className={`w-5 h-5 ${
                      formData.visibility === "public"
                        ? "text-violet-600"
                        : "text-slate-400"
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm">Công khai</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Mọi người có thể xem
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/flashcards")}
              disabled={loading}
              className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Tạo Flashcard Set
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-violet-50 border border-violet-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BookMarked className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-violet-800">
              <p className="font-semibold mb-1">💡 Mẹo:</p>
              <p>
                Sau khi tạo flashcard set, bạn có thể thêm các thẻ flashcard vào
                bộ. Mỗi thẻ sẽ có mặt trước (thuật ngữ) và mặt sau (định nghĩa).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreateForm;
