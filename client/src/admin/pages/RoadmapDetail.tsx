import {
  ArrowLeft,
  Clock,
  Target,
  Award,
  Calendar,
  Plus,
  Edit,
  Route as RouteIcon,
  TrendingUp,
  DollarSign,
  BookOpen,
  Trash2,
  FileText,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";
import { useRoadmap } from "../contexts/roadmapContext.tsx";
import { usePhase } from "../contexts/phaseContext.tsx";
import { useCertificate } from "../contexts/certificateContext.tsx";
import { usePhaseCourse } from "../contexts/phaseCourseContext.tsx";
import { useDocumentPhase } from "../contexts/documentPhaseContext.tsx";
import {
  AddPhaseModal,
  EditPhaseModal,
  AddPhaseCourseModal,
  AddDocumentPhaseModal,
  EditDocumentPhaseModal,
} from "../components/RoadmapManagement";

const RoadmapDetail = () => {
  const { roadmap_id } = useParams<{ roadmap_id: string }>();
  const { getRoadmapById } = useRoadmap();
  const { phases, getPhasesByRoadmapId, createPhase, updatePhase } = usePhase();
  const { certificates } = useCertificate();
  const {
    phaseCourses,
    getPhaseCoursesByPhaseId,
    createPhaseCourse,
    removeCourseFromPhase,
  } = usePhaseCourse();
  const {
    documentPhases,
    fetchDocumentPhasesByPhaseId,
    addDocumentToPhase,
    updateDocumentPhase,
    removeDocumentFromPhase,
  } = useDocumentPhase();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<any>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showEditDocumentModal, setShowEditDocumentModal] = useState(false);
  const [selectedDocumentPhase, setSelectedDocumentPhase] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (roadmap_id) {
        setLoading(true);
        const roadmapData = await getRoadmapById(Number(roadmap_id));
        if (roadmapData) {
          setRoadmap(roadmapData);
          await getPhasesByRoadmapId(Number(roadmap_id));
        }
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap_id]);

  // Fetch courses and documents when active phase changes
  useEffect(() => {
    if (phases.length > 0 && phases[activePhase]) {
      getPhaseCoursesByPhaseId(phases[activePhase].phase_id);
      fetchDocumentPhasesByPhaseId(phases[activePhase].phase_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhase, phases.length]);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      reference: "Tài liệu tham khảo",
      guide: "Hướng dẫn",
      exercise: "Bài tập",
      other: "Khác",
    };
    return types[type] || type;
  };

  const handleAddPhase = async (data: {
    phase_name: string;
    phase_description: string;
    order: number;
    phase_aims: string;
  }) => {
    if (roadmap_id) {
      const success = await createPhase(
        Number(roadmap_id),
        data.phase_name,
        data.phase_description,
        data.order,
        data.phase_aims,
      );
      if (success) {
        setShowAddModal(false);
      }
    }
  };

  const handleEditPhase = async (data: {
    phase_name: string;
    phase_description: string;
    order: number;
    phase_aims: string;
  }) => {
    if (selectedPhase) {
      const success = await updatePhase(
        selectedPhase.phase_id,
        data.phase_name,
        data.phase_description,
        data.order,
        data.phase_aims,
      );
      if (success) {
        setShowEditModal(false);
        setSelectedPhase(null);
      }
    }
  };

  const handleAddCourse = async (data: {
    course_id: number;
    order_number: number;
    is_required: boolean;
  }) => {
    if (phases[activePhase]) {
      const success = await createPhaseCourse(
        phases[activePhase].phase_id,
        data.course_id,
        data.order_number,
        data.is_required,
      );
      if (success) {
        setShowAddCourseModal(false);
      }
    }
  };

  const handleRemoveCourse = async (phase_course_id: number) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa khóa học này khỏi giai đoạn?")
    ) {
      await removeCourseFromPhase(phase_course_id);
    }
  };

  const handleAddDocument = async (data: {
    document_id: number;
    order_index: number;
  }) => {
    if (phases[activePhase]) {
      const success = await addDocumentToPhase(
        phases[activePhase].phase_id,
        data.document_id,
        data.order_index,
      );
      if (success) {
        setShowAddDocumentModal(false);
      }
    }
  };

  const handleEditDocument = async (orderIndex: number) => {
    if (selectedDocumentPhase) {
      const success = await updateDocumentPhase(
        selectedDocumentPhase.document_phase_id,
        orderIndex,
      );
      if (success) {
        setShowEditDocumentModal(false);
        setSelectedDocumentPhase(null);
      }
    }
  };

  const handleRemoveDocument = async (document_phase_id: number) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tài liệu này khỏi giai đoạn?")
    ) {
      await removeDocumentFromPhase(document_phase_id);
    }
  };

  const openEditDocumentModal = (documentPhase: any) => {
    setSelectedDocumentPhase(documentPhase);
    setShowEditDocumentModal(true);
  };

  const openEditModal = (phase: any) => {
    setSelectedPhase(phase);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Không tìm thấy lộ trình</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/roadmaps"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {roadmap.roadmap_title}
            </h1>
            <p className="text-gray-600">{roadmap.roadmap_description}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm giai đoạn
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mục tiêu</p>
              <p className="text-xl font-bold text-gray-900">
                {roadmap.roadmap_aim}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thời gian</p>
              <p className="text-xl font-bold text-gray-900">
                {roadmap.estimated_duration} tháng
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chứng chỉ</p>
              <p className="text-sm font-bold text-gray-900">
                {getCertificateName(roadmap.certificate_id)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Giá</p>
              {roadmap.discount_percent > 0 ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 line-through">
                      {formatCurrency(roadmap.calculated_price)}
                    </p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      -{roadmap.discount_percent}%
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(roadmap.final_price)}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(roadmap.calculated_price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <RouteIcon className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Cấp độ</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {getLevelLabel(roadmap.roadmap_level)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Giảm giá</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {roadmap.discount_percent}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatDate(roadmap.created_at)}
          </p>
        </div>
      </div>

      {/* Roadmap Phases */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Các giai đoạn học tập
          </h2>
          <p className="text-gray-600">
            Chi tiết từng giai đoạn trong lộ trình học ({phases.length} giai
            đoạn)
          </p>
        </div>

        <div className="p-6">
          {phases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Chưa có giai đoạn nào được tạo
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo giai đoạn đầu tiên
              </button>
            </div>
          ) : (
            <>
              {/* Phase Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                {phases.map((phase, index) => (
                  <button
                    key={phase.phase_id}
                    onClick={() => setActivePhase(index)}
                    className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      activePhase === index
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Giai đoạn {phase.order}
                  </button>
                ))}
              </div>

              {/* Phase Content */}
              {phases[activePhase] && (
                <div className="space-y-6">
                  {/* Phase Header with Edit Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {phases[activePhase].phase_name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {phases[activePhase].phase_description}
                      </p>
                    </div>
                    <button
                      onClick={() => openEditModal(phases[activePhase])}
                      className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </button>
                  </div>

                  {/* Phase Aims */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Mục tiêu cần đạt
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phases[activePhase].phase_aims
                        .split("\n")
                        .filter((aim: string) => aim.trim())
                        .map((aim: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <svg
                                className="h-5 w-5 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700">
                              {aim.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Courses in Phase */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Khóa học trong giai đoạn ({phaseCourses.length})
                      </h4>
                      <button
                        onClick={() => setShowAddCourseModal(true)}
                        className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm khóa học
                      </button>
                    </div>

                    {phaseCourses.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Chưa có khóa học nào trong giai đoạn này
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phaseCourses.map((phaseCourse) => (
                          <div
                            key={phaseCourse.phase_course_id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <BookOpen className="h-5 w-5 text-blue-600" />
                                  <span className="text-xs font-medium text-gray-500">
                                    Thứ tự: {phaseCourse.order_number}
                                  </span>
                                  {phaseCourse.is_required && (
                                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                                      Bắt buộc
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-medium text-gray-900">
                                  {phaseCourse.Course?.course_title}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {phaseCourse.Course?.description}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="px-2 py-1 bg-gray-100 rounded">
                                    {phaseCourse.Course?.course_level}
                                  </span>
                                  <span>
                                    {phaseCourse.Course?.estimate_duration}
                                  </span>
                                  <span className="font-medium text-blue-600">
                                    {formatCurrency(phaseCourse.Course?.price)}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveCourse(
                                    phaseCourse.phase_course_id,
                                  )
                                }
                                className="text-red-600 hover:text-red-800 ml-2"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Documents in Phase */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Tài liệu hỗ trợ ({documentPhases.length})
                      </h4>
                      <button
                        onClick={() => setShowAddDocumentModal(true)}
                        className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm tài liệu
                      </button>
                    </div>

                    {documentPhases.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Chưa có tài liệu hỗ trợ nào trong giai đoạn này
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentPhases
                          .sort((a, b) => a.order_index - b.order_index)
                          .map((docPhase) => (
                            <div
                              key={docPhase.document_phase_id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-purple-600" />
                                    <span className="text-xs font-medium text-gray-500">
                                      Thứ tự: {docPhase.order_index}
                                    </span>
                                  </div>
                                  <h5 className="font-medium text-gray-900">
                                    {docPhase.Document?.document_name}
                                  </h5>
                                  {docPhase.Document?.document_description && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                      {docPhase.Document.document_description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                      {getDocumentTypeLabel(
                                        docPhase.Document?.document_type || "",
                                      )}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded uppercase">
                                      {docPhase.Document?.file_type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatFileSize(
                                        docPhase.Document?.document_size || 0,
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 ml-2">
                                  <a
                                    href={docPhase.Document?.document_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Tải xuống"
                                  >
                                    <Download className="h-5 w-5" />
                                  </a>
                                  <button
                                    onClick={() =>
                                      openEditDocumentModal(docPhase)
                                    }
                                    className="text-gray-600 hover:text-gray-800"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRemoveDocument(
                                        docPhase.document_phase_id,
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800"
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPhaseModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPhase}
        />
      )}

      {showEditModal && selectedPhase && (
        <EditPhaseModal
          phase={selectedPhase}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPhase(null);
          }}
          onSubmit={handleEditPhase}
        />
      )}

      {showAddCourseModal && phases[activePhase] && (
        <AddPhaseCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onSubmit={handleAddCourse}
          existingCourseIds={phaseCourses.map((pc) => pc.course_id)}
        />
      )}

      {showAddDocumentModal && phases[activePhase] && (
        <AddDocumentPhaseModal
          onClose={() => setShowAddDocumentModal(false)}
          onSubmit={handleAddDocument}
          existingDocumentIds={documentPhases.map((dp) => dp.document_id)}
        />
      )}

      {showEditDocumentModal && selectedDocumentPhase && (
        <EditDocumentPhaseModal
          onClose={() => {
            setShowEditDocumentModal(false);
            setSelectedDocumentPhase(null);
          }}
          onSubmit={handleEditDocument}
          currentOrderIndex={selectedDocumentPhase.order_index}
          documentName={
            selectedDocumentPhase.Document?.document_name || "Tài liệu"
          }
        />
      )}
    </div>
  );
};

export default RoadmapDetail;
