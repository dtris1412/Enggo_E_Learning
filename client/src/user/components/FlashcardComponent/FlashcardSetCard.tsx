import React from "react";
import { BookMarked, User, Globe, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FlashcardSetCardProps {
  flashcardSet: {
    flashcard_set_id: number;
    title: string;
    description: string | null;
    visibility: "public" | "private";
    created_by_type: "user" | "admin";
    total_cards: number;
    created_at: string;
    User?: {
      user_id: number;
      user_name: string;
      user_email: string;
      avatar: string | null;
    };
  };
}

const FlashcardSetCard: React.FC<FlashcardSetCardProps> = ({
  flashcardSet,
}) => {
  const navigate = useNavigate();

  const getVisibilityColor = (visibility: string) => {
    return visibility === "public"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-slate-100 text-slate-700";
  };

  const getCreatedByColor = (type: string) => {
    return type === "admin"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const handleCardClick = () => {
    if (
      !flashcardSet.flashcard_set_id ||
      isNaN(Number(flashcardSet.flashcard_set_id)) ||
      Number(flashcardSet.flashcard_set_id) <= 0
    ) {
      console.error(
        "FlashcardSetCard: Invalid flashcard_set_id:",
        flashcardSet.flashcard_set_id,
      );
      return;
    }
    navigate(`/flashcards/${flashcardSet.flashcard_set_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 overflow-hidden group hover:-translate-y-1"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
            <BookMarked className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Badges */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {flashcardSet.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getVisibilityColor(
                  flashcardSet.visibility,
                )}`}
              >
                {flashcardSet.visibility === "public" ? (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <LockKeyhole className="w-3 h-3" />
                    Private
                  </span>
                )}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getCreatedByColor(
                  flashcardSet.created_by_type,
                )}`}
              >
                {flashcardSet.created_by_type === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Description */}
          {flashcardSet.description && (
            <p className="text-sm text-slate-500 mb-2 line-clamp-1">
              {flashcardSet.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5" />
              <span className="font-medium">{flashcardSet.total_cards}</span>
              <span>cards</span>
            </div>
            <div className="flex items-center gap-1">
              {flashcardSet.User?.avatar ? (
                <img
                  src={flashcardSet.User.avatar}
                  alt={flashcardSet.User.user_name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              <span>by {flashcardSet.User?.user_name || "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-2 px-6 rounded-xl transition-all duration-200 text-sm hover:shadow-md">
            Học
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
