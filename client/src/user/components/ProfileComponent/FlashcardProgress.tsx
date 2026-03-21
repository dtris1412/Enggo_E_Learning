import React, { useEffect } from "react";
import { CreditCard, Brain, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";

const FlashcardProgress: React.FC = () => {
  const { flashcardSets, loading, fetchMyFlashcardSets } = useFlashcard();

  useEffect(() => {
    fetchMyFlashcardSets("", 1, 10);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
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

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Flashcard của bạn
          </h2>
          <p className="text-gray-500 text-sm">
            Quản lý và học tập với flashcards
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {flashcardSets.length}
              </div>
              <div className="text-sm text-purple-600">Bộ flashcard</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {totalCards}
              </div>
              <div className="text-sm text-blue-600">Tổng số thẻ</div>
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
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có bộ flashcard nào
          </h3>
          <p className="text-gray-500 mb-4">
            Tạo bộ flashcard đầu tiên để bắt đầu học tập
          </p>
          <Link
            to="/flashcards/create"
            className="inline-block px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Tạo flashcard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              Bộ flashcard của bạn
            </h3>
            <Link
              to="/flashcards/my-library"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          {flashcardSets.slice(0, 5).map((set) => (
            <div
              key={set.flashcard_set_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <Link
                    to={`/flashcards/${set.flashcard_set_id}`}
                    className="font-semibold text-gray-800 hover:text-purple-600 mb-1 inline-block"
                  >
                    {set.title}
                  </Link>
                  {set.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {set.description}
                    </p>
                  )}
                </div>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    set.visibility === "public"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {set.visibility === "public" ? "Công khai" : "Riêng tư"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                  className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm flex items-center gap-1"
                >
                  Học ngay
                </Link>
                <Link
                  to={`/flashcards/${set.flashcard_set_id}`}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          ))}

          {flashcardSets.length > 5 && (
            <div className="text-center pt-4">
              <Link
                to="/flashcards/my-library"
                className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
              >
                Xem thêm {flashcardSets.length - 5} bộ flashcard khác →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Thao tác nhanh</h4>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/flashcards/create"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
          >
            Tạo flashcard mới
          </Link>
          <Link
            to="/flashcards/my-library"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
          >
            Thư viện của tôi
          </Link>
          <Link
            to="/flashcards"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
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
