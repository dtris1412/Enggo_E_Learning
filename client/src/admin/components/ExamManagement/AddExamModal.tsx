import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddExamModal = ({ isOpen, onClose, onSuccess }: AddExamModalProps) => {
  const { createExam, loading, error } = useExam();

  const [formData, setFormData] = useState({
    exam_title: "",
    exam_duration: 120,
    exam_type: "TOEIC" as "TOEIC" | "IELTS",
    certificate_id: "",
    source: "",
  });

  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    // Fetch certificates for dropdown
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/admin/certificates/paginated?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.success) {
        setCertificates(result.data.certificates || []);
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "exam_duration" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const examData: any = {
      exam_title: formData.exam_title,
      exam_duration: formData.exam_duration,
      exam_type: formData.exam_type,
    };

    // Only include certificate_id if one is selected
    if (formData.certificate_id) {
      examData.certificate_id = parseInt(formData.certificate_id);
    }

    // Only include source if provided
    if (formData.source) {
      examData.source = formData.source;
    }

    const success = await createExam(examData);
    if (success) {
      onSuccess();
      // Reset form
      setFormData({
        exam_title: "",
        exam_duration: 120,
        exam_type: "TOEIC",
        certificate_id: "",
        source: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thêm đề thi mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Exam Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề đề thi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="exam_title"
                value={formData.exam_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề đề thi"
              />
            </div>

            {/* Exam Type and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại đề thi <span className="text-red-500">*</span>
                </label>
                <select
                  name="exam_type"
                  value={formData.exam_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TOEIC">TOEIC (200 câu)</option>
                  <option value="IELTS">IELTS (40 câu)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="exam_duration"
                  value={formData.exam_duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="120"
                />
              </div>
            </div>

            {/* Certificate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chứng chỉ <span className="text-red-500">*</span>
              </label>
              <select
                name="certificate_id"
                value={formData.certificate_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn chứng chỉ --</option>
                {certificates.map((cert) => (
                  <option key={cert.certificate_id} value={cert.certificate_id}>
                    {cert.certificate_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nguồn (tùy chọn)
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: ETS Official Guide, Cambridge IELTS"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang thêm..." : "Thêm đề thi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamModal;
