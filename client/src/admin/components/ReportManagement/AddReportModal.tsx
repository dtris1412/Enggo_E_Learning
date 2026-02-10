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
    filters: {
      from_date: "",
      to_date: "",
      page: 1,
      limit: 1000,
    },
  });

  const reportTypes = [
    { value: "users", label: "Người dùng" },
    { value: "courses", label: "Khóa học" },
    { value: "lessons", label: "Bài học" },
    { value: "exams", label: "Đề thi" },
    { value: "blogs", label: "Tin tức" },
    { value: "documents", label: "Tài liệu" },
    { value: "roadmaps", label: "Lộ trình" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up empty values from filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(formData.filters).filter(([_, value]) => value !== ""),
    );
    onSubmit({
      ...formData,
      filters: cleanedFilters,
    });
  };

  const handleClose = () => {
    setFormData({
      report_name: "",
      report_type: "users",
      filters: {
        from_date: "",
        to_date: "",
        page: 1,
        limit: 1000,
      },
    });
    onClose();
  };

  const updateFilter = (key: string, value: any) => {
    setFormData({
      ...formData,
      filters: {
        ...formData.filters,
        [key]: value,
      },
    });
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
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900">Lọc theo thời gian</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={formData.filters.from_date}
                  onChange={(e) => updateFilter("from_date", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={formData.filters.to_date}
                  onChange={(e) => updateFilter("to_date", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pagination Options */}
          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900">Tùy chọn phân trang</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Số bản ghi tối đa
                </label>
                <select
                  value={formData.filters.limit}
                  onChange={(e) =>
                    updateFilter("limit", parseInt(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1,000</option>
                  <option value={5000}>5,000</option>
                  <option value={10000}>10,000</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Trang
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.filters.page}
                  onChange={(e) =>
                    updateFilter("page", parseInt(e.target.value) || 1)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Bạn có thể lọc báo cáo theo khoảng thời
              gian và giới hạn số lượng bản ghi. Nếu không chọn thời gian, hệ
              thống sẽ xuất toàn bộ dữ liệu.
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
