import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { SpeakButton } from "../../../shared/components/SpeakButton";
import Confetti from "react-confetti";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Star,
  CheckCircle,
  XCircle,
  BookMarked,
  Clock,
  Zap,
  Brain,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

type QualityRating = "again" | "hard" | "good" | "easy";

interface ProgressStats {
  total: number;
  new: number;
  learning: number;
  mastered: number;
  reviewing: number;
  due_for_review: number;
}

const FlashcardViewer: React.FC = () => {
  const { flashcard_set_id } = useParams<{ flashcard_set_id: string }>();
  const navigate = useNavigate();
  const { getFlashcardSetById, loading } = useFlashcard();
  const { showToast } = useToast();

  // Core states
  const [flashcardSet, setFlashcardSet] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [markedCards, setMarkedCards] = useState<Set<number>>(new Set());

  // Progress tracking states
  const [studyMode, setStudyMode] = useState(false);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [lastReviewedCard, setLastReviewedCard] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    total: 0,
    new: 0,
    learning: 0,
    mastered: 0,
    reviewing: 0,
    due_for_review: 0,
  });
  const [isReviewing, setIsReviewing] = useState(false);

  // Window dimensions for confetti
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load flashcard set (only when needed for browse mode)
  useEffect(() => {
    const fetchData = async () => {
      if (!flashcard_set_id) return;

      // Kiểm tra xem có cần load tất cả cards không
      // Nếu sẽ auto-start study mode, bỏ qua việc load toàn bộ cards
      const savedStudyMode = localStorage.getItem(
        `flashcard_study_mode_${flashcard_set_id}`,
      );

      if (savedStudyMode === "true") {
        // Chỉ load metadata của set, không load cards
        console.log(
          "[Optimization] Skipping full card load - will use API for study mode",
        );
        const data = await getFlashcardSetById(Number(flashcard_set_id));
        if (data) {
          setFlashcardSet(data);
          // Không set flashcards array - sẽ dùng API next-card
        } else {
          showToast("error", "Không tìm thấy flashcard set");
          navigate("/flashcards");
        }
        return;
      }

      // Browse mode: Load đầy đủ cards
      console.log("[Browse mode] Loading all flashcards for free navigation");
      const data = await getFlashcardSetById(Number(flashcard_set_id));
      if (data && data.Flashcards) {
        setFlashcardSet(data);
        setFlashcards(data.Flashcards);

        // Restore saved position in browser mode
        const savedPosition = localStorage.getItem(
          `flashcard_position_${flashcard_set_id}`,
        );
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          if (position >= 0 && position < data.Flashcards.length) {
            setCurrentIndex(position);
          } else {
            setCurrentIndex(0);
          }
        } else {
          setCurrentIndex(0);
        }
      } else {
        showToast("error", "Không tìm thấy flashcard set");
        navigate("/flashcards");
      }
    };

    fetchData();
  }, [flashcard_set_id]);

  // Load saved study mode preference on mount
  useEffect(() => {
    if (!flashcard_set_id) return;

    const savedStudyMode = localStorage.getItem(
      `flashcard_study_mode_${flashcard_set_id}`,
    );

    if (savedStudyMode === "true") {
      // Auto-enable study mode if it was previously enabled
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Delay to ensure flashcards are loaded first
        setTimeout(async () => {
          try {
            const response = await fetch(
              `${API_URL}/user/flashcard-sets/${flashcard_set_id}/start`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            if (response.ok || response.status === 409) {
              await fetchNextCard();
              await fetchProgressStats();
              setStudyMode(true);
            }
          } catch (error) {
            console.error("Error auto-starting study mode:", error);
          }
        }, 100);
      }
    }
  }, [flashcard_set_id]);

  // Save position in browser mode
  useEffect(() => {
    if (!studyMode && flashcard_set_id && flashcards.length > 0) {
      localStorage.setItem(
        `flashcard_position_${flashcard_set_id}`,
        currentIndex.toString(),
      );
    }
  }, [currentIndex, studyMode, flashcard_set_id, flashcards.length]);

  // Toggle Progress Tracking
  const handleToggleStudyMode = async () => {
    if (!studyMode) {
      // Turning ON Progress Tracking - start learning with SM-2
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("error", "Vui lòng đăng nhập để theo dõi tiến độ");
        return;
      }

      try {
        // Call API to start the set
        const response = await fetch(
          `${API_URL}/user/flashcard-sets/${flashcard_set_id}/start`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok || response.status === 409) {
          // 409 means already started, which is fine
          showToast("success", "📊 Đã bật theo dõi tiến độ - SM-2 algorithm");

          // Get first card from backend
          await fetchNextCard();
          await fetchProgressStats();

          // Set study mode AFTER fetching data to avoid showing completion screen during loading
          setStudyMode(true);

          // Save study mode preference
          localStorage.setItem(
            `flashcard_study_mode_${flashcard_set_id}`,
            "true",
          );

          // Clear saved position when entering progress tracking mode
          localStorage.removeItem(`flashcard_position_${flashcard_set_id}`);
        } else {
          const result = await response.json();
          showToast("error", result.message || "Lỗi khi bật theo dõi tiến độ");
        }
      } catch (error) {
        console.error("Error starting progress tracking:", error);
        showToast("error", "Lỗi kết nối server");
      }
    } else {
      // Turning OFF Progress Tracking - back to free browsing
      setStudyMode(false);

      // Remove study mode preference
      localStorage.removeItem(`flashcard_study_mode_${flashcard_set_id}`);

      setCurrentCard(null);
      setIsCompleted(false);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowAnswer(false);

      // Load all flashcards if not already loaded (for browse mode)
      if (flashcards.length === 0 && flashcard_set_id) {
        const data = await getFlashcardSetById(Number(flashcard_set_id));
        if (data && data.Flashcards) {
          setFlashcards(data.Flashcards);

          // Restore saved position if exists
          const savedPosition = localStorage.getItem(
            `flashcard_position_${flashcard_set_id}`,
          );
          if (savedPosition) {
            const position = parseInt(savedPosition, 10);
            if (position >= 0 && position < data.Flashcards.length) {
              setCurrentIndex(position);
            }
          }
        }
      }

      showToast("info", "📖 Xem tự do - không theo dõi tiến độ");
    }
  };

  // Fetch next card from backend
  const fetchNextCard = async () => {
    if (!flashcard_set_id) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}/next-card`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();

      console.log("[DEBUG] Next card response:", result);

      if (response.ok && result.success) {
        // Backend returns: { success: true, data: { flashcard: {...}, reason: "..." } }
        // or { success: true, data: null, message: "..." } when completed
        if (result.data === null) {
          // All completed
          console.log("[DEBUG] Session completed!");
          showToast("success", "🎉 Đã hoàn thành tất cả flashcard!");
          setCurrentCard(null);
          setIsCompleted(true);
        } else if (result.data && result.data.flashcard) {
          // Got next card
          const flashcard = result.data.flashcard;
          const cardData = {
            ...flashcard,
            is_new: result.data.reason === "new",
            is_due: result.data.reason === "due",
            is_upcoming: result.data.reason === "upcoming",
          };

          // Save as last reviewed card
          setLastReviewedCard(cardData);
          setCurrentCard(cardData);
          setIsCompleted(false);

          // Find index in flashcards array
          const index = flashcards.findIndex(
            (card) => card.flashcard_id === flashcard.flashcard_id,
          );
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      } else {
        showToast("error", result.message || "Lỗi khi lấy thẻ tiếp theo");
      }
    } catch (error) {
      console.error("Error fetching next card:", error);
    }
  };

  // Fetch progress statistics
  const fetchProgressStats = async () => {
    if (!flashcard_set_id) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();

      if (response.ok && result.cards_stats) {
        console.log("[DEBUG] Progress stats updated:", result.cards_stats);
        setProgressStats(result.cards_stats);
      }
    } catch (error) {
      console.error("Error fetching progress stats:", error);
    }
  };

  // Review flashcard with quality rating (SM-2 algorithm)
  const handleReviewCard = async (quality: QualityRating) => {
    if (!currentCard || isReviewing) return;

    setIsReviewing(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      showToast("error", "Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/user/flashcards/${currentCard.flashcard_id}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quality }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        // Get interval from server response
        const intervalDays = result.data?.nextReview?.intervalDays || 0;

        // Format time display based on interval
        const formatInterval = (days: number) => {
          if (days < 1) {
            // Convert to minutes
            const minutes = Math.round(days * 24 * 60);
            if (minutes < 60) {
              return `${minutes} phút`;
            } else {
              const hours = Math.round(minutes / 60);
              return `${hours} giờ`;
            }
          } else {
            return `${Math.round(days)} ngày`;
          }
        };

        // Show feedback based on quality with actual interval from server
        const timeDisplay = formatInterval(intervalDays);
        const messages = {
          again: `Chưa nhớ - Ôn lại sau ${timeDisplay}`,
          hard: `Khó - Ôn lại sau ${timeDisplay}`,
          good: `Tốt - Ôn lại sau ${timeDisplay}`,
          easy: `Dễ - Ôn lại sau ${timeDisplay}`,
        };
        showToast("success", messages[quality]);

        // Get next card and update progress
        setTimeout(async () => {
          setIsFlipped(false);
          setShowAnswer(false);

          // Fetch next card first
          await fetchNextCard();

          // Wait a bit for backend to finish processing
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Then update progress stats to reflect new state
          await fetchProgressStats();

          setIsReviewing(false);
        }, 500);
      } else {
        showToast("error", "Lỗi khi đánh giá flashcard");
        setIsReviewing(false);
      }
    } catch (error) {
      console.error("Error reviewing flashcard:", error);
      showToast("error", "Lỗi kết nối server");
      setIsReviewing(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleNext = async () => {
    setIsFlipped(false);
    setShowAnswer(false);

    if (studyMode) {
      // Progress Tracking: Get next card from backend (SM-2)
      await fetchNextCard();
    } else {
      // Free browsing: Simple array navigation
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        showToast("info", "Đã đến thẻ cuối cùng");
      }
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowAnswer(false);

    if (studyMode) {
      // Progress Tracking: Cannot go back (SM-2 flow)
      showToast("info", "Chế độ theo dõi không hỗ trợ quay lại thẻ trước");
    } else {
      // Free browsing: Simple array navigation
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        showToast("info", "Đã ở thẻ đầu tiên");
      }
    }
  };

  const handleShuffle = () => {
    if (studyMode) {
      showToast("info", "Không thể xáo trộn khi đang theo dõi tiến độ");
      return;
    }

    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    showToast("success", "Đã xáo trộn thẻ");
  };

  const handleReset = async () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setMarkedCards(new Set());

    if (studyMode) {
      // Study Mode: Reset progress in database, then restart
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("error", "Vui lòng đăng nhập");
        return;
      }

      try {
        setIsReviewing(true);

        // Call API to reset progress
        const response = await fetch(
          `${API_URL}/user/flashcard-sets/${flashcard_set_id}/progress`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          // Reset local states completely
          setIsCompleted(false);
          setCurrentCard(null);
          setLastReviewedCard(null);
          setIsFlipped(false);
          setShowAnswer(false);

          // Start fresh session
          await fetch(
            `${API_URL}/user/flashcard-sets/${flashcard_set_id}/start`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          // Get first card
          await fetchNextCard();
          await fetchProgressStats();

          showToast("success", "✨ Đã reset tiến trình - Bắt đầu lại từ đầu!");
        } else {
          const result = await response.json();
          showToast("error", result.message || "Lỗi khi reset tiến trình");
        }
      } catch (error) {
        console.error("Error resetting progress:", error);
        showToast("error", "Lỗi kết nối server");
      } finally {
        setIsReviewing(false);
      }
    } else {
      showToast("success", "Đã reset về thẻ đầu tiên");
    }
  };

  const handleBackToLastCard = () => {
    if (lastReviewedCard) {
      setCurrentCard(lastReviewedCard);
      setIsCompleted(false);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handleMarkCard = () => {
    const cardId = studyMode
      ? currentCard?.flashcard_id
      : flashcards[currentIndex]?.flashcard_id;

    if (!cardId) return;

    const newMarked = new Set(markedCards);
    if (newMarked.has(cardId)) {
      newMarked.delete(cardId);
      showToast("success", "Đã bỏ đánh dấu thẻ");
    } else {
      newMarked.add(cardId);
      showToast("success", "Đã đánh dấu thẻ khó");
    }
    setMarkedCards(newMarked);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isFlipped]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookMarked className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Không tìm thấy flashcard set</p>
          <button
            onClick={() => navigate("/flashcards")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Only check flashcards length in browse mode
  // In study mode, we use backend API (currentCard) instead of flashcards array
  if (!studyMode && flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookMarked className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Không có flashcard nào để học</p>
          <button
            onClick={() => navigate("/flashcards")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // If all cards completed (Progress Tracking only)
  if (studyMode && isCompleted) {
    const learnedCount = progressStats.total - progressStats.new;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* Confetti effect */}
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Main completion card */}
            <div className="text-center mb-12">
              {/* Megaphone Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 rounded-full mb-8 transform rotate-12">
                <span className="text-6xl transform -rotate-12">📣</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Chà, bạn nằm bài thật chắc! Bạn đã sắp xếp tất cả các thẻ.
              </h1>
            </div>

            {/* Progress Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span>
                Tiến độ của bạn
              </h2>

              <div className="space-y-4">
                {/* Đã biết */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white font-medium">Đã biết</span>
                  </div>
                  <span className="text-white font-bold text-xl">
                    {learnedCount}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${(learnedCount / progressStats.total) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Đang học */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-white font-medium">Đang học</span>
                  </div>
                  <span className="text-white font-bold text-xl">
                    {progressStats.learning}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${(progressStats.learning / progressStats.total) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Còn lại */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-white font-medium">Còn lại</span>
                  </div>
                  <span className="text-white font-bold text-xl">
                    {progressStats.new}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 transition-all duration-500"
                    style={{
                      width: `${(progressStats.new / progressStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Bước tiếp theo
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/flashcards")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">🔄</span>
                  <span>Ôn luyện với các câu hỏi</span>
                </button>

                <button
                  onClick={handleReset}
                  disabled={isReviewing}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">🔁</span>
                  <span>
                    {isReviewing ? "Đang reset..." : "Đặt lại Thẻ ghi nhớ"}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between text-white">
              <button
                onClick={handleBackToLastCard}
                disabled={!lastReviewedCard}
                className="flex items-center gap-2 hover:text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại câu hỏi cuối cùng</span>
              </button>

              <button
                onClick={() => navigate("/flashcards")}
                className="flex items-center gap-2 hover:text-indigo-300 transition-colors"
              >
                <span>Nhấn phím bất kỳ để tiếp tục</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get current card data based on mode
  const displayCard = studyMode ? currentCard : flashcards[currentIndex];
  const isMarked = displayCard
    ? markedCards.has(displayCard.flashcard_id)
    : false;

  const progress = studyMode
    ? progressStats.total > 0
      ? ((progressStats.total - progressStats.new) / progressStats.total) * 100
      : 0
    : flashcards.length > 0
      ? ((currentIndex + 1) / flashcards.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/flashcards/${flashcard_set_id}`)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </button>

            <div className="text-center flex-1 max-w-md mx-4">
              <h1 className="text-lg font-bold text-slate-900 truncate">
                {flashcardSet.title}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-1">
                {studyMode ? (
                  <>
                    <p className="text-sm text-slate-600">
                      {progressStats.total - progressStats.new} /{" "}
                      {progressStats.total} đã học
                    </p>
                    {currentCard?.is_due && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        Cần ôn
                      </span>
                    )}
                    {currentCard?.is_new && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Thẻ mới
                      </span>
                    )}
                    {currentCard?.is_upcoming && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                        Ôn trước
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-600">
                    {currentIndex + 1} / {flashcards.length} thẻ
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Progress Tracking Toggle */}
              <button
                onClick={handleToggleStudyMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  studyMode
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title={
                  studyMode ? "Tắt theo dõi tiến độ" : "Bật theo dõi tiến độ"
                }
              >
                {studyMode ? (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">Theo dõi tiến độ</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">Xem tự do</span>
                  </>
                )}
              </button>
              <button
                onClick={handleShuffle}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Xáo trộn thẻ"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Reset tiến trình"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Stats - Only show when tracking */}
          {studyMode && (
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <span className="text-slate-700">
                  Mới: <span className="font-bold">{progressStats.new}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-700">
                  Đang học:{" "}
                  <span className="font-bold">{progressStats.learning}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-700">
                  Ôn lại:{" "}
                  <span className="font-bold">{progressStats.reviewing}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">
                  Thành thạo:{" "}
                  <span className="font-bold">{progressStats.mastered}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-700">
                  Cần ôn:{" "}
                  <span className="font-bold">
                    {progressStats.due_for_review}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-slate-700">
                  Đánh dấu:{" "}
                  <span className="font-bold">{markedCards.size}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Flashcard Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Flashcard */}
          <div className="perspective-1000">
            <div
              className={`relative w-full h-96 transition-transform duration-500 transform-style-3d cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
            >
              {/* Front Side */}
              <div
                className={`absolute inset-0 bg-white rounded-2xl shadow-2xl p-8 backface-hidden ${
                  isFlipped ? "invisible" : "visible"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="absolute top-4 right-4">
                    {isMarked && (
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>

                  <div className="absolute top-4 left-4">
                    <SpeakButton
                      text={displayCard.front_content}
                      lang="en-US"
                      className=""
                    />
                  </div>

                  <div className="text-center px-8">
                    <h2 className="text-5xl font-bold text-slate-900 mb-6">
                      {displayCard.front_content}
                    </h2>
                    {displayCard.pronunciation && (
                      <p className="text-2xl text-indigo-600 mb-4">
                        {displayCard.pronunciation}
                      </p>
                    )}
                    {displayCard.difficulty_level && (
                      <span
                        className={`px-4 py-2 text-sm font-medium rounded-full ${
                          displayCard.difficulty_level === "easy"
                            ? "bg-green-100 text-green-800"
                            : displayCard.difficulty_level === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {displayCard.difficulty_level}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-8 text-slate-400 text-sm flex items-center gap-2">
                    <span>Nhấp để lật thẻ</span>
                    <span className="text-slate-300">|</span>
                    <span>Space</span>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 backface-hidden rotate-y-180 ${
                  isFlipped ? "visible" : "invisible"
                }`}
              >
                <div className="flex flex-col h-full text-white">
                  <div className="absolute top-4 right-4">
                    {isMarked && (
                      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col items-center justify-center px-8">
                    <h2 className="text-5xl font-bold mb-6">
                      {displayCard.back_content}
                    </h2>
                    {displayCard.example && (
                      <p className="text-xl text-white/90 italic max-w-2xl text-center">
                        "{displayCard.example}"
                      </p>
                    )}
                  </div>

                  {/* SM-2 Quality Rating Buttons - Only in Study Mode */}
                  {studyMode && (
                    <div className="pb-4">
                      <p className="text-center text-white/80 text-sm mb-3 font-medium">
                        Đánh giá mức độ nhớ của bạn:
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewCard("again");
                          }}
                          disabled={isReviewing}
                          className="flex-1 max-w-[140px] bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 px-4 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          <XCircle className="w-5 h-5 inline-block mb-1" />
                          <div className="text-sm">Chưa nhớ</div>
                          <div className="text-xs opacity-75">10 phút</div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewCard("hard");
                          }}
                          disabled={isReviewing}
                          className="flex-1 max-w-[140px] bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed text-orange-600 px-4 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          <Brain className="w-5 h-5 inline-block mb-1" />
                          <div className="text-sm">Khó</div>
                          <div className="text-xs opacity-75">6 giờ+</div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewCard("good");
                          }}
                          disabled={isReviewing}
                          className="flex-1 max-w-[140px] bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed text-green-600 px-4 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          <CheckCircle className="w-5 h-5 inline-block mb-1" />
                          <div className="text-sm">Tốt</div>
                          <div className="text-xs opacity-75">1 ngày+</div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewCard("easy");
                          }}
                          disabled={isReviewing}
                          className="flex-1 max-w-[140px] bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 px-4 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          <Zap className="w-5 h-5 inline-block mb-1" />
                          <div className="text-sm">Dễ</div>
                          <div className="text-xs opacity-75">4+ ngày</div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={studyMode || currentIndex === 0}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={
                studyMode
                  ? "Chế độ theo dõi không hỗ trợ quay lại"
                  : "Thẻ trước"
              }
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <button
              onClick={handleMarkCard}
              className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all ${
                isMarked
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-slate-700 hover:bg-yellow-50"
              }`}
              title="Đánh dấu thẻ khó"
            >
              <Star className={`w-6 h-6 ${isMarked ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={handleNext}
              disabled={!studyMode && currentIndex === flashcards.length - 1}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={studyMode ? "Lấy thẻ tiếp theo" : "Thẻ sau"}
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-slate-600 text-center">
              <span className="font-medium">Phím tắt:</span> ← Thẻ trước | → Thẻ
              sau | Space: Lật thẻ
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardViewer;
