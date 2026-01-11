import React, { useState } from "react";
import { X } from "lucide-react";

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    certificate_name: string;
    description: string;
    total_score: number;
  }) => Promise<void>;
}

const AddCertificateModal: React.FC<AddCertificateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    certificate_name: "",
    description: "",
    total_score: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.certificate_name.trim()) {
      newErrors.certificate_name = "Tên chứng chỉ không được để trống";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }
    if (formData.total_score <= 0) {
      newErrors.total_score = "Điểm số phải lớn hơn 0";
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
      setFormData({
        certificate_name: "",
        description: "",
        total_score: 0,
      });
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
            Tạo chứng chỉ mới
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
              Tên chứng chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.certificate_name}
              onChange={(e) =>
                setFormData({ ...formData, certificate_name: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.certificate_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: IELTS, TOEIC..."
            />
            {errors.certificate_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certificate_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mô tả chi tiết về chứng chỉ..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng điểm <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.total_score}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_score: Number(e.target.value),
                })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.total_score ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: 990, 9.0..."
            />
            {errors.total_score && (
              <p className="text-red-500 text-sm mt-1">{errors.total_score}</p>
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
              {isSubmitting ? "Đang xử lý..." : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCertificateModal;
