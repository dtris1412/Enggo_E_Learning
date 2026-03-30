import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useExam } from "../../contexts/examContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  Mic,
  MicOff,
  Send,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";

// ── Browser Speech API type declarations ─────────────────────────────────────
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

interface Message {
  role: "ai" | "user";
  content: string;
}

interface SpeakingExamOverlayProps {
  /** When provided, component runs as a fixed overlay inside ExamTaking */
  overrideExamId?: number;
  overrideUserExamId?: number;
  overrideContainerId?: number;
  /** Container's time_limit in minutes. Shows a countdown and auto-ends session when reached. */
  timeLimitMinutes?: number;
  /** Called when the user exits (false = pressed back, true = completed & continued) */
  onClose?: (sessionCompleted: boolean) => void;
}

const SpeakingExam: React.FC<SpeakingExamOverlayProps> = ({
  overrideExamId,
  overrideUserExamId,
  overrideContainerId,
  timeLimitMinutes,
  onClose,
}) => {
  const { examId, userExamId, containerId } = useParams<{
    examId: string;
    userExamId: string;
    containerId: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const containerIndex: number = (location.state as any)?.containerIndex ?? 0;

  // Resolve IDs — prefer override props (overlay mode) over route params
  const resolvedExamId = overrideExamId ?? parseInt(examId!);
  const resolvedUserExamId = overrideUserExamId ?? parseInt(userExamId!);
  const resolvedContainerId = overrideContainerId ?? parseInt(containerId!);
  const { speakingTurn, submitSpeaking } = useExam();
  const { showToast } = useToast();

  // ── Conversation state ───────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [showTextFallback, setShowTextFallback] = useState(false);

  // ── Voice input (STT) ────────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [voiceSupported] = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef("");

  // ── Voice output (TTS) ───────────────────────────────────────────────────
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const ttsEnabledRef = useRef(true); // stable ref for callbacks

  // ── Container timer (overlay mode with timeLimitMinutes) ─────────────────
  const [speakingTimeLeft, setSpeakingTimeLeft] = useState<number | null>(
    timeLimitMinutes ? timeLimitMinutes * 60 : null,
  );
  const handleEndSessionRef = useRef<(() => void) | null>(null);

  const formatSpeakingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  // keep ttsEnabledRef in sync
  useEffect(() => {
    ttsEnabledRef.current = ttsEnabled;
  }, [ttsEnabled]);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, interimText]);

  // ── TTS helper ──────────────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!ttsEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Prefer a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("female")),
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeakingAI(true);
    utterance.onend = () => setIsSpeakingAI(false);
    utterance.onerror = () => setIsSpeakingAI(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeakingAI(false);
  };

  // ── Send message to AI ──────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || sessionEnded) return;

      const trimmed = text.trim();
      setTextInput("");
      setInterimText("");
      finalTranscriptRef.current = "";

      const updatedMessages: Message[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(updatedMessages);
      setIsLoading(true);
      stopSpeaking();

      const result = await speakingTurn(
        resolvedUserExamId,
        resolvedContainerId,
        updatedMessages,
      );

      setIsLoading(false);

      if (result.success) {
        const aiReply = result.data.reply as string;
        setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
        if (result.data.is_finished) setSessionEnded(true);
        speakText(aiReply);
      } else {
        showToast("error", result.message || "Lỗi kết nối AI");
      }
    },
    [
      messages,
      isLoading,
      sessionEnded,
      userExamId,
      containerId,
      speakingTurn,
      speakText,
      showToast,
    ],
  );

  // ── Speech Recognition ──────────────────────────────────────────────────
  const buildRecognition = useCallback((): SpeechRecognitionInstance | null => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return null;

    const rec = new SpeechRecognitionCtor();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      finalTranscriptRef.current = "";
      setIsRecording(true);
      setInterimText("");
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = finalTranscriptRef.current;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          final += r[0].transcript + " ";
        } else {
          interim += r[0].transcript;
        }
      }
      finalTranscriptRef.current = final;
      setInterimText(interim || final);
    };

    rec.onerror = () => {
      setIsRecording(false);
      setInterimText("");
    };

    rec.onend = () => {
      setIsRecording(false);
      const captured = finalTranscriptRef.current.trim();
      if (captured) {
        sendMessage(captured);
      }
      setInterimText("");
    };

    return rec;
  }, [sendMessage]);

  const toggleRecording = () => {
    if (isLoading || sessionEnded) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    // Stop AI speaking before user talks
    stopSpeaking();

    const rec = buildRecognition();
    if (!rec) {
      showToast(
        "error",
        "Trình duyệt không hỗ trợ nhận giọng nói. Hãy dùng Chrome/Edge.",
      );
      setShowTextFallback(true);
      return;
    }
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      showToast("error", "Không thể bật microphone. Kiểm tra quyền truy cập.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Start conversation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!resolvedUserExamId || !resolvedContainerId) return;

    const init = async () => {
      setIsLoading(true);
      const result = await speakingTurn(
        resolvedUserExamId,
        resolvedContainerId,
        [],
      );
      setIsLoading(false);
      if (result.success) {
        const reply = result.data.reply as string;
        setMessages([{ role: "ai", content: reply }]);
        if (result.data.is_finished) setSessionEnded(true);
        // Small delay so voices have time to load
        setTimeout(() => speakText(reply), 600);
      } else {
        showToast(
          "error",
          result.message || "Không thể kết nối với AI Examiner",
        );
      }
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save transcript (no AI yet — AI evaluates on final submit) ───────────
  const handleEndSession = async () => {
    if (messages.length < 2) {
      showToast("error", "Cần có ít nhất 1 lượt trả lời để lưu.");
      return;
    }
    stopSpeaking();
    recognitionRef.current?.abort();

    setIsLoading(true);
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    const result = await submitSpeaking(
      resolvedUserExamId,
      resolvedContainerId,
      messages,
      durationSeconds,
    );
    setIsLoading(false);

    if (result.success) {
      setSessionEnded(true);
      showToast("success", "Đã lưu! AI sẽ đánh giá khi bạn nộp bài.");
    } else {
      showToast("error", result.message || "Không thể lưu phần speaking");
    }
  };

  // Keep ref up-to-date so timer effect can call it safely
  useEffect(() => {
    handleEndSessionRef.current = handleEndSession;
  });

  // ── Container countdown timer (overlay mode) ────────────────────────────
  useEffect(() => {
    if (speakingTimeLeft === null || speakingTimeLeft <= 0 || sessionEnded)
      return;
    const t = setInterval(() => {
      setSpeakingTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [sessionEnded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-end when container time runs out
  useEffect(() => {
    if (speakingTimeLeft === 0 && !sessionEnded && timeLimitMinutes) {
      handleEndSessionRef.current?.();
    }
  }, [speakingTimeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Text fallback send ──────────────────────────────────────────────────
  const handleTextSend = () => sendMessage(textInput);
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col${
        onClose ? " fixed inset-0 z-[60]" : " min-h-screen"
      }`}
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur border-b border-white/10 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                stopSpeaking();
                if (onClose) {
                  onClose(false);
                } else {
                  navigate(-1);
                }
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isSpeakingAI ? "bg-purple-400 animate-pulse" : isRecording ? "bg-red-400 animate-pulse" : "bg-green-400"}`}
              />
              <div>
                <h1 className="text-base font-semibold text-white">
                  IELTS Speaking — AI Examiner
                </h1>
                <p className="text-xs text-white/50">
                  {isSpeakingAI
                    ? "AI đang nói..."
                    : isRecording
                      ? "Đang nghe..."
                      : sessionEnded
                        ? "Phiên đã kết thúc"
                        : "Đang thi"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Container timer (overlay mode) */}
            {speakingTimeLeft !== null && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold ${
                  speakingTimeLeft < 120
                    ? "bg-red-600/40 text-red-300"
                    : "bg-white/10 text-white/70"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {formatSpeakingTime(speakingTimeLeft)}
              </div>
            )}
            {/* TTS toggle */}
            <button
              onClick={() => {
                setTtsEnabled((v) => !v);
                if (isSpeakingAI) stopSpeaking();
              }}
              className={`p-2 rounded-lg transition-colors ${ttsEnabled ? "bg-purple-600/50 text-purple-200" : "bg-white/10 text-white/40"}`}
              title={ttsEnabled ? "Tắt giọng AI" : "Bật giọng AI"}
            >
              {ttsEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {!sessionEnded && (
              <button
                onClick={handleEndSession}
                disabled={isLoading || messages.length < 2}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Kết thúc Part này
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-2xl flex flex-col gap-4">
        {/* ── Saved Confirmation ────────────────────────────────────── */}
        {sessionEnded && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">
              Transcript đã được lưu!
            </h2>
            <p className="text-sm text-slate-500">
              AI sẽ phân tích và đánh giá band điểm cho Speaking khi bạn nộp bài
              thi.
            </p>

            <button
              onClick={() => {
                if (onClose) {
                  onClose(true);
                } else {
                  navigate(`/exams/${resolvedExamId}/take`, {
                    state: { containerIndex: containerIndex + 1 },
                  });
                }
              }}
              className="w-full px-4 py-3 bg-purple-700 text-white font-semibold rounded-xl hover:bg-purple-800 transition-colors"
            >
              Tiếp tục bài thi
            </button>
          </div>
        )}

        {/* ── Chat Messages ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto space-y-4 px-1 max-h-[45vh] min-h-[220px]">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-16 text-white/30">
              <Mic className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Đang kết nối với AI Examiner...</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  msg.role === "ai" ? "bg-purple-600" : "bg-blue-500"
                }`}
              >
                {msg.role === "ai" ? "AI" : <User className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "ai"
                    ? "bg-white/10 text-white rounded-bl-sm"
                    : "bg-blue-500 text-white rounded-br-sm"
                }`}
              >
                {msg.content}
              </div>
              {/* Replay TTS button for AI messages */}
              {msg.role === "ai" && ttsEnabled && (
                <button
                  onClick={() => speakText(msg.content)}
                  className="flex-shrink-0 p-1 text-white/30 hover:text-white/70 transition-colors"
                  title="Nghe lại"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* AI loading bubble */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div className="bg-white/10 rounded-2xl rounded-bl-sm px-5 py-3 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* Interim transcript preview */}
          {interimText && (
            <div className="flex items-end gap-2 flex-row-reverse opacity-60">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[78%] rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white bg-blue-500/40 italic border border-blue-400/30">
                {interimText}
                <span className="ml-1 animate-pulse">|</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── AI Speaking Wave ────────────────────────────────────────── */}
        {isSpeakingAI && (
          <div className="flex items-center justify-center gap-1 py-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite]"
                style={{
                  height: `${8 + Math.sin(i * 0.8) * 10 + 8}px`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
            <span className="ml-2 text-xs text-purple-300">AI đang nói...</span>
          </div>
        )}

        {/* ── Voice Input Controls ────────────────────────────────────── */}
        {!sessionEnded && (
          <div className="flex flex-col items-center gap-4 py-2">
            {/* Big mic button */}
            <button
              onClick={toggleRecording}
              disabled={isLoading || isSpeakingAI}
              className={`
                relative w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-200 shadow-lg disabled:opacity-40
                ${
                  isRecording
                    ? "bg-red-500 scale-110 shadow-red-500/50"
                    : "bg-purple-600 hover:bg-purple-500 hover:scale-105 shadow-purple-500/30"
                }
              `}
              title={isRecording ? "Dừng ghi âm" : "Nhấn để nói"}
            >
              {/* Pulse ring when recording */}
              {isRecording && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                  <span className="absolute inset-[-8px] rounded-full border-2 border-red-400/40 animate-pulse" />
                </>
              )}
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>

            <p className="text-xs text-white/50 text-center">
              {isRecording
                ? "Đang nghe — nhấn lại để dừng"
                : isSpeakingAI
                  ? "Chờ AI nói xong..."
                  : "Nhấn micro để trả lời"}
            </p>

            {/* Text fallback toggle */}
            {voiceSupported && (
              <button
                onClick={() => setShowTextFallback((v) => !v)}
                className="text-xs text-white/30 hover:text-white/60 transition-colors underline underline-offset-2"
              >
                {showTextFallback ? "Ẩn bàn phím" : "Dùng bàn phím thay thế"}
              </button>
            )}

            {/* Text fallback input */}
            {(!voiceSupported || showTextFallback) && (
              <div className="w-full flex items-end gap-2">
                <textarea
                  rows={2}
                  className="flex-1 resize-none bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập câu trả lời... (Enter để gửi)"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleTextKeyDown}
                  disabled={isLoading}
                />
                <button
                  onClick={handleTextSend}
                  disabled={!textInput.trim() || isLoading}
                  className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-500 transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingExam;
