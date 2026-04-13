import { useEffect, useState } from "react";
import { useSkill } from "../contexts/skillContext";
import { useCertificate } from "../contexts/certificateContext";
import {
  Search,
  Plus,
  Edit,
  Target,
  Calendar,
  Link2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddSkillModal from "../components/SkillManagement/AddSkillModal";
import EditSkillModal from "../components/SkillManagement/EditSkillModal.tsx";
import LinkCertificateSkillModal from "../components/SkillManagement/LinkCertificateSkillModal.tsx";

const SkillManagement = () => {
  const {
    skills,
    totalItems,
    loading,
    fetchSkills,
    createSkill,
    updateSkill,
    certificateSkills,
    fetchCertificateSkills,
    createCertificateSkill,
    deleteCertificateSkill,
  } = useSkill();

  const { certificates, fetchCertificates } = useCertificate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const totalPages = Math.ceil(totalItems / limit);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [linkingSkill, setLinkingSkill] = useState<any>(null);

  useEffect(() => {
    fetchSkills("", limit, currentPage);
    fetchCertificates("", 100, 1);
  }, [fetchSkills, fetchCertificates, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchSkills(searchTerm, limit, 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchSkills]);

  const handleCreateSkill = () => {
    setShowAddModal(true);
  };

  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill);
    setShowEditModal(true);
  };

  const handleLinkCertificate = (skill: any) => {
    setLinkingSkill(skill);
    setShowLinkModal(true);
  };

  const handleSubmitAddSkill = async (data: any) => {
    const success = await createSkill(data.skill_name);
    if (success) {
      setShowAddModal(false);
      fetchSkills(searchTerm, limit, currentPage);
    }
  };

  const handleSubmitEditSkill = async (data: any) => {
    if (editingSkill) {
      const success = await updateSkill(editingSkill.skill_id, data.skill_name);
      if (success) {
        setShowEditModal(false);
        fetchSkills(searchTerm, limit, currentPage);
      }
    }
  };

  const handleSubmitLinkCertificate = async (data: any) => {
    if (linkingSkill) {
      const success = await createCertificateSkill(
        data.certificate_id,
        linkingSkill.skill_id,
        data.weight,
        data.description,
      );
      if (success) {
        setShowLinkModal(false);
        fetchSkills(searchTerm, limit, currentPage);
      }
    }
  };

  const handleDeleteCertificateSkill = async (certificateSkillId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên kết này?")) {
      const success = await deleteCertificateSkill(certificateSkillId);
      if (success) {
        fetchSkills(searchTerm, limit, currentPage);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kỹ năng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các kỹ năng và liên kết với chứng chỉ
          </p>
        </div>
        <button
          onClick={handleCreateSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm kỹ năng</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm kỹ năng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có kỹ năng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên kỹ năng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chứng chỉ liên kết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skills.map((skill) => (
                  <tr key={skill.skill_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{skill.skill_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {skill.skill_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {skill.Certificate_Skills &&
                      skill.Certificate_Skills.length > 0 ? (
                        <div className="space-y-2">
                          {skill.Certificate_Skills.map((cs) => (
                            <div
                              key={cs.certificate_skill_id}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {cs.Certificate?.certificate_name}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-xs text-gray-600">
                                    Trọng số: {cs.weight}%
                                  </span>
                                  {cs.description && (
                                    <span className="text-xs text-gray-500">
                                      {cs.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteCertificateSkill(
                                    cs.certificate_skill_id,
                                  )
                                }
                                className="ml-3 text-red-600 hover:text-red-800"
                                title="Xóa liên kết"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa liên kết
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(skill.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSkill(skill)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleLinkCertificate(skill)}
                          className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                          title="Liên kết chứng chỉ"
                        >
                          <Link2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* Pagination */}
      {totalPages > 1 &&
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
      <AddSkillModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAddSkill}
      />

      <EditSkillModal
        isOpen={showEditModal}
        skill={editingSkill}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEditSkill}
      />

      <LinkCertificateSkillModal
        isOpen={showLinkModal}
        skill={linkingSkill}
        certificates={certificates}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleSubmitLinkCertificate}
      />
    </div>
  );
};

export default SkillManagement;
