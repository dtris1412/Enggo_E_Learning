import { useState } from "react";
import { X } from "lucide-react";

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    report_name: string;
    report_type: string;
    filters?: any;
  }) => void;
  loading?: boolean;
}

const AddReportModal: React.FC<AddReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    report_name: "",
    report_type: "users",
    filters: {},
  });

  const reportTypes = [
    { value: "users", label: "Người dùng", icon: "👥" },
    { value: "courses", label: "Khóa học", icon: "📚" },
    { value: "lessons", label: "Bài học", icon: "📖" },
    { value: "exams", label: "Đề thi", icon: "📝" },
    { value: "blogs", label: "Tin tức", icon: "📰" },
    { value: "documents", label: "Tài liệu", icon: "📄" },
    { value: "roadmaps", label: "Lộ trình", icon: "🗺️" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      report_name: "",
      report_type: "users",
      filters: {},
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Tạo báo cáo mới</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tên báo cáo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.report_name}
              onChange={(e) =>
                setFormData({ ...formData, report_name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Báo cáo người dùng tháng 2/2026"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Loại báo cáo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.report_type}
              onChange={(e) =>
                setFormData({ ...formData, report_type: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Lưu ý:</strong> Báo cáo sẽ xuất toàn bộ dữ liệu hiện có
              của loại đã chọn. File Excel sẽ được tạo và lưu vào hệ thống.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReportModal;
