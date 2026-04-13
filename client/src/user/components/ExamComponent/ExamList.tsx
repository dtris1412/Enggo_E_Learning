import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import ExamCard from "./ExamCard";
import Pagination from "../../../shared/components/Pagination";
import { Search, FileText, BookOpen, TrendingUp, Award } from "lucide-react";

const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const { exams, totalExams, totalPages, loading, error, fetchExamsPaginated } =
    useExam();

  const [searchTerm, setSearchTerm] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [itemsPerPage] = useState(12);
  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const urlPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  const resetPage = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });

  // Initial load
  useEffect(() => {
    fetchExamsPaginated(searchTerm, urlPage, itemsPerPage);
  }, [urlPage]);

  // Fetch recent exams for sidebar (independent of search/filter)
  useEffect(() => {
    const fetchRecentExams = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        const response = await fetch(`${API_URL}/user/exams?page=1&limit=5`);
        const data = await response.json();
        if (data.success) {
          setRecentExams(data.data.exams || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent exams:", error);
      }
    };
    fetchRecentExams();
  }, []);

  // Auto-search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      resetPage();
      fetchExamsPaginated(
        searchTerm,
        1,
        itemsPerPage,
        examTypeFilter,
        yearFilter ? parseInt(yearFilter) : undefined,
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Auto-fetch when filters change
  useEffect(() => {
    resetPage();
    fetchExamsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      examTypeFilter,
      yearFilter ? parseInt(yearFilter) : undefined,
    );
  }, [examTypeFilter, yearFilter]);

  const handlePageChange = (page: number) => {
    fetchExamsPaginated(
      searchTerm,
      page,
      itemsPerPage,
      examTypeFilter,
      yearFilter ? parseInt(yearFilter) : undefined,
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExamTypeFilter(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearFilter(e.target.value);
  };

  // Generate year options (last 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-[300px] h-[300px] bg-violet-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-violet-700/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Luyện thi
            </span>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight">
              <span className="text-white">Đề thi</span>{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                luyện tập
              </span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm đề thi theo tên hoặc mã..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Exam Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Loại đề thi
                  </label>
                  <select
                    value={examTypeFilter}
                    onChange={handleExamTypeChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Năm
                  </label>
                  <select
                    value={yearFilter}
                    onChange={handleYearChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {totalExams}
                    </span>{" "}
                    đề thi
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            )}

            {/* Exam Grid */}
            {!loading && exams.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {exams.map((exam) => (
                    <ExamCard key={exam.exam_id} exam={exam} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={urlPage}
                  totalPages={totalPages}
                  buildPageUrl={buildPageUrl}
                  onPageChange={handlePageChange}
                  className="mb-8"
                />
              </>
            )}

            {/* Empty State */}
            {!loading && exams.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Không tìm thấy đề thi
                </h3>
                <p className="text-slate-600">
                  Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Recent Exams */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  <h3 className="font-semibold text-slate-900">
                    Đề thi mới nhất
                  </h3>
                </div>
                <div className="space-y-3">
                  {recentExams.slice(0, 5).map((exam) => (
                    <div
                      key={exam.exam_id}
                      onClick={() => navigate(`/exams/${exam.exam_id}`)}
                      className="cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors border border-slate-100"
                    >
                      <h4 className="font-medium text-sm text-slate-900 mb-1 line-clamp-2">
                        {exam.exam_title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded">
                          {exam.exam_type}
                        </span>
                        <span>{exam.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Statistics */}
              <div className="bg-violet-700 rounded-md shadow-sm p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" />
                  <h3 className="font-semibold">Thống kê nhanh</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-violet-200">Tổng số đề thi</span>
                    <span className="font-bold text-xl">{totalExams}</span>
                  </div>
                  <div className="border-t border-violet-600 pt-3">
                    <button
                      onClick={() => navigate("/exams/history")}
                      className="w-full bg-white text-violet-700 px-4 py-2 rounded-md font-medium hover:bg-violet-50 transition-colors"
                    >
                      Xem lịch sử làm bài
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-slate-900">Mẹo làm bài</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Đọc kỹ hướng dẫn trước khi bắt đầu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Quản lý thời gian hợp lý</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Xem lại câu trả lời trước khi nộp bài</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamList;
