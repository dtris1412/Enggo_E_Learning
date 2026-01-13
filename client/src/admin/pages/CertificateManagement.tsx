import { useEffect, useState } from "react";
import { useCertificate } from "../contexts/certificateContext";
import {
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  Award,
  Calendar,
} from "lucide-react";
import AddCertificateModal from "../components/CourseManagement/Certificate/AddCertificateModal";
import EditCertificateModal from "../components/CourseManagement/Certificate/EditCertificateModal";

const CertificateManagement = () => {
  const {
    certificates,
    loading,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    lockCertificate,
    unlockCertificate,
  } = useCertificate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);

  useEffect(() => {
    fetchCertificates("", 100, 1);
  }, [fetchCertificates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCertificates(searchTerm, 100, 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCertificates]);

  const handleCreateCertificate = () => {
    setShowAddModal(true);
  };

  const handleEditCertificate = (cert: any) => {
    setEditingCertificate(cert);
    setShowEditModal(true);
  };

  const handleSubmitAddCertificate = async (data: any) => {
    const success = await createCertificate(
      data.certificate_name,
      data.description,
      data.total_score
    );
    if (success) {
      setShowAddModal(false);
    }
  };

  const handleSubmitEditCertificate = async (data: any) => {
    if (editingCertificate) {
      const success = await updateCertificate(
        editingCertificate.certificate_id,
        data.certificate_name,
        data.description,
        data.total_score
      );
      if (success) {
        setShowEditModal(false);
      }
    }
  };

  const handleToggleCertificateStatus = async (cert: any) => {
    if (cert.certificate_status) {
      await lockCertificate(cert.certificate_id);
    } else {
      await unlockCertificate(cert.certificate_id);
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
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý chứng chỉ
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các chứng chỉ và điểm số của hệ thống
          </p>
        </div>
        <button
          onClick={handleCreateCertificate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo chứng chỉ mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm chứng chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Không tìm thấy chứng chỉ nào</p>
          </div>
        ) : (
          certificates.map((cert) => (
            <div
              key={cert.certificate_id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {cert.certificate_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            cert.certificate_status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cert.certificate_status ? "Hoạt động" : "Khóa"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {cert.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tổng điểm:</span>
                    <span className="font-semibold text-gray-900">
                      {cert.total_score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo:
                    </span>
                    <span className="text-gray-700">
                      {formatDate(cert.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEditCertificate(cert)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleCertificateStatus(cert)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      cert.certificate_status
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {cert.certificate_status ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Khóa
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" />
                        Mở khóa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddCertificateModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAddCertificate}
      />

      <EditCertificateModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEditCertificate}
        initialData={
          editingCertificate || {
            certificate_name: "",
            description: "",
            total_score: 0,
          }
        }
      />
    </div>
  );
};

export default CertificateManagement;
