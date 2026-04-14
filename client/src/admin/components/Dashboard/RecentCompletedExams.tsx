import React, { useEffect } from "react";
import { CheckCircle, Clock, BookOpen } from "lucide-react";

interface CompletedExam {
  user_exam_id: number;
  started_at: string;
  submitted_at: string;
  total_score: number;
  status: string;
  selected_parts: string;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
  };
  Exam: {
    exam_id: number;
    exam_name: string;
    exam_type: string;
    exam_title: string;
  };
}

interface RecentCompletedExamsProps {
  exams: CompletedExam[];
  loading?: boolean;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return `${diffDays} ngày trước`;
};

// Calculate duration in minutes
const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / 60000); // convert to minutes
};

// Parse selected parts to display
const getSelectedPartsDisplay = (selectedParts: string): string => {
  try {
    const parts = JSON.parse(selectedParts);
    if (Array.isArray(parts)) {
      if (parts.includes("all")) return "Tất cả phần";
      return `Phần: ${parts.join(", ")}`;
    }
  } catch {
    return selectedParts;
  }
  return selectedParts;
};

const RecentCompletedExams: React.FC<RecentCompletedExamsProps> = ({
  exams,
  loading = false,
}) => {
  // Debug log
  useEffect(() => {
    console.log("[RecentCompletedExams] Received exams prop:", exams);
    console.log("[RecentCompletedExams] Loading state:", loading);
    console.log("[RecentCompletedExams] Exams count:", exams.length);
  }, [exams, loading]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Bài thi hoàn thành gần đây
      </h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : exams.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có bài thi hoàn thành
          </p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.user_exam_id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              {/* Header: Exam Name + Status */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {exam.Exam.exam_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {exam.Exam.exam_type}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded flex-shrink-0">
                  {exam.total_score}
                </span>
              </div>

              {/* Student Info */}
              <p className="text-xs text-gray-600 mb-2">
                Nộp bởi:{" "}
                <span className="font-medium text-gray-800">
                  {exam.User.full_name || exam.User.user_name}
                </span>
              </p>

              {/* Selected Parts */}
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                <BookOpen className="h-3 w-3 text-gray-400" />
                <span>{getSelectedPartsDisplay(exam.selected_parts)}</span>
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo(exam.submitted_at)}</span>
                </div>
                <span>
                  Thời lượng:{" "}
                  {calculateDuration(exam.started_at, exam.submitted_at)} phút
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentCompletedExams;
