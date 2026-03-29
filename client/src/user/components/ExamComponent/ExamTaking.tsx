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
  FileText,
  Mic,
  Loader2,
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
    submitWriting,
  } = useExam();
  const { showToast } = useToast();

  const [exam, setExam] = useState<any>(null);
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  // Writing: text per container_question_id
  const [writingTexts, setWritingTexts] = useState<Record<number, string>>({});
  const [writingFeedbacks, setWritingFeedbacks] = useState<Record<number, any>>(
    {},
  );
  const [writingSubmitting, setWritingSubmitting] = useState<
    Record<number, boolean>
  >({});
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

          showToast("info", "Đang tiếp tục bài thi...");
        } else {
          // Start new exam
          const startResult = await startExam(parseInt(id));
          if (startResult.success) {
            examId = startResult.data.user_exam_id;
            setUserExamId(examId);
          } else {
            showToast(
              "error",
              startResult.message || "Không thể bắt đầu bài thi",
            );
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
          showToast("error", "Không thể tải đề thi");
          navigate(`/exams/${id}`);
        }
      } catch (error) {
        console.error("Error initializing exam:", error);
        showToast("error", "Không thể tải đề thi");
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

  const handleWritingSubmit = async (container_question_id: number) => {
    if (!userExamId) return;
    const content = writingTexts[container_question_id] || "";
    if (content.trim().split(/\s+/).filter(Boolean).length < 5) {
      showToast("error", "Vui lòng viết ít nhất 5 từ trước khi nộp.");
      return;
    }
    setWritingSubmitting((prev) => ({
      ...prev,
      [container_question_id]: true,
    }));
    try {
      const result = await submitWriting(
        userExamId,
        container_question_id,
        content,
      );
      if (result.success) {
        setWritingFeedbacks((prev) => ({
          ...prev,
          [container_question_id]: result.data,
        }));
        showToast(
          "success",
          `Bài viết đã được chấm: Band ${result.data?.submission?.final_score ?? "N/A"}`,
        );
      } else {
        showToast("error", result.message || "Không thể nộp bài viết");
      }
    } catch (e) {
      showToast("error", "Lỗi kết nối");
    } finally {
      setWritingSubmitting((prev) => ({
        ...prev,
        [container_question_id]: false,
      }));
    }
  };

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
        showToast("success", "Đã lưu câu trả lời");
      }
    } catch (error) {
      console.error("Error saving answers:", error);
      if (showNotification) {
        showToast("error", "Không thể lưu câu trả lời");
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
      showToast("success", "Đã nộp bài thi thành công!");
      navigate(`/exams/result/${userExamId}`);
    } else {
      showToast("error", result.message || "Không thể nộp bài thi");
    }
  };

  const handleAutoSubmit = async () => {
    showToast("info", "Hết giờ! Đang nộp bài thi...");
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
    return containers.reduce((total: number, container: any) => {
      // Speaking parts count as 1 "item" in progress
      if (container.type === "speaking_part") return total + 1;
      return total + (container.Container_Questions?.length || 0);
    }, 0);
  };

  const getAnsweredQuestionsCount = () => {
    const containers = getFlattenedContainers();
    let count = Object.values(answers).filter((ans) => ans !== null).length;
    // Also count submitted writing tasks
    containers.forEach((container: any) => {
      if (container.type === "writing_task") {
        container.Container_Questions?.forEach((cq: any) => {
          if (writingFeedbacks[cq.container_question_id]) count++;
        });
      }
    });
    return count;
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Không thể tải đề thi
          </h3>
          <button
            onClick={() => navigate(`/exams/${id}`)}
            className="text-blue-600 hover:underline"
          >
            Quay lại chi tiết đề thi
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
    <div className="min-h-screen bg-slate-50">
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
                <h1 className="text-lg font-semibold text-slate-900">
                  {exam.exam_title}
                </h1>
                <p className="text-xs text-slate-500">
                  Câu {currentQuestionNumber} / {totalQuestions}
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
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title={isAudioPlaying ? "Tạm dừng âm thanh" : "Phát âm thanh"}
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
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                title="Tổng quan câu hỏi"
              >
                <LayoutGrid className="w-5 h-5 text-slate-600" />
              </button>

              {/* Save */}
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Đang lưu..." : "Lưu"}
              </button>

              {/* Submit */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Nộp bài
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
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              {currentContainer && (
                <>
                  {/* Container Header */}
                  <div className="mb-4 pb-3 border-b">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded uppercase">
                      {currentContainer.skill || "Section"}
                    </span>
                    {currentContainer.instruction && (
                      <p className="text-base font-medium text-slate-700 mt-2">
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
                        className="w-full rounded-lg border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Question Image - Enlarged */}
                  {currentQuestion && currentQuestion.image_url && (
                    <div className="mb-5">
                      <p className="text-sm font-medium text-slate-600 mb-2">
                        Hình ảnh câu {currentQuestionNumber}:
                      </p>
                      <img
                        src={currentQuestion.image_url}
                        alt="Question"
                        className="w-full rounded-lg border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Content/Paragraph */}
                  {currentContainer.content && (
                    <div className="prose prose-base max-w-none">
                      <div className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap">
                        {currentContainer.content}
                      </div>
                    </div>
                  )}

                  {/* Empty state if no content */}
                  {!currentContainer.image_url &&
                    !currentContainer.content &&
                    !currentQuestion?.image_url && (
                      <div className="text-center py-12 text-slate-400">
                        <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Không có nội dung hình ảnh</p>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Question & Answers */}
          <div>
            {/* ── WRITING TASK ─────────────────────────── */}
            {currentContainer?.type === "writing_task" &&
              currentQuestion &&
              (() => {
                const cqId = currentQuestion.container_question_id;
                const text = writingTexts[cqId] || "";
                const wordCount = text
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length;
                const feedback = writingFeedbacks[cqId];
                const isSubmitting = writingSubmitting[cqId];

                return (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5">
                    {/* Task instruction */}
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-green-700 uppercase mb-1">
                          Writing Task
                        </p>
                        <p className="text-base font-medium text-slate-900 leading-relaxed">
                          {currentQuestion.Question.question_content}
                        </p>
                      </div>
                    </div>

                    {/* Textarea */}
                    {!feedback ? (
                      <>
                        <textarea
                          className="w-full h-64 border border-slate-300 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                          placeholder="Viết bài của bạn ở đây..."
                          value={text}
                          onChange={(e) =>
                            setWritingTexts((prev) => ({
                              ...prev,
                              [cqId]: e.target.value,
                            }))
                          }
                          disabled={isSubmitting}
                        />
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium ${wordCount < 50 ? "text-red-500" : "text-slate-500"}`}
                          >
                            {wordCount} từ
                          </span>
                          <button
                            onClick={() => handleWritingSubmit(cqId)}
                            disabled={isSubmitting || wordCount < 5}
                            className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang chấm...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Nộp & Chấm điểm
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Feedback display */
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-green-800">
                              Đã chấm điểm
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                              Band {feedback.submission?.final_score ?? "N/A"}
                            </p>
                          </div>
                        </div>

                        {feedback.feedback?.criteria_scores && (
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(
                              feedback.feedback.criteria_scores,
                            ).map(([k, v]: [string, any]) => (
                              <div
                                key={k}
                                className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                              >
                                <p className="text-xs text-slate-500 capitalize mb-1">
                                  {k.replace(/_/g, " ")}
                                </p>
                                <p className="text-lg font-bold text-slate-800">
                                  {v}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {feedback.feedback?.comments?.feedback
                          ?.overall_comment && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm font-semibold text-blue-800 mb-2">
                              Nhận xét chung
                            </p>
                            <p className="text-sm text-blue-900 leading-relaxed">
                              {
                                feedback.feedback.comments.feedback
                                  .overall_comment
                              }
                            </p>
                          </div>
                        )}

                        {feedback.feedback?.comments?.feedback?.improvements
                          ?.length > 0 && (
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <p className="text-sm font-semibold text-amber-800 mb-2">
                              Cần cải thiện
                            </p>
                            <ul className="space-y-1">
                              {feedback.feedback.comments.feedback.improvements.map(
                                (imp: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-amber-900 flex items-start gap-2"
                                  >
                                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    {imp}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={
                          currentContainerIndex === 0 &&
                          currentQuestionIndex === 0
                        }
                        className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 flex items-center gap-2 text-sm font-medium text-slate-700"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        disabled={
                          currentContainerIndex ===
                            getFlattenedContainers().length - 1 &&
                          currentQuestionIndex ===
                            (currentContainer?.Container_Questions?.length ||
                              0) -
                              1
                        }
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center gap-2 text-sm font-medium"
                      >
                        Tiếp
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}

            {/* ── SPEAKING PART ────────────────────────── */}
            {currentContainer?.type === "speaking_part" && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-purple-700 uppercase mb-1">
                      Speaking Part
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      {currentContainer.instruction ||
                        currentContainer.content ||
                        "IELTS Speaking"}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-900 leading-relaxed mb-4">
                    Phần Speaking sẽ diễn ra dưới dạng đối thoại 1-1 với AI
                    Examiner. Sau khi kết thúc, AI sẽ đánh giá dựa trên
                    transcript ghi lại.
                  </p>
                  <button
                    onClick={() =>
                      navigate(
                        `/speaking-exam/${id}/${userExamId}/${currentContainer.container_id}`,
                      )
                    }
                    className="w-full px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    Vào phòng Speaking
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentContainerIndex === 0}
                    className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 flex items-center gap-2 text-sm font-medium text-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={
                      currentContainerIndex ===
                      getFlattenedContainers().length - 1
                    }
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center gap-2 text-sm font-medium"
                  >
                    Tiếp
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── MCQ (default) ────────────────────────── */}
            {currentContainer?.type !== "writing_task" &&
              currentContainer?.type !== "speaking_part" &&
              currentQuestion && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  {/* Question */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {currentQuestionNumber}
                      </span>
                      <h3 className="flex-1 text-lg font-medium text-slate-900 leading-relaxed">
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
                              : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="text-slate-800 text-base">
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
                        currentContainerIndex === 0 &&
                        currentQuestionIndex === 0
                      }
                      className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Trước
                    </button>

                    <div className="text-sm text-slate-500 font-medium">
                      {Math.round((answeredQuestions / totalQuestions) * 100)}%
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      disabled={
                        currentContainerIndex ===
                          getFlattenedContainers().length - 1 &&
                        currentQuestionIndex ===
                          (currentContainer?.Container_Questions?.length || 0) -
                            1
                      }
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                    >
                      Tiếp
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
              <h3 className="text-xl font-bold text-slate-900">
                Tổng quan câu hỏi
              </h3>
              <button
                onClick={() => setShowOverviewModal(false)}
                className="text-slate-400 hover:text-slate-600"
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
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">
                        {container.instruction || `Phần ${containerIdx + 1}`} -{" "}
                        {container.skill?.toUpperCase()}
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
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                                title={`Câu ${globalNum}${isAnswered ? " (Đã trả lời)" : ""}`}
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
                <span className="text-sm text-slate-600">Hiện tại</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-lg"></div>
                <span className="text-sm text-slate-600">Đã trả lời</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-lg"></div>
                <span className="text-sm text-slate-600">Chưa trả lời</span>
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
              <h3 className="text-xl font-bold text-slate-900">
                Xác nhận nộp bài?
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Bạn có chắc muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời
                sau khi nộp.
              </p>
              <div className="space-y-2 bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tổng số câu:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Đã trả lời:</span>
                  <span className="font-semibold text-green-600">
                    {answeredQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Chưa trả lời:</span>
                  <span className="font-semibold text-red-600">
                    {totalQuestions - answeredQuestions}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Nộp bài thi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTaking;
