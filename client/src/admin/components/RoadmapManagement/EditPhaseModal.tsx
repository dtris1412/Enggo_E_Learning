import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Phase {
  phase_id: number;
  phase_name: string;
  phase_description: string;
  order: number;
  phase_aims: string;
  roadmap_id: number;
  created_at: string;
  updated_at: string;
}

interface EditPhaseModalProps {
  phase: Phase;
  onClose: () => void;
  onSubmit: (data: {
    phase_name: string;
    phase_description: string;
    order: number;
    phase_aims: string;
  }) => Promise<void>;
}

const EditPhaseModal: React.FC<EditPhaseModalProps> = ({
  phase,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    phase_name: "",
    phase_description: "",
    order: 1,
    phase_aims: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (phase) {
      setFormData({
        phase_name: phase.phase_name,
        phase_description: phase.phase_description,
        order: phase.order,
        phase_aims: phase.phase_aims,
      });
    }
  }, [phase]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.phase_name.trim()) {
      newErrors.phase_name = "Tên giai đoạn không được để trống";
    }

    if (!formData.phase_description.trim()) {
      newErrors.phase_description = "Mô tả không được để trống";
    }

    if (!formData.phase_aims.trim()) {
      newErrors.phase_aims = "Mục tiêu không được để trống";
    }

    if (!formData.order || formData.order <= 0) {
      newErrors.order = "Thứ tự phải lớn hơn 0";
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa giai đoạn
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
          {/* Phase Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên giai đoạn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.phase_name}
              onChange={(e) =>
                setFormData({ ...formData, phase_name: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phase_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên giai đoạn..."
            />
            {errors.phase_name && (
              <p className="mt-1 text-sm text-red-500">{errors.phase_name}</p>
            )}
          </div>

          {/* Phase Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả giai đoạn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.phase_description}
              onChange={(e) =>
                setFormData({ ...formData, phase_description: e.target.value })
              }
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phase_description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mô tả giai đoạn..."
            />
            {errors.phase_description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phase_description}
              </p>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.order ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập thứ tự giai đoạn..."
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-500">{errors.order}</p>
            )}
          </div>

          {/* Phase Aims */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mục tiêu giai đoạn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.phase_aims}
              onChange={(e) =>
                setFormData({ ...formData, phase_aims: e.target.value })
              }
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phase_aims ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mục tiêu cần đạt được trong giai đoạn này..."
            />
            {errors.phase_aims && (
              <p className="mt-1 text-sm text-red-500">{errors.phase_aims}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mỗi mục tiêu trên một dòng để dễ đọc
            </p>
          </div>

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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhaseModal;
