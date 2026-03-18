import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import {
  Clock,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Volume2,
  ChevronLeft,
  ChevronRight,
  List,
  X,
} from "lucide-react";

const ExamTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getExamForTaking,
    startExam,
    saveAnswers,
    submitExam,
    getOngoingExam,
  } = useExam();
  const { showToast } = useToast();

  const [exam, setExam] = useState<any>(null);
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [currentContainerIndex, setCurrentContainerIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Initialize exam
  useEffect(() => {
    const initializeExam = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Check for ongoing exam first
        const ongoingResult = await getOngoingExam();
        let examId = null;

        if (ongoingResult.success && ongoingResult.data) {
          // Resume ongoing exam
          examId = ongoingResult.data.user_exam_id;
          setUserExamId(examId);

          // Load saved answers
          const savedAnswers: Record<number, number | null> = {};
          ongoingResult.data.saved_answers.forEach((ans: any) => {
            savedAnswers[ans.container_question_id] = ans.question_option_id;
          });
          setAnswers(savedAnswers);

          showToast("info", "Resuming your exam...");
        } else {
          // Start new exam
          const startResult = await startExam(parseInt(id));
          if (startResult.success) {
            examId = startResult.data.user_exam_id;
            setUserExamId(examId);
          } else {
            showToast("error", startResult.message || "Failed to start exam");
            navigate(`/exams/${id}`);
            return;
          }
        }

        // Fetch exam content
        const examData = await getExamForTaking(parseInt(id));
        if (examData) {
          setExam(examData);
          setTimeRemaining(examData.exam_duration * 60); // Convert to seconds
        } else {
          showToast("error", "Failed to load exam");
          navigate(`/exams/${id}`);
        }
      } catch (error) {
        console.error("Error initializing exam:", error);
        showToast("error", "Failed to load exam");
        navigate(`/exams/${id}`);
      } finally {
        setLoading(false);
      }
    };

    initializeExam();

    return () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
      }
    };
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || !exam) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, exam]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!userExamId || !exam) return;

    const timer = setInterval(() => {
      handleSave(false);
    }, 30000); // 30 seconds

    setAutoSaveTimer(timer);

    return () => clearInterval(timer);
  }, [userExamId, answers, exam]);

  const handleSave = async (showNotification = true) => {
    if (!userExamId) return;

    setIsSaving(true);
    try {
      const answersArray = Object.entries(answers).map(([key, value]) => ({
        container_question_id: parseInt(key),
        question_option_id: value,
      }));

      const result = await saveAnswers(userExamId, answersArray);
      if (result.success && showNotification) {
        showToast("success", "Answers saved successfully");
      }
    } catch (error) {
      console.error("Error saving answers:", error);
      if (showNotification) {
        showToast("error", "Failed to save answers");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!userExamId) return;

    // Save answers first
    await handleSave(false);

    // Submit exam
    const result = await submitExam(userExamId);
    if (result.success) {
      showToast("success", "Exam submitted successfully!");
      navigate(`/exams/result/${userExamId}`);
    } else {
      showToast("error", result.message || "Failed to submit exam");
    }
  };

  const handleAutoSubmit = async () => {
    showToast("info", "Time's up! Submitting your exam...");
    await handleSubmit();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (
    containerQuestionId: number,
    optionId: number,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [containerQuestionId]: optionId,
    }));
  };

  const getCurrentContainer = () => {
    if (!exam || !exam.Exam_Containers) return null;
    return exam.Exam_Containers[currentContainerIndex];
  };

  const getCurrentQuestion = () => {
    const container = getCurrentContainer();
    if (!container || !container.Container_Questions) return null;
    return container.Container_Questions[currentQuestionIndex];
  };

  const handleNextQuestion = () => {
    const container = getCurrentContainer();
    if (!container) return;

    if (currentQuestionIndex < container.Container_Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentContainerIndex < exam.Exam_Containers.length - 1) {
      setCurrentContainerIndex(currentContainerIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentContainerIndex > 0) {
      setCurrentContainerIndex(currentContainerIndex - 1);
      const prevContainer = exam.Exam_Containers[currentContainerIndex - 1];
      setCurrentQuestionIndex(prevContainer.Container_Questions.length - 1);
    }
  };

  const getTotalQuestionsCount = () => {
    if (!exam || !exam.Exam_Containers) return 0;
    return exam.Exam_Containers.reduce(
      (total: number, container: any) =>
        total + container.Container_Questions.length,
      0,
    );
  };

  const getAnsweredQuestionsCount = () => {
    return Object.values(answers).filter((ans) => ans !== null).length;
  };

  const getCurrentQuestionNumber = () => {
    if (!exam || !exam.Exam_Containers) return 0;
    let count = 0;
    for (let i = 0; i < currentContainerIndex; i++) {
      count += exam.Exam_Containers[i].Container_Questions.length;
    }
    return count + currentQuestionIndex + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load exam
          </h3>
          <button
            onClick={() => navigate(`/exams/${id}`)}
            className="text-blue-600 hover:underline"
          >
            Back to exam details
          </button>
        </div>
      </div>
    );
  }

  const currentContainer = getCurrentContainer();
  const currentQuestion = getCurrentQuestion();
  const totalQuestions = getTotalQuestionsCount();
  const answeredQuestions = getAnsweredQuestionsCount();
  const currentQuestionNumber = getCurrentQuestionNumber();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {exam.exam_title}
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionNumber} of {totalQuestions}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>
                  {answeredQuestions}/{totalQuestions} answered
                </span>
              </div>

              {/* Question Navigator */}
              <button
                onClick={() => setShowQuestionNav(!showQuestionNav)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <List className="w-5 h-5" />
              </button>

              {/* Save Button */}
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Container Info */}
          {currentContainer && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {currentContainer.skill?.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {currentContainer.type}
                  </span>
                </div>
                {currentContainer.audio_url && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                    <Volume2 className="w-4 h-4" />
                    Play Audio
                  </button>
                )}
              </div>

              {currentContainer.instruction && (
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-sm font-medium text-gray-900">
                    {currentContainer.instruction}
                  </p>
                </div>
              )}

              {currentContainer.content && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {currentContainer.content}
                  </p>
                </div>
              )}

              {currentContainer.image_url && (
                <div className="mb-4">
                  <img
                    src={currentContainer.image_url}
                    alt="Container"
                    className="max-w-full rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Question */}
          {currentQuestion && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-6">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {currentQuestionNumber}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {currentQuestion.Question.question_content}
                  </h3>

                  {currentQuestion.image_url && (
                    <div className="mb-4">
                      <img
                        src={currentQuestion.image_url}
                        alt="Question"
                        className="max-w-sm rounded-lg shadow-sm"
                      />
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.Question_Options.map((option: any) => {
                      const isSelected =
                        answers[currentQuestion.container_question_id] ===
                        option.question_option_id;

                      return (
                        <button
                          key={option.question_option_id}
                          onClick={() =>
                            handleAnswerSelect(
                              currentQuestion.container_question_id,
                              option.question_option_id,
                            )
                          }
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="flex-1 text-gray-900">
                              {option.content}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={
                    currentContainerIndex === 0 && currentQuestionIndex === 0
                  }
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  {answeredQuestions > 0 && (
                    <span>
                      {Math.round((answeredQuestions / totalQuestions) * 100)}%
                      complete
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={
                    currentContainerIndex === exam.Exam_Containers.length - 1 &&
                    currentQuestionIndex ===
                      currentContainer.Container_Questions.length - 1
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Submit Exam?</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to submit your exam? You won't be able to
                change your answers after submission.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-semibold text-green-600">
                    {answeredQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unanswered:</span>
                  <span className="font-semibold text-red-600">
                    {totalQuestions - answeredQuestions}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Navigator Modal */}
      {showQuestionNav && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Question Navigator
              </h3>
              <button
                onClick={() => setShowQuestionNav(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {exam.Exam_Containers.map(
                (container: any, containerIdx: number) => (
                  <div key={container.container_id}>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Part {containerIdx + 1} - {container.skill?.toUpperCase()}
                    </h4>
                    <div className="grid grid-cols-10 gap-2">
                      {container.Container_Questions.map(
                        (question: any, questionIdx: number) => {
                          const isAnswered =
                            answers[question.container_question_id] !== null &&
                            answers[question.container_question_id] !==
                              undefined;
                          const isCurrent =
                            containerIdx === currentContainerIndex &&
                            questionIdx === currentQuestionIndex;

                          return (
                            <button
                              key={question.container_question_id}
                              onClick={() => {
                                setCurrentContainerIndex(containerIdx);
                                setCurrentQuestionIndex(questionIdx);
                                setShowQuestionNav(false);
                              }}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                isCurrent
                                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                                  : isAnswered
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {questionIdx + 1}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTaking;
