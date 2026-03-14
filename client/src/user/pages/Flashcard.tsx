import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  Layers,
  Search,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import FlashcardSidebar from "../components/FlashcardComponent/FlashcardSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface FlashcardSetItem {
  flashcard_set_id: number;
  title: string;
  description?: string;
  total_cards: number;
  created_by_type: string;
  visibility: string;
  User?: {
    user_name: string;
  };
  progress?: number;
  learned_cards?: number;
  updated_at?: string;
  created_at?: string;
  isTracking?: boolean; // True if user has enabled progress tracking
  cards_stats?: {
    new?: number;
    learning?: number;
    mastered?: number;
    total?: number;
    due_for_review?: number;
  };
}

const Flashcard: React.FC = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [jumpBackInSets, setJumpBackInSets] = useState<FlashcardSetItem[]>([]);
  const [recentSets, setRecentSets] = useState<FlashcardSetItem[]>([]);
  const [popularSets, setPopularSets] = useState<FlashcardSetItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    fetchJumpBackInSets();
    fetchRecentSets();
    fetchPopularSets();
  }, []);

  useEffect(() => {
    updateScrollButtons();
  }, [jumpBackInSets]);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const fetchJumpBackInSets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Step 1: Fetch all tracked sets (sets with user_flashcard_sets records)
      const trackedResponse = await fetch(
        `${API_URL}/user/flashcards/active-sets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const trackedResult = await trackedResponse.json();
      const trackedSetIds = new Set<number>();
      const trackedSetsMap = new Map<number, any>();

      if (trackedResponse.ok && trackedResult.active_sets) {
        // Fetch detailed progress for each tracked set
        await Promise.all(
          trackedResult.active_sets.map(async (set: any) => {
            trackedSetIds.add(set.flashcard_set_id);
            try {
              const progressResponse = await fetch(
                `${API_URL}/user/flashcard-sets/${set.flashcard_set_id}/progress`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                trackedSetsMap.set(set.flashcard_set_id, {
                  flashcard_set_id: set.flashcard_set_id,
                  title: set.set_name,
                  description: set.description,
                  total_cards:
                    progressData.cards_stats?.total || set.total_cards || 0,
                  learned_cards:
                    (progressData.cards_stats?.learning || 0) +
                    (progressData.cards_stats?.mastered || 0),
                  progress: progressData.progress_percent || 0,
                  created_by_type: "user",
                  visibility: "private",
                  isTracking: true,
                  cards_stats: progressData.cards_stats,
                });
              } else {
                // Fallback if progress fetch fails
                trackedSetsMap.set(set.flashcard_set_id, {
                  flashcard_set_id: set.flashcard_set_id,
                  title: set.set_name,
                  description: set.description,
                  total_cards: set.total_cards || 0,
                  learned_cards: 0,
                  progress: set.progress_percent || 0,
                  created_by_type: "user",
                  visibility: "private",
                  isTracking: true,
                  cards_stats: null,
                });
              }
            } catch (error) {
              console.error(
                `Error fetching progress for set ${set.flashcard_set_id}:`,
                error,
              );
            }
          }),
        );
      }

      // Step 2: Fetch recent sets to fill in non-tracked sets
      const recentResponse = await fetch(
        `${API_URL}/user/flashcard-sets?limit=15&sortBy=updated_at&sortOrder=DESC`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const recentResult = await recentResponse.json();
      const allSets: FlashcardSetItem[] = [];

      if (recentResult.success && recentResult.data) {
        const recentSets = (recentResult.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) =>
            set.flashcard_set_id &&
            !isNaN(Number(set.flashcard_set_id)) &&
            Number(set.flashcard_set_id) > 0 &&
            set.total_cards > 0,
        );

        // Merge: Tracked sets first, then non-tracked sets with localStorage progress
        for (const set of recentSets) {
          if (trackedSetIds.has(set.flashcard_set_id)) {
            // Use tracked data
            const trackedData = trackedSetsMap.get(set.flashcard_set_id);
            if (trackedData) {
              allSets.push(trackedData);
            }
          } else {
            // Use localStorage data for non-tracked sets
            const savedPosition = localStorage.getItem(
              `flashcard_position_${set.flashcard_set_id}`,
            );
            const currentPosition = savedPosition
              ? parseInt(savedPosition, 10)
              : 0;
            const viewedCards = Math.min(currentPosition + 1, set.total_cards);
            const progressPercent =
              set.total_cards > 0
                ? Math.round((viewedCards / set.total_cards) * 100)
                : 0;

            allSets.push({
              ...set,
              progress: progressPercent,
              learned_cards: viewedCards,
              isTracking: false,
            });
          }
        }
      }

      // Sort: tracked sets first (by recent activity), then non-tracked sets
      const sortedSets = allSets.sort((a, b) => {
        if (a.isTracking && !b.isTracking) return -1;
        if (!a.isTracking && b.isTracking) return 1;
        return 0;
      });

      setJumpBackInSets(sortedSets.slice(0, 10)); // Limit to 10 sets
    } catch (error) {
      console.error("Error fetching jump back in sets:", error);
    }
  };

  const fetchRecentSets = async () => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets?limit=8&sortBy=created_at&sortOrder=DESC`,
      );
      const result = await response.json();
      if (result.success && result.data) {
        const validSets = (result.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) =>
            set.flashcard_set_id &&
            !isNaN(Number(set.flashcard_set_id)) &&
            Number(set.flashcard_set_id) > 0,
        );
        setRecentSets(validSets);
      }
    } catch (error) {
      console.error("Error fetching recent sets:", error);
    }
  };

  const fetchPopularSets = async () => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets?limit=8&sortBy=total_cards&sortOrder=DESC`,
      );
      const result = await response.json();
      if (result.success && result.data) {
        const validSets = (result.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) =>
            set.flashcard_set_id &&
            !isNaN(Number(set.flashcard_set_id)) &&
            Number(set.flashcard_set_id) > 0,
        );
        setPopularSets(validSets);
      }
    } catch (error) {
      console.error("Error fetching popular sets:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/flashcards/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCreateNew = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để tạo flashcard set");
      navigate("/login");
      return;
    }
    navigate("/flashcards/create");
  };

  // Helper function to get progress bar color based on SM-2 stats
  const getProgressBarColor = (
    set: FlashcardSetItem,
  ): { color: string; bgColor: string } => {
    if (!set.isTracking || !set.cards_stats) {
      // Non-tracked sets: use white/light color
      return { color: "bg-white", bgColor: "bg-blue-800/40" };
    }

    const stats = set.cards_stats;
    const total = stats.total || 1;
    const newCards = stats.new || 0;
    const learning = stats.learning || 0;
    const mastered = stats.mastered || 0;
    const dueCards = stats.due_for_review || 0;

    // Priority: Due/New (red) > Learning (orange) > Mastered (green) > Default (blue)
    if (dueCards > 0 || newCards > total * 0.5) {
      return { color: "bg-red-500", bgColor: "bg-red-900/40" };
    } else if (learning > total * 0.3) {
      return { color: "bg-orange-500", bgColor: "bg-orange-900/40" };
    } else if (mastered > total * 0.6) {
      return { color: "bg-green-500", bgColor: "bg-green-900/40" };
    } else {
      return { color: "bg-blue-500", bgColor: "bg-blue-900/40" };
    }
  };

  const renderSetRow = (set: FlashcardSetItem) => (
    <Link
      key={set.flashcard_set_id}
      to={`/flashcards/${set.flashcard_set_id}`}
      className="block hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
    >
      <div className="px-6 py-3.5 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm mb-0.5 truncate">
            {set.title}
          </h3>
          <p className="text-xs text-gray-600">
            {set.total_cards} cards
            {set.User?.user_name && ` • by ${set.User.user_name}`}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar */}
      <FlashcardSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Flashcards
              </h1>
              <p className="text-lg text-purple-100 mb-6">
                Học từ vựng thông minh - Ghi nhớ nhanh, hiệu quả cao
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm flashcard sets..."
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 text-gray-900"
                    />
                  </div>
                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus className="w-5 h-5" />
                      Tạo mới
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Jump back in Section - Mixed Mode */}
          {isLoggedIn && jumpBackInSets.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Jump back in
                </h2>
              </div>

              <div className="relative group">
                {/* Scroll Left Button */}
                {canScrollLeft && (
                  <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                    style={{ left: "-16px" }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                )}

                {/* Horizontal Scroll Container */}
                <div
                  ref={scrollContainerRef}
                  onScroll={updateScrollButtons}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {jumpBackInSets.map((set) => {
                    const progressColors = getProgressBarColor(set);
                    const isTracked = set.isTracking;

                    return (
                      <Link
                        key={set.flashcard_set_id}
                        to={
                          isTracked
                            ? `/flashcards/${set.flashcard_set_id}/learn`
                            : `/flashcards/${set.flashcard_set_id}`
                        }
                        className="flex-shrink-0 w-[28rem]"
                      >
                        <div
                          className={`rounded-xl p-6 text-white hover:shadow-2xl transition-shadow relative overflow-hidden group h-48 ${
                            isTracked
                              ? "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800"
                              : "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"
                          }`}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute right-0 bottom-0 w-40 h-40">
                              {isTracked ? (
                                <TrendingUp className="w-full h-full" />
                              ) : (
                                <BookOpen className="w-full h-full" />
                              )}
                            </div>
                          </div>

                          <div className="relative h-full flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold flex-1 pr-4 line-clamp-2">
                                {set.title}
                              </h3>
                              {isTracked && (
                                <div className="flex-shrink-0 bg-indigo-500/30 px-2 py-1 rounded-full">
                                  <TrendingUp className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Progress Info */}
                            <div className="mt-auto">
                              <div
                                className={`flex items-center justify-between text-sm mb-2 ${
                                  isTracked ? "text-gray-300" : "text-blue-100"
                                }`}
                              >
                                <span>
                                  {set.learned_cards || 0}/{set.total_cards}{" "}
                                  cards {isTracked ? "reviewed" : "viewed"}
                                </span>
                                <span className="text-xs font-semibold">
                                  {set.progress || 0}%
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div
                                className={`w-full rounded-full h-2 mb-4 ${progressColors.bgColor}`}
                              >
                                <div
                                  className={`${progressColors.color} h-2 rounded-full transition-all`}
                                  style={{
                                    width: `${set.progress || 0}%`,
                                  }}
                                ></div>
                              </div>

                              {/* Action Button */}
                              <button
                                className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                  isTracked
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-white/90 hover:bg-white text-indigo-700"
                                }`}
                              >
                                {isTracked ? (
                                  <>
                                    <TrendingUp className="w-4 h-4" />
                                    Tiếp tục học
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-4 h-4" />
                                    {set.learned_cards && set.learned_cards > 0
                                      ? "Tiếp tục xem"
                                      : "Xem tự do"}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Scroll Right Button */}
                {canScrollRight && (
                  <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                    style={{ right: "-16px" }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Recents Section - List View */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recents</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {recentSets.length > 0 ? (
                recentSets.map((set) => renderSetRow(set))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  Chưa có flashcard sets gần đây
                </div>
              )}
            </div>
          </section>

          {/* Popular Section - List View */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {popularSets.length > 0 ? (
                popularSets.map((set) => renderSetRow(set))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  Chưa có flashcard sets phổ biến
                </div>
              )}
            </div>
          </section>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-64 bg-gradient-to-b from-purple-900 via-indigo-800 to-indigo-900 text-white">
        <div className="p-6">
          {/* Content will be added later */}
          <div className="text-indigo-300 text-sm text-center opacity-50">
            Nội dung sẽ được thêm sau
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Flashcard;
