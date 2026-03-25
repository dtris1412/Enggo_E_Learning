import React, { useEffect, useState } from "react";
import {
  BarChart2,
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  ChevronDown,
  Loader2,
  Sparkles,
  AlertCircle,
  Target,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import {
  useExamAnalytics,
  WeaknessType,
} from "../../contexts/examAnalyticsContext";
import { useExam } from "../../contexts/examContext";

// ==================== Helpers ====================

const QUESTION_TYPE_LABELS: Record<string, string> = {
  listening_photographs: "Listening - Part 1: Photographs",
  listening_question_response: "Listening - Part 2: Q&R",
  listening_conversation: "Listening - Part 3: Conversations",
  listening_talk: "Listening - Part 4: Talks",
  reading_incomplete_sentences: "Reading - Part 5: Incomplete Sentences",
  reading_text_completion: "Reading - Part 6: Text Completion",
  reading_reading_comprehension: "Reading - Part 7: Comprehension",
  reading_matching_headings: "Reading - Matching Headings",
  reading_true_false_not_given: "Reading - True/False/NG",
  reading_multiple_choice: "Reading - Multiple Choice",
  reading_matching_information: "Reading - Matching Information",
  reading_sentence_completion: "Reading - Sentence Completion",
  reading_summary_completion: "Reading - Summary Completion",
  reading_short_answer: "Reading - Short Answer",
  writing_task_1: "Writing - Task 1",
  writing_task_2: "Writing - Task 2",
  speaking_part_1: "Speaking - Part 1",
  speaking_part_2: "Speaking - Part 2",
  speaking_part_3: "Speaking - Part 3",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
};

const getAccuracyColor = (rate: string) => {
  const val = parseFloat(rate);
  if (val >= 80) return "text-green-600";
  if (val >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getExamTypeBadge = (type: string) =>
  type === "TOEIC"
    ? "bg-blue-100 text-blue-700"
    : "bg-purple-100 text-purple-700";

// ==================== Sub-components ====================

const WeaknessBar: React.FC<{ weakness: WeaknessType; max: number }> = ({
  weakness,
  max,
}) => {
  const pct = max > 0 ? (weakness.wrong_count / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span className="truncate max-w-[80%]">
          {QUESTION_TYPE_LABELS[weakness.type] ?? weakness.type}
        </span>
        <span className="font-semibold text-red-600 ml-2">
          {weakness.wrong_count} sai
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/** Renders AI markdown-like text with basic formatting */
const AIAnalysisText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div className="space-y-1 text-sm text-gray-700 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("### "))
          return (
            <p key={i} className="font-bold text-gray-800 text-base mt-3">
              {line.replace("### ", "")}
            </p>
          );
        if (line.startsWith("## "))
          return (
            <p key={i} className="font-bold text-blue-700 text-base mt-3">
              {line.replace("## ", "")}
            </p>
          );
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <p key={i} className="font-semibold text-gray-800 mt-2">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (line.startsWith("- ") || line.startsWith("• "))
          return (
            <p
              key={i}
              className="pl-4 before:content-['•'] before:mr-2 before:text-blue-500"
            >
              {line.replace(/^[-•]\s/, "")}
            </p>
          );
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
};

// ==================== Main Component ====================

interface ExamAttemptForAnalysis {
  user_exam_id: number;
  exam_id: number;
  status: string;
  Exam: { exam_title: string; exam_type: string };
  submitted_at: string;
}

const ExamAnalytics: React.FC = () => {
  const {
    overallStats,
    loadingOverall,
    errorOverall,
    aiAnalysis,
    loadingAI,
    errorAI,
    fetchOverallStats,
    fetchAIAnalysis,
    clearAIAnalysis,
  } = useExamAnalytics();

  const { getUserExamHistory } = useExam();

  const [examHistory, setExamHistory] = useState<ExamAttemptForAnalysis[]>([]);
  const [selectedUserExamId, setSelectedUserExamId] = useState<number | null>(
    null,
  );
  const [expandedStat, setExpandedStat] = useState<number | null>(null);

  useEffect(() => {
    fetchOverallStats();
    loadExamHistory();
  }, []);

  const loadExamHistory = async () => {
    const result = await getUserExamHistory(1, 20);
    if (result?.success) {
      // Chỉ lấy các bài đã được graded
      const graded = (result.data || []).filter(
        (e: ExamAttemptForAnalysis) => e.status === "graded",
      );
      setExamHistory(graded);
    }
  };

  const handleAIAnalysis = async () => {
    if (!selectedUserExamId) return;
    await fetchAIAnalysis(selectedUserExamId);
  };

  const totalExams = overallStats.length;
  const avgAccuracy =
    totalExams > 0
      ? (
          overallStats.reduce(
            (sum, s) => sum + parseFloat(s.accuracy_rate),
            0,
          ) / totalExams
        ).toFixed(1)
      : "0.0";

  const totalCorrect = overallStats.reduce(
    (s, stat) => s + stat.total_correct,
    0,
  );
  const totalWrong = overallStats.reduce((s, stat) => s + stat.total_wrong, 0);

  // Top weakness types tổng hợp từ tất cả bài
  const allWeaknesses = overallStats.flatMap((s) => s.weakness_types || []);
  const weaknessSummary = allWeaknesses.reduce<Record<string, number>>(
    (acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + w.wrong_count;
      return acc;
    },
    {},
  );
  const topWeaknesses = Object.entries(weaknessSummary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, wrong_count]) => ({ type, wrong_count }));

  const maxWrong = topWeaknesses[0]?.wrong_count || 1;

  // ==================== Render ====================

  if (loadingOverall) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
        <span className="text-gray-500">Đang tải thống kê...</span>
      </div>
    );
  }

  if (errorOverall) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 mb-4">{errorOverall}</p>
        <button
          onClick={fetchOverallStats}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Phân tích kết quả thi</h2>
        </div>
        <p className="text-indigo-100 text-sm">
          Xem thống kê tổng hợp và nhận phân tích cá nhân hóa từ AI
        </p>
      </div>

      {totalExams === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có dữ liệu thống kê.</p>
          <p className="text-gray-400 text-sm mt-1">
            Hãy hoàn thành ít nhất một bài thi để xem phân tích.
          </p>
        </div>
      ) : (
        <>
          {/* ===== Overview Cards ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-500 font-medium">
                  Số đề đã thi
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{totalExams}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500 font-medium">
                  Trung bình đúng
                </span>
              </div>
              <p
                className={`text-3xl font-bold ${getAccuracyColor(avgAccuracy)}`}
              >
                {avgAccuracy}%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-gray-500 font-medium">
                  Tổng câu đúng
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                {totalCorrect}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-500 font-medium">
                  Tổng câu sai
                </span>
              </div>
              <p className="text-3xl font-bold text-red-500">{totalWrong}</p>
            </div>
          </div>

          {/* ===== Top Weakness Types ===== */}
          {topWeaknesses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-gray-800">
                  Dạng câu hỏi yếu nhất (tổng hợp)
                </h3>
              </div>
              <div className="space-y-3">
                {topWeaknesses.map((w) => (
                  <WeaknessBar key={w.type} weakness={w} max={maxWrong} />
                ))}
              </div>
            </div>
          )}

          {/* ===== Per-Exam Stats List ===== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-800">Thống kê theo từng đề</h3>
            </div>

            <div className="space-y-3">
              {overallStats.map((stat) => {
                const isExpanded = expandedStat === stat.exam_id;
                const maxW = stat.weakness_types?.[0]?.wrong_count || 1;

                return (
                  <div
                    key={stat.exam_id}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    {/* Row header */}
                    <button
                      onClick={() =>
                        setExpandedStat(isExpanded ? null : stat.exam_id)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getExamTypeBadge(stat.exam_type)}`}
                        >
                          {stat.exam_type}
                        </span>
                        <span className="font-medium text-gray-800 text-sm truncate">
                          {stat.exam_title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${getAccuracyColor(stat.accuracy_rate)}`}
                          >
                            {stat.accuracy_rate}%
                          </p>
                          <p className="text-xs text-gray-400">
                            {stat.total_correct}/
                            {stat.total_correct + stat.total_wrong}
                          </p>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                        {/* Progress bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1 text-gray-600">
                            <span>
                              <span className="text-emerald-600 font-medium">
                                {stat.total_correct} đúng
                              </span>{" "}
                              /{" "}
                              <span className="text-red-500 font-medium">
                                {stat.total_wrong} sai
                              </span>
                            </span>
                            <span className="text-gray-400">
                              Cập nhật:{" "}
                              {new Date(stat.updated_at).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-emerald-500"
                              style={{
                                width: `${(stat.total_correct / (stat.total_correct + stat.total_wrong)) * 100}%`,
                              }}
                            />
                            <div className="h-full bg-red-400 flex-1" />
                          </div>
                        </div>

                        {/* Weakness types for this exam */}
                        {stat.weakness_types?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Dạng câu yếu:
                            </p>
                            <div className="space-y-2">
                              {stat.weakness_types.slice(0, 4).map((w) => (
                                <WeaknessBar
                                  key={w.type}
                                  weakness={w}
                                  max={maxW}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== AI Analysis Section ===== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-800">
                Phân tích AI & Lộ trình học
              </h3>
              <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                Dùng AI Token
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Chọn một bài thi đã hoàn thành để AI phân tích chi tiết điểm
              mạnh/yếu và đề xuất lộ trình học cá nhân hóa.
            </p>

            {/* Select exam */}
            <div className="flex gap-3 mb-4">
              <select
                value={selectedUserExamId ?? ""}
                onChange={(e) => {
                  clearAIAnalysis();
                  setSelectedUserExamId(
                    e.target.value ? Number(e.target.value) : null,
                  );
                }}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
              >
                <option value="">-- Chọn bài thi --</option>
                {examHistory.map((e) => (
                  <option key={e.user_exam_id} value={e.user_exam_id}>
                    {e.Exam.exam_title} (
                    {new Date(e.submitted_at).toLocaleDateString("vi-VN")})
                  </option>
                ))}
              </select>

              <button
                onClick={handleAIAnalysis}
                disabled={!selectedUserExamId || loadingAI}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Phân tích
                  </>
                )}
              </button>
            </div>

            {/* Error */}
            {errorAI && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorAI}</span>
              </div>
            )}

            {/* AI Result */}
            {aiAnalysis && (
              <div className="mt-4 space-y-4">
                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-indigo-700">
                      {aiAnalysis.stats.accuracy_rate}
                    </p>
                    <p className="text-xs text-indigo-500 mt-0.5">Tỷ lệ đúng</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-emerald-700">
                      {aiAnalysis.stats.total_correct}
                    </p>
                    <p className="text-xs text-emerald-500 mt-0.5">Câu đúng</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-red-600">
                      {aiAnalysis.stats.total_wrong}
                    </p>
                    <p className="text-xs text-red-400 mt-0.5">Câu sai</p>
                  </div>
                </div>

                {/* Weakness types for this exam */}
                {aiAnalysis.stats.weakness_types?.length > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                    <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> Dạng câu yếu nhất:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.stats.weakness_types.slice(0, 5).map((w) => (
                        <span
                          key={w.type}
                          className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                        >
                          {QUESTION_TYPE_LABELS[w.type] ?? w.type} (
                          {w.wrong_count} sai)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historical context summary */}
                {aiAnalysis.historical_context &&
                  aiAnalysis.historical_context.total_exams_taken > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-3 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> Dữ liệu lịch sử học
                        tập ({aiAnalysis.historical_context.total_exams_taken}{" "}
                        bài đã thi)
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white rounded p-2 text-center border border-blue-100">
                          <p className="text-base font-bold text-blue-700">
                            {aiAnalysis.historical_context.overall_avg_accuracy}
                          </p>
                          <p className="text-xs text-blue-400">
                            Trung bình chính xác
                          </p>
                        </div>
                        <div className="bg-white rounded p-2 text-center border border-blue-100">
                          <p
                            className={`text-base font-bold ${
                              aiAnalysis.historical_context.progress_trend.includes(
                                "tiến bộ",
                              )
                                ? "text-emerald-600"
                                : aiAnalysis.historical_context.progress_trend.includes(
                                      "giảm",
                                    )
                                  ? "text-red-500"
                                  : "text-gray-600"
                            }`}
                          >
                            {aiAnalysis.historical_context.progress_trend
                              .charAt(0)
                              .toUpperCase() +
                              aiAnalysis.historical_context.progress_trend.slice(
                                1,
                              )}
                          </p>
                          <p className="text-xs text-blue-400">
                            Xu hướng (3 bài)
                          </p>
                        </div>
                      </div>
                      {aiAnalysis.historical_context.recurring_weaknesses
                        .length > 0 && (
                        <div>
                          <p className="text-xs text-blue-600 font-medium mb-1">
                            Điểm yếu lặp lại:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {aiAnalysis.historical_context.recurring_weaknesses.map(
                              (w) => (
                                <span
                                  key={w.type}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                  title={`Xuất hiện ${w.appearances} bài, tổng ${w.total_wrong} câu sai`}
                                >
                                  {QUESTION_TYPE_LABELS[w.type] ?? w.type} ×
                                  {w.appearances}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* AI text analysis */}
                <div className="border border-purple-100 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <p className="font-semibold text-purple-800 text-sm">
                      Phân tích từ AI
                    </p>
                    <button
                      onClick={() => fetchAIAnalysis(selectedUserExamId!)}
                      disabled={loadingAI}
                      className="ml-auto text-purple-400 hover:text-purple-700 transition"
                      title="Phân tích lại"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <AIAnalysisText text={aiAnalysis.ai_analysis} />
                </div>

                {/* Token info */}
                <p className="text-right text-xs text-gray-400">
                  Đã dùng {aiAnalysis.token_usage.ai_tokens_used} AI token (
                  {aiAnalysis.token_usage.openai_tokens_used} OpenAI tokens)
                </p>
              </div>
            )}

            {/* Empty state */}
            {!loadingAI && !aiAnalysis && !errorAI && (
              <div className="text-center py-8 text-gray-400">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  Chọn bài thi và nhấn <strong>Phân tích</strong> để bắt đầu.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamAnalytics;
