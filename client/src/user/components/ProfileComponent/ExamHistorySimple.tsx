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

  useEffect(() => {
    fetchExamHistory();
  }, []);

  const fetchExamHistory = async () => {
    try {
      setLoading(true);
      const result = await getUserExamHistory(1, 10);

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
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
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

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
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
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Lịch sử làm bài</h2>
        </div>

        {totalExams === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Chưa có lịch sử làm bài</p>
            <Link
              to="/exams"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Làm bài thi ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 10).map((attempt) => {
              const percentage = getScorePercentage(attempt);
              const isPassed = percentage >= 60;

              return (
                <div
                  key={attempt.user_exam_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {attempt.Exam.exam_title}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(attempt.submitted_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
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
                      className="ml-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}

            {totalExams > 10 && (
              <div className="text-center pt-4">
                <Link
                  to="/exams/history"
                  className="inline-block px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Xem tất cả ({totalExams} bài thi)
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHistorySimple;
