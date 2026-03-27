import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  TrendingUp,
  Clock,
  AlertCircle,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import FlashcardSidebar from "../components/FlashcardComponent/FlashcardSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface DueCard {
  flashcard_id: number;
  front_content: string;
  back_content: string;
  next_review_at: string;
  due_hours_ago: number;
}

interface Notification {
  flashcard_set_id: number;
  set_title: string;
  set_description?: string;
  due_cards: DueCard[];
  total_due: number;
}

interface NotificationResponse {
  success: boolean;
  total_due_cards: number;
  total_sets_with_due: number;
  notifications: Notification[];
}

const FlashcardNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalDueCards, setTotalDueCards] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSets, setExpandedSets] = useState<Set<number>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(
        `${API_URL}/user/flashcards/due-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result: NotificationResponse = await response.json();

      if (result.success) {
        setNotifications(result.notifications || []);
        setTotalDueCards(result.total_due_cards || 0);
        setTotalSets(result.total_sets_with_due || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetExpansion = (setId: number) => {
    const newExpanded = new Set(expandedSets);
    if (newExpanded.has(setId)) {
      newExpanded.delete(setId);
    } else {
      newExpanded.add(setId);
    }
    setExpandedSets(newExpanded);
  };

  const getUrgencyColor = (hoursAgo: number) => {
    if (hoursAgo >= 72) return "text-red-600 bg-red-50"; // 3+ days
    if (hoursAgo >= 24) return "text-orange-600 bg-orange-50"; // 1+ day
    if (hoursAgo >= 12) return "text-yellow-600 bg-yellow-50"; // 12+ hours
    return "text-blue-600 bg-blue-50"; // Less than 12 hours
  };

  const getUrgencyLabel = (hoursAgo: number) => {
    if (hoursAgo >= 72) return "Rất cấp bách";
    if (hoursAgo >= 24) return "Cấp bách";
    if (hoursAgo >= 12) return "Cần ôn sớm";
    return "Đến hạn";
  };

  const formatDueTime = (hoursAgo: number) => {
    if (hoursAgo >= 24) {
      const days = Math.floor(hoursAgo / 24);
      return `${days} ngày trước`;
    }
    return `${hoursAgo} giờ trước`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar */}
      <FlashcardSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-10 h-10 text-white" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Thông báo
                </h1>
              </div>
              <p className="text-lg text-purple-100">
                Cards đến hạn ôn tập theo lịch SM-2
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {!isLoading && totalDueCards > 0 && (
          <div className="bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Cards đến hạn</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalDueCards}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Sets</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalSets}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Sẵn sàng ôn tập</p>
                    <p className="text-2xl font-bold text-green-600">
                      Bắt đầu ngay!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-slate-600">Đang tải thông báo...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="max-w-4xl space-y-4">
              {notifications.map((notification) => {
                const isExpanded = expandedSets.has(
                  notification.flashcard_set_id,
                );
                const mostUrgentCard = notification.due_cards[0];

                return (
                  <div
                    key={notification.flashcard_set_id}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                  >
                    {/* Set Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-slate-900 mb-2">
                            {notification.set_title}
                          </h2>
                          {notification.set_description && (
                            <p className="text-sm text-slate-600 mb-3">
                              {notification.set_description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 flex-wrap">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getUrgencyColor(
                                mostUrgentCard.due_hours_ago,
                              )}`}
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {notification.total_due} cards đến hạn
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                Cũ nhất:{" "}
                                {formatDueTime(mostUrgentCard.due_hours_ago)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/flashcards/${notification.flashcard_set_id}/learn`}
                          className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold whitespace-nowrap"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Ôn ngay
                        </Link>
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={() =>
                          toggleSetExpansion(notification.flashcard_set_id)
                        }
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        {isExpanded
                          ? "Thu gọn danh sách"
                          : `Xem ${notification.total_due} cards đến hạn`}
                      </button>
                    </div>

                    {/* Expanded Card List */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50">
                        <div className="p-6 space-y-3">
                          {notification.due_cards.map((card) => (
                            <div
                              key={card.flashcard_id}
                              className="bg-white rounded-lg p-4 border border-slate-200"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-900 mb-2">
                                    {card.front_content}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {card.back_content}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <div
                                    className={`px-2 py-1 rounded text-xs font-semibold ${getUrgencyColor(
                                      card.due_hours_ago,
                                    )}`}
                                  >
                                    {getUrgencyLabel(card.due_hours_ago)}
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1 text-right">
                                    {formatDueTime(card.due_hours_ago)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Bạn không có thông báo nào!
              </h2>
              <p className="text-slate-600 mb-6">
                Tuyệt vời! Bạn đã ôn tập tất cả các cards đến hạn hoặc chưa có
                cards nào cần ôn.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/flashcards"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <BookOpen className="w-4 h-4" />
                  Khám phá flashcards
                </Link>
                <Link
                  to="/flashcards/my-library"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors font-semibold"
                >
                  <TrendingUp className="w-4 h-4" />
                  Thư viện của tôi
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardNotifications;
