import React from "react";
import { Layers, User } from "lucide-react";

interface Flashcard {
  flashcard_set_id: number;
  title: string;
  total_cards: number;
  created_at: string;
  User: {
    user_name: string;
    full_name: string;
  };
}

interface RecentFlashcardsProps {
  flashcards: Flashcard[];
  loading?: boolean;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
};

const RecentFlashcards: React.FC<RecentFlashcardsProps> = ({
  flashcards,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Flashcard được tạo gần đây
      </h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : flashcards.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có flashcard nào
          </p>
        ) : (
          flashcards.map((card) => (
            <div
              key={card.flashcard_set_id}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Layers className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {card.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <User className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {card.User.full_name || card.User.user_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {card.total_cards} thẻ
                  </span>
                  <span className="text-xs text-gray-500">
                    {timeAgo(card.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentFlashcards;
