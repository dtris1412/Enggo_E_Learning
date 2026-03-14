import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { SpeakButton } from "../../../shared/components/SpeakButton";
import AddFlashcardModal from "./AddFlashcardModal";
import EditFlashcardModal from "./EditFlashcardModal";
import BulkCreateFlashcardsModal from "./BulkCreateFlashcardsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
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
  List,
  CheckSquare,
  Square,
} from "lucide-react";

const FlashcardDetail: React.FC = () => {
  const { flashcard_set_id } = useParams<{ flashcard_set_id: string }>();
  const navigate = useNavigate();
  const {
    getFlashcardSetById,
    createFlashcard,
    createMultipleFlashcards,
    updateFlashcard,
    deleteFlashcard,
    deleteMultipleFlashcards,
    deleteFlashcardSet,
    loading,
  } = useFlashcard();
  const { showToast } = useToast();

  const [flashcardSet, setFlashcardSet] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFlashcardId, setDeletingFlashcardId] = useState<number | null>(
    null,
  );
  const [isDeleteSetModalOpen, setIsDeleteSetModalOpen] = useState(false);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] =
    useState(false);

  // Selection states
  const [selectedFlashcards, setSelectedFlashcards] = useState<Set<number>>(
    new Set(),
  );
  const [selectionMode, setSelectionMode] = useState(false);

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

  const handleDeleteSet = () => {
    setIsDeleteSetModalOpen(true);
  };

  const handleConfirmDeleteSet = async () => {
    if (!flashcard_set_id) return;
    const numericId = Number(flashcard_set_id);
    if (isNaN(numericId) || numericId <= 0) return;

    setIsSubmitting(true);
    try {
      const result = await deleteFlashcardSet(numericId);
      if (result.success) {
        showToast("success", "Đã xóa bộ flashcard");
        navigate("/flashcards");
      } else {
        showToast("error", result.message || "Không thể xóa bộ flashcard");
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi xóa bộ flashcard");
    } finally {
      setIsSubmitting(false);
      setIsDeleteSetModalOpen(false);
    }
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

  const handleBulkCreateCards = async (
    flashcards: Array<{
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard";
      pronunciation?: string;
    }>,
  ) => {
    if (!flashcard_set_id) return;
    const numericId = Number(flashcard_set_id);
    if (isNaN(numericId) || numericId <= 0) return;

    setIsSubmitting(true);
    try {
      const result = await createMultipleFlashcards(numericId, flashcards);

      if (result.success) {
        showToast("success", `Đã thêm ${flashcards.length} thẻ thành công!`);
        setIsBulkCreateModalOpen(false);
        await refreshData();
      } else {
        showToast("error", result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi thêm thẻ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCard = (flashcard: any) => {
    setEditingFlashcard(flashcard);
    setIsEditModalOpen(true);
  };

  const handleSaveEditCard = async (data: {
    front_content: string;
    back_content: string;
    example?: string;
    difficulty_level?: "easy" | "medium" | "hard" | null;
    pronunciation?: string;
  }) => {
    if (!editingFlashcard) return;

    setIsSubmitting(true);
    try {
      const result = await updateFlashcard(editingFlashcard.flashcard_id, data);

      if (result.success) {
        showToast("success", "Cập nhật thẻ thành công!");
        setIsEditModalOpen(false);
        setEditingFlashcard(null);
        await refreshData();
      } else {
        showToast("error", result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi cập nhật thẻ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = (flashcard_id: number) => {
    setDeletingFlashcardId(flashcard_id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteCard = async () => {
    if (!deletingFlashcardId) return;

    setIsSubmitting(true);
    try {
      const result = await deleteFlashcard(deletingFlashcardId);

      if (result.success) {
        showToast("success", "Đã xóa thẻ");
        setIsDeleteModalOpen(false);
        setDeletingFlashcardId(null);
        await refreshData();
      } else {
        showToast("error", result.message || "Không thể xóa thẻ");
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi xóa thẻ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelection = (flashcard_id: number) => {
    const newSelection = new Set(selectedFlashcards);
    if (newSelection.has(flashcard_id)) {
      newSelection.delete(flashcard_id);
    } else {
      newSelection.add(flashcard_id);
    }
    setSelectedFlashcards(newSelection);
  };

  const selectAll = () => {
    if (flashcardSet?.Flashcards) {
      const allIds = flashcardSet.Flashcards.map((fc: any) => fc.flashcard_id);
      setSelectedFlashcards(new Set(allIds));
    }
  };

  const clearSelection = () => {
    setSelectedFlashcards(new Set());
    setSelectionMode(false);
  };

  const handleDeleteMultiple = () => {
    if (selectedFlashcards.size === 0) {
      showToast("info", "Vui lòng chọn ít nhất 1 thẻ để xóa");
      return;
    }
    setIsDeleteMultipleModalOpen(true);
  };

  const handleConfirmDeleteMultiple = async () => {
    if (selectedFlashcards.size === 0) return;

    setIsSubmitting(true);
    try {
      const result = await deleteMultipleFlashcards(
        Array.from(selectedFlashcards),
      );

      if (result.success) {
        showToast("success", `Đã xóa ${selectedFlashcards.size} thẻ`);
        setIsDeleteMultipleModalOpen(false);
        clearSelection();
        await refreshData();
      } else {
        showToast("error", result.message || "Không thể xóa thẻ");
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi xóa thẻ");
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
                    onClick={handleDeleteSet}
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
              <div className="flex items-center gap-3">
                {selectionMode ? (
                  <>
                    <span className="text-sm text-gray-600">
                      Đã chọn {selectedFlashcards.size} thẻ
                    </span>
                    {selectedFlashcards.size <
                      (flashcardSet.Flashcards?.length || 0) && (
                      <button
                        onClick={selectAll}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        Chọn tất cả
                      </button>
                    )}
                    <button
                      onClick={handleDeleteMultiple}
                      disabled={selectedFlashcards.size === 0}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa ({selectedFlashcards.size})
                    </button>
                    <button
                      onClick={clearSelection}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    {flashcardSet.Flashcards &&
                      flashcardSet.Flashcards.length > 0 && (
                        <button
                          onClick={() => setSelectionMode(true)}
                          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                          <CheckSquare className="w-4 h-4" />
                          Chọn nhiều
                        </button>
                      )}
                    <button
                      onClick={() => setIsBulkCreateModalOpen(true)}
                      className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      Thêm nhiều
                    </button>
                    <button
                      onClick={handleOpenAddModal}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm thẻ mới
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Flashcards List */}
          {flashcardSet.Flashcards && flashcardSet.Flashcards.length > 0 ? (
            <div className="space-y-4">
              {flashcardSet.Flashcards.map((flashcard: any, index: number) => (
                <div
                  key={flashcard.flashcard_id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                    selectedFlashcards.has(flashcard.flashcard_id)
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    {selectionMode && isOwner && (
                      <button
                        onClick={() => toggleSelection(flashcard.flashcard_id)}
                        className="flex-shrink-0 mt-1"
                      >
                        {selectedFlashcards.has(flashcard.flashcard_id) ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    )}

                    {/* Index Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">
                      {index + 1}
                    </div>

                    {/* Content */}
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

                    {/* Difficulty Level */}
                    {flashcard.difficulty_level && (
                      <span
                        className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                          flashcard.difficulty_level === "easy"
                            ? "bg-green-100 text-green-800"
                            : flashcard.difficulty_level === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {flashcard.difficulty_level === "easy"
                          ? "Dễ"
                          : flashcard.difficulty_level === "medium"
                            ? "TB"
                            : "Khó"}
                      </span>
                    )}

                    {/* Edit/Delete Actions */}
                    {isOwner && !selectionMode && (
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => handleEditCard(flashcard)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCard(flashcard.flashcard_id)
                          }
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Modals */}
      <AddFlashcardModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddCard}
        loading={isSubmitting}
      />

      <BulkCreateFlashcardsModal
        isOpen={isBulkCreateModalOpen}
        onClose={() => setIsBulkCreateModalOpen(false)}
        onSave={handleBulkCreateCards}
      />

      {editingFlashcard && (
        <EditFlashcardModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFlashcard(null);
          }}
          flashcard={editingFlashcard}
          onSave={handleSaveEditCard}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingFlashcardId(null);
        }}
        onConfirm={handleConfirmDeleteCard}
        title="Xóa flashcard"
        message="Bạn có chắc chắn muốn xóa thẻ này? Hành động này không thể hoàn tác."
        loading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteMultipleModalOpen}
        onClose={() => setIsDeleteMultipleModalOpen(false)}
        onConfirm={handleConfirmDeleteMultiple}
        title={`Xóa ${selectedFlashcards.size} flashcards`}
        message={`Bạn có chắc chắn muốn xóa ${selectedFlashcards.size} thẻ đã chọn? Hành động này không thể hoàn tác.`}
        loading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteSetModalOpen}
        onClose={() => setIsDeleteSetModalOpen(false)}
        onConfirm={handleConfirmDeleteSet}
        title="Xóa bộ flashcard"
        message="Bạn có chắc chắn muốn xóa toàn bộ bộ flashcard này? Tất cả các thẻ trong bộ sẽ bị xóa. Hành động này không thể hoàn tác."
        confirmText="Xóa bộ flashcard"
        loading={isSubmitting}
      />
    </div>
  );
};

export default FlashcardDetail;
