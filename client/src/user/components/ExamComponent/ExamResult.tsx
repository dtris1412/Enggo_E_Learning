import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { autoAnalyzeAfterExam } from "../../../shared/hooks/useAIAnalyzer";
import {
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Calendar,
  ArrowLeft,
  RotateCcw,
  FileText,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";

const ExamResult: React.FC = () => {
  const { userExamId } = useParams<{ userExamId: string }>();
  const navigate = useNavigate();
  const { getExamResult } = useExam();
  const { showToast } = useToast();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const fetchResult = async () => {
      if (!userExamId) return;

      setLoading(true);
      try {
        const resultData = await getExamResult(parseInt(userExamId));
        if (resultData.success) {
          setResult(resultData.data);

          // Auto-analyze exam performance with AI
          autoAnalyzeAfterExam(resultData.data).then((analysis) => {
            if (analysis) {
              console.log("AI Analysis completed:", analysis);
              // Có thể lưu analysis vào state hoặc hiển thị notification
            }
          });
        } else {
          showToast("error", resultData.message || "Không thể tải kết quả");
          navigate("/exams");
        }
      } catch (error) {
        console.error("Error fetching result:", error);
        showToast("error", "Không thể tải kết quả");
        navigate("/exams");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [userExamId]);

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Không tìm thấy kết quả
          </h3>
          <button
            onClick={() => navigate("/exams")}
            className="text-blue-600 hover:underline"
          >
            Quay lại danh sách đề thi
          </button>
        </div>
      </div>
    );
  }

  const percentage = parseFloat(result.statistics.percentage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/exams")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại đề thi
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Kết quả thi
              </h1>
              <p className="text-slate-600">{result.exam.exam_title}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/exams/${result.exam.exam_id}`)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Xem đề thi
              </button>
              <button
                onClick={() => navigate(`/exams/${result.exam.exam_id}/take`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <div
              className={`rounded-lg shadow-lg border-2 p-8 ${getScoreBgColor(
                percentage,
              )}`}
            >
              <div className="text-center">
                <Award
                  className={`w-20 h-20 mx-auto mb-4 ${getScoreColor(percentage)}`}
                />
                <h2 className="text-4xl font-bold text-slate-900 mb-2">
                  {percentage.toFixed(1)}%
                </h2>
                <p className="text-lg text-slate-700 mb-4">
                  Điểm: {result.total_score} điểm
                </p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">
                      {result.statistics.correct_answers} Đúng
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-slate-700">
                      {result.statistics.incorrect_answers} Sai
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Tổng quan kết quả
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {result.statistics.total_questions}
                  </p>
                  <p className="text-sm text-slate-600">Tổng câu hỏi</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {result.statistics.correct_answers}
                  </p>
                  <p className="text-sm text-slate-600">Câu đúng</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {result.statistics.incorrect_answers}
                  </p>
                  <p className="text-sm text-slate-600">Câu sai</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {result.total_score}
                  </p>
                  <p className="text-sm text-slate-600">Điểm số</p>
                </div>
              </div>
            </div>

            {/* Detailed Answers */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Đáp án chi tiết
              </h3>

              <div className="space-y-4">
                {result.answers.map((answer: any, index: number) => {
                  const isExpanded =
                    expandedQuestions[answer.user_answer_id] || false;
                  const isCorrect = answer.is_correct;

                  return (
                    <div
                      key={answer.user_answer_id}
                      className={`border-2 rounded-lg overflow-hidden ${
                        isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div
                        onClick={() => toggleQuestion(answer.user_answer_id)}
                        className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {isCorrect ? (
                              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 mb-1">
                                Câu {index + 1}
                              </p>
                              <p className="text-slate-700 line-clamp-2">
                                {
                                  answer.Container_Question.Question
                                    .question_content
                                }
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-200 pt-4 bg-white">
                          <div className="mb-4">
                            <p className="font-medium text-slate-900 mb-3">
                              {
                                answer.Container_Question.Question
                                  .question_content
                              }
                            </p>

                            {answer.Container_Question.image_url && (
                              <img
                                src={answer.Container_Question.image_url}
                                alt="Question"
                                className="max-w-sm rounded-lg shadow-sm mb-4"
                              />
                            )}

                            {/* Options */}
                            <div className="space-y-2">
                              {answer.Container_Question.Question_Options.map(
                                (option: any) => {
                                  const isUserAnswer =
                                    answer.Question_Option
                                      ?.question_option_id ===
                                    option.question_option_id;
                                  const isCorrectOption = option.is_correct;

                                  return (
                                    <div
                                      key={option.question_option_id}
                                      className={`p-3 rounded-lg border-2 ${
                                        isCorrectOption
                                          ? "border-green-500 bg-green-50"
                                          : isUserAnswer && !isCorrectOption
                                            ? "border-red-500 bg-red-50"
                                            : "border-slate-200 bg-slate-50"
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <span
                                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            isCorrectOption
                                              ? "bg-green-600 text-white"
                                              : isUserAnswer
                                                ? "bg-red-600 text-white"
                                                : "bg-slate-300 text-slate-700"
                                          }`}
                                        >
                                          {option.label}
                                        </span>
                                        <div className="flex-1">
                                          <span className="text-slate-900">
                                            {option.content}
                                          </span>
                                          {isCorrectOption && (
                                            <span className="ml-2 text-green-600 font-semibold text-sm">
                                              (Đáp án đúng)
                                            </span>
                                          )}
                                          {isUserAnswer && !isCorrectOption && (
                                            <span className="ml-2 text-red-600 font-semibold text-sm">
                                              (Câu trả lời của bạn)
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>

                          {/* Explanation */}
                          {answer.Container_Question.Question.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                              <p className="font-semibold text-blue-900 mb-2">
                                Giải thích:
                              </p>
                              <p className="text-blue-800">
                                {answer.Container_Question.Question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Exam Info */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Chi tiết đề thi
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-600">Đề thi</p>
                      <p className="font-medium text-slate-900">
                        {result.exam.exam_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-600">Đã nộp</p>
                      <p className="font-medium text-slate-900">
                        {new Date(result.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-600">Thời gian</p>
                      <p className="font-medium text-slate-900">
                        {result.exam.exam_duration} phút
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Lời khuyên
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {percentage >= 80 ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Xuất sắc! Hãy tiếp tục luyện tập.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Xem lại các câu sai để cải thiện.</span>
                      </li>
                    </>
                  ) : percentage >= 60 ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-0.5">!</span>
                        <span>Cố gắng tốt! Cần luyện tập thêm.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-0.5">!</span>
                        <span>Tập trung vào các điểm yếu.</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">×</span>
                        <span>Tiếp tục luyện tập để nâng cao điểm số.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">×</span>
                        <span>Xem lại tài liệu một cách cẩn thận.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Bước tiếp theo
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      navigate(`/exams/${result.exam.exam_id}/take`)
                    }
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Làm lại bài thi
                  </button>
                  <button
                    onClick={() => navigate("/exams")}
                    className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Khám phá đề thi
                  </button>
                  <button
                    onClick={() => navigate("/exams/history")}
                    className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Xem lịch sử
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
