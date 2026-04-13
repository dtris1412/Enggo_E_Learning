import {
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  Route,
  Target,
  Clock,
  Award,
  Calendar,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoadmap } from "../contexts/roadmapContext";
import { useCertificate } from "../contexts/certificateContext";
import AddRoadmapModal from "../components/RoadmapManagement/AddRoadmapModal.tsx";
import EditRoadmapModal from "../components/RoadmapManagement/EditRoadmapModal.tsx";
import ExportButton from "../components/ExportButton";

const RoadmapManagement = () => {
  const navigate = useNavigate();
  const {
    roadmaps,
    totalRoadmaps,
    loading,
    fetchRoadmapsPaginated,
    createRoadmap,
    updateRoadmap,
    lockRoadmap,
    unlockRoadmap,
  } = useRoadmap();

  const { certificates, fetchCertificates } = useCertificate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<any>(null);
  const [levelFilter, setLevelFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const totalPages = Math.ceil(totalRoadmaps / limit);

  useEffect(() => {
    fetchRoadmapsPaginated("", currentPage, limit);
    fetchCertificates("", 100, 1);
  }, [fetchRoadmapsPaginated, fetchCertificates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoadmapsPaginated(
        searchTerm,
        currentPage,
        limit,
        levelFilter || undefined,
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, levelFilter, currentPage, limit, fetchRoadmapsPaginated]);

  const handleCreateRoadmap = () => {
    setShowAddModal(true);
  };

  const handleEditRoadmap = (roadmap: any) => {
    setEditingRoadmap(roadmap);
    setShowEditModal(true);
  };

  const handleSubmitAddRoadmap = async (data: any) => {
    const success = await createRoadmap(
      data.roadmap_title,
      data.roadmap_description,
      data.roadmap_aim,
      data.roadmap_level,
      data.estimated_duration,
      data.roadmap_status,
      data.certificate_id,
    );
    if (success) {
      setShowAddModal(false);
    }
  };

  const handleSubmitEditRoadmap = async (data: any) => {
    if (editingRoadmap) {
      const success = await updateRoadmap(
        editingRoadmap.roadmap_id,
        data.roadmap_title,
        data.roadmap_description,
        data.roadmap_aim,
        data.roadmap_level,
        data.estimated_duration,
        data.roadmap_status,
        data.certificate_id,
      );
      if (success) {
        setShowEditModal(false);
      }
    }
  };

  const handleToggleRoadmapStatus = async (roadmap: any) => {
    if (roadmap.roadmap_status) {
      await lockRoadmap(roadmap.roadmap_id);
    } else {
      await unlockRoadmap(roadmap.roadmap_id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
    };
    return labels[level] || level;
  };

  const getCertificateName = (certificate_id: number) => {
    const cert = certificates.find((c) => c.certificate_id === certificate_id);
    return cert ? cert.certificate_name : "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lộ trình</h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các lộ trình học tập có hệ thống
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            type="roadmaps"
            filters={{
              search: searchTerm,
              roadmap_level: levelFilter,
            }}
          />
          <button
            onClick={handleCreateRoadmap}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo lộ trình mới
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm lộ trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500">Không tìm thấy lộ trình nào</p>
          </div>
        ) : (
          roadmaps.map((roadmap) => (
            <div
              key={roadmap.roadmap_id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Route className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {roadmap.roadmap_title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {roadmap.roadmap_description}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    roadmap.roadmap_status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {roadmap.roadmap_status ? "Hoạt động" : "Khóa"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Mục tiêu:</span>
                  <span className="font-medium text-gray-900">
                    {roadmap.roadmap_aim}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium text-gray-900">
                    {roadmap.estimated_duration} tháng
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Chứng chỉ:</span>
                  <span className="font-medium text-gray-900">
                    {getCertificateName(roadmap.certificate_id)}
                  </span>
                </div>
                {roadmap.enrolled_users_count !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Người học:</span>
                    <span className="font-semibold text-blue-600">
                      {roadmap.enrolled_users_count}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      roadmap.roadmap_level === "beginner"
                        ? "bg-blue-100 text-blue-800"
                        : roadmap.roadmap_level === "intermediate"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getLevelLabel(roadmap.roadmap_level)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">Roadmap</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(roadmap.created_at)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/roadmaps/${roadmap.roadmap_id}`)
                    }
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleEditRoadmap(roadmap)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleRoadmapStatus(roadmap)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                      roadmap.roadmap_status
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {roadmap.roadmap_status ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Khóa
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" />
                        Mở
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading &&
        roadmaps.length > 0 &&
        totalPages > 1 &&
        (() => {
          const getPageNums = (): (number | "...")[] => {
            if (totalPages <= 7)
              return Array.from({ length: totalPages }, (_, i) => i + 1);
            const startGroup = [1, 2];
            const endGroup = [totalPages - 1, totalPages];
            const midGroup = [
              currentPage - 1,
              currentPage,
              currentPage + 1,
            ].filter((p) => p > 2 && p < totalPages - 1);
            const all = new Set([...startGroup, ...midGroup, ...endGroup]);
            const sorted = Array.from(all).sort((a, b) => a - b);
            const result: (number | "...")[] = [];
            for (let i = 0; i < sorted.length; i++) {
              if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
              result.push(sorted[i]);
            }
            return result;
          };
          return (
            <div className="flex justify-center items-center gap-5 flex-wrap py-4">
              {currentPage > 1 ? (
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  aria-label="Trang trước"
                  className="text-slate-400 hover:text-violet-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <span className="text-slate-200 cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              )}
              {getPageNums().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`e-${idx}`}
                    className="text-sm text-slate-300 select-none tracking-widest"
                    aria-hidden="true"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    aria-label={`Trang ${p}`}
                    aria-current={currentPage === p ? "page" : undefined}
                    className={
                      currentPage === p
                        ? "text-base font-semibold text-violet-600 border-b-2 border-violet-600 pb-0.5 pointer-events-none"
                        : "text-base font-medium text-slate-500 hover:text-violet-600 transition-colors pb-0.5 border-b-2 border-transparent hover:border-violet-300"
                    }
                  >
                    {p}
                  </button>
                ),
              )}
              {currentPage < totalPages ? (
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label="Trang tiếp"
                  className="text-slate-400 hover:text-violet-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <span className="text-slate-200 cursor-not-allowed">
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </div>
          );
        })()}

      {/* Modals */}
      {showAddModal && (
        <AddRoadmapModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitAddRoadmap}
          certificates={certificates}
        />
      )}

      {showEditModal && editingRoadmap && (
        <EditRoadmapModal
          roadmap={editingRoadmap}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmitEditRoadmap}
          certificates={certificates}
        />
      )}
    </div>
  );
};

export default RoadmapManagement;
