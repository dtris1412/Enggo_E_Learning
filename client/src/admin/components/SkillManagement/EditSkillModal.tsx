import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditSkillModalProps {
  isOpen: boolean;
  skill: any;
  onClose: () => void;
  onSubmit: (data: { skill_name: string }) => Promise<void>;
}

const EditSkillModal: React.FC<EditSkillModalProps> = ({
  isOpen,
  skill,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    skill_name: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        skill_name: skill.skill_name || "",
      });
    }
  }, [skill]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.skill_name.trim()) {
      newErrors.skill_name = "Tên kỹ năng không được để trống";
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
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa kỹ năng
          </h2>
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
              Tên kỹ năng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.skill_name}
              onChange={(e) =>
                setFormData({ ...formData, skill_name: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.skill_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: Listening, Reading, Writing, Speaking..."
            />
            {errors.skill_name && (
              <p className="text-red-500 text-sm mt-1">{errors.skill_name}</p>
            )}
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillModal;
