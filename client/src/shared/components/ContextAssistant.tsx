import React, { useState } from "react";
import { Lightbulb, BookOpen, Loader2, X } from "lucide-react";

interface ContextAssistantProps {
  type: "exam" | "flashcard" | "question";
  examId?: number;
  questionId?: number;
  questionText?: string;
  userHistory?: any;
  position?: "inline" | "sidebar" | "modal";
}

const ContextAssistant: React.FC<ContextAssistantProps> = ({
  type,
  examId,
  questionId,
  questionText,
  userHistory,
  position = "inline",
}) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = {
    exam: [
      { icon: "💡", text: "Giải thích câu hỏi này", action: "explain" },
      { icon: "🎯", text: "Gợi ý cách tiếp cận", action: "hint" },
      { icon: "📚", text: "Kiến thức liên quan", action: "related" },
    ],
    flashcard: [
      { icon: "🃏", text: "Tạo flashcard từ nội dung", action: "generate" },
      { icon: "✨", text: "Gợi ý cải thiện", action: "improve" },
      { icon: "🔄", text: "Tạo câu hỏi ngược", action: "reverse" },
    ],
    question: [
      { icon: "❓", text: "Giải thích đáp án", action: "explain_answer" },
      { icon: "🔍", text: "Phân tích câu hỏi", action: "analyze" },
      { icon: "📝", text: "Ví dụ tương tự", action: "similar" },
    ],
  };

  const handleQuickAction = async (action: string) => {
    let prompt = "";
    switch (action) {
      case "explain":
        prompt = `Giải thích câu hỏi: ${questionText}`;
        break;
      case "hint":
        prompt = `Cho tôi gợi ý để giải câu hỏi: ${questionText}`;
        break;
      case "related":
        prompt = `Cho tôi biết kiến thức liên quan đến câu hỏi: ${questionText}`;
        break;
      case "generate":
        prompt = `Tạo flashcard từ nội dung này`;
        break;
      case "improve":
        prompt = `Gợi ý cải thiện flashcard này`;
        break;
      case "reverse":
        prompt = `Tạo câu hỏi ngược từ flashcard này`;
        break;
      case "explain_answer":
        prompt = `Giải thích đáp án của câu hỏi: ${questionText}`;
        break;
      case "analyze":
        prompt = `Phân tích câu hỏi: ${questionText}`;
        break;
      case "similar":
        prompt = `Cho tôi ví dụ tương tự với câu hỏi: ${questionText}`;
        break;
      default:
        prompt = message;
    }
    setMessage(prompt);
    await handleSendMessage(prompt);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const msgToSend = customMessage || message;
    if (!msgToSend.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const token = localStorage.getItem("accessToken");

      // Check if user is logged in
      if (!token) {
        setResponse(
          "Bạn cần đăng nhập để sử dụng AI trợ lý. Vui lòng đăng nhập và thử lại.",
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/user/ai/context-assist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: msgToSend,
          type: type,
          exam_id: examId,
          question_id: questionId,
          user_history: userHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalid or expired
          localStorage.removeItem("accessToken");
          setResponse(
            "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
          );
          setIsLoading(false);
          return;
        }

        // Display specific error message from server
        const errorMsg = data.detail || data.error || "Có lỗi xảy ra. Vui lòng thử lại sau.";
        setResponse(errorMsg);
        setIsLoading(false);
        return;
      }

      setResponse(data.reply);
    } catch (error) {
      console.error("Context assist error:", error);
      setResponse("Có lỗi kết nối. Vui lòng kiểm tra kết nối internet và thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (position === "inline") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">AI Trợ Lý</h4>
        </div>

        {!response && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            {quickActions[type].map((qa, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(qa.action)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-white hover:bg-blue-100 text-sm px-3 py-2 rounded-lg border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{qa.icon}</span>
                <span className="text-left text-sm">{qa.text}</span>
              </button>
            ))}
          </div>
        )}

        {response && (
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-900">
                  Phản hồi từ AI
                </span>
              </div>
              <button
                onClick={() => setResponse(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close response"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {response}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hoặc đặt câu hỏi riêng..."
            className="flex-1 border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Đang xử lý...</span>
              </>
            ) : (
              <span className="text-sm">Hỏi AI</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Sidebar hoặc modal version có thể thêm sau
  return null;
};

export default ContextAssistant;
