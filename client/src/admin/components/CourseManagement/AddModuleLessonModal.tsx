import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useLesson } from "../../contexts/lessonContext.tsx";

interface Lesson {
  lesson_id: number;
  lesson_title: string;
  lesson_type: string;
  lesson_content: string;
  duration: number;
  is_preview: boolean;
}

interface AddModuleLessonModalProps {
  onClose: () => void;
  onSubmit: (data: {
    lesson_id: number;
    description: string;
    order_index: number;
    status: boolean;
  }) => Promise<void>;
  existingLessonIds: number[];
}

const AddModuleLessonModal: React.FC<AddModuleLessonModalProps> = ({
  onClose,
  onSubmit,
  existingLessonIds,
}) => {
  const { lessons, fetchLessonsPaginated } = useLesson();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    order_index: 1,
    status: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // fetchLessonsPaginated(search, limit, page, lesson_type, difficulty_level, is_exam_format, lesson_status)
    fetchLessonsPaginated(searchTerm, 100, 1, "", "", undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const availableLessons = lessons.filter(
    (lesson) => !existingLessonIds.includes(lesson.lesson_id),
  );

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedLesson) {
      newErrors.lesson = "Vui lòng chọn bài học";
    }

    if (!formData.order_index || formData.order_index <= 0) {
      newErrors.order_index = "Thứ tự phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedLesson) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        lesson_id: selectedLesson.lesson_id,
        description: formData.description,
        order_index: formData.order_index,
        status: formData.status,
      });
      setSelectedLesson(null);
      setFormData({
        description: "",
        order_index: 1,
        status: true,
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedLesson(null);
    setFormData({
      description: "",
      order_index: 1,
      status: true,
    });
    setErrors({});
    onClose();
  };

  const getLessonTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      video: "Video",
      reading: "Đọc",
      quiz: "Bài tập",
      practice: "Thực hành",
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Thêm bài học vào module
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Search Lessons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm bài học <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên bài học..."
              />
            </div>
          </div>

          {/* Lesson List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn bài học <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
              {availableLessons.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Không có bài học nào khả dụng
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableLessons.map((lesson) => (
                    <div
                      key={lesson.lesson_id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedLesson?.lesson_id === lesson.lesson_id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {lesson.lesson_title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {getLessonTypeLabel(lesson.lesson_type)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {lesson.duration} phút
                            </span>
                            {lesson.is_preview && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                Xem trước
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedLesson?.lesson_id === lesson.lesson_id && (
                          <div className="ml-4">
                            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.lesson && (
              <p className="mt-1 text-sm text-red-600">{errors.lesson}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả cho bài học trong module này..."
            />
          </div>

          {/* Order Index */}
          <div>
            <label
              htmlFor="order_index"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Thứ tự <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="order_index"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
            {errors.order_index && (
              <p className="mt-1 text-sm text-red-600">{errors.order_index}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="status"
              checked={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="status" className="ml-2 text-sm text-gray-700">
              Kích hoạt
            </label>
          </div>

          {/* Selected Lesson Summary */}
          {selectedLesson && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Bài học đã chọn:
              </h4>
              <p className="text-sm text-gray-700">
                <span className="font-medium">
                  {selectedLesson.lesson_title}
                </span>
                {" - "}
                <span className="text-gray-600">
                  {getLessonTypeLabel(selectedLesson.lesson_type)}
                </span>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedLesson}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Đang thêm..." : "Thêm bài học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleLessonModal;
