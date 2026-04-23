import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import UpgradeTokenModal from "./UpgradeTokenModal";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GlobalAIChatWidgetProps {
  context?: {
    exam_id?: number;
    question_id?: number;
    current_page?: string;
    user_score_history?: any;
  };
}

const GlobalAIChatWidget: React.FC<GlobalAIChatWidgetProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      // Check if user is logged in
      if (!token) {
        const errorMessage: Message = {
          role: "assistant",
          content:
            "Bạn cần đăng nhập để sử dụng AI trợ lý. Vui lòng đăng nhập và thử lại.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/user/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          context: context,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalid or expired
          localStorage.removeItem("accessToken");
          const errorMessage: Message = {
            role: "assistant",
            content:
              "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setIsLoading(false);
          return;
        }

        if (response.status === 402) {
          // Token quota exceeded
          setShowUpgradeModal(true);
          setIsLoading(false);
          return;
        }

        // Get error details from response
        const errorData = await response.json();
        const errorMsg =
          errorData.detail ||
          errorData.error ||
          "Có lỗi xảy ra. Vui lòng thử lại sau.";
        const errorMessage: Message = {
          role: "assistant",
          content: errorMsg,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Có lỗi kết nối. Vui lòng kiểm tra kết nối internet và thử lại.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50 group"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -left-2 bg-green-500 w-3 h-3 rounded-full animate-pulse"></span>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Trợ Lý
        </span>
      </button>
    );
  }

  return (
    <>
      <UpgradeTokenModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <div
        className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all ${
          isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">AI Trợ Lý</h3>
            <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">
              Online
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-blue-800 p-1 rounded transition-colors"
              aria-label={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-800 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">
                    Xin chào! Tôi có thể giúp gì cho bạn?
                  </p>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() =>
                        setInputMessage("Giải thích câu hỏi này cho tôi")
                      }
                      className="block w-full text-left text-sm bg-white p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      💡 Giải thích câu hỏi này
                    </button>
                    <button
                      onClick={() =>
                        setInputMessage(
                          "Tôi cần gợi ý để cải thiện kết quả học tập",
                        )
                      }
                      className="block w-full text-left text-sm bg-white p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      📈 Gợi ý cải thiện kết quả
                    </button>
                    <button
                      onClick={() =>
                        setInputMessage("Tạo flashcard từ bài học này")
                      }
                      className="block w-full text-left text-sm bg-white p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      🃏 Tạo flashcard
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-md rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 text-white rounded-lg px-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GlobalAIChatWidget;
