import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import {
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ExamHistory: React.FC = () => {
  const navigate = useNavigate();
  const { getUserExamHistory } = useExam();
  const { showToast } = useToast();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getUserExamHistory();
      if (response.success) {
        setHistory(response.data || []);
      } else {
        showToast("error", response.message || "Không thể tải lịch sử thi");
      }
    } catch (error) {
      console.error("Error fetching exam history:", error);
      showToast("error", "Không thể tải lịch sử thi");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { text: "Xuất sắc", color: "bg-green-500" };
    if (percentage >= 60) return { text: "Tốt", color: "bg-yellow-500" };
    return { text: "Cần cải thiện", color: "bg-red-500" };
  };

  const calculatePercentage = (attempt: any): number => {
    if (!attempt.statistics) return 0;
    return parseFloat(attempt.statistics.percentage) || 0;
  };

  // Filter and sort history
  const filteredHistory = history
    .filter((attempt) => {
      // Skip if exam was deleted
      if (!attempt.Exam) return false;

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        attempt.Exam.exam_title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        attempt.Exam.exam_code.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "passed" && calculatePercentage(attempt) >= 60) ||
        (filterStatus === "failed" && calculatePercentage(attempt) < 60);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.submitted_at).getTime();
        const dateB = new Date(b.submitted_at).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        const scoreA = calculatePercentage(a);
        const scoreB = calculatePercentage(b);
        return sortOrder === "desc" ? scoreB - scoreA : scoreA - scoreB;
      }
    });

  // Calculate statistics
  const totalAttempts = history.length;
  const averageScore =
    totalAttempts > 0
      ? history.reduce(
          (sum, attempt) => sum + calculatePercentage(attempt),
          0,
        ) / totalAttempts
      : 0;
  const passedExams = history.filter(
    (attempt) => calculatePercentage(attempt) >= 60,
  ).length;
  const highestScore = Math.max(
    ...history.map((attempt) => calculatePercentage(attempt)),
    0,
  );

  const toggleSort = (newSortBy: "date" | "score") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải lịch sử thi...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Lịch sử thi
              </h1>
              <p className="text-slate-600">
                Xem các lần thi và kết quả của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalAttempts}</p>
            <p className="text-sm text-slate-600">Tổng lượt thi</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {averageScore.toFixed(1)}%
            </p>
            <p className="text-sm text-slate-600">Điểm trung bình</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{passedExams}</p>
            <p className="text-sm text-slate-600">Đã vượt qua</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {highestScore.toFixed(1)}%
            </p>
            <p className="text-sm text-slate-600">Điểm cao nhất</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đề thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">Tất cả</option>
                <option value="passed">Đã qua (≥60%)</option>
                <option value="failed">Chưa qua (&lt;60%)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleSort("date")}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  sortBy === "date"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Ngày
                {sortBy === "date" &&
                  (sortOrder === "desc" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  ))}
              </button>
              <button
                onClick={() => toggleSort("score")}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  sortBy === "score"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Award className="w-4 h-4" />
                Điểm
                {sortBy === "score" &&
                  (sortOrder === "desc" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  ))}
              </button>
            </div>
          </div>
        </div>

        {/* Exam History List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Không có lịch sử thi
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Hãy thử điều chỉnh bộ lọc"
                : "Làm bài thi để xem lịch sử ở đây"}
            </p>
            <button
              onClick={() => navigate("/exams")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá đề thi
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((attempt) => {
              const percentage = calculatePercentage(attempt);
              const badge = getScoreBadge(percentage);

              return (
                <div
                  key={attempt.user_exam_id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-1">
                              {attempt.Exam?.exam_title || "Đề thi đã xóa"}
                            </h3>
                            <p className="text-sm text-slate-600">
                              Mã: {attempt.Exam?.exam_code || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-lg ${getScoreBgColor(percentage)} ${getScoreColor(percentage)} font-bold text-2xl mb-2`}
                        >
                          {percentage.toFixed(1)}%
                        </div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${badge.color}`}
                          >
                            {badge.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Đã nộp</p>
                          <p className="font-medium text-slate-900">
                            {new Date(
                              attempt.submitted_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Thời gian</p>
                          <p className="font-medium text-slate-900">
                            {new Date(
                              attempt.submitted_at,
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Điểm</p>
                          <p className="font-medium text-slate-900">
                            {attempt.total_score} điểm
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Câu hỏi</p>
                          <p className="font-medium text-slate-900">
                            {attempt.statistics?.total_questions || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Statistics Bar */}
                    {attempt.statistics && (
                      <div className="mb-4">
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-slate-700">
                              {attempt.statistics.correct_answers} Đúng
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-slate-700">
                              {attempt.statistics.incorrect_answers} Sai
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-500 h-2 transition-all"
                            style={{
                              width: `${(attempt.statistics.correct_answers / attempt.statistics.total_questions) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/exams/result/${attempt.user_exam_id}`)
                        }
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => navigate(`/exams/${attempt.exam_id}`)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                        disabled={!attempt.Exam}
                        title={!attempt.Exam ? "Đề thi đã bị xóa" : ""}
                      >
                        Xem đề
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHistory;
