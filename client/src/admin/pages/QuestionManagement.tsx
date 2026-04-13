import { useEffect, useState } from "react";
import {
  Search,
  Edit2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useLessonQuestion,
  LessonQuestion,
} from "../contexts/lessonQuestionContext.tsx";
import EditLessonQuestionModal from "../components/LessonManagement/EditLessonQuestionModal.tsx";

const QuestionManagement = () => {
  const {
    questions,
    totalQuestions,
    loading,
    fetchQuestionsPaginated,
    lockQuestion,
    unlockQuestion,
  } = useLessonQuestion();

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<LessonQuestion | null>(null);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadQuestions = () => {
    fetchQuestionsPaginated(page, limit, searchTerm);
  };

  const handleSearch = () => {
    setPage(1);
    loadQuestions();
  };

  const handleEdit = (question: LessonQuestion) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleToggleLock = async (question: LessonQuestion) => {
    if (question.status) {
      await lockQuestion(question.lesson_question_id);
    } else {
      await unlockQuestion(question.lesson_question_id);
    }
    loadQuestions();
  };

  const getQuestionTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      multiple_choice: "Trắc nghiệm",
      true_false: "Đúng/Sai",
      fill_in_blank: "Điền vào chỗ trống",
      short_answer: "Câu trả lời ngắn",
    };
    return types[type] || type;
  };

  const getDifficultyBadge = (level: string) => {
    const colors: { [key: string]: string } = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const totalPages = Math.ceil(totalQuestions / limit);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý câu hỏi</h1>
        <p className="text-gray-600 mt-1">
          Quản lý tất cả câu hỏi trong hệ thống
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm kiếm theo nội dung câu hỏi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy câu hỏi nào.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Độ khó
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đáp án
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question, index) => (
                    <tr
                      key={question.lesson_question_id}
                      className={!question.status ? "bg-gray-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {question.content}
                          </p>
                          {question.explaination && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {question.explaination}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                          {getQuestionTypeLabel(question.question_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${getDifficultyBadge(
                            question.difficulty_level,
                          )}`}
                        >
                          {question.difficulty_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                        {question.correct_answer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            question.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.status ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleLock(question)}
                            className={`p-2 rounded-lg ${
                              question.status
                                ? "text-yellow-600 hover:bg-yellow-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={question.status ? "Khóa" : "Mở khóa"}
                          >
                            {question.status ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 &&
              (() => {
                const getPageNums = (): (number | "...")[] => {
                  if (totalPages <= 7)
                    return Array.from({ length: totalPages }, (_, i) => i + 1);
                  const startGroup = [1, 2];
                  const endGroup = [totalPages - 1, totalPages];
                  const midGroup = [page - 1, page, page + 1].filter(
                    (p) => p > 2 && p < totalPages - 1,
                  );
                  const all = new Set([
                    ...startGroup,
                    ...midGroup,
                    ...endGroup,
                  ]);
                  const sorted = Array.from(all).sort((a, b) => a - b);
                  const result: (number | "...")[] = [];
                  for (let i = 0; i < sorted.length; i++) {
                    if (i > 0 && sorted[i] - sorted[i - 1] > 1)
                      result.push("...");
                    result.push(sorted[i]);
                  }
                  return result;
                };
                return (
                  <div className="flex justify-center items-center gap-5 flex-wrap bg-gray-50 px-6 py-4 border-t border-gray-200">
                    {page > 1 ? (
                      <button
                        onClick={() => setPage((p) => p - 1)}
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
                          onClick={() => setPage(p as number)}
                          aria-label={`Trang ${p}`}
                          aria-current={page === p ? "page" : undefined}
                          className={
                            page === p
                              ? "text-base font-semibold text-violet-600 border-b-2 border-violet-600 pb-0.5 pointer-events-none"
                              : "text-base font-medium text-slate-500 hover:text-violet-600 transition-colors pb-0.5 border-b-2 border-transparent hover:border-violet-300"
                          }
                        >
                          {p}
                        </button>
                      ),
                    )}
                    {page < totalPages ? (
                      <button
                        onClick={() => setPage((p) => p + 1)}
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
          </>
        )}
      </div>

      {/* Edit Modal */}
      <EditLessonQuestionModal
        isOpen={isEditModalOpen}
        question={selectedQuestion}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuestion(null);
        }}
        onSuccess={loadQuestions}
      />
    </div>
  );
};

export default QuestionManagement;
