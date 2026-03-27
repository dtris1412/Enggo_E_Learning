import { useState } from "react";

interface LessonQuestion {
  lesson_question_id: number;
  order_index: number;
  question_type: string;
  content: string;
  options: Array<{ value: string; label: string }> | null;
  correct_answer: string;
  explaination: string | null;
  difficulty_level: string;
}

interface LessonQuizProps {
  questions: LessonQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export const LessonQuiz = ({ questions, onComplete }: LessonQuizProps) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  console.log("❓ LessonQuiz rendered with questions:", questions);
  console.log("📊 Questions count:", questions?.length);

  if (!questions || questions.length === 0) {
    console.log("⚠️ LessonQuiz: No questions to display");
    return null;
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    if (submitted) return; // Prevent changes after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const allAnswered = questions.every(
      (q) => userAnswers[q.lesson_question_id],
    );

    if (!allAnswered) {
      alert("Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài!");
      return;
    }

    setSubmitted(true);
    setShowResults(true);

    // Calculate score
    const correctCount = questions.filter(
      (q) => userAnswers[q.lesson_question_id] === q.correct_answer,
    ).length;

    if (onComplete) {
      onComplete(correctCount, questions.length);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const renderQuestion = (question: LessonQuestion, index: number) => {
    const userAnswer = userAnswers[question.lesson_question_id];
    const isCorrect = userAnswer === question.correct_answer;
    const showAnswer = submitted && showResults;

    return (
      <div
        key={question.lesson_question_id}
        className={`p-4 rounded-lg border-2 ${
          showAnswer
            ? isCorrect
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Question Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-base flex-1">
            <span className="text-blue-600 mr-2">Câu {index + 1}:</span>
            {question.content}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              question.difficulty_level,
            )}`}
          >
            {question.difficulty_level}
          </span>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options?.map((option, optIndex) => {
            const isSelected = userAnswer === option.value;
            const isCorrectOption = option.value === question.correct_answer;

            return (
              <label
                key={optIndex}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  submitted
                    ? isCorrectOption
                      ? "border-green-500 bg-green-50"
                      : isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                } ${submitted ? "cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${question.lesson_question_id}`}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) =>
                    handleAnswerChange(
                      question.lesson_question_id,
                      e.target.value,
                    )
                  }
                  disabled={submitted}
                  className="mr-3 w-5 h-5"
                />
                <span className="flex-1 font-medium">{option.label}</span>
                {showAnswer && isCorrectOption && (
                  <span className="text-green-600 font-bold">✓ Đúng</span>
                )}
                {showAnswer && isSelected && !isCorrectOption && (
                  <span className="text-red-600 font-bold">✗ Sai</span>
                )}
              </label>
            );
          })}
        </div>

        {/* Explanation */}
        {showAnswer && question.explaination && (
          <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-1">💡 Giải thích:</p>
            <p className="text-slate-700">{question.explaination}</p>
          </div>
        )}
      </div>
    );
  };

  const correctCount = questions.filter(
    (q) => userAnswers[q.lesson_question_id] === q.correct_answer,
  ).length;
  const scorePercentage = (correctCount / questions.length) * 100;

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">✏️ Kiểm tra kiến thức</h2>
        <span className="text-slate-600">{questions.length} câu hỏi</span>
      </div>

      {/* Results Summary */}
      {showResults && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            scorePercentage >= 70
              ? "bg-green-100 border-2 border-green-500"
              : scorePercentage >= 50
                ? "bg-yellow-100 border-2 border-yellow-500"
                : "bg-red-100 border-2 border-red-500"
          }`}
        >
          <h3 className="text-lg font-bold mb-2">
            {scorePercentage >= 70
              ? "🎉 Xuất sắc!"
              : scorePercentage >= 50
                ? "👍 Tốt"
                : "💪 Cần cố gắng thêm"}
          </h3>
          <p className="text-base">
            Bạn đã trả lời đúng{" "}
            <span className="font-bold text-blue-600">
              {correctCount}/{questions.length}
            </span>{" "}
            câu hỏi ({scorePercentage.toFixed(0)}%)
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => renderQuestion(question, index))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 justify-center">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nộp bài
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-6 py-2 text-sm bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Làm lại
          </button>
        )}
      </div>
    </div>
  );
};
