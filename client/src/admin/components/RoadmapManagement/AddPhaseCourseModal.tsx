import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useCourse } from "../../contexts/courseContext";

interface Course {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  estimate_duration: string;
  price: number;
}

interface AddPhaseCourseModalProps {
  onClose: () => void;
  onSubmit: (data: {
    course_id: number;
    order_number: number;
    is_required: boolean;
  }) => Promise<void>;
  existingCourseIds: number[];
}

const AddPhaseCourseModal: React.FC<AddPhaseCourseModalProps> = ({
  onClose,
  onSubmit,
  existingCourseIds,
}) => {
  const { courses, fetchCoursesPaginated } = useCourse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    order_number: 1,
    is_required: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoursesPaginated(searchTerm, 100, 1, true);
  }, [searchTerm, fetchCoursesPaginated]);

  const availableCourses = courses.filter(
    (course) => !existingCourseIds.includes(course.course_id),
  );

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedCourse) {
      newErrors.course = "Vui lòng chọn khóa học";
    }

    if (!formData.order_number || formData.order_number <= 0) {
      newErrors.order_number = "Thứ tự phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedCourse) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        course_id: selectedCourse.course_id,
        order_number: formData.order_number,
        is_required: formData.is_required,
      });
      setSelectedCourse(null);
      setFormData({
        order_number: 1,
        is_required: true,
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCourse(null);
    setFormData({
      order_number: 1,
      is_required: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Thêm khóa học vào giai đoạn
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
          {/* Search Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm khóa học <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên khóa học..."
              />
            </div>
          </div>

          {/* Course List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn khóa học <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
              {availableCourses.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Không có khóa học nào khả dụng
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableCourses.map((course) => (
                    <div
                      key={course.course_id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedCourse?.course_id === course.course_id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {course.course_title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {course.course_level}
                            </span>
                            <span>{course.estimate_duration}</span>
                            <span className="font-medium text-blue-600">
                              {course.price.toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        </div>
                        {selectedCourse?.course_id === course.course_id && (
                          <div className="ml-4">
                            <svg
                              className="h-6 w-6 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.course && (
              <p className="mt-1 text-sm text-red-500">{errors.course}</p>
            )}
          </div>

          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự hiển thị <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.order_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_number: parseInt(e.target.value),
                })
              }
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.order_number ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập thứ tự hiển thị..."
            />
            {errors.order_number && (
              <p className="mt-1 text-sm text-red-500">{errors.order_number}</p>
            )}
          </div>

          {/* Is Required */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_required"
              checked={formData.is_required}
              onChange={(e) =>
                setFormData({ ...formData, is_required: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_required"
              className="ml-2 block text-sm text-gray-700"
            >
              Khóa học bắt buộc
            </label>
          </div>

          {/* Selected Course Preview */}
          {selectedCourse && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Khóa học đã chọn:
              </p>
              <p className="text-gray-900 font-semibold">
                {selectedCourse.course_title}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedCourse}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang thêm..." : "Thêm khóa học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhaseCourseModal;
