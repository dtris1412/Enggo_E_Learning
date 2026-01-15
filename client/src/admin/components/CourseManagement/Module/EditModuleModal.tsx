import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    module_title: string;
    module_description: string;
    order_index: number;
    estimated_time: number;
  }) => Promise<void>;
  initialData: {
    module_title: string;
    module_description: string;
    order_index: number;
    estimated_time: number;
  };
}

const EditModuleModal: React.FC<EditModuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.module_title.trim()) {
      newErrors.module_title = "Tên module không được để trống";
    }

    if (!formData.module_description.trim()) {
      newErrors.module_description = "Mô tả module không được để trống";
    }

    if (formData.order_index < 1) {
      newErrors.order_index = "Thứ tự phải lớn hơn 0";
    }

    if (formData.estimated_time < 0) {
      newErrors.estimated_time = "Thời gian ước tính phải lớn hơn hoặc bằng 0";
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
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa Module</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Module Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Module <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.module_title}
              onChange={(e) =>
                setFormData({ ...formData, module_title: e.target.value })
              }
              className={`w-full px-4 py-2 border ${
                errors.module_title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Ví dụ: Module 1: Giới thiệu về IELTS"
            />
            {errors.module_title && (
              <p className="mt-1 text-sm text-red-500">{errors.module_title}</p>
            )}
          </div>

          {/* Module Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả Module <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.module_description}
              onChange={(e) =>
                setFormData({ ...formData, module_description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-2 border ${
                errors.module_description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Mô tả chi tiết về nội dung module..."
            />
            {errors.module_description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.module_description}
              </p>
            )}
          </div>

          {/* Order Index and Estimated Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Order Index */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full px-4 py-2 border ${
                  errors.order_index ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.order_index && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.order_index}
                </p>
              )}
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian ước tính (giờ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimated_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_time: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-4 py-2 border ${
                  errors.estimated_time ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Ví dụ: 2.5"
              />
              {errors.estimated_time && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.estimated_time}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModuleModal;
