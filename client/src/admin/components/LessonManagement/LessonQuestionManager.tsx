import { useEffect, useState } from "react";
import { Plus, Edit2, Lock, Unlock, Trash2 } from "lucide-react";
import {
  useLessonQuestion,
  LessonQuestion,
} from "../../contexts/lessonQuestionContext.tsx";
import AddLessonQuestionModal from "./AddLessonQuestionModal.tsx";
import EditLessonQuestionModal from "./EditLessonQuestionModal.tsx";

interface LessonQuestionManagerProps {
  lessonId: number;
}

const LessonQuestionManager: React.FC<LessonQuestionManagerProps> = ({
  lessonId,
}) => {
  const {
    questions,
    loading,
    fetchQuestionsByLessonId,
    lockQuestion,
    unlockQuestion,
  } = useLessonQuestion();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<LessonQuestion | null>(null);

  useEffect(() => {
    if (lessonId) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadQuestions = () => {
    fetchQuestionsByLessonId(lessonId);
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Quản lý câu hỏi</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm câu hỏi</span>
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Chưa có câu hỏi nào.</p>
          <p className="text-sm text-gray-400 mt-1">
            Nhấn "Thêm câu hỏi" để bắt đầu
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.lesson_question_id}
              className={`border rounded-lg p-4 ${
                !question.status ? "bg-gray-50 opacity-60" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Question Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{question.order_index}
                    </span>
                    <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {getQuestionTypeLabel(question.question_type)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getDifficultyBadge(
                        question.difficulty_level,
                      )}`}
                    >
                      {question.difficulty_level}
                    </span>
                    {!question.status && (
                      <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                        Đã khóa
                      </span>
                    )}
                  </div>

                  {/* Question Content */}
                  <p className="text-gray-800 mb-2">{question.content}</p>

                  {/* Options (for multiple choice and true/false) */}
                  {(question.question_type === "multiple_choice" ||
                    question.question_type === "true_false") &&
                    question.options && (
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        {(() => {
                          try {
                            const options = JSON.parse(question.options);
                            return Object.entries(options).map(
                              ([key, value]) => (
                                <div key={key} className="flex items-center">
                                  <span className="font-medium mr-2">
                                    {key}:
                                  </span>
                                  <span>{String(value)}</span>
                                </div>
                              ),
                            );
                          } catch (e) {
                            return (
                              <p className="text-red-500">
                                Lỗi hiển thị options
                              </p>
                            );
                          }
                        })()}
                      </div>
                    )}

                  {/* Correct Answer */}
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-green-700">Đáp án: </span>
                    <span className="text-gray-700">
                      {question.correct_answer}
                    </span>
                  </div>

                  {/* Explanation */}
                  {question.explaination && (
                    <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      <span className="font-medium">Giải thích: </span>
                      {question.explaination}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(question)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="h-5 w-5" />
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
                      <Lock className="h-5 w-5" />
                    ) : (
                      <Unlock className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddLessonQuestionModal
        isOpen={isAddModalOpen}
        lessonId={lessonId}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadQuestions}
      />

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

export default LessonQuestionManager;
