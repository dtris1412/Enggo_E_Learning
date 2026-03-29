import React, { useEffect, useState } from "react";
import { CreditCard, Brain, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";

const ITEMS_PER_PAGE = 4;

const FlashcardProgress: React.FC = () => {
  const { flashcardSets, loading, fetchMyFlashcardSets } = useFlashcard();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMyFlashcardSets("", 1, 100);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-300 rounded w-1/3"></div>
          <div className="h-24 bg-slate-300 rounded"></div>
          <div className="h-24 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  const totalCards = flashcardSets.reduce(
    (sum, set) => sum + (set.total_cards || 0),
    0,
  );
  const publicSets = flashcardSets.filter(
    (set) => set.visibility === "public",
  ).length;

  const totalPages = Math.ceil(flashcardSets.length / ITEMS_PER_PAGE);
  const paginatedSets = flashcardSets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 rounded-lg">
          <Brain className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Flashcard của bạn
          </h2>
          <p className="text-slate-500 text-sm">
            Quản lý và học tập với flashcards
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-violet-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-700">
                {flashcardSets.length}
              </div>
              <div className="text-sm text-violet-600">Bộ flashcard</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-700">
                {totalCards}
              </div>
              <div className="text-sm text-slate-600">Tổng số thẻ</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {publicSets}
              </div>
              <div className="text-sm text-green-600">Bộ công khai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Sets List */}
      {flashcardSets.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Chưa có bộ flashcard nào
          </h3>
          <p className="text-slate-500 mb-4">
            Tạo bộ flashcard đầu tiên để bắt đầu học tập
          </p>
          <Link
            to="/flashcards/create"
            className="inline-block px-6 py-2.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
          >
            Tạo flashcard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800 mb-4">
            Bộ flashcard của bạn
          </h3>

          {paginatedSets.map((set) => (
            <div
              key={set.flashcard_set_id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-violet-300 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <Link
                    to={`/flashcards/${set.flashcard_set_id}`}
                    className="font-semibold text-slate-800 hover:text-violet-600 mb-1 inline-block"
                  >
                    {set.title}
                  </Link>
                  {set.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {set.description}
                    </p>
                  )}
                </div>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    set.visibility === "public"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {set.visibility === "public" ? "Công khai" : "Riêng tư"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  {set.total_cards} thẻ
                </span>
                <span>
                  Tạo ngày:{" "}
                  {new Date(set.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/flashcards/${set.flashcard_set_id}/learn`}
                  className="px-3 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition text-sm flex items-center gap-1"
                >
                  Học ngay
                </Link>
                <Link
                  to={`/flashcards/${set.flashcard_set_id}`}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition text-sm"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Trang {currentPage}/{totalPages} &bull; {flashcardSets.length}{" "}
                bộ flashcard
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ‹ Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
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

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3">Thao tác nhanh</h4>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/flashcards/create"
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm"
          >
            Tạo flashcard mới
          </Link>
          <Link
            to="/flashcards/my-library"
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm"
          >
            Thư viện của tôi
          </Link>
          <Link
            to="/flashcards"
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-sm"
          >
            Khám phá flashcard
          </Link>
          <Link
            to="/flashcards/notifications"
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm"
          >
            Ôn tập hôm nay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlashcardProgress;
