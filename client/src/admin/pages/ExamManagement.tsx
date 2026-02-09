import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Award,
  FileText,
} from "lucide-react";
import { useExam } from "../contexts/examContext";
import { AddExamModal, EditExamModal } from "../components/ExamManagement";
import ExportButton from "../components/ExportButton";

const ExamManagement = () => {
  const navigate = useNavigate();
  const { exams, pagination, loading, error, fetchExamsPaginated, deleteExam } =
    useExam();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  useEffect(() => {
    loadExams();
  }, [currentPage, searchTerm, selectedType]);

  const loadExams = () => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedType !== "all") params.exam_type = selectedType;

    fetchExamsPaginated(params);
  };

  const handleDelete = async (exam_id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này?")) {
      const success = await deleteExam(exam_id);
      if (success) {
        loadExams();
      }
    }
  };

  const handleEdit = (exam: any) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (exam_id: number) => {
    navigate(`/admin/exams/${exam_id}`);
  };

  const getTypeLabel = (type: string) => {
    const types: any = {
      TOEIC: "TOEIC",
      IELTS: "IELTS",
    };
    return types[type] || type;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý Đề thi
        </h1>
        <p className="text-gray-600">
          Quản lý tất cả các bài thi, câu hỏi và đáp án
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng số đề thi</p>
              <p className="text-2xl font-bold text-gray-800">
                {pagination?.total || 0}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đề thi TOEIC</p>
              <p className="text-2xl font-bold text-green-600">
                {exams?.filter((e) => e.exam_type === "TOEIC").length || 0}
              </p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đề thi IELTS</p>
              <p className="text-2xl font-bold text-purple-600">
                {exams?.filter((e) => e.exam_type === "IELTS").length || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm đề thi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả loại</option>
            <option value="TOEIC">TOEIC</option>
            <option value="IELTS">IELTS</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="mt-4 flex justify-end gap-3">
          <ExportButton
            type="exams"
            filters={{
              search: searchTerm,
              exam_type: selectedType !== "all" ? selectedType : undefined,
            }}
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm đề thi mới
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : !exams || exams.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy đề thi nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng số câu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nguồn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.exam_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {exam.exam_title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mã: {exam.exam_code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {getTypeLabel(exam.exam_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Clock className="w-4 h-4" />
                        {exam.exam_duration} phút
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {exam.total_questions} câu
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {exam.source || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(exam.exam_id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(exam)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.exam_id)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pagination?.totalPages || 1, p + 1),
                  )
                }
                disabled={currentPage === (pagination?.totalPages || 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * (pagination?.limit || 10) + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * (pagination?.limit || 10),
                      pagination?.total || 0,
                    )}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{pagination?.total || 0}</span>{" "}
                  kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {Array.from(
                    { length: pagination?.totalPages || 0 },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === (pagination?.totalPages || 1) ||
                        Math.abs(page - currentPage) <= 2,
                    )
                    .map((page, index, array) => (
                      <>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </>
                    ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination?.totalPages || 1, p + 1),
                      )
                    }
                    disabled={currentPage === (pagination?.totalPages || 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddExamModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            loadExams();
          }}
        />
      )}

      {isEditModalOpen && selectedExam && (
        <EditExamModal
          isOpen={isEditModalOpen}
          exam={selectedExam}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedExam(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedExam(null);
            loadExams();
          }}
        />
      )}
    </div>
  );
};

export default ExamManagement;
