import React from "react";
import { Trophy, Users, Layers } from "lucide-react";

interface TopLearnedFlashcard {
  flashcard_set_id: number;
  title: string;
  description: string | null;
  total_cards: number;
  visibility: string;
  created_by_type: string;
  created_at: string;
  learner_count: number;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
  };
}

interface TopLearnedFlashcardsProps {
  flashcards: TopLearnedFlashcard[];
  loading?: boolean;
}

const getCreatorBadge = (createdByType: string) => {
  switch (createdByType?.toLowerCase()) {
    case "admin":
      return { color: "bg-purple-100 text-purple-700", text: "Admin" };
    case "user":
      return { color: "bg-blue-100 text-blue-700", text: "User" };
    case "ai":
      return { color: "bg-orange-100 text-orange-700", text: "AI" };
    default:
      return { color: "bg-gray-100 text-gray-700", text: createdByType };
  }
};

const TopLearnedFlashcards: React.FC<TopLearnedFlashcardsProps> = ({
  flashcards,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Top Flashcard Được Học Nhiều Nhất
      </h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : flashcards.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có flashcard nào được học
          </p>
        ) : (
          flashcards.map((flashcard, index) => {
            const creatorBadge = getCreatorBadge(flashcard.created_by_type);

            return (
              <div
                key={flashcard.flashcard_set_id}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex items-start gap-2">
                  {/* Ranking Badge */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                          ? "bg-gray-200 text-gray-700"
                          : index === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    #{index + 1}
                  </div>

                  {/* Flashcard Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1 leading-tight mb-1">
                      {flashcard.title}
                    </h4>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      {/* Learner Count - Highlighted */}
                      <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded">
                        <Users className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">
                          {flashcard.learner_count}
                        </span>
                      </div>

                      {/* Total Cards */}
                      <div className="flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded">
                        <Layers className="h-3 w-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">
                          {flashcard.total_cards}
                        </span>
                      </div>

                      {/* Creator Badge */}
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${creatorBadge.color}`}
                      >
                        {creatorBadge.text}
                      </span>
                    </div>

                    {/* Creator Info */}
                    <p className="text-xs text-gray-600 truncate">
                      {flashcard.User?.full_name ||
                        flashcard.User?.user_name ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopLearnedFlashcards;
