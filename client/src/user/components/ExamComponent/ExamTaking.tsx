import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import SpeakingExam from "./SpeakingExam";

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
  const location = useLocation();
  const {
    getExamForTaking,
    startExam,
    saveAnswers,
    submitExam,
    getOngoingExam,
    submitAllWriting,
    evaluateAllSpeaking,
  } = useExam();
  const { showToast } = useToast();

  const [exam, setExam] = useState<any>(null);
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  // Writing: text per container_question_id
  const [writingTexts, setWritingTexts] = useState<Record<number, string>>({});
  const [writingResults, setWritingResults] = useState<any>(null);
  const [isSubmittingAllWriting, setIsSubmittingAllWriting] = useState(false);
  const [showWritingSubmitModal, setShowWritingSubmitModal] = useState(false);
  const [showWritingResultsModal, setShowWritingResultsModal] = useState(false);
  const [currentContainerIndex, setCurrentContainerIndex] = useState<number>(
    (location.state as any)?.containerIndex ?? 0,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedSpeakingCqIds, setCompletedSpeakingCqIds] = useState<
    Set<number>
  >(new Set());
  const [activeSpeakingContainer, setActiveSpeakingContainer] =
    useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        let resumedStartedAt: string | null = null;

        if (ongoingResult.success && ongoingResult.data) {
          // Resume ongoing exam
          examId = ongoingResult.data.user_exam_id;
          resumedStartedAt = ongoingResult.data.started_at;
          setUserExamId(examId);

          // Load saved MCQ answers
          const savedAnswers: Record<number, number | null> = {};
          ongoingResult.data.saved_answers.forEach((ans: any) => {
            savedAnswers[ans.container_question_id] = ans.question_option_id;
          });
          setAnswers(savedAnswers);

          // Restore writing texts
          if (ongoingResult.data.writing_texts?.length) {
            const savedWritingTexts: Record<number, string> = {};
            ongoingResult.data.writing_texts.forEach((wt: any) => {
              savedWritingTexts[wt.container_question_id] = wt.content || "";
            });
            setWritingTexts(savedWritingTexts);
          }

          // Restore writing drafts saved in sessionStorage (unsubmitted text)
          const draftKey = `writingDraft_${ongoingResult.data.user_exam_id}`;
          const draft = sessionStorage.getItem(draftKey);
          if (draft) {
            try {
              const parsed: Record<number, string> = JSON.parse(draft);
              setWritingTexts((prev) => ({ ...parsed, ...prev }));
            } catch {}
          }

          // Restore completed speaking parts
          if (ongoingResult.data.completed_speaking_cq_ids?.length) {
            setCompletedSpeakingCqIds(
              new Set<number>(ongoingResult.data.completed_speaking_cq_ids),
            );
          }

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
          const customDuration = (location.state as any)?.customDuration as
            | number
            | undefined;
          const totalSeconds = (customDuration ?? examData.exam_duration) * 60;
          if (resumedStartedAt) {
            const elapsed = Math.floor(
              (Date.now() - new Date(resumedStartedAt).getTime()) / 1000,
            );
            setTimeRemaining(Math.max(0, totalSeconds - elapsed));
          } else {
            setTimeRemaining(totalSeconds);
          }
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

  const handleSubmitAllWriting = async () => {
    if (!userExamId) return;
    const allWritingTasks = getFlattenedContainers()
      .filter((c: any) => c.type === "writing_task")
      .flatMap((c: any) => c.Container_Questions || []);
    const tasks = allWritingTasks
      .map((cq: any) => ({
        container_question_id: cq.container_question_id,
        content: writingTexts[cq.container_question_id] || "",
      }))
      .filter(
        (t: any) => t.content.trim().split(/\s+/).filter(Boolean).length >= 5,
      );
    if (tasks.length === 0) {
      showToast(
        "error",
        "Vui lòng viết ít nhất một bài (tối thiểu 5 từ) trước khi nộp.",
      );
      return;
    }
    setShowWritingSubmitModal(false);
    setIsSubmittingAllWriting(true);
    const result = await submitAllWriting(userExamId, tasks);
    setIsSubmittingAllWriting(false);
    if (result.success) {
      setWritingResults(result.data);
      setShowWritingResultsModal(true);
      showToast("success", `Writing Band: ${result.data?.final_band ?? "N/A"}`);
    } else {
      showToast("error", result.message || "Không thể nộp bài writing");
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
    setIsSubmitting(true);
    try {
      // 1. Save MCQ answers
      await handleSave(false);

      // 2. Auto-submit writing tasks if present and not yet submitted
      const writingContainers = getFlattenedContainers().filter(
        (c: any) => c.type === "writing_task",
      );
      if (writingContainers.length > 0 && !writingResults) {
        const tasks = writingContainers
          .flatMap((c: any) => c.Container_Questions || [])
          .map((cq: any) => ({
            container_question_id: cq.container_question_id,
            content: writingTexts[cq.container_question_id] || "",
          }))
          .filter(
            (t: any) =>
              t.content.trim().split(/\s+/).filter(Boolean).length >= 5,
          );
        if (tasks.length > 0) {
          setIsSubmittingAllWriting(true);
          const wResult = await submitAllWriting(userExamId, tasks);
          setIsSubmittingAllWriting(false);
          if (wResult.success) setWritingResults(wResult.data);
        }
      }

      // 2.5. Evaluate all speaking parts (AI scoring)
      const speakingContainers = getFlattenedContainers().filter(
        (c: any) => c.type === "speaking_part",
      );
      if (speakingContainers.length > 0) {
        await evaluateAllSpeaking(userExamId);
      }

      // 3. Submit exam (MCQ scoring)
      const result = await submitExam(userExamId);
      if (result.success) {
        showToast("success", "Đã nộp bài thi thành công!");
        navigate(`/exams/result/${userExamId}`);
      } else {
        showToast("error", result.message || "Không thể nộp bài thi");
      }
    } finally {
      setIsSubmitting(false);
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

    const sortedParents = [...exam.Exam_Containers].sort(
      (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
    );

    const flattened: any[] = [];
    sortedParents.forEach((container: any) => {
      // For parent containers with children, add children only
      if (container.children && container.children.length > 0) {
        const sortedChildren = [...container.children].sort(
          (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
        );
        flattened.push(...sortedChildren);
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
    // Count writing tasks where user has typed >= 5 words
    containers.forEach((container: any) => {
      if (container.type === "writing_task") {
        container.Container_Questions?.forEach((cq: any) => {
          const wc = (writingTexts[cq.container_question_id] || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;
          if (wc >= 5) count++;
        });
      }
      // Count speaking parts that have been completed
      if (container.type === "speaking_part") {
        const firstCqId =
          container.Container_Questions?.[0]?.container_question_id;
        if (firstCqId && completedSpeakingCqIds.has(firstCqId)) count++;
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

              {/* Nộp Writing button - shown when exam has writing tasks */}
              {(() => {
                const hasWritingTasks = getFlattenedContainers().some(
                  (c: any) => c.type === "writing_task",
                );
                if (!hasWritingTasks) return null;
                if (writingResults) {
                  return (
                    <button
                      onClick={() => setShowWritingResultsModal(true)}
                      className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg border border-green-300 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Writing Band {writingResults.final_band}
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => setShowWritingSubmitModal(true)}
                    disabled={isSubmittingAllWriting}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmittingAllWriting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang chấm...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Nộp Writing
                      </>
                    )}
                  </button>
                );
              })()}

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
                const taskResult = writingResults?.tasks?.find(
                  (t: any) => t.container_question_id === cqId,
                );

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

                    {/* Textarea - always visible; read-only after grading */}
                    <textarea
                      placeholder="Viết bài của bạn ở đây... Sau khi viết xong các task, nhấn 'Nộp Writing' ở trên để nộp."
                      value={text}
                      onChange={(e) => {
                        if (!writingResults) {
                          setWritingTexts((prev) => ({
                            ...prev,
                            [cqId]: e.target.value,
                          }));
                        }
                      }}
                      readOnly={!!writingResults}
                      className={`w-full h-64 border rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 resize-y ${
                        writingResults
                          ? "border-slate-200 bg-slate-50 text-slate-600 cursor-default"
                          : "border-slate-300 focus:ring-green-500"
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${wordCount < 50 ? "text-red-500" : "text-slate-500"}`}
                      >
                        {wordCount} từ
                      </span>
                      {!writingResults && (
                        <p className="text-xs text-slate-400 italic">
                          Dùng nút &ldquo;Nộp Writing&rdquo; ở thanh trên để nộp
                        </p>
                      )}
                    </div>

                    {/* Rich Feedback — shown after all-tasks grading */}
                    {taskResult?.feedback && (
                      <div className="space-y-4">
                        {/* Band score banner */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                Đã chấm điểm
                              </p>
                              <p className="text-3xl font-black text-green-800">
                                Band{" "}
                                {taskResult.submission?.final_score ?? "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Số từ</p>
                            <p className="text-lg font-bold text-slate-700">
                              {taskResult.submission?.word_count ?? wordCount}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                              {taskResult.task_type ?? ""}
                            </p>
                          </div>
                        </div>

                        {/* Word count warning */}
                        {taskResult.feedback.comments?.word_count_note && (
                          <div className="flex items-start gap-2 px-4 py-3 bg-orange-50 rounded-lg border border-orange-200">
                            <span className="text-orange-500 text-sm mt-0.5">
                              ⚠
                            </span>
                            <p className="text-sm text-orange-800">
                              {taskResult.feedback.comments.word_count_note}
                            </p>
                          </div>
                        )}

                        {/* Criteria scores + per-criterion comment */}
                        {taskResult.feedback.criteria_scores && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Phân tích tiêu chí
                            </p>
                            {Object.entries(
                              taskResult.feedback.criteria_scores,
                            ).map(([k, v]: [string, any]) => {
                              const comment =
                                taskResult.feedback.criteria_comments?.[k];
                              const score = Number(v);
                              const pct = Math.round((score / 9) * 100);
                              const barColor =
                                score >= 7
                                  ? "bg-green-500"
                                  : score >= 5.5
                                    ? "bg-blue-500"
                                    : score >= 4
                                      ? "bg-amber-500"
                                      : "bg-red-500";
                              const textColor =
                                score >= 7
                                  ? "text-green-700"
                                  : score >= 5.5
                                    ? "text-blue-700"
                                    : score >= 4
                                      ? "text-amber-700"
                                      : "text-red-700";
                              return (
                                <div
                                  key={k}
                                  className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-xs font-semibold text-slate-600 capitalize">
                                      {k.replace(/_/g, " ")}
                                    </p>
                                    <span
                                      className={`text-sm font-bold ${textColor}`}
                                    >
                                      {v}
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                                    <div
                                      className={`h-full rounded-full transition-all ${barColor}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  {comment && (
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                      {comment}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Overall comment */}
                        {taskResult.feedback.comments?.feedback
                          ?.overall_comment && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                              Nhận xét tổng quát
                            </p>
                            <p className="text-sm text-blue-900 leading-relaxed">
                              {
                                taskResult.feedback.comments.feedback
                                  .overall_comment
                              }
                            </p>
                          </div>
                        )}

                        {/* Strengths */}
                        {(taskResult.feedback.comments?.feedback?.strengths
                          ?.length ?? 0) > 0 && (
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                              ✓ Điểm mạnh
                            </p>
                            <ul className="space-y-1.5">
                              {taskResult.feedback.comments.feedback.strengths.map(
                                (s: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-green-900 flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {s}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Improvements */}
                        {(taskResult.feedback.comments?.feedback?.improvements
                          ?.length ?? 0) > 0 && (
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                              ✗ Cần cải thiện
                            </p>
                            <ul className="space-y-1.5">
                              {taskResult.feedback.comments.feedback.improvements.map(
                                (imp: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-amber-900 flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    {imp}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Tips */}
                        {(taskResult.feedback.comments?.feedback?.tips
                          ?.length ?? 0) > 0 && (
                          <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                            <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wide mb-2">
                              💡 Gợi ý cải thiện
                            </p>
                            <ul className="space-y-1.5">
                              {taskResult.feedback.comments.feedback.tips.map(
                                (tip: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-cyan-900 flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                    {tip}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Sample improvements */}
                        {(taskResult.feedback.comments?.sample_improvements
                          ?.length ?? 0) > 0 && (
                          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-3">
                              ✏ Câu được sửa mẫu
                            </p>
                            <div className="space-y-3">
                              {taskResult.feedback.comments.sample_improvements.map(
                                (ex: string, i: number) => {
                                  const parts = ex
                                    .split(/→|->/)
                                    .map((p: string) => p.trim());
                                  return parts.length === 2 ? (
                                    <div key={i} className="space-y-1.5">
                                      <p className="text-xs text-purple-600 font-medium">
                                        Câu gốc:
                                      </p>
                                      <p className="text-sm text-purple-900 bg-purple-100 rounded-lg px-3 py-2 line-through opacity-70">
                                        {parts[0].replace(/^Original:\s*/i, "")}
                                      </p>
                                      <p className="text-xs text-purple-600 font-medium">
                                        Câu tốt hơn:
                                      </p>
                                      <p className="text-sm text-purple-900 bg-white rounded-lg px-3 py-2 border border-purple-300">
                                        {parts[1].replace(/^Improved:\s*/i, "")}
                                      </p>
                                    </div>
                                  ) : (
                                    <p
                                      key={i}
                                      className="text-sm text-purple-900"
                                    >
                                      {ex}
                                    </p>
                                  );
                                },
                              )}
                            </div>
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
            {currentContainer?.type === "speaking_part" &&
              (() => {
                const firstCqId =
                  currentContainer.Container_Questions?.[0]
                    ?.container_question_id;
                const isDone =
                  firstCqId != null && completedSpeakingCqIds.has(firstCqId);
                return (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-purple-700 uppercase">
                            Speaking Part
                          </p>
                          {isDone && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Đã hoàn thành
                            </span>
                          )}
                        </div>
                        <p className="text-base font-medium text-slate-900">
                          {currentContainer.instruction ||
                            currentContainer.content ||
                            "IELTS Speaking"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-lg p-4 border ${isDone ? "bg-green-50 border-green-200" : "bg-purple-50 border-purple-200"}`}
                    >
                      {isDone ? (
                        <p className="text-sm text-green-800 leading-relaxed mb-4">
                          Bạn đã hoàn thành phần Speaking này. AI sẽ đánh giá
                          khi nộp bài. Bạn có thể vào lại để ghi âm lại nếu
                          muốn.
                        </p>
                      ) : (
                        <p className="text-sm text-purple-900 leading-relaxed mb-4">
                          Phần Speaking sẽ diễn ra dưới dạng đối thoại 1-1 với
                          AI Examiner. Sau khi kết thúc, AI sẽ đánh giá dựa trên
                          transcript ghi lại.
                        </p>
                      )}
                      <button
                        onClick={async () => {
                          await handleSave(false);
                          setActiveSpeakingContainer(currentContainer);
                        }}
                        className={`w-full px-5 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          isDone
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        {isDone
                          ? "Vào lại phòng Speaking"
                          : "Vào phòng Speaking"}
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
                );
              })()}

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

                  // Speaking part: show as a single status tile
                  if (container.type === "speaking_part") {
                    const firstCqId =
                      containerQuestions[0]?.container_question_id;
                    const isDone =
                      firstCqId != null &&
                      completedSpeakingCqIds.has(firstCqId);
                    const isCurrent = containerIdx === currentContainerIndex;
                    return (
                      <div key={container.container_id}>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">
                          {container.instruction || `Phần ${containerIdx + 1}`}{" "}
                          - SPEAKING
                        </h4>
                        <button
                          onClick={() => {
                            goToQuestion(containerIdx, 0);
                            setShowOverviewModal(false);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                            isCurrent
                              ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                              : isDone
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                        >
                          <Mic className="w-4 h-4" />
                          {isDone ? "Đã hoàn thành" : "Chưa làm"}
                        </button>
                      </div>
                    );
                  }

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
                              container.type === "writing_task"
                                ? (
                                    writingTexts[
                                      question.container_question_id
                                    ] || ""
                                  )
                                    .trim()
                                    .split(/\s+/)
                                    .filter(Boolean).length >= 5
                                : answers[question.container_question_id] !==
                                    null &&
                                  answers[question.container_question_id] !==
                                    undefined;
                            const isCurrent =
                              containerIdx === currentContainerIndex &&
                              questionIdx === currentQuestionIndex;

                            // Calculate global question number
                            let globalNum = 0;
                            for (let i = 0; i < containerIdx; i++) {
                              const c = getFlattenedContainers()[i];
                              if (c.type !== "speaking_part") {
                                globalNum += c.Container_Questions?.length || 0;
                              }
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
            <div className="flex items-center gap-6 mt-6 pt-6 border-t flex-wrap">
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 border border-purple-200 rounded-lg"></div>
                <span className="text-sm text-slate-600">
                  Speaking chưa làm
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Submit Confirmation Modal */}
      {showWritingSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Nộp tất cả bài Writing?
              </h3>
              <button
                onClick={() => setShowWritingSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-slate-600 text-sm">
                AI sẽ chấm điểm từng task và tính band tổng. Bạn không thể chỉnh
                sửa sau khi nộp.
              </p>
              <div className="space-y-2">
                {getFlattenedContainers()
                  .filter((c: any) => c.type === "writing_task")
                  .flatMap((c: any) => c.Container_Questions || [])
                  .map((cq: any) => {
                    const wc = (writingTexts[cq.container_question_id] || "")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean).length;
                    return (
                      <div
                        key={cq.container_question_id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                          wc >= 5
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <span className="text-slate-700 truncate max-w-[260px]">
                          {cq.Question?.question_content?.slice(0, 60) ||
                            `Task ${cq.container_question_id}`}
                          ...
                        </span>
                        <span
                          className={`ml-3 font-semibold flex-shrink-0 ${wc >= 5 ? "text-green-700" : "text-red-600"}`}
                        >
                          {wc} từ{wc < 5 ? " ⚠" : ""}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWritingSubmitModal(false)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitAllWriting}
                disabled={isSubmittingAllWriting}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingAllWriting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang chấm...
                  </>
                ) : (
                  "Nộp & Chấm điểm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Writing Results Summary Modal */}
      {showWritingResultsModal && writingResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Kết quả Writing
              </h3>
              <button
                onClick={() => setShowWritingResultsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Final band */}
            <div className="flex items-center justify-center p-6 mb-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-center">
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">
                  Writing Band Score
                </p>
                <p className="text-6xl font-black text-green-800">
                  {writingResults.final_band ?? "N/A"}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Đã chấm {writingResults.graded_count}/
                  {writingResults.total_count} task
                </p>
              </div>
            </div>

            {/* Per-task summary */}
            <div className="space-y-3">
              {(writingResults.tasks || []).map((t: any) => (
                <div
                  key={t.container_question_id}
                  className={`p-4 rounded-xl border ${
                    t.feedback
                      ? "bg-slate-50 border-slate-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {t.task_type === "task1" ? "Task 1" : "Task 2"}
                    </span>
                    {t.feedback ? (
                      <span className="text-lg font-black text-green-700">
                        Band {t.submission?.final_score ?? "N/A"}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Không chấm được
                      </span>
                    )}
                  </div>
                  {t.feedback?.comments?.feedback?.overall_comment && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {t.feedback.comments.feedback.overall_comment}
                    </p>
                  )}
                  {!t.feedback && t.message && (
                    <p className="text-xs text-red-600">{t.message}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowWritingResultsModal(false)}
              className="mt-6 w-full px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium"
            >
              Đóng
            </button>
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
                disabled={isSubmitting || isSubmittingAllWriting}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmittingAllWriting}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting || isSubmittingAllWriting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isSubmittingAllWriting
                      ? "Đang chấm writing..."
                      : "Đang nộp bài..."}
                  </>
                ) : (
                  "Nộp bài thi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Speaking Exam Overlay */}
      {activeSpeakingContainer && userExamId && (
        <SpeakingExam
          overrideExamId={parseInt(id!)}
          overrideUserExamId={userExamId}
          overrideContainerId={activeSpeakingContainer.container_id}
          timeLimitMinutes={activeSpeakingContainer.time_limit ?? undefined}
          onClose={(sessionCompleted) => {
            if (sessionCompleted) {
              const firstCqId =
                activeSpeakingContainer?.Container_Questions?.[0]
                  ?.container_question_id;
              if (firstCqId != null) {
                setCompletedSpeakingCqIds(
                  (prev) => new Set([...prev, firstCqId as number]),
                );
              }
              const containers = getFlattenedContainers();
              if (currentContainerIndex < containers.length - 1) {
                setCurrentContainerIndex((ci) => ci + 1);
              }
            }
            setActiveSpeakingContainer(null);
          }}
        />
      )}
    </div>
  );
};

export default ExamTaking;
