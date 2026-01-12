import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    course_title: string;
    description: string;
    course_level: string;
    course_aim: string;
    estimate_duration: string;
  }) => Promise<void>;
  initialData: {
    course_title: string;
    description: string;
    course_level: string;
    course_aim: string;
    estimate_duration: string;
  };
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    course_title: initialData.course_title,
    description: initialData.description,
    course_level: initialData.course_level,
    course_aim: initialData.course_aim,
    estimate_duration: initialData.estimate_duration,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        course_title: initialData.course_title,
        description: initialData.description,
        course_level: initialData.course_level,
        course_aim: initialData.course_aim,
        estimate_duration: initialData.estimate_duration,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.course_title.trim()) {
      newErrors.course_title = "Tên khóa học không được để trống";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }
    if (!formData.course_aim.trim()) {
      newErrors.course_aim = "Mục tiêu khóa học không được để trống";
    }
    if (!formData.estimate_duration.trim()) {
      newErrors.estimate_duration = "Thời lượng ước tính không được để trống";
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
      onClose();
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa khóa học
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.course_title}
              onChange={(e) =>
                setFormData({ ...formData, course_title: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.course_title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: Speaking for IELTS..."
            />
            {errors.course_title && (
              <p className="text-red-500 text-sm mt-1">{errors.course_title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mô tả chi tiết về khóa học..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cấp độ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.course_level}
              onChange={(e) =>
                setFormData({ ...formData, course_level: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Beginner">Cơ bản</option>
              <option value="Intermediate">Trung cấp</option>
              <option value="Advanced">Nâng cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mục tiêu khóa học <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.course_aim}
              onChange={(e) =>
                setFormData({ ...formData, course_aim: e.target.value })
              }
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.course_aim ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mô tả mục tiêu đạt được sau khóa học..."
            />
            {errors.course_aim && (
              <p className="text-red-500 text-sm mt-1">{errors.course_aim}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời lượng ước tính <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.estimate_duration}
              onChange={(e) =>
                setFormData({ ...formData, estimate_duration: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.estimate_duration ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: 3 tháng, 40 giờ..."
            />
            {errors.estimate_duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimate_duration}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
