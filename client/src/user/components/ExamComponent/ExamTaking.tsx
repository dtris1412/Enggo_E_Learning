import React, { useEffect, useState, useRef } from "react";
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
  VolumeX,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X,
  LayoutGrid,
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
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Audio player ref for persistent playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

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
        const examData = await getExamForTaking(parseInt(id), examId);
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

  // Handle audio playback - auto-play when container changes or exam loads
  useEffect(() => {
    const container = getCurrentContainer();
    if (!container) return;

    const audioUrl = getAudioUrl();

    // If audio URL changed, update and auto-play
    if (audioUrl && audioUrl !== currentAudioUrl) {
      setCurrentAudioUrl(audioUrl);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.log("Audio autoplay prevented:", error);
          setIsAudioPlaying(false);
        });
        setIsAudioPlaying(true);
      }
    } else if (!audioUrl && currentAudioUrl) {
      // No audio for this container
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setCurrentAudioUrl(null);
      setIsAudioPlaying(false);
    }
  }, [currentContainerIndex, exam]);

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

  // Flatten containers to include children
  const getFlattenedContainers = () => {
    if (!exam || !exam.Exam_Containers) return [];

    const flattened: any[] = [];
    exam.Exam_Containers.forEach((container: any) => {
      // For parent containers with children, add children only
      if (container.children && container.children.length > 0) {
        flattened.push(...container.children);
      } else {
        // For containers without children (Part 1, 2, 5), add the container itself
        flattened.push(container);
      }
    });

    return flattened;
  };

  const getCurrentContainer = () => {
    const containers = getFlattenedContainers();
    if (containers.length === 0) return null;
    return containers[currentContainerIndex];
  };

  const getCurrentQuestion = () => {
    const container = getCurrentContainer();
    if (!container || !container.Container_Questions) return null;
    return container.Container_Questions[currentQuestionIndex];
  };

  const handleNextQuestion = () => {
    const container = getCurrentContainer();
    const containers = getFlattenedContainers();
    if (!container) return;

    if (currentQuestionIndex < container.Container_Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentContainerIndex < containers.length - 1) {
      setCurrentContainerIndex(currentContainerIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousQuestion = () => {
    const containers = getFlattenedContainers();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentContainerIndex > 0) {
      setCurrentContainerIndex(currentContainerIndex - 1);
      const prevContainer = containers[currentContainerIndex - 1];
      setCurrentQuestionIndex(prevContainer.Container_Questions.length - 1);
    }
  };

  const getTotalQuestionsCount = () => {
    const containers = getFlattenedContainers();
    return containers.reduce(
      (total: number, container: any) =>
        total + (container.Container_Questions?.length || 0),
      0,
    );
  };

  const getAnsweredQuestionsCount = () => {
    return Object.values(answers).filter((ans) => ans !== null).length;
  };

  const getCurrentQuestionNumber = () => {
    const containers = getFlattenedContainers();
    let count = 0;
    for (let i = 0; i < currentContainerIndex; i++) {
      count += containers[i].Container_Questions?.length || 0;
    }
    return count + currentQuestionIndex + 1;
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  const goToQuestion = (containerIdx: number, questionIdx: number) => {
    setCurrentContainerIndex(containerIdx);
    setCurrentQuestionIndex(questionIdx);
  };

  // Get parent container for audio (Part 3, 4 store audio in parent)
  const getParentContainer = () => {
    if (!exam || !exam.Exam_Containers) return null;

    const currentContainer = getCurrentContainer();
    if (!currentContainer) return null;

    // If current container has parent_id, find the parent
    if (currentContainer.parent_id) {
      return exam.Exam_Containers.find(
        (c: any) => c.container_id === currentContainer.parent_id,
      );
    }

    return null;
  };

  // Get audio URL from parent or current container
  const getAudioUrl = () => {
    const parent = getParentContainer();
    if (parent && parent.audio_url) {
      return parent.audio_url;
    }

    const currentContainer = getCurrentContainer();
    return currentContainer?.audio_url || null;
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
    <div className="min-h-screen bg-gray-50">
      {/* Hidden audio element for persistent playback */}
      <audio
        ref={audioRef}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        onEnded={() => setIsAudioPlaying(false)}
      />

      {/* Fixed Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Exam Title */}
            <div className="flex items-center gap-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {exam.exam_title}
                </h1>
                <p className="text-xs text-gray-500">
                  Question {currentQuestionNumber} of {totalQuestions}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Audio Control */}
              {currentAudioUrl && (
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-lg transition-colors ${
                    isAudioPlaying
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={isAudioPlaying ? "Pause Audio" : "Play Audio"}
                >
                  {isAudioPlaying ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm font-semibold ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeRemaining)}
              </div>

              {/* Progress Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {answeredQuestions}/{totalQuestions}
                </span>
              </div>

              {/* Overview Button */}
              <button
                onClick={() => setShowOverviewModal(true)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Question Overview"
              >
                <LayoutGrid className="w-5 h-5 text-gray-600" />
              </button>

              {/* Save */}
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>

              {/* Submit */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - All Images & Content */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              {currentContainer && (
                <>
                  {/* Container Header */}
                  <div className="mb-4 pb-3 border-b">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded uppercase">
                      {currentContainer.skill || "Section"}
                    </span>
                    {currentContainer.instruction && (
                      <p className="text-base font-medium text-gray-700 mt-2">
                        {currentContainer.instruction}
                      </p>
                    )}
                  </div>

                  {/* Container Image - Enlarged */}
                  {currentContainer.image_url && (
                    <div className="mb-5">
                      <img
                        src={currentContainer.image_url}
                        alt="Test content"
                        className="w-full rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Question Image - Enlarged */}
                  {currentQuestion && currentQuestion.image_url && (
                    <div className="mb-5">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Question {currentQuestionNumber} Image:
                      </p>
                      <img
                        src={currentQuestion.image_url}
                        alt="Question"
                        className="w-full rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Content/Paragraph */}
                  {currentContainer.content && (
                    <div className="prose prose-base max-w-none">
                      <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                        {currentContainer.content}
                      </div>
                    </div>
                  )}

                  {/* Empty state if no content */}
                  {!currentContainer.image_url &&
                    !currentContainer.content &&
                    !currentQuestion?.image_url && (
                      <div className="text-center py-12 text-gray-400">
                        <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No visual content</p>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Question & Answers */}
          <div>
            {currentQuestion && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Question */}
                <div className="mb-6">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {currentQuestionNumber}
                    </span>
                    <h3 className="flex-1 text-lg font-medium text-gray-900 leading-relaxed">
                      {currentQuestion.Question.question_content}
                    </h3>
                  </div>
                </div>

                {/* Answer Options */}
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
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="text-gray-800 text-base">
                            {option.content}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={
                      currentContainerIndex === 0 && currentQuestionIndex === 0
                    }
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="text-sm text-gray-500 font-medium">
                    {Math.round((answeredQuestions / totalQuestions) * 100)}%
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={
                      currentContainerIndex ===
                        getFlattenedContainers().length - 1 &&
                      currentQuestionIndex ===
                        (currentContainer?.Container_Questions?.length || 0) - 1
                    }
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Overview Modal */}
      {showOverviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Question Overview
              </h3>
              <button
                onClick={() => setShowOverviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {getFlattenedContainers().map(
                (container: any, containerIdx: number) => {
                  const containerQuestions =
                    container.Container_Questions || [];
                  if (containerQuestions.length === 0) return null;

                  return (
                    <div key={container.container_id}>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        {container.instruction || `Section ${containerIdx + 1}`}{" "}
                        - {container.skill?.toUpperCase()}
                      </h4>
                      <div className="grid grid-cols-10 gap-2">
                        {containerQuestions.map(
                          (question: any, questionIdx: number) => {
                            const isAnswered =
                              answers[question.container_question_id] !==
                                null &&
                              answers[question.container_question_id] !==
                                undefined;
                            const isCurrent =
                              containerIdx === currentContainerIndex &&
                              questionIdx === currentQuestionIndex;

                            // Calculate global question number
                            let globalNum = 0;
                            for (let i = 0; i < containerIdx; i++) {
                              globalNum +=
                                getFlattenedContainers()[i].Container_Questions
                                  ?.length || 0;
                            }
                            globalNum += questionIdx + 1;

                            return (
                              <button
                                key={question.container_question_id}
                                onClick={() => {
                                  goToQuestion(containerIdx, questionIdx);
                                  setShowOverviewModal(false);
                                }}
                                className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all ${
                                  isCurrent
                                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                                    : isAnswered
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                title={`Question ${globalNum}${isAnswered ? " (Answered)" : ""}`}
                              >
                                {globalNum}
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-lg"></div>
                <span className="text-sm text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg"></div>
                <span className="text-sm text-gray-600">Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-semibold text-green-600">
                    {answeredQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
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
    </div>
  );
};

export default ExamTaking;
