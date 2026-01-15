import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface LinkCertificateSkillModalProps {
  isOpen: boolean;
  skill: any;
  certificates: any[];
  onClose: () => void;
  onSubmit: (data: {
    certificate_id: number;
    weight: number;
    description: string;
  }) => Promise<void>;
}

const LinkCertificateSkillModal: React.FC<LinkCertificateSkillModalProps> = ({
  isOpen,
  skill,
  certificates,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    certificate_id: 0,
    weight: 0,
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out already linked certificates
  const availableCertificates = certificates.filter((cert) => {
    if (!skill?.Certificate_Skills) return true;
    return !skill.Certificate_Skills.some(
      (cs: any) => cs.certificate_id === cert.certificate_id
    );
  });

  useEffect(() => {
    if (availableCertificates.length > 0) {
      setFormData({
        certificate_id: availableCertificates[0].certificate_id,
        weight: 0,
        description: "",
      });
    }
  }, [skill, certificates]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.certificate_id || formData.certificate_id === 0) {
      newErrors.certificate_id = "Vui lòng chọn chứng chỉ";
    }

    if (formData.weight <= 0) {
      newErrors.weight = "Trọng số phải lớn hơn 0";
    }

    if (formData.weight > 100) {
      newErrors.weight = "Trọng số không được vượt quá 100";
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
        certificate_id: availableCertificates[0]?.certificate_id || 0,
        weight: 0,
        description: "",
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
      certificate_id: availableCertificates[0]?.certificate_id || 0,
      weight: 0,
      description: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Liên kết chứng chỉ
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Kỹ năng: <span className="font-medium">{skill?.skill_name}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {availableCertificates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Tất cả chứng chỉ đã được liên kết với kỹ năng này
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn chứng chỉ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.certificate_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certificate_id: Number(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.certificate_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                {availableCertificates.map((cert) => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trọng số (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: Number(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="VD: 25.0"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Trọng số của kỹ năng này trong chứng chỉ (0-100%)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Listening accounts for 25% of total score..."
              />
            </div>

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
                {isSubmitting ? "Đang liên kết..." : "Liên kết"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LinkCertificateSkillModal;
