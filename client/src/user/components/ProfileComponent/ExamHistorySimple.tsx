import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useExam } from "../../contexts/examContext";

interface ExamAttempt {
  user_exam_id: number;
  exam_id: number;
  started_at: string;
  submitted_at: string;
  status: string;
  total_score: number;
  selected_parts: string[];
  Exam: {
    exam_id: number;
    exam_title: string;
    exam_code: string;
    exam_type: string;
    total_questions: number;
    Certificate: {
      certificate_id: number;
      certificate_name: string;
    };
  };
  statistics: {
    total_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    percentage: string;
  };
}

const ExamHistorySimple: React.FC = () => {
  const { getUserExamHistory } = useExam();
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchExamHistory();
  }, []);

  const fetchExamHistory = async () => {
    try {
      setLoading(true);
      const result = await getUserExamHistory(1, 100);

      if (result.success) {
        setHistory(result.data || []);
      } else {
        setError(result.message || "Failed to load exam history");
      }
    } catch (err) {
      console.error("Error fetching exam history:", err);
      setError("An error occurred while loading exam history");
    } finally {
      setLoading(false);
    }
  };

  const getScorePercentage = (attempt: ExamAttempt): number => {
    if (attempt.statistics?.percentage) {
      return parseFloat(attempt.statistics.percentage);
    }
    return 0;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-300 rounded w-1/3"></div>
          <div className="h-4 bg-slate-300 rounded w-full"></div>
          <div className="h-4 bg-slate-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <XCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalExams = history.length;
  const averageScore =
    totalExams > 0
      ? history.reduce((sum, attempt) => sum + getScorePercentage(attempt), 0) /
        totalExams
      : 0;

  const totalPages = Math.ceil(totalExams / ITEMS_PER_PAGE);
  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-violet-800 to-violet-900 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Tổng số bài thi</p>
              <p className="text-3xl font-bold">{totalExams}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Điểm trung bình</p>
              <p className="text-3xl font-bold">{averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam History List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-slate-800">Lịch sử làm bài</h2>
        </div>

        {totalExams === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">Chưa có lịch sử làm bài</p>
            <Link
              to="/exams"
              className="inline-block px-6 py-2.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
            >
              Làm bài thi ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedHistory.map((attempt) => {
              const percentage = getScorePercentage(attempt);
              const isPassed = percentage >= 60;

              return (
                <div
                  key={attempt.user_exam_id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-800 mb-2">
                        {attempt.Exam.exam_title}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(attempt.submitted_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                          <Award className="w-4 h-4" />
                          <span>
                            {attempt.statistics.correct_answers}/
                            {attempt.statistics.total_questions} câu
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`font-semibold ${getScoreColor(percentage)}`}
                          >
                            {percentage.toFixed(1)}%
                          </span>
                        </div>

                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isPassed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isPassed ? "Đạt" : "Chưa đạt"}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/exams/result/${attempt.user_exam_id}`}
                      className="ml-4 px-4 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-md transition"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Trang {currentPage}/{totalPages} &bull; {totalExams} bài thi
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ‹ Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - currentPage) <= 1,
                    )
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && (arr[i - 1] as number) < p - 1)
                        acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="px-2 py-1.5 text-sm text-slate-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                            currentPage === p
                              ? "bg-violet-600 text-white border-violet-600"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Sau ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHistorySimple;
