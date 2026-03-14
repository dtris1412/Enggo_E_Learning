import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFlashcard } from "../../contexts/flashcardContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import { SpeakButton } from "../../../shared/components/SpeakButton";
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
} from "lucide-react";

const FlashcardViewer: React.FC = () => {
  const { flashcard_set_id } = useParams<{ flashcard_set_id: string }>();
  const navigate = useNavigate();
  const { getFlashcardSetById, loading } = useFlashcard();
  const { showToast } = useToast();

  const [flashcardSet, setFlashcardSet] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [markedCards, setMarkedCards] = useState<Set<number>>(new Set());
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!flashcard_set_id) return;

      const data = await getFlashcardSetById(Number(flashcard_set_id));
      if (data && data.Flashcards) {
        setFlashcardSet(data);
        setFlashcards(data.Flashcards);
      } else {
        showToast("error", "Không tìm thấy flashcard set");
        navigate("/flashcards");
      }
    };

    fetchData();
  }, [flashcard_set_id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    showToast("success", "Đã xáo trộn thẻ");
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setMarkedCards(new Set());
    setKnownCards(new Set());
    setUnknownCards(new Set());
    showToast("success", "Đã reset tiến trình");
  };

  const handleMarkCard = () => {
    const newMarked = new Set(markedCards);
    const cardId = flashcards[currentIndex].flashcard_id;
    if (newMarked.has(cardId)) {
      newMarked.delete(cardId);
      showToast("info", "Đã bỏ đánh dấu thẻ");
    } else {
      newMarked.add(cardId);
      showToast("success", "Đã đánh dấu thẻ khó");
    }
    setMarkedCards(newMarked);
  };

  const handleKnowCard = () => {
    const cardId = flashcards[currentIndex].flashcard_id;
    const newKnown = new Set(knownCards);
    const newUnknown = new Set(unknownCards);

    newKnown.add(cardId);
    newUnknown.delete(cardId);

    setKnownCards(newKnown);
    setUnknownCards(newUnknown);

    // Auto move to next card
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleDontKnowCard = () => {
    const cardId = flashcards[currentIndex].flashcard_id;
    const newKnown = new Set(knownCards);
    const newUnknown = new Set(unknownCards);

    newUnknown.add(cardId);
    newKnown.delete(cardId);

    setKnownCards(newKnown);
    setUnknownCards(newUnknown);

    // Auto move to next card
    setTimeout(() => {
      handleNext();
    }, 300);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!flashcardSet || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Không có flashcard nào để học</p>
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

  const currentCard = flashcards[currentIndex];
  const isMarked = markedCards.has(currentCard.flashcard_id);
  const isKnown = knownCards.has(currentCard.flashcard_id);
  const isDontKnow = unknownCards.has(currentCard.flashcard_id);
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/flashcards/${flashcard_set_id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </button>

            <div className="text-center flex-1 max-w-md mx-4">
              <h1 className="text-lg font-bold text-gray-900 truncate">
                {flashcardSet.title}
              </h1>
              <p className="text-sm text-gray-600">
                {currentIndex + 1} / {flashcards.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Xáo trộn thẻ"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Reset tiến trình"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">
                Biết: <span className="font-bold">{knownCards.size}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-gray-700">
                Chưa biết:{" "}
                <span className="font-bold">{unknownCards.size}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-700">
                Đánh dấu: <span className="font-bold">{markedCards.size}</span>
              </span>
            </div>
          </div>
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
                      text={currentCard.front_content}
                      lang="en-US"
                      className=""
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                      Mặt trước
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      {currentCard.front_content}
                    </h2>
                    {currentCard.pronunciation && (
                      <p className="text-xl text-indigo-600 mb-4">
                        {currentCard.pronunciation}
                      </p>
                    )}
                    {currentCard.difficulty_level && (
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          currentCard.difficulty_level === "easy"
                            ? "bg-green-100 text-green-800"
                            : currentCard.difficulty_level === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {currentCard.difficulty_level}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-8 text-gray-400 text-sm">
                    Nhấp để lật thẻ hoặc nhấn Space
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 backface-hidden rotate-y-180 ${
                  isFlipped ? "visible" : "invisible"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <div className="absolute top-4 right-4">
                    {isMarked && (
                      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-4 uppercase tracking-wide">
                      Mặt sau
                    </p>
                    <h2 className="text-4xl font-bold mb-4">
                      {currentCard.back_content}
                    </h2>
                    {currentCard.example && (
                      <p className="text-lg text-white/90 italic max-w-2xl">
                        "{currentCard.example}"
                      </p>
                    )}
                  </div>

                  <div className="absolute bottom-8 text-white/70 text-sm">
                    Nhấp để lật lại thẻ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={handleMarkCard}
              className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all ${
                isMarked
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-700 hover:bg-yellow-50"
              }`}
              title="Đánh dấu thẻ khó"
            >
              <Star className={`w-6 h-6 ${isMarked ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Know / Don't Know Buttons */}
          {isFlipped && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={handleDontKnowCard}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  isDontKnow
                    ? "bg-red-500 text-white"
                    : "bg-white text-red-600 hover:bg-red-50 shadow-md hover:shadow-lg"
                }`}
              >
                <XCircle className="w-5 h-5 inline-block mr-2" />
                Chưa biết
              </button>
              <button
                onClick={handleKnowCard}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  isKnown
                    ? "bg-green-500 text-white"
                    : "bg-white text-green-600 hover:bg-green-50 shadow-md hover:shadow-lg"
                }`}
              >
                <CheckCircle className="w-5 h-5 inline-block mr-2" />
                Đã biết
              </button>
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
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
