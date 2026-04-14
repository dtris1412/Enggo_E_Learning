import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import FlashcardSetCard from "./FlashcardSetCard";
import Pagination from "../../../shared/components/Pagination";
import { Search, BookMarked, Plus, Filter } from "lucide-react";

const FlashcardList: React.FC = () => {
  const navigate = useNavigate();
  const {
    flashcardSets,
    totalFlashcardSets,
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Initial load
  useEffect(() => {
    fetchFlashcardSetsPaginated(
      searchTerm,
      urlPage,
      itemsPerPage,
      visibilityFilter,
      createdByFilter,
    );
  }, [urlPage]);

  // Auto-search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      resetPage();
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

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
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
              Ôn luyện
            </span>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight">
              <span className="text-white">Flashcard</span>{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                học tập
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Create button */}
        {isLoggedIn && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleCreateNew}
              className="bg-violet-600 text-white hover:bg-violet-700 font-medium py-2.5 px-6 rounded-md transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tạo Flashcard Set mới
            </button>
          </div>
        )}
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm flashcard set..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Bộ lọc</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quyền truy cập
              </label>
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Người tạo
              </label>
              <select
                value={createdByFilter}
                onChange={(e) => setCreatedByFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
          <p className="text-slate-600">
            Tìm thấy{" "}
            <span className="font-semibold text-slate-900">
              {totalFlashcardSets}
            </span>{" "}
            flashcard sets
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-slate-600">Đang tải...</p>
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
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <BookMarked className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Không tìm thấy flashcard set nào
            </h3>
            <p className="text-slate-600 mb-4">
              Thử thay đổi bộ lọc hoặc tạo flashcard set mới
            </p>
            {isLoggedIn && (
              <button
                onClick={handleCreateNew}
                className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 inline-flex items-center gap-2"
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
        {!loading && (
          <Pagination
            currentPage={urlPage}
            totalPages={totalPages}
            buildPageUrl={buildPageUrl}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
};

export default FlashcardList;
