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
  Mic,
  Headphones,
  BookOpen,
  PenLine,
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
  const [writingExpandedTasks, setWritingExpandedTasks] = useState<
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
            {result.skill_bands ? (
              // ── IELTS Band Score Card ─────────────────────────────────────
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="text-center mb-8">
                  <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-2">
                    IELTS Overall Band Score
                  </p>
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/15 border-4 border-white/40 mb-3">
                    <span className="text-6xl font-black text-white">
                      {result.skill_bands.overall ?? "—"}
                    </span>
                  </div>
                  {result.skill_bands.overall == null && (
                    <p className="text-blue-200 text-xs mt-1">
                      Hoàn thành Writing &amp; Speaking để tính band tổng
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Listening */}
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
                    <Headphones className="w-7 h-7 text-cyan-300" />
                    <p className="text-xs font-semibold text-blue-200 uppercase">
                      Listening
                    </p>
                    <p className="text-3xl font-black text-white">
                      {result.skill_bands.listening?.band ?? "—"}
                    </p>
                    {result.skill_bands.listening && (
                      <p className="text-xs text-blue-200">
                        {result.skill_bands.listening.correct}/
                        {result.skill_bands.listening.total} đúng
                      </p>
                    )}
                  </div>

                  {/* Reading */}
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
                    <BookOpen className="w-7 h-7 text-emerald-300" />
                    <p className="text-xs font-semibold text-blue-200 uppercase">
                      Reading
                    </p>
                    <p className="text-3xl font-black text-white">
                      {result.skill_bands.reading?.band ?? "—"}
                    </p>
                    {result.skill_bands.reading && (
                      <p className="text-xs text-blue-200">
                        {result.skill_bands.reading.correct}/
                        {result.skill_bands.reading.total} đúng
                      </p>
                    )}
                  </div>

                  {/* Writing */}
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
                    <PenLine className="w-7 h-7 text-amber-300" />
                    <p className="text-xs font-semibold text-blue-200 uppercase">
                      Writing
                    </p>
                    <p className="text-3xl font-black text-white">
                      {result.skill_bands.writing?.band ?? "—"}
                    </p>
                    {result.skill_bands.writing == null && (
                      <p className="text-xs text-blue-200">Chưa chấm</p>
                    )}
                  </div>

                  {/* Speaking */}
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
                    <Mic className="w-7 h-7 text-violet-300" />
                    <p className="text-xs font-semibold text-blue-200 uppercase">
                      Speaking
                    </p>
                    <p className="text-3xl font-black text-white">
                      {result.skill_bands.speaking?.band ?? "—"}
                    </p>
                    {result.skill_bands.speaking == null && (
                      <p className="text-xs text-blue-200">Chưa chấm</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // ── Non-IELTS Score Card ──────────────────────────────────────
              <div
                className={`rounded-lg shadow-lg border-2 p-8 ${getScoreBgColor(percentage)}`}
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
            )}

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
                  <p className="text-sm text-slate-600">Câu đúng (L+R)</p>
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
                  <p className="text-sm text-slate-600">Điểm số (L+R)</p>
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

            {/* Writing Results Section */}
            {result.writing_results && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-slate-900">
                      Kết quả Writing
                    </h3>
                  </div>
                  {result.writing_results.final_band != null && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-sm font-medium text-emerald-700">
                        Writing Band
                      </span>
                      <span className="text-3xl font-black text-emerald-800">
                        {result.writing_results.final_band}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {result.writing_results.submissions.map((sub: any) => {
                    const feedback = sub.Writing_Feedbacks?.[0];
                    const comments = feedback
                      ? (() => {
                          try {
                            return JSON.parse(feedback.comments);
                          } catch {
                            return null;
                          }
                        })()
                      : null;
                    const isExpanded =
                      writingExpandedTasks[sub.submission_id] ?? false;
                    const taskLabel =
                      comments?.task_type === "task1" ? "Task 1" : "Task 2";

                    return (
                      <div
                        key={sub.submission_id}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        {/* Task header — always visible */}
                        <button
                          onClick={() =>
                            setWritingExpandedTasks((prev) => ({
                              ...prev,
                              [sub.submission_id]: !prev[sub.submission_id],
                            }))
                          }
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded uppercase">
                              {taskLabel}
                            </span>
                            <span className="text-sm text-slate-500">
                              {sub.word_count} từ
                            </span>
                            {sub.final_score != null ? (
                              <span className="text-sm font-semibold text-emerald-700">
                                Band {sub.final_score}
                              </span>
                            ) : (
                              <span className="text-sm text-red-500">
                                Chưa chấm được
                              </span>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Expandable content */}
                        {isExpanded && (
                          <div className="p-4 space-y-4">
                            {/* Criteria scores */}
                            {feedback?.criteria_scores && (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                  Criteria Analysis
                                </p>
                                {Object.entries(feedback.criteria_scores).map(
                                  ([k, v]: [string, any]) => {
                                    const comment =
                                      comments?.criteria_comments?.[k];
                                    const score = Number(v);
                                    const pct = Math.round((score / 9) * 100);
                                    const barColor =
                                      score >= 7
                                        ? "bg-green-500"
                                        : score >= 5.5
                                          ? "bg-blue-500"
                                          : score >= 4
                                            ? "bg-amber-500"
                                            : "bg-red-500";
                                    const textColor =
                                      score >= 7
                                        ? "text-green-700"
                                        : score >= 5.5
                                          ? "text-blue-700"
                                          : score >= 4
                                            ? "text-amber-700"
                                            : "text-red-700";
                                    return (
                                      <div
                                        key={k}
                                        className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="text-xs font-semibold text-slate-600 capitalize">
                                            {k.replace(/_/g, " ")}
                                          </p>
                                          <span
                                            className={`text-sm font-bold ${textColor}`}
                                          >
                                            {v}
                                          </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                                          <div
                                            className={`h-full rounded-full ${barColor}`}
                                            style={{ width: `${pct}%` }}
                                          />
                                        </div>
                                        {comment && (
                                          <p className="text-xs text-slate-500">
                                            {comment}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            )}

                            {/* Overall comment */}
                            {comments?.feedback?.overall_comment && (
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-xs font-semibold text-blue-700 uppercase mb-1">
                                  Overall Comment
                                </p>
                                <p className="text-sm text-blue-900 leading-relaxed">
                                  {comments.feedback.overall_comment}
                                </p>
                              </div>
                            )}

                            {/* Strengths */}
                            {(comments?.feedback?.strengths?.length ?? 0) >
                              0 && (
                              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <p className="text-xs font-semibold text-green-700 uppercase mb-2">
                                  ✓ Strengths
                                </p>
                                <ul className="space-y-1">
                                  {comments.feedback.strengths.map(
                                    (s: string, i: number) => (
                                      <li
                                        key={i}
                                        className="text-sm text-green-900 flex items-start gap-2"
                                      >
                                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500" />
                                        {s}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Improvements */}
                            {(comments?.feedback?.improvements?.length ?? 0) >
                              0 && (
                              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                <p className="text-xs font-semibold text-amber-700 uppercase mb-2">
                                  ✗ Improvements
                                </p>
                                <ul className="space-y-1">
                                  {comments.feedback.improvements.map(
                                    (s: string, i: number) => (
                                      <li
                                        key={i}
                                        className="text-sm text-amber-900 flex items-start gap-2"
                                      >
                                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        {s}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Tips */}
                            {(comments?.feedback?.tips?.length ?? 0) > 0 && (
                              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                                <p className="text-xs font-semibold text-cyan-700 uppercase mb-2">
                                  💡 Tips
                                </p>
                                <ul className="space-y-1">
                                  {comments.feedback.tips.map(
                                    (s: string, i: number) => (
                                      <li
                                        key={i}
                                        className="text-sm text-cyan-900 flex items-start gap-2"
                                      >
                                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                        {s}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Sample improvements */}
                            {(comments?.sample_improvements?.length ?? 0) >
                              0 && (
                              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <p className="text-xs font-semibold text-purple-700 uppercase mb-3">
                                  ✏ Sample Improvements
                                </p>
                                <div className="space-y-3">
                                  {comments.sample_improvements.map(
                                    (ex: string, i: number) => {
                                      const parts = ex
                                        .split(/→|->/)
                                        .map((p: string) => p.trim());
                                      return parts.length === 2 ? (
                                        <div key={i} className="space-y-1">
                                          <p className="text-xs text-purple-600 font-medium">
                                            Original Sentence:
                                          </p>
                                          <p className="text-sm text-purple-900 bg-purple-100 rounded px-3 py-2 line-through opacity-70">
                                            {parts[0].replace(
                                              /^Original:\s*/i,
                                              "",
                                            )}
                                          </p>
                                          <p className="text-xs text-purple-600 font-medium">
                                            Improved Sentence:
                                          </p>
                                          <p className="text-sm text-purple-900 bg-white rounded px-3 py-2 border border-purple-300">
                                            {parts[1].replace(
                                              /^Improved:\s*/i,
                                              "",
                                            )}
                                          </p>
                                        </div>
                                      ) : (
                                        <p
                                          key={i}
                                          className="text-sm text-purple-900"
                                        >
                                          {ex}
                                        </p>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            )}

                            {/* User's essay */}
                            <details className="group">
                              <summary className="cursor-pointer text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 select-none">
                                Your Essay
                              </summary>
                              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {sub.content}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Speaking Results Section */}
            {result.speaking_results && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Mic className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-slate-900">
                      Kết quả Speaking
                    </h3>
                  </div>
                  {result.speaking_results.final_band != null && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
                      <span className="text-sm font-medium text-purple-700">
                        Speaking Band
                      </span>
                      <span className="text-3xl font-black text-purple-800">
                        {result.speaking_results.final_band}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {result.speaking_results.records.map(
                    (rec: any, idx: number) => {
                      const fb = rec.Speaking_Feedbacks?.[0];
                      const comments = fb
                        ? (() => {
                            try {
                              return JSON.parse(fb.comments);
                            } catch {
                              return null;
                            }
                          })()
                        : null;
                      const isExpanded =
                        writingExpandedTasks[-rec.record_id] ?? false;

                      return (
                        <div
                          key={rec.record_id}
                          className="border border-slate-200 rounded-xl overflow-hidden"
                        >
                          {/* Part header */}
                          <button
                            onClick={() =>
                              setWritingExpandedTasks((prev) => ({
                                ...prev,
                                [-rec.record_id]: !prev[-rec.record_id],
                              }))
                            }
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded uppercase">
                                Part {idx + 1}
                              </span>
                              <span className="text-sm text-slate-500">
                                {rec.duration}s
                              </span>
                              {rec.final_score != null ? (
                                <span className="text-sm font-semibold text-purple-700">
                                  Band {rec.final_score}
                                </span>
                              ) : (
                                <span className="text-sm text-red-500">
                                  Chưa chấm được
                                </span>
                              )}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-4 space-y-4">
                              {/* Criteria scores */}
                              {fb?.criteria_scores && (
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Criteria Analysis
                                  </p>
                                  {Object.entries(fb.criteria_scores).map(
                                    ([k, v]: [string, any]) => {
                                      const score = Number(v);
                                      const pct = Math.round((score / 9) * 100);
                                      const barColor =
                                        score >= 7
                                          ? "bg-green-500"
                                          : score >= 5.5
                                            ? "bg-blue-500"
                                            : score >= 4
                                              ? "bg-amber-500"
                                              : "bg-red-500";
                                      const textColor =
                                        score >= 7
                                          ? "text-green-700"
                                          : score >= 5.5
                                            ? "text-blue-700"
                                            : score >= 4
                                              ? "text-amber-700"
                                              : "text-red-700";
                                      const criteriaComment =
                                        comments?.criteria_comments?.[k];
                                      return (
                                        <div
                                          key={k}
                                          className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-semibold text-slate-600 capitalize">
                                              {k.replace(/_/g, " ")}
                                            </p>
                                            <span
                                              className={`text-sm font-bold ${textColor}`}
                                            >
                                              {v}
                                            </span>
                                          </div>
                                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                                            <div
                                              className={`h-full rounded-full ${barColor}`}
                                              style={{ width: `${pct}%` }}
                                            />
                                          </div>
                                          {criteriaComment && (
                                            <p className="text-xs text-slate-500">
                                              {criteriaComment}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              )}

                              {/* Overall comment */}
                              {comments?.feedback?.overall_comment && (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                  <p className="text-xs font-semibold text-blue-700 uppercase mb-1">
                                    Overall Comment
                                  </p>
                                  <p className="text-sm text-blue-900 leading-relaxed">
                                    {comments.feedback.overall_comment}
                                  </p>
                                </div>
                              )}

                              {/* Strengths */}
                              {(comments?.feedback?.strengths?.length ?? 0) >
                                0 && (
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                  <p className="text-xs font-semibold text-green-700 uppercase mb-2">
                                    ✓ Strengths
                                  </p>
                                  <ul className="space-y-1">
                                    {comments.feedback.strengths.map(
                                      (s: string, i: number) => (
                                        <li
                                          key={i}
                                          className="text-sm text-green-900 flex items-start gap-2"
                                        >
                                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500" />
                                          {s}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Improvements */}
                              {(comments?.feedback?.improvements?.length ?? 0) >
                                0 && (
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                  <p className="text-xs font-semibold text-amber-700 uppercase mb-2">
                                    ✗ Improvements
                                  </p>
                                  <ul className="space-y-1">
                                    {comments.feedback.improvements.map(
                                      (s: string, i: number) => (
                                        <li
                                          key={i}
                                          className="text-sm text-amber-900 flex items-start gap-2"
                                        >
                                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                                          {s}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Pronunciation notes */}
                              {(comments?.feedback?.pronunciation_notes
                                ?.length ?? 0) > 0 && (
                                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                  <p className="text-xs font-semibold text-indigo-700 uppercase mb-2">
                                    🗣 Pronunciation
                                  </p>
                                  <ul className="space-y-1">
                                    {comments.feedback.pronunciation_notes.map(
                                      (note: string, i: number) => (
                                        <li
                                          key={i}
                                          className="text-sm text-indigo-900 flex items-start gap-2"
                                        >
                                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                          {note}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Tips */}
                              {(comments?.feedback?.tips?.length ?? 0) > 0 && (
                                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                                  <p className="text-xs font-semibold text-cyan-700 uppercase mb-2">
                                    💡 Tips
                                  </p>
                                  <ul className="space-y-1">
                                    {comments.feedback.tips.map(
                                      (tip: string, i: number) => (
                                        <li
                                          key={i}
                                          className="text-sm text-cyan-900 flex items-start gap-2"
                                        >
                                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                          {tip}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Transcript */}
                              {comments?.transcript && (
                                <details className="group">
                                  <summary className="cursor-pointer text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 select-none">
                                    Conversation Transcript
                                  </summary>
                                  <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                                    {comments.transcript}
                                  </div>
                                </details>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}
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
