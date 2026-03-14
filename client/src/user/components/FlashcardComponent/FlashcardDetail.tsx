import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { SpeakButton } from "../../../shared/components/SpeakButton";
import AddFlashcardModal from "./AddFlashcardModal";
import {
  BookMarked,
  User,
  Clock,
  Globe,
  LockKeyhole,
  ArrowLeft,
  Play,
  Edit,
  Trash2,
  Plus,
  Home,
  ChevronRight,
} from "lucide-react";

const FlashcardDetail: React.FC = () => {
  const { flashcard_set_id } = useParams<{ flashcard_set_id: string }>();
  const navigate = useNavigate();
  const { getFlashcardSetById, createFlashcard, loading } = useFlashcard();
  const { showToast } = useToast();

  const [flashcardSet, setFlashcardSet] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get current user ID
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.user_id);
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!flashcard_set_id) {
        console.error("FlashcardDetail: No flashcard_set_id in URL");
        showToast("error", "ID flashcard set không hợp lệ");
        navigate("/flashcards");
        return;
      }

      const numericId = Number(flashcard_set_id);
      if (isNaN(numericId) || numericId <= 0) {
        console.error(
          "FlashcardDetail: Invalid flashcard_set_id:",
          flashcard_set_id,
        );
        showToast("error", "ID flashcard set không hợp lệ");
        navigate("/flashcards");
        return;
      }

      const data = await getFlashcardSetById(numericId);
      if (data) {
        setFlashcardSet(data);
        // Check if current user is owner
        if (currentUserId && data.user_id === currentUserId) {
          setIsOwner(true);
        }
      } else {
        showToast("error", "Không tìm thấy flashcard set");
        navigate("/flashcards");
      }
    };

    fetchData();
  }, [flashcard_set_id, currentUserId]);

  const handleStartLearning = () => {
    navigate(`/flashcards/${flashcard_set_id}/learn`);
  };

  const handleEdit = () => {
    navigate(`/flashcards/${flashcard_set_id}/edit`);
  };

  const handleDelete = () => {
    // TODO: Implement delete confirmation modal
    showToast("info", "Chức năng xóa đang được phát triển");
  };

  const refreshData = async () => {
    if (!flashcard_set_id) return;
    const numericId = Number(flashcard_set_id);
    if (isNaN(numericId) || numericId <= 0) return;

    const data = await getFlashcardSetById(numericId);
    if (data) {
      setFlashcardSet(data);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddCard = async (data: {
    front_content: string;
    back_content: string;
    example?: string;
    difficulty_level?: "easy" | "medium" | "hard" | null;
    pronunciation?: string;
  }) => {
    if (!flashcard_set_id) return;
    const numericId = Number(flashcard_set_id);
    if (isNaN(numericId) || numericId <= 0) return;

    setIsSubmitting(true);
    try {
      const result = await createFlashcard(numericId, data);

      if (result.success) {
        showToast("success", "Thêm thẻ thành công!");
        setIsAddModalOpen(false);
        // Refresh flashcard set data
        await refreshData();
      } else {
        showToast("error", result.message || "Có lỗi xảy ra khi thêm thẻ");
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi thêm thẻ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!flashcardSet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <a href="/" className="hover:text-indigo-600 transition-colors">
              Trang chủ
            </a>
            <ChevronRight className="w-4 h-4" />
            <a
              href="/flashcards"
              className="hover:text-indigo-600 transition-colors"
            >
              Flashcards
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {flashcardSet.title}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <button
            onClick={() => navigate("/flashcards")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    flashcardSet.visibility === "public"
                      ? "bg-green-500/20 text-white"
                      : "bg-gray-500/20 text-white"
                  }`}
                >
                  {flashcardSet.visibility === "public" ? (
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <LockKeyhole className="w-4 h-4" />
                      Private
                    </span>
                  )}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20 text-white">
                  {flashcardSet.created_by_type === "admin" ? "Admin" : "User"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {flashcardSet.title}
              </h1>

              {flashcardSet.description && (
                <p className="text-lg text-white/90 mb-6 max-w-3xl">
                  {flashcardSet.description}
                </p>
              )}

              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5" />
                  <span className="font-medium">
                    {flashcardSet.total_cards}
                  </span>
                  <span>thẻ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    ~{Math.max(1, Math.ceil(flashcardSet.total_cards / 10))}{" "}
                    phút
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {flashcardSet.User?.avatar ? (
                    <img
                      src={flashcardSet.User.avatar}
                      alt={flashcardSet.User.user_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span>{flashcardSet.User?.user_name || "Unknown"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStartLearning}
                className="bg-white text-indigo-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Bắt đầu học
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500/20 hover:bg-red-500/30 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Danh sách flashcards ({flashcardSet.total_cards})
            </h2>
            {isOwner && (
              <button
                onClick={handleOpenAddModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm thẻ mới
              </button>
            )}
          </div>

          {/* Flashcards List */}
          {flashcardSet.Flashcards && flashcardSet.Flashcards.length > 0 ? (
            <div className="space-y-4">
              {flashcardSet.Flashcards.map((flashcard: any, index: number) => (
                <div
                  key={flashcard.flashcard_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-medium">
                          Mặt trước
                        </span>
                        <div className="flex items-start gap-2 mt-1">
                          <p className="text-gray-900 font-medium flex-1">
                            {flashcard.front_content}
                          </p>
                          <SpeakButton
                            text={flashcard.front_content}
                            lang="en-US"
                            className="flex-shrink-0"
                          />
                        </div>
                        {flashcard.pronunciation && (
                          <p className="text-sm text-indigo-600 mt-1">
                            {flashcard.pronunciation}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-medium">
                          Mặt sau
                        </span>
                        <p className="text-gray-900 font-medium mt-1">
                          {flashcard.back_content}
                        </p>
                        {flashcard.example && (
                          <p className="text-sm text-gray-600 italic mt-1">
                            "{flashcard.example}"
                          </p>
                        )}
                      </div>
                    </div>
                    {flashcard.difficulty_level && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          flashcard.difficulty_level === "easy"
                            ? "bg-green-100 text-green-800"
                            : flashcard.difficulty_level === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {flashcard.difficulty_level}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có flashcard nào</p>
              {isOwner && (
                <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm thẻ mới
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Thông tin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="ml-2 text-gray-900 font-medium">
                {formatDate(flashcardSet.created_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Cập nhật lần cuối:</span>
              <span className="ml-2 text-gray-900 font-medium">
                {formatDate(flashcardSet.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Flashcard Modal */}
      <AddFlashcardModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddCard}
        loading={isSubmitting}
      />
    </div>
  );
};

export default FlashcardDetail;
