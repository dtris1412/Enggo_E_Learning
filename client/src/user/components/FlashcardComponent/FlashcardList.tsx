import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import FlashcardSetCard from "./FlashcardSetCard";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Home,
  ChevronRight as ChevronRightIcon,
  Plus,
  Filter,
} from "lucide-react";

const FlashcardList: React.FC = () => {
  const navigate = useNavigate();
  const {
    flashcardSets,
    totalFlashcardSets,
    currentPage,
    totalPages,
    loading,
    error,
    fetchFlashcardSetsPaginated,
  } = useFlashcard();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");
  const [itemsPerPage] = useState(12);

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Initial load
  useEffect(() => {
    fetchFlashcardSetsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      visibilityFilter,
      createdByFilter,
    );
  }, []);

  // Auto-search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFlashcardSetsPaginated(
        searchTerm,
        1,
        itemsPerPage,
        visibilityFilter,
        createdByFilter,
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Auto-fetch when filters change
  useEffect(() => {
    fetchFlashcardSetsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      visibilityFilter,
      createdByFilter,
    );
  }, [visibilityFilter, createdByFilter]);

  const handlePageChange = (page: number) => {
    fetchFlashcardSetsPaginated(
      searchTerm,
      page,
      itemsPerPage,
      visibilityFilter,
      createdByFilter,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateNew = () => {
    if (!isLoggedIn) {
      showToast("info", "Vui lòng đăng nhập để tạo flashcard set");
      navigate("/login");
      return;
    }
    navigate("/flashcards/create");
  };

  const visibilityOptions = [
    { value: "", label: "Tất cả" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const createdByOptions = [
    { value: "", label: "Tất cả" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              FLASHCARD HỌC TẬP
            </h1>
            <p className="text-base md:text-lg text-purple-100 max-w-2xl mx-auto mb-4">
              Học từ vựng thông minh với flashcard - Ghi nhớ nhanh, hiệu quả cao
            </p>
            {isLoggedIn && (
              <button
                onClick={handleCreateNew}
                className="bg-white text-indigo-700 hover:bg-gray-100 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tạo Flashcard Set mới
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <a href="/" className="hover:text-indigo-600 transition-colors">
              Trang chủ
            </a>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Flashcards</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm flashcard set..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quyền truy cập
              </label>
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người tạo
              </label>
              <select
                value={createdByFilter}
                onChange={(e) => setCreatedByFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {createdByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold text-gray-900">
              {totalFlashcardSets}
            </span>{" "}
            flashcard sets
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && flashcardSets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy flashcard set nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi bộ lọc hoặc tạo flashcard set mới
            </p>
            {isLoggedIn && (
              <button
                onClick={handleCreateNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tạo Flashcard Set mới
              </button>
            )}
          </div>
        )}

        {/* Flashcard Sets List */}
        {!loading && !error && flashcardSets.length > 0 && (
          <div className="space-y-4 mb-8">
            {flashcardSets
              .filter((set) => {
                const isValid =
                  set.flashcard_set_id &&
                  !isNaN(Number(set.flashcard_set_id)) &&
                  Number(set.flashcard_set_id) > 0;
                if (!isValid) {
                  console.warn("FlashcardList: Filtered out invalid set:", set);
                }
                return isValid;
              })
              .map((set) => (
                <FlashcardSetCard
                  key={set.flashcard_set_id}
                  flashcardSet={set}
                />
              ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardList;
