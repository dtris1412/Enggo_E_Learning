import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layers, TrendingUp, BookOpen, Edit, Trash2, Plus } from "lucide-react";
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
  isTracking?: boolean;
  cards_stats?: {
    new?: number;
    learning?: number;
    mastered?: number;
    total?: number;
    due_for_review?: number;
  };
}

const FlashcardLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"mine" | "reference">("mine");
  const [mySets, setMySets] = useState<FlashcardSetItem[]>([]);
  const [referenceSets, setReferenceSets] = useState<FlashcardSetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Clear both arrays before fetching to prevent mixing data
    setMySets([]);
    setReferenceSets([]);

    if (activeTab === "mine") {
      fetchMySets();
    } else {
      fetchReferenceSets();
    }
  }, [activeTab, navigate]);

  const fetchMySets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch flashcard sets created by the user
      const response = await fetch(`${API_URL}/user/flashcard-sets/my-sets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success && result.data) {
        const validSets = (result.data.flashcardSets || []).filter(
          (set: FlashcardSetItem) =>
            set.flashcard_set_id &&
            !isNaN(Number(set.flashcard_set_id)) &&
            Number(set.flashcard_set_id) > 0,
        );
        setMySets(validSets);
      }
    } catch (error) {
      console.error("Error fetching my sets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReferenceSets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch sets that user is learning (have user_flashcard_sets records)
      const response = await fetch(`${API_URL}/user/flashcards/active-sets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      console.log("[DEBUG] Active sets from API:", result.active_sets);

      if (response.ok && result.active_sets) {
        // Fetch detailed progress for each set
        const setsWithProgress = await Promise.all(
          result.active_sets.map(async (set: any) => {
            try {
              const progressResponse = await fetch(
                `${API_URL}/user/flashcard-sets/${set.flashcard_set_id}/progress`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                return {
                  flashcard_set_id: set.flashcard_set_id,
                  title: set.set_name,
                  description: set.description,
                  total_cards:
                    progressData.cards_stats?.total || set.total_cards || 0,
                  learned_cards:
                    (progressData.cards_stats?.total || 0) -
                    (progressData.cards_stats?.new || 0),
                  progress: progressData.progress_percent || 0,
                  created_by_type: "user",
                  visibility: "private",
                  isTracking: true,
                  cards_stats: progressData.cards_stats,
                };
              }
            } catch (error) {
              console.error(
                `Error fetching progress for set ${set.flashcard_set_id}:`,
                error,
              );
            }

            return {
              flashcard_set_id: set.flashcard_set_id,
              title: set.set_name,
              description: set.description,
              total_cards: set.total_cards || 0,
              learned_cards: 0,
              progress: set.progress_percent || 0,
              created_by_type: "user",
              visibility: "private",
              isTracking: true,
            };
          }),
        );

        const validSets = setsWithProgress.filter(
          (set: any) => set && set.flashcard_set_id && set.total_cards > 0,
        );

        console.log("[DEBUG] Valid reference sets count:", validSets.length);
        console.log("[DEBUG] Valid reference sets:", validSets);

        setReferenceSets(validSets);
      }
    } catch (error) {
      console.error("Error fetching reference sets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (setId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa flashcard set này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/user/flashcard-sets/${setId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchMySets();
      } else {
        alert("Không thể xóa flashcard set này");
      }
    } catch (error) {
      console.error("Error deleting set:", error);
      alert("Có lỗi xảy ra khi xóa flashcard set");
    }
  };

  const getProgressBarColor = (
    set: FlashcardSetItem,
  ): { color: string; bgColor: string } => {
    if (!set.isTracking || !set.cards_stats) {
      return { color: "bg-blue-500", bgColor: "bg-blue-100" };
    }

    const stats = set.cards_stats;
    const total = stats.total || 1;
    const newCards = stats.new || 0;
    const learning = stats.learning || 0;
    const mastered = stats.mastered || 0;
    const dueCards = stats.due_for_review || 0;

    if (dueCards > 0 || newCards > total * 0.5) {
      return { color: "bg-red-500", bgColor: "bg-red-100" };
    } else if (learning > total * 0.3) {
      return { color: "bg-orange-500", bgColor: "bg-orange-100" };
    } else if (mastered > total * 0.6) {
      return { color: "bg-green-500", bgColor: "bg-green-100" };
    } else {
      return { color: "bg-blue-500", bgColor: "bg-blue-100" };
    }
  };

  const renderSetCard = (set: FlashcardSetItem) => {
    const progressColors = getProgressBarColor(set);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={
                  activeTab === "reference"
                    ? `/flashcards/${set.flashcard_set_id}/learn`
                    : `/flashcards/${set.flashcard_set_id}`
                }
                className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors block"
              >
                {set.title}
              </Link>
              {set.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {set.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{set.total_cards} cards</span>
                {set.User?.user_name && <span>• by {set.User.user_name}</span>}
                {activeTab === "reference" && set.isTracking && (
                  <span className="flex items-center gap-1 text-indigo-600">
                    <TrendingUp className="w-4 h-4" />
                    Đang theo dõi
                  </span>
                )}
              </div>
            </div>
          </div>

          {activeTab === "mine" && (
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() =>
                  navigate(`/flashcards/${set.flashcard_set_id}/edit`)
                }
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(set.flashcard_set_id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {activeTab === "reference" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                {set.learned_cards || 0}/{set.total_cards} cards reviewed
              </span>
              <span className="font-semibold">{set.progress || 0}%</span>
            </div>
            <div
              className={`w-full rounded-full h-2 ${progressColors.bgColor}`}
            >
              <div
                className={`${progressColors.color} h-2 rounded-full transition-all`}
                style={{
                  width: `${set.progress || 0}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <Link
            to={
              activeTab === "reference"
                ? `/flashcards/${set.flashcard_set_id}/learn`
                : `/flashcards/${set.flashcard_set_id}`
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            {activeTab === "reference" ? (
              <>
                <TrendingUp className="w-4 h-4" />
                Tiếp tục học
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Xem chi tiết
              </>
            )}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar */}
      <FlashcardSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Thư viện của tôi
              </h1>
              <p className="text-lg text-purple-100">
                Quản lý và theo dõi các flashcard sets của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("mine")}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === "mine"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Của tôi
              </button>
              <button
                onClick={() => setActiveTab("reference")}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === "reference"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Tham khảo
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === "mine" && (
            <div className="mb-6">
              <button
                onClick={() => navigate("/flashcards/create")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                Tạo flashcard set mới
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === "mine" ? (
                mySets.length > 0 ? (
                  mySets.map((set) => (
                    <div key={`mine-${set.flashcard_set_id}`}>
                      {renderSetCard(set)}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Bạn chưa tạo flashcard set nào
                    </p>
                    <button
                      onClick={() => navigate("/flashcards/create")}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      <Plus className="w-5 h-5" />
                      Tạo flashcard set đầu tiên
                    </button>
                  </div>
                )
              ) : referenceSets.length > 0 ? (
                referenceSets.map((set) => (
                  <div key={`reference-${set.flashcard_set_id}`}>
                    {renderSetCard(set)}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Bạn chưa có flashcard set nào đang theo dõi
                  </p>
                  <button
                    onClick={() => navigate("/flashcards")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    <BookOpen className="w-5 h-5" />
                    Khám phá flashcards
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardLibrary;
