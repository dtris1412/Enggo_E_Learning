import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import ExamCard from "./ExamCard";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  TrendingUp,
  Home,
  ChevronRight as ChevronRightIcon,
  Award,
} from "lucide-react";

const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const {
    exams,
    totalExams,
    currentPage,
    totalPages,
    loading,
    error,
    fetchExamsPaginated,
  } = useExam();

  const [searchTerm, setSearchTerm] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [itemsPerPage] = useState(12);
  const [recentExams, setRecentExams] = useState<any[]>([]);

  // Initial load
  useEffect(() => {
    fetchExamsPaginated(searchTerm, 1, itemsPerPage);
  }, []);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
          }`}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  // Generate year options (last 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Practice Exams</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Practice Exams
              </h1>
              <p className="text-slate-600">
                Test your skills with our comprehensive exam collection
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search exams by title or code..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Exam Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Exam Type
                  </label>
                  <select
                    value={examTypeFilter}
                    onChange={handleExamTypeChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Year
                  </label>
                  <select
                    value={yearFilter}
                    onChange={handleYearChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Years</option>
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
                    exams found
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {renderPagination()}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && exams.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No exams found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search or filters
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
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Recent Exams</h3>
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
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {exam.exam_type}
                        </span>
                        <span>{exam.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Statistics */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" />
                  <h3 className="font-semibold">Quick Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Total Exams</span>
                    <span className="font-bold text-xl">{totalExams}</span>
                  </div>
                  <div className="border-t border-blue-500 pt-3">
                    <button
                      onClick={() => navigate("/exams/history")}
                      className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      View My History
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-slate-900">Exam Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Read instructions carefully before starting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Manage your time wisely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Review your answers before submitting</span>
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
