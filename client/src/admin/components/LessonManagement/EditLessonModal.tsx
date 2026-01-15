import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditLessonModalProps {
  isOpen: boolean;
  lesson: any;
  skills: any[];
  onClose: () => void;
  onSubmit: (data: {
    lesson_title: string;
    lesson_type: string;
    difficulty_level: string;
    lesson_content: string;
    is_exam_format: boolean;
    estimated_time: number;
    skill_id: number;
  }) => Promise<void>;
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({
  isOpen,
  lesson,
  skills,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    lesson_title: "",
    lesson_type: "reading",
    difficulty_level: "beginner",
    lesson_content: "",
    is_exam_format: false,
    estimated_time: 30,
    skill_id: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lesson) {
      setFormData({
        lesson_title: lesson.lesson_title || "",
        lesson_type: lesson.lesson_type || "reading",
        difficulty_level: lesson.difficulty_level || "beginner",
        lesson_content: lesson.lesson_content || "",
        is_exam_format: lesson.is_exam_format || false,
        estimated_time: lesson.estimated_time || 30,
        skill_id: lesson.skill_id || 0,
      });
    }
  }, [lesson]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.lesson_title.trim()) {
      newErrors.lesson_title = "Tiêu đề bài học không được để trống";
    }

    if (!formData.skill_id || formData.skill_id === 0) {
      newErrors.skill_id = "Vui lòng chọn kỹ năng";
    }

    if (formData.estimated_time <= 0) {
      newErrors.estimated_time = "Thời gian ước tính phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa bài học
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lesson Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lesson_title}
              onChange={(e) =>
                setFormData({ ...formData, lesson_title: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.lesson_title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: IELTS Reading Practice - Test 1"
            />
            {errors.lesson_title && (
              <p className="text-red-500 text-sm mt-1">{errors.lesson_title}</p>
            )}
          </div>

          {/* Lesson Type & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại bài học <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.lesson_type}
                onChange={(e) =>
                  setFormData({ ...formData, lesson_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
                <option value="grammar">Grammar</option>
                <option value="vocabulary">Vocabulary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ khó <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.difficulty_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty_level: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Skill & Estimated Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ năng <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.skill_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skill_id: Number(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.skill_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="0">-- Chọn kỹ năng --</option>
                {skills.map((skill) => (
                  <option key={skill.skill_id} value={skill.skill_id}>
                    {skill.skill_name}
                  </option>
                ))}
              </select>
              {errors.skill_id && (
                <p className="text-red-500 text-sm mt-1">{errors.skill_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian ước tính (phút){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimated_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_time: Number(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.estimated_time ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.estimated_time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.estimated_time}
                </p>
              )}
            </div>
          </div>

          {/* Lesson Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung bài học
            </label>
            <textarea
              value={formData.lesson_content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lesson_content: e.target.value,
                })
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập nội dung bài học..."
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_exam_format_edit"
              checked={formData.is_exam_format}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_exam_format: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_exam_format_edit"
              className="ml-2 block text-sm text-gray-700"
            >
              Định dạng bài thi
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLessonModal;
