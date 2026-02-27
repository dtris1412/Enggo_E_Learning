import React, { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { SpeakButton } from "../../../shared/components/SpeakButton";

interface FlashcardListModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcardSet: any;
  onUpdate: () => void;
}

const FlashcardListModal: React.FC<FlashcardListModalProps> = ({
  isOpen,
  onClose,
  flashcardSet,
  onUpdate,
}) => {
  const {
    flashcards,
    loading,
    fetchFlashcardsBySetId,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  } = useFlashcard();

  const { showToast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [newCard, setNewCard] = useState({
    front_content: "",
    back_content: "",
    example: "",
    pronunciation: "",
    difficulty_level: "beginner",
  });

  const [editCard, setEditCard] = useState({
    front_content: "",
    back_content: "",
    example: "",
    pronunciation: "",
    difficulty_level: "beginner",
  });

  useEffect(() => {
    if (isOpen && flashcardSet) {
      fetchFlashcardsBySetId(flashcardSet.flashcard_set_id);
    }
  }, [isOpen, flashcardSet, fetchFlashcardsBySetId]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCard.front_content.trim() || !newCard.back_content.trim()) {
      showToast("error", "Front content and back content are required");
      return;
    }

    const success = await createFlashcard({
      ...newCard,
      flashcard_set_id: flashcardSet.flashcard_set_id,
    });

    if (success) {
      showToast("success", "Flashcard added successfully");
      setNewCard({
        front_content: "",
        back_content: "",
        example: "",
        pronunciation: "",
        difficulty_level: "beginner",
      });
      setIsAdding(false);
      fetchFlashcardsBySetId(flashcardSet.flashcard_set_id);
      onUpdate();
    } else {
      showToast("error", "Failed to add flashcard");
    }
  };

  const handleEditCard = async (flashcardId: number) => {
    if (!editCard.front_content.trim() || !editCard.back_content.trim()) {
      showToast("error", "Front content and back content are required");
      return;
    }

    const success = await updateFlashcard(flashcardId, editCard);

    if (success) {
      showToast("success", "Flashcard updated successfully");
      setEditingId(null);
      fetchFlashcardsBySetId(flashcardSet.flashcard_set_id);
      onUpdate();
    } else {
      showToast("error", "Failed to update flashcard");
    }
  };

  const handleDeleteCard = async (flashcardId: number) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      const success = await deleteFlashcard(flashcardId);

      if (success) {
        showToast("success", "Flashcard deleted successfully");
        fetchFlashcardsBySetId(flashcardSet.flashcard_set_id);
        onUpdate();
      } else {
        showToast("error", "Failed to delete flashcard");
      }
    }
  };

  const startEdit = (card: any) => {
    setEditingId(card.flashcard_id);
    setEditCard({
      front_content: card.front_content,
      back_content: card.back_content,
      example: card.example || "",
      pronunciation: card.pronunciation || "",
      difficulty_level: card.difficulty_level || "beginner",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCard({
      front_content: "",
      back_content: "",
      example: "",
      pronunciation: "",
      difficulty_level: "beginner",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {flashcardSet?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage flashcards ({flashcards.length} cards)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Card Button */}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Flashcard
            </button>
          )}

          {/* Add Card Form */}
          {isAdding && (
            <form
              onSubmit={handleAddCard}
              className="mb-6 p-4 border-2 border-blue-300 rounded-lg bg-blue-50"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Add New Flashcard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Front Content <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCard.front_content}
                    onChange={(e) =>
                      setNewCard({ ...newCard, front_content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Back Content <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCard.back_content}
                    onChange={(e) =>
                      setNewCard({ ...newCard, back_content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pronunciation
                  </label>
                  <input
                    type="text"
                    value={newCard.pronunciation}
                    onChange={(e) =>
                      setNewCard({ ...newCard, pronunciation: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newCard.difficulty_level}
                    onChange={(e) =>
                      setNewCard({
                        ...newCard,
                        difficulty_level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Example
                  </label>
                  <textarea
                    value={newCard.example}
                    onChange={(e) =>
                      setNewCard({
                        ...newCard,
                        example: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewCard({
                      front_content: "",
                      back_content: "",
                      example: "",
                      pronunciation: "",
                      difficulty_level: "beginner",
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Card
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Flashcards List */}
          <div className="space-y-3">
            {loading && flashcards.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : flashcards.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No flashcards yet. Add your first card to get started!
              </div>
            ) : (
              flashcards.map((card) => (
                <div
                  key={card.flashcard_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingId === card.flashcard_id ? (
                    // Edit Form
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Front Content
                          </label>
                          <input
                            type="text"
                            value={editCard.front_content}
                            onChange={(e) =>
                              setEditCard({
                                ...editCard,
                                front_content: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Back Content
                          </label>
                          <input
                            type="text"
                            value={editCard.back_content}
                            onChange={(e) =>
                              setEditCard({
                                ...editCard,
                                back_content: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pronunciation
                          </label>
                          <input
                            type="text"
                            value={editCard.pronunciation}
                            onChange={(e) =>
                              setEditCard({
                                ...editCard,
                                pronunciation: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty Level
                          </label>
                          <select
                            value={editCard.difficulty_level}
                            onChange={(e) =>
                              setEditCard({
                                ...editCard,
                                difficulty_level: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Example
                          </label>
                          <textarea
                            value={editCard.example}
                            onChange={(e) =>
                              setEditCard({
                                ...editCard,
                                example: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditCard(card.flashcard_id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-lg font-semibold text-gray-900">
                              {card.front_content}
                            </div>
                            {card.pronunciation && (
                              <div className="text-sm text-gray-500 italic">
                                /{card.pronunciation}/
                              </div>
                            )}
                          </div>
                          <div className="text-gray-700 mb-2">
                            → {card.back_content}
                          </div>
                          {card.example && (
                            <div className="text-sm text-gray-600 italic mt-2 pl-4 border-l-2 border-gray-300">
                              {card.example}
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                card.difficulty_level === "beginner"
                                  ? "bg-green-100 text-green-800"
                                  : card.difficulty_level === "intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {card.difficulty_level}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <SpeakButton text={card.front_content} />
                          <button
                            onClick={() => startEdit(card)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card.flashcard_id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardListModal;
