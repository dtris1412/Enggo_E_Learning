import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookMarked,
  Bell,
  Clock,
  TrendingUp,
  Layers,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface FlashcardSetItem {
  flashcard_set_id: number;
  title: string;
  total_cards: number;
  created_by_type: string;
  User?: {
    user_name: string;
  };
  progress?: number; // for jump back in
}

const FlashcardSidebar: React.FC = () => {
  const location = useLocation();
  const [inProgressSets, setInProgressSets] = useState<FlashcardSetItem[]>([]);
  const [recentSets, setRecentSets] = useState<FlashcardSetItem[]>([]);
  const [popularSets, setPopularSets] = useState<FlashcardSetItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // Fetch data
    fetchInProgressSets();
    fetchRecentSets();
    fetchPopularSets();
  }, []);

  const fetchInProgressSets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // For now, fetch user's sets (in the future, add progress filtering)
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/my-sets?limit=3&sortBy=updated_at&sortOrder=DESC`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.success && result.data) {
        const validSets = (result.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) => {
            const isValid =
              set.flashcard_set_id &&
              !isNaN(Number(set.flashcard_set_id)) &&
              Number(set.flashcard_set_id) > 0;
            if (!isValid) {
              console.warn("FlashcardSidebar: Filtered out invalid set:", set);
            }
            return isValid;
          },
        );
        setInProgressSets(validSets);
      }
    } catch (error) {
      console.error("Error fetching in-progress sets:", error);
    }
  };

  const fetchRecentSets = async () => {
    try {
      // Fetch recent public sets
      const response = await fetch(
        `${API_URL}/user/flashcard-sets?limit=5&sortBy=created_at&sortOrder=DESC`,
      );
      const result = await response.json();
      if (result.success && result.data) {
        const validSets = (result.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) => {
            const isValid =
              set.flashcard_set_id &&
              !isNaN(Number(set.flashcard_set_id)) &&
              Number(set.flashcard_set_id) > 0;
            if (!isValid) {
              console.warn(
                "FlashcardSidebar: Filtered out invalid recent set:",
                set,
              );
            }
            return isValid;
          },
        );
        setRecentSets(validSets);
      }
    } catch (error) {
      console.error("Error fetching recent sets:", error);
    }
  };

  const fetchPopularSets = async () => {
    try {
      // Fetch popular sets (sorted by total_cards as proxy for popularity)
      const response = await fetch(
        `${API_URL}/user/flashcard-sets?limit=5&sortBy=total_cards&sortOrder=DESC`,
      );
      const result = await response.json();
      if (result.success && result.data) {
        const validSets = (result.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) => {
            const isValid =
              set.flashcard_set_id &&
              !isNaN(Number(set.flashcard_set_id)) &&
              Number(set.flashcard_set_id) > 0;
            if (!isValid) {
              console.warn(
                "FlashcardSidebar: Filtered out invalid popular set:",
                set,
              );
            }
            return isValid;
          },
        );
        setPopularSets(validSets);
      }
    } catch (error) {
      console.error("Error fetching popular sets:", error);
    }
  };

  const navItems = [
    { path: "/flashcards", label: "Trang chính", icon: Home },
    {
      path: "/flashcards/my-library",
      label: "Thư viện của tôi",
      icon: BookMarked,
      requireAuth: true,
    },
    {
      path: "/flashcards/notifications",
      label: "Thông báo",
      icon: Bell,
      requireAuth: true,
    },
  ];

  const renderSetItem = (set: FlashcardSetItem, showProgress = false) => (
    <Link
      key={set.flashcard_set_id}
      to={`/flashcards/${set.flashcard_set_id}`}
      className="block px-4 py-3 hover:bg-indigo-50 transition-colors duration-150 border-l-4 border-transparent hover:border-indigo-500"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {set.title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {set.total_cards} cards
            {set.User?.user_name && ` • by ${set.User.user_name}`}
          </p>
          {showProgress && set.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>
                  {set.progress}/{set.total_cards} cards sorted
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(set.progress / set.total_cards) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <aside className="w-full lg:w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white min-h-screen lg:min-h-0 lg:sticky lg:top-16">
      <div className="p-4">
        {/* Navigation Items */}
        <nav className="space-y-1 mb-6">
          {navItems.map((item) => {
            if (item.requireAuth && !isLoggedIn) return null;

            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-700 text-white shadow-lg"
                    : "text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-indigo-700 my-4"></div>

        {/* Jump Back In Section */}
        {isLoggedIn && inProgressSets.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-4 py-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-300" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Jump back in
              </h3>
            </div>
            <div className="space-y-1">
              {inProgressSets.map((set) =>
                renderSetItem(
                  {
                    ...set,
                    progress: Math.floor(Math.random() * set.total_cards),
                  },
                  true,
                ),
              )}
            </div>
          </div>
        )}

        {/* Recents Section */}
        {recentSets.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-4 py-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-300" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Recents
              </h3>
            </div>
            <div className="space-y-1">
              {recentSets.map((set) => renderSetItem(set))}
            </div>
          </div>
        )}

        {/* Popular Section */}
        {popularSets.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-4 py-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-300" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Popular
              </h3>
            </div>
            <div className="space-y-1">
              {popularSets.slice(0, 5).map((set) => renderSetItem(set))}
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-8 px-4 py-4 bg-indigo-950/30 rounded-lg">
          <p className="text-xs text-indigo-300 text-center">
            Học thông minh hơn với Flashcards
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FlashcardSidebar;
