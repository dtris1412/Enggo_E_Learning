import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Music,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Upload,
  Info,
  Layers,
  MessageSquare,
} from "lucide-react";
import { useExam } from "../contexts/examContext";
import {
  AddExamContainerModal,
  EditExamContainerModal,
  AddQuestionModal,
  AddExamMediaModal,
  BulkQuestionImportModal,
} from "../components/ExamManagement";

const ExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const {
    getExamWithDetails,
    deleteExamContainer,
    removeQuestionFromContainer,
    deleteQuestionOption,
    getExamMediaByExamId,
    deleteExamMedia,
    createQuestionOption,
    loading,
    error,
  } = useExam();

  const [exam, setExam] = useState<any>(null);
  const [containers, setContainers] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [expandedContainers, setExpandedContainers] = useState<number[]>([]);

  // Modal states
  const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);
  const [isEditContainerModalOpen, setIsEditContainerModalOpen] =
    useState(false);
  const [selectedContainer, setSelectedContainer] = useState<any>(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(
    null,
  );
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [bulkImportContainerId, setBulkImportContainerId] = useState<
    number | null
  >(null);
  const [bulkImportContainerName, setBulkImportContainerName] = useState("");
  const [showGuide, setShowGuide] = useState(true);

  // Inline quick add states
  const [showQuickAddOption, setShowQuickAddOption] = useState<number | null>(
    null,
  );
  const [quickOptionForm, setQuickOptionForm] = useState({
    label: "A",
    content: "",
    is_correct: false,
  });

  useEffect(() => {
    if (examId) {
      loadExamData();
    }
  }, [examId]);

  const loadExamData = async () => {
    if (!examId) return;

    const examData = await getExamWithDetails(parseInt(examId));
    if (examData) {
      setExam(examData);
      setContainers(examData.Exam_Containers || []);
    }

    const mediaData = await getExamMediaByExamId(parseInt(examId));
    setMedia(mediaData);
  };

  const toggleContainer = (containerId: number) => {
    setExpandedContainers((prev) =>
      prev.includes(containerId)
        ? prev.filter((id) => id !== containerId)
        : [...prev, containerId],
    );
  };

  const handleDeleteContainer = async (containerId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phần thi này?")) {
      const success = await deleteExamContainer(containerId);
      if (success) {
        loadExamData();
      }
    }
  };

  const handleEditContainer = (container: any) => {
    setSelectedContainer(container);
    setIsEditContainerModalOpen(true);
  };

  const handleAddQuestion = (containerId: number) => {
    setSelectedContainerId(containerId);
    setIsAddQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (containerQuestionId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      const success = await removeQuestionFromContainer(containerQuestionId);
      if (success) {
        loadExamData();
      }
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đáp án này?")) {
      const success = await deleteQuestionOption(optionId);
      if (success) {
        loadExamData();
      }
    }
  };

  const handleQuickAddOption = async (containerQuestionId: number) => {
    const cq = containers
      .flatMap((c) => c.Container_Questions || [])
      .find((q) => q.container_question_id === containerQuestionId);

    const existingOptions = cq?.Question_Options || [];
    const usedLabels = existingOptions.map((opt: any) => opt.label);
    const labels = ["A", "B", "C", "D"];
    const nextLabel =
      labels.find((label) => !usedLabels.includes(label)) || "A";

    setQuickOptionForm({
      label: nextLabel,
      content: "",
      is_correct: !existingOptions.some((opt: any) => opt.is_correct),
    });
    setShowQuickAddOption(containerQuestionId);
  };

  const handleSubmitQuickOption = async (containerQuestionId: number) => {
    const cq = containers
      .flatMap((c) => c.Container_Questions || [])
      .find((q) => q.container_question_id === containerQuestionId);

    const existingOptions = cq?.Question_Options || [];
    const maxOrder = Math.max(
      ...existingOptions.map((opt: any) => opt.order_index),
      0,
    );

    const success = await createQuestionOption({
      container_question_id: containerQuestionId,
      ...quickOptionForm,
      order_index: maxOrder + 1,
    });

    if (success) {
      setShowQuickAddOption(null);
      setQuickOptionForm({ label: "A", content: "", is_correct: false });
      loadExamData();
    }
  };

  const getContainerStats = (container: any) => {
    const questions = container.Container_Questions || [];
    const totalQuestions = questions.length;
    const questionsWithOptions = questions.filter(
      (q: any) => q.Question_Options && q.Question_Options.length > 0,
    ).length;
    const questionsComplete = questions.filter(
      (q: any) =>
        q.Question_Options &&
        q.Question_Options.length === 4 &&
        q.Question_Options.some((opt: any) => opt.is_correct),
    ).length;
    return { totalQuestions, questionsWithOptions, questionsComplete };
  };

  const getSkillColor = (skill?: string) => {
    const colors: Record<string, string> = {
      listening: "bg-blue-100 text-blue-700 border-blue-300",
      reading: "bg-green-100 text-green-700 border-green-300",
      writing: "bg-purple-100 text-purple-700 border-purple-300",
      speaking: "bg-orange-100 text-orange-700 border-orange-300",
    };
    return colors[skill || ""] || "bg-gray-100 text-gray-700 border-gray-300";
  };
  const handleDeleteMedia = async (mediaId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa media này?")) {
      const success = await deleteExamMedia(mediaId);
      if (success) {
        loadExamData();
      }
    }
  };

  if (loading && !exam) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6 text-center text-gray-500">Không tìm thấy đề thi</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/exams")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {exam.exam_title}
            </h1>
            <p className="text-gray-600 mt-1">{exam.exam_description}</p>
          </div>
        </div>
      </div>

      {/* Exam Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {exam.exam_type}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {exam.exam_code}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Thông tin chi tiết
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Thời gian
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {exam.exam_duration}
            </p>
            <p className="text-xs text-gray-600">phút</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Tổng câu hỏi
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {exam.total_questions}
            </p>
            <p className="text-xs text-gray-600">câu</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Năm
            </p>
            <p className="text-2xl font-bold text-gray-800">{exam.year}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Chứng chỉ
            </p>
            <p className="text-sm font-medium text-gray-800">
              {exam.Certificate?.certificate_name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Media đề thi</h2>
          <button
            onClick={() => setIsAddMediaModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Thêm media
          </button>
        </div>

        {media.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Chưa có media nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <div
                key={item.media_id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-800">
                      Audio Listening
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteMedia(item.media_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <audio controls className="w-full mt-2">
                  <source src={item.audio_url} />
                </audio>

                {item.duration > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Thời lượng: {Math.floor(item.duration / 60)}:
                    {(item.duration % 60).toString().padStart(2, "0")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Containers Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">
              Phần thi & Câu hỏi
            </h2>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Xem hướng dẫn"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIsAddContainerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Thêm Part mới (Container)"
          >
            <Plus className="w-5 h-5" />
            Thêm phần thi
          </button>
        </div>

        {/* Guide Panel */}
        {showGuide && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  📋 Hướng dẫn tổ chức câu hỏi
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-700">
                        Part đơn giản (Part 1, 2, 5):
                      </strong>
                      <br />
                      <span className="text-gray-600">
                        1 Container = Cả Part → Bulk import tất cả câu hỏi vào 1
                        lần
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        Type:{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          toeic_single
                        </code>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-purple-700">
                        Part có nhóm (Part 3, 4, 6, 7):
                      </strong>
                      <br />
                      <span className="text-gray-600">
                        1 Container = 1 Passage/Conversation → Bulk import 2-5
                        câu
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        Type:{" "}
                        <code className="bg-purple-100 px-1 rounded">
                          toeic_group
                        </code>{" "}
                        | Part 3: 13 containers × 3 câu | Part 4: 10 containers
                        × 3 câu
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200 text-xs text-gray-600">
                    💡 <strong>Ví dụ:</strong> Part 3 (Questions 32-70) = Tạo 13
                    Containers, mỗi Container gắn audio riêng + bulk import 3
                    câu
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {containers.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{containers.length}</span>
              </div>
              <p className="text-sm opacity-90">Tổng số Part</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <HelpCircle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">
                  {containers.reduce(
                    (sum, c) => sum + (c.Container_Questions?.length || 0),
                    0,
                  )}
                </span>
              </div>
              <p className="text-sm opacity-90">Tổng câu hỏi</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">
                  {containers.reduce((sum, c) => {
                    const stats = getContainerStats(c);
                    return sum + stats.questionsComplete;
                  }, 0)}
                </span>
              </div>
              <p className="text-sm opacity-90">Câu hoàn thành</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">
                  {containers.reduce((sum, c) => {
                    const questions = c.Container_Questions || [];
                    const incomplete = questions.filter(
                      (q: any) =>
                        !q.Question_Options ||
                        q.Question_Options.length < 4 ||
                        !q.Question_Options.some((opt: any) => opt.is_correct),
                    ).length;
                    return sum + incomplete;
                  }, 0)}
                </span>
              </div>
              <p className="text-sm opacity-90">Câu chưa xong</p>
            </div>
          </div>
        )}

        {containers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Chưa có phần thi nào. Hãy thêm phần thi đầu tiên!
          </p>
        ) : (
          <div className="space-y-4">
            {containers.map((container, index) => {
              const stats = getContainerStats(container);
              const completionRate =
                stats.totalQuestions > 0
                  ? Math.round(
                      (stats.questionsComplete / stats.totalQuestions) * 100,
                    )
                  : 0;

              return (
                <div
                  key={container.container_id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Container Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() =>
                            toggleContainer(container.container_id)
                          }
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {expandedContainers.includes(
                            container.container_id,
                          ) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">
                              {container.instruction
                                ? container.instruction
                                    .split("\n")[0]
                                    .substring(0, 80) +
                                  (container.instruction.split("\n")[0].length >
                                  80
                                    ? "..."
                                    : "")
                                : `Part ${index + 1}`}
                            </h3>
                            {container.skill && (
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded border ${getSkillColor(container.skill)}`}
                              >
                                {container.skill.toUpperCase()}
                              </span>
                            )}
                            {container.type === "toeic_group" ? (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded border border-purple-300 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                Group (Nhóm câu)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-300 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Single (Độc lập)
                              </span>
                            )}
                            {container.audio_url && (
                              <Music className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                          {container.instruction &&
                            container.instruction.split("\n").length > 1 && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {container.instruction
                                  .split("\n")
                                  .slice(1)
                                  .join(" ")}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleAddQuestion(container.container_id)
                          }
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Thêm từng câu hỏi"
                        >
                          <Plus className="w-4 h-4" />
                          Câu hỏi
                        </button>
                        <button
                          onClick={() => {
                            setBulkImportContainerId(container.container_id);
                            // Show instruction or content preview for better context
                            const displayName = container.instruction
                              ? container.instruction.substring(0, 50) +
                                (container.instruction.length > 50 ? "..." : "")
                              : `Part ${index + 1} - ${container.skill || container.type}`;
                            setBulkImportContainerName(displayName);
                            setIsBulkImportModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                          title={
                            container.type === "toeic_group"
                              ? "Import 2-5 câu cho passage này"
                              : "Import nhiều câu hỏi cùng lúc"
                          }
                        >
                          <Upload className="w-4 h-4" />
                          {container.type === "toeic_group"
                            ? "Bulk (Nhóm)"
                            : "Bulk"}
                        </button>
                        <button
                          onClick={() => handleEditContainer(container)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteContainer(container.container_id)
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          <span className="font-semibold">
                            {stats.totalQuestions}
                          </span>{" "}
                          câu hỏi
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">
                          <span className="font-semibold">
                            {stats.questionsComplete}
                          </span>{" "}
                          hoàn thành
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            completionRate === 100
                              ? "bg-green-500"
                              : completionRate > 50
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                          }`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {completionRate}%
                      </span>
                    </div>
                  </div>

                  {/* Container Content */}
                  {expandedContainers.includes(container.container_id) && (
                    <div className="p-6 bg-white">
                      {/* Container Type Indicator */}
                      {container.type === "toeic_group" && (
                        <div className="mb-4 bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquare className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div className="text-purple-800">
                              <strong>Container nhóm:</strong> Các câu hỏi trong
                              phần này chia sẻ chung{" "}
                              {container.skill === "listening"
                                ? "audio"
                                : "passage"}{" "}
                              bên dưới.
                              {container.skill === "listening" &&
                                !container.audio_url && (
                                  <span className="ml-1 text-orange-600">
                                    ⚠️ Chưa có audio - hãy Edit container để
                                    thêm!
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Audio if exists */}
                      {container.audio_url && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Music className="w-5 h-5 text-purple-600" />
                            <p className="text-sm font-semibold text-purple-900">
                              Audio Part
                            </p>
                          </div>
                          <audio controls className="w-full">
                            <source src={container.audio_url} />
                          </audio>
                        </div>
                      )}

                      {container.content && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                          <p className="text-sm font-medium text-blue-900 mb-2">
                            📝 Nội dung:
                          </p>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {container.content}
                          </p>
                        </div>
                      )}

                      {/* Questions */}
                      {container.Container_Questions &&
                      container.Container_Questions.length > 0 ? (
                        <div className="space-y-6">
                          {container.Container_Questions.map(
                            (cq: any, qIndex: number) => {
                              const hasAllOptions =
                                cq.Question_Options &&
                                cq.Question_Options.length === 4;
                              const hasCorrectAnswer =
                                cq.Question_Options?.some(
                                  (opt: any) => opt.is_correct,
                                );
                              const isComplete =
                                hasAllOptions && hasCorrectAnswer;

                              return (
                                <div
                                  key={cq.container_question_id}
                                  className={`border-2 rounded-xl p-5 transition-all ${
                                    isComplete
                                      ? "border-green-200 bg-green-50/30"
                                      : "border-gray-200 bg-white hover:border-blue-300"
                                  }`}
                                >
                                  {/* Question Header */}
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                      <div
                                        className={`p-2 rounded-lg ${
                                          isComplete
                                            ? "bg-green-100"
                                            : "bg-blue-100"
                                        }`}
                                      >
                                        <HelpCircle
                                          className={`w-5 h-5 ${
                                            isComplete
                                              ? "text-green-600"
                                              : "text-blue-600"
                                          }`}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                                            Q{qIndex + 1}
                                          </span>
                                          {cq.score && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                              {cq.score} điểm
                                            </span>
                                          )}
                                          {isComplete ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                                          )}
                                        </div>

                                        {/* Image if exists */}
                                        {cq.image_url && (
                                          <img
                                            src={cq.image_url}
                                            alt="Question"
                                            className="w-64 h-40 object-cover rounded-lg mb-3 border border-gray-200"
                                          />
                                        )}

                                        <p className="font-medium text-gray-900 text-lg mb-2">
                                          {cq.Question?.question_content}
                                        </p>

                                        {cq.Question?.explanation && (
                                          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <p className="text-sm text-amber-900">
                                              💡{" "}
                                              <span className="font-medium">
                                                Giải thích:
                                              </span>{" "}
                                              {cq.Question.explanation}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDeleteQuestion(
                                          cq.container_question_id,
                                        )
                                      }
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Options Grid */}
                                  <div className="ml-11">
                                    {cq.Question_Options &&
                                    cq.Question_Options.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        {cq.Question_Options.map(
                                          (option: any) => (
                                            <div
                                              key={option.question_option_id}
                                              className={`group relative p-3 rounded-lg border-2 transition-all ${
                                                option.is_correct
                                                  ? "bg-green-50 border-green-400 shadow-sm"
                                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                                              }`}
                                            >
                                              <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-3 flex-1">
                                                  <span
                                                    className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${
                                                      option.is_correct
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-300 text-gray-700"
                                                    }`}
                                                  >
                                                    {option.label}
                                                  </span>
                                                  <span className="text-gray-800 leading-relaxed flex-1">
                                                    {option.content}
                                                  </span>
                                                </div>
                                                <button
                                                  onClick={() =>
                                                    handleDeleteOption(
                                                      option.question_option_id,
                                                    )
                                                  }
                                                  className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 rounded transition-all"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        ⚠️ Chưa có đáp án nào
                                      </p>
                                    )}

                                    {/* Quick Add Option */}
                                    {showQuickAddOption ===
                                    cq.container_question_id ? (
                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Plus className="w-4 h-4 text-blue-600" />
                                          <h4 className="font-semibold text-gray-800">
                                            Thêm đáp án nhanh
                                          </h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                          <div className="grid grid-cols-4 gap-2">
                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Nhãn
                                              </label>
                                              <select
                                                value={quickOptionForm.label}
                                                onChange={(e) =>
                                                  setQuickOptionForm({
                                                    ...quickOptionForm,
                                                    label: e.target.value,
                                                  })
                                                }
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                              >
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                              </select>
                                            </div>
                                            <div className="col-span-3">
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Nội dung đáp án
                                              </label>
                                              <input
                                                type="text"
                                                value={quickOptionForm.content}
                                                onChange={(e) =>
                                                  setQuickOptionForm({
                                                    ...quickOptionForm,
                                                    content: e.target.value,
                                                  })
                                                }
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập nội dung đáp án..."
                                              />
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  quickOptionForm.is_correct
                                                }
                                                onChange={(e) =>
                                                  setQuickOptionForm({
                                                    ...quickOptionForm,
                                                    is_correct:
                                                      e.target.checked,
                                                  })
                                                }
                                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                              />
                                              <span className="text-sm font-medium text-gray-700">
                                                Đáp án đúng
                                              </span>
                                            </label>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => {
                                                  setShowQuickAddOption(null);
                                                  setQuickOptionForm({
                                                    label: "A",
                                                    content: "",
                                                    is_correct: false,
                                                  });
                                                }}
                                                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleSubmitQuickOption(
                                                    cq.container_question_id,
                                                  )
                                                }
                                                disabled={
                                                  !quickOptionForm.content.trim()
                                                }
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                              >
                                                <Save className="w-4 h-4" />
                                                Lưu
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleQuickAddOption(
                                            cq.container_question_id,
                                          )
                                        }
                                        disabled={
                                          cq.Question_Options &&
                                          cq.Question_Options.length >= 4
                                        }
                                        className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Plus className="w-4 h-4 inline mr-1" />
                                        {cq.Question_Options &&
                                        cq.Question_Options.length >= 4
                                          ? "Đã đủ 4 đáp án"
                                          : "Thêm đáp án"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">
                            Chưa có câu hỏi nào
                          </p>
                          <button
                            onClick={() =>
                              handleAddQuestion(container.container_id)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Thêm câu hỏi đầu tiên
                          </button>
                        </div>
                      )}

                      {/* Children Containers (for Part 3,4,6,7) */}
                      {container.children && container.children.length > 0 && (
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-t pt-4">
                            <Layers className="w-4 h-4" />
                            <span>Sub-containers (Conversations/Passages)</span>
                          </div>
                          {container.children.map(
                            (child: any, childIndex: number) => {
                              const childStats = getContainerStats(child);
                              return (
                                <div
                                  key={child.container_id}
                                  className="ml-8 border-l-4 border-purple-300 pl-4 bg-purple-50/30 rounded-r-lg p-4"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-800 mb-1">
                                        {child.instruction ||
                                          `Container ${childIndex + 1}`}
                                      </h4>
                                      <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        <span>
                                          {childStats.totalQuestions} câu hỏi
                                        </span>
                                        {child.audio_url && (
                                          <Music className="w-3.5 h-3.5 text-purple-500" />
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() =>
                                          handleAddQuestion(child.container_id)
                                        }
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                      >
                                        <Plus className="w-3 h-3" />
                                        Câu hỏi
                                      </button>
                                      <button
                                        onClick={() => {
                                          setBulkImportContainerId(
                                            child.container_id,
                                          );
                                          setBulkImportContainerName(
                                            child.instruction ||
                                              `Container ${childIndex + 1}`,
                                          );
                                          setIsBulkImportModalOpen(true);
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                      >
                                        <Upload className="w-3 h-3" />
                                        Bulk
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleEditContainer(child)
                                        }
                                        className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteContainer(
                                            child.container_id,
                                          )
                                        }
                                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Child container content and questions */}
                                  {child.audio_url && (
                                    <div className="mb-3">
                                      <audio controls className="w-full h-8">
                                        <source src={child.audio_url} />
                                      </audio>
                                    </div>
                                  )}
                                  {child.content && (
                                    <div className="bg-white border p-3 rounded mb-3 text-sm">
                                      {child.content}
                                    </div>
                                  )}
                                  {child.Container_Questions &&
                                    child.Container_Questions.length > 0 && (
                                      <div className="space-y-2">
                                        {child.Container_Questions.map(
                                          (cq: any, qIdx: number) => (
                                            <div
                                              key={cq.container_question_id}
                                              className="bg-white border rounded p-3 text-sm"
                                            >
                                              <div className="flex items-start justify-between mb-2">
                                                <span className="font-semibold text-gray-700">
                                                  Q{qIdx + 1}:{" "}
                                                  {
                                                    cq.Question
                                                      ?.question_content
                                                  }
                                                </span>
                                                <button
                                                  onClick={() =>
                                                    handleDeleteQuestion(
                                                      cq.container_question_id,
                                                    )
                                                  }
                                                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                              {cq.Question_Options && (
                                                <div className="space-y-1 ml-4">
                                                  {cq.Question_Options.map(
                                                    (opt: any) => (
                                                      <div
                                                        key={
                                                          opt.question_option_id
                                                        }
                                                        className={`text-xs p-2 rounded ${
                                                          opt.is_correct
                                                            ? "bg-green-100 font-medium"
                                                            : "bg-gray-50"
                                                        }`}
                                                      >
                                                        {opt.label}.{" "}
                                                        {opt.content}
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddContainerModalOpen && examId && (
        <AddExamContainerModal
          isOpen={isAddContainerModalOpen}
          examId={parseInt(examId)}
          onClose={() => setIsAddContainerModalOpen(false)}
          onSuccess={() => {
            setIsAddContainerModalOpen(false);
            loadExamData();
          }}
        />
      )}

      {isEditContainerModalOpen && selectedContainer && (
        <EditExamContainerModal
          isOpen={isEditContainerModalOpen}
          container={selectedContainer}
          onClose={() => {
            setIsEditContainerModalOpen(false);
            setSelectedContainer(null);
          }}
          onSuccess={() => {
            setIsEditContainerModalOpen(false);
            setSelectedContainer(null);
            loadExamData();
          }}
        />
      )}

      {isAddQuestionModalOpen && selectedContainerId && (
        <AddQuestionModal
          isOpen={isAddQuestionModalOpen}
          containerId={selectedContainerId}
          onClose={() => {
            setIsAddQuestionModalOpen(false);
            setSelectedContainerId(null);
          }}
          onSuccess={() => {
            setIsAddQuestionModalOpen(false);
            setSelectedContainerId(null);
            loadExamData();
          }}
        />
      )}

      {isAddMediaModalOpen && examId && (
        <AddExamMediaModal
          isOpen={isAddMediaModalOpen}
          examId={parseInt(examId)}
          onClose={() => setIsAddMediaModalOpen(false)}
          onSuccess={() => {
            setIsAddMediaModalOpen(false);
            loadExamData();
          }}
        />
      )}

      {isBulkImportModalOpen && bulkImportContainerId && (
        <BulkQuestionImportModal
          isOpen={isBulkImportModalOpen}
          containerId={bulkImportContainerId}
          containerName={bulkImportContainerName}
          onClose={() => {
            setIsBulkImportModalOpen(false);
            setBulkImportContainerId(null);
            setBulkImportContainerName("");
          }}
          onImportSuccess={() => {
            loadExamData();
          }}
        />
      )}
    </div>
  );
};

export default ExamDetail;
