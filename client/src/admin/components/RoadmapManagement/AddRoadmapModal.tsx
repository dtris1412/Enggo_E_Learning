import React, { useState } from "react";
import { X } from "lucide-react";

interface Certificate {
  certificate_id: number;
  certificate_name: string;
}

interface AddRoadmapModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  certificates: Certificate[];
}

const AddRoadmapModal: React.FC<AddRoadmapModalProps> = ({
  onClose,
  onSubmit,
  certificates,
}) => {
  const [formData, setFormData] = useState({
    roadmap_title: "",
    roadmap_description: "",
    roadmap_aim: "",
    roadmap_level: "beginner",
    estimated_duration: 0,
    roadmap_status: true,
    certificate_id: 0,
    discount_percent: 0,
    roadmap_price: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.roadmap_title.trim()) {
      newErrors.roadmap_title = "Tiêu đề lộ trình không được để trống";
    }

    if (!formData.roadmap_description.trim()) {
      newErrors.roadmap_description = "Mô tả không được để trống";
    }

    if (!formData.roadmap_aim.trim()) {
      newErrors.roadmap_aim = "Mục tiêu không được để trống";
    }

    if (!formData.certificate_id || formData.certificate_id === 0) {
      newErrors.certificate_id = "Vui lòng chọn chứng chỉ";
    }

    if (!formData.estimated_duration || formData.estimated_duration <= 0) {
      newErrors.estimated_duration = "Thời gian ước tính phải lớn hơn 0";
    }

    if (formData.roadmap_price < 0) {
      newErrors.roadmap_price = "Giá không được âm";
    }

    if (formData.discount_percent < 0 || formData.discount_percent > 100) {
      newErrors.discount_percent = "Phần trăm giảm giá từ 0-100";
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
      setFormData({
        roadmap_title: "",
        roadmap_description: "",
        roadmap_aim: "",
        roadmap_level: "beginner",
        estimated_duration: 0,
        roadmap_status: true,
        certificate_id: 0,
        discount_percent: 0,
        roadmap_price: 0,
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      roadmap_title: "",
      roadmap_description: "",
      roadmap_aim: "",
      roadmap_level: "beginner",
      estimated_duration: 0,
      roadmap_status: true,
      certificate_id: 0,
      discount_percent: 0,
      roadmap_price: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tạo lộ trình mới</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề lộ trình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.roadmap_title}
              onChange={(e) =>
                setFormData({ ...formData, roadmap_title: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.roadmap_title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: Lộ trình IELTS từ 0 đến 7.0+"
            />
            {errors.roadmap_title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roadmap_title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.roadmap_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roadmap_description: e.target.value,
                })
              }
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.roadmap_description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Mô tả chi tiết về lộ trình học"
            />
            {errors.roadmap_description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roadmap_description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mục tiêu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.roadmap_aim}
              onChange={(e) =>
                setFormData({ ...formData, roadmap_aim: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.roadmap_aim ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: Đạt IELTS 7.0+"
            />
            {errors.roadmap_aim && (
              <p className="text-red-500 text-sm mt-1">{errors.roadmap_aim}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cấp độ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.roadmap_level}
                onChange={(e) =>
                  setFormData({ ...formData, roadmap_level: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (tháng) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_duration: parseInt(e.target.value) || 0,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.estimated_duration
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="6"
                min="0"
              />
              {errors.estimated_duration && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.estimated_duration}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chứng chỉ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.certificate_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  certificate_id: parseInt(e.target.value),
                })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.certificate_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={0}>Chọn chứng chỉ</option>
              {certificates.map((cert) => (
                <option key={cert.certificate_id} value={cert.certificate_id}>
                  {cert.certificate_name}
                </option>
              ))}
            </select>
            {errors.certificate_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certificate_id}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.roadmap_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roadmap_price: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.roadmap_price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1000000"
                min="0"
              />
              {errors.roadmap_price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.roadmap_price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảm giá (%)
              </label>
              <input
                type="number"
                value={formData.discount_percent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_percent: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.discount_percent ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
                max="100"
              />
              {errors.discount_percent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount_percent}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="roadmap_status"
              checked={formData.roadmap_status}
              onChange={(e) =>
                setFormData({ ...formData, roadmap_status: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="roadmap_status"
              className="ml-2 block text-sm text-gray-700"
            >
              Kích hoạt lộ trình ngay
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
              {isSubmitting ? "Đang tạo..." : "Tạo lộ trình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoadmapModal;
