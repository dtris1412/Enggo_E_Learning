import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../../shared/components/Toast/Toast";
import { useReport } from "../contexts/reportContext";
import { AddReportModal } from "../components/ReportManagement";

interface Report {
  report_id: number;
  report_name: string;
  report_type: string;
  report_content: string;
  file_path: string;
  file_format: string;
  filters: string;
  created_at: string;
  user?: {
    user_id: number;
    user_name: string;
    user_email: string;
  };
}

const ReportManagementNew = () => {
  const { showToast } = useToast();
  const {
    reports,
    pagination,
    loading,
    error,
    fetchReportsPaginated,
    generateReport,
    downloadReport,
    deleteReport,
  } = useReport();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const reportTypes = [
    { value: "users", label: "Người dùng", icon: "👥" },
    { value: "courses", label: "Khóa học", icon: "📚" },
    { value: "lessons", label: "Bài học", icon: "📖" },
    { value: "exams", label: "Đề thi", icon: "📝" },
    { value: "blogs", label: "Tin tức", icon: "📰" },
    { value: "documents", label: "Tài liệu", icon: "📄" },
    { value: "roadmaps", label: "Lộ trình", icon: "🗺️" },
  ];

  useEffect(() => {
    loadReports();
  }, [currentPage, search, filterType]);

  useEffect(() => {
    if (error) {
      showToast("error", error);
    }
  }, [error, showToast]);

  const loadReports = () => {
    fetchReportsPaginated({
      page: currentPage,
      limit: 10,
      search,
      report_type: filterType,
    });
  };

  const handleGenerateReport = async (data: {
    report_name: string;
    report_type: string;
    filters?: any;
  }) => {
    const success = await generateReport(data);
    if (success) {
      showToast("success", "Tạo báo cáo thành công!");
      setShowAddModal(false);
      loadReports();
    } else if (error) {
      showToast("error", error);
    } else {
      showToast("error", "Lỗi khi tạo báo cáo");
    }
  };

  const handleDownloadReport = async (reportId: number, reportName: string) => {
    const success = await downloadReport(reportId, reportName);
    if (success) {
      showToast("success", "Tải báo cáo thành công!");
    } else if (error) {
      showToast("error", error);
    } else {
      showToast("error", "Lỗi khi tải báo cáo");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa báo cáo này?")) return;

    const success = await deleteReport(reportId);
    if (success) {
      showToast("success", "Xóa báo cáo thành công!");
      loadReports();
    } else if (error) {
      showToast("error", error);
    } else {
      showToast("error", "Lỗi khi xóa báo cáo");
    }
  };

  const getReportTypeLabel = (type: string) => {
    const found = reportTypes.find((t) => t.value === type);
    return found ? `${found.icon} ${found.label}` : type;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Báo cáo</h1>
          <p className="mt-1 text-gray-600">
            Tạo và quản lý các báo cáo hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          Tạo báo cáo mới
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Tất cả loại báo cáo</option>
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tên báo cáo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nội dung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Người tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không có báo cáo nào
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.report_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="text-green-600" size={20} />
                      <span className="font-medium text-gray-900">
                        {report.report_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                      {getReportTypeLabel(report.report_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.report_content}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.user?.user_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(report.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleDownloadReport(
                            report.report_id,
                            report.report_name,
                          )
                        }
                        className="rounded p-2 text-blue-600 hover:bg-blue-50"
                        title="Tải xuống"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.report_id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="flex items-center px-4 py-2">
            Trang {currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={currentPage === pagination.totalPages}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Add Report Modal */}
      <AddReportModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleGenerateReport}
      />
    </div>
  );
};

export default ReportManagementNew;
