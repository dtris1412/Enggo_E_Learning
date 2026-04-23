import React, { useState } from "react";
import {
  Sparkles,
  Save,
  RefreshCw,
  Edit2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useToast } from "../../../shared/components/Toast/Toast";
import UpgradeTokenModal from "../../../shared/components/UpgradeTokenModal";
import { useNavigate } from "react-router-dom";

interface Flashcard {
  front_content: string;
  back_content: string;
  example: string;
  difficulty_level: string;
  pronunciation?: string;
}

interface SetInfo {
  title: string;
  description: string;
}

interface GeneratedData {
  set_info: SetInfo;
  flashcards: Flashcard[];
}

const AIFlashcardGenerator: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [additionalContext, setAdditionalContext] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [requiredTokens, setRequiredTokens] = useState(0);
  const [availableTokens, setAvailableTokens] = useState(0);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(
    null,
  );

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCard, setEditedCard] = useState<Flashcard | null>(null);

  const [editingSetInfo, setEditingSetInfo] = useState(false);
  const [editedSetInfo, setEditedSetInfo] = useState<SetInfo | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast("error", "Vui lòng nhập chủ đề");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      showToast("error", "Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/user/ai/generate-flashcard-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          cardCount,
          difficulty,
          additionalContext: additionalContext.trim() || undefined,
          saveToDatabase: false, // Preview mode
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        showToast("error", "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        setIsGenerating(false);
        return;
      }

      if (response.status === 402) {
        const errorData = await response.json();
        setRequiredTokens(errorData.requiredTokens || 0);
        setAvailableTokens(errorData.availableTokens || 0);
        setShowUpgradeModal(true);
        setIsGenerating(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // Hiển thị error message chi tiết từ server
        const errorMessage =
          data.detail || data.error || "Không thể tạo flashcard set";
        throw new Error(errorMessage);
      }

      setGeneratedData(data);
      showToast(
        "success",
        "Đã tạo flashcard set thành công! Xem trước bên dưới.",
      );
    } catch (error) {
      console.error("Generate flashcard set error:", error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Có lỗi xảy ra",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      showToast("error", "Vui lòng đăng nhập");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/user/ai/generate-flashcard-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          cardCount,
          difficulty,
          additionalContext: additionalContext.trim() || undefined,
          saveToDatabase: true,
          generatedData: generatedData, // Send the current (possibly edited) data
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        showToast("error", "Phiên đăng nhập hết hạn");
        setIsSaving(false);
        return;
      }

      if (response.status === 402) {
        const errorData = await response.json();
        setRequiredTokens(errorData.requiredTokens || 0);
        setAvailableTokens(errorData.availableTokens || 0);
        setShowUpgradeModal(true);
        setIsSaving(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.details || data.error || "Không thể lưu flashcard set";
        throw new Error(errorMessage);
      }

      showToast("success", "Đã lưu flashcard set thành công!");
      navigate(`/flashcards/${data.flashcard_set_id}`);
    } catch (error) {
      console.error("Save flashcard set error:", error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingCard = (index: number) => {
    setEditingIndex(index);
    setEditedCard({ ...generatedData!.flashcards[index] });
  };

  const saveEditedCard = () => {
    if (editingIndex !== null && editedCard && generatedData) {
      const updatedFlashcards = [...generatedData.flashcards];
      updatedFlashcards[editingIndex] = editedCard;
      setGeneratedData({
        ...generatedData,
        flashcards: updatedFlashcards,
      });
      setEditingIndex(null);
      setEditedCard(null);
      showToast("success", "Đã cập nhật flashcard");
    }
  };

  const cancelEditingCard = () => {
    setEditingIndex(null);
    setEditedCard(null);
  };

  const startEditingSetInfo = () => {
    setEditingSetInfo(true);
    setEditedSetInfo({ ...generatedData!.set_info });
  };

  const saveEditedSetInfo = () => {
    if (editedSetInfo && generatedData) {
      setGeneratedData({
        ...generatedData,
        set_info: editedSetInfo,
      });
      setEditingSetInfo(false);
      setEditedSetInfo(null);
      showToast("success", "Đã cập nhật thông tin bộ flashcard");
    }
  };

  const cancelEditingSetInfo = () => {
    setEditingSetInfo(false);
    setEditedSetInfo(null);
  };

  return (
    <>
      <UpgradeTokenModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTokens={availableTokens}
        requiredTokens={requiredTokens}
      />
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Tạo Flashcard bằng AI
              </h1>
              <p className="text-slate-600 text-sm">
                Nhập chủ đề và để AI tạo bộ flashcard hoàn chỉnh cho bạn
              </p>
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Chủ đề *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Từ vựng tiếng Anh về du lịch, Công thức toán học lớp 12..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số lượng flashcard
                </label>
                <input
                  type="number"
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  min="5"
                  max="50"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Độ khó
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as "easy" | "medium" | "hard")
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isGenerating}
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thông tin bổ sung (tùy chọn)
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Thêm yêu cầu đặc biệt, ngữ cảnh, hoặc định dạng mong muốn..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-violet-600 text-white py-3 rounded-md font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo flashcard...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Tạo Flashcard
                </>
              )}
            </button>
          </div>

          {/* Preview Generated Data */}
          {generatedData && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Xem trước Flashcard Set
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isSaving}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tạo lại
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Lưu Flashcard Set
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Set Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                {editingSetInfo && editedSetInfo ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={editedSetInfo.title}
                        onChange={(e) =>
                          setEditedSetInfo({
                            ...editedSetInfo,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={editedSetInfo.description}
                        onChange={(e) =>
                          setEditedSetInfo({
                            ...editedSetInfo,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditedSetInfo}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Lưu
                      </button>
                      <button
                        onClick={cancelEditingSetInfo}
                        className="px-3 py-1 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-slate-800">
                        {generatedData.set_info.title}
                      </h3>
                      <button
                        onClick={startEditingSetInfo}
                        className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm">
                      {generatedData.set_info.description}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      {generatedData.flashcards.length} flashcards
                    </p>
                  </div>
                )}
              </div>

              {/* Flashcards List */}
              <div className="space-y-3">
                {generatedData.flashcards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    {editingIndex === index && editedCard ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Mặt trước
                          </label>
                          <textarea
                            value={editedCard.front_content}
                            onChange={(e) =>
                              setEditedCard({
                                ...editedCard,
                                front_content: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Mặt sau
                          </label>
                          <textarea
                            value={editedCard.back_content}
                            onChange={(e) =>
                              setEditedCard({
                                ...editedCard,
                                back_content: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Ví dụ
                          </label>
                          <textarea
                            value={editedCard.example}
                            onChange={(e) =>
                              setEditedCard({
                                ...editedCard,
                                example: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Phiên âm (tùy chọn)
                          </label>
                          <input
                            type="text"
                            value={editedCard.pronunciation || ""}
                            onChange={(e) =>
                              setEditedCard({
                                ...editedCard,
                                pronunciation: e.target.value,
                              })
                            }
                            placeholder="Ví dụ: /həˈloʊ/"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveEditedCard}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                          >
                            <Check className="w-4 h-4" />
                            Lưu
                          </button>
                          <button
                            onClick={cancelEditingCard}
                            className="px-3 py-1 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 flex items-center gap-1 text-sm"
                          >
                            <X className="w-4 h-4" />
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-slate-500">
                                #{index + 1}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded">
                                {card.difficulty_level}
                              </span>
                            </div>
                            <p className="font-medium text-slate-800 mb-1">
                              {card.front_content}
                            </p>
                            <p className="text-slate-600 text-sm mb-2">
                              {card.back_content}
                            </p>
                            {card.example && (
                              <p className="text-slate-500 text-xs italic">
                                💡 {card.example}
                              </p>
                            )}
                            {card.pronunciation && (
                              <p className="text-slate-400 text-xs">
                                🔊 {card.pronunciation}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => startEditingCard(index)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIFlashcardGenerator;
