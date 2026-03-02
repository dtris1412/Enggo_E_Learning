import React from "react";
import { CheckCircle, Clock } from "lucide-react";

interface CompletedExam {
  user_exam_id: number;
  submitted_at: string;
  total_score: number;
  User: {
    user_name: string;
    full_name: string;
  };
  Exam: {
    exam_name: string;
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

const RecentCompletedExams: React.FC<RecentCompletedExamsProps> = ({
  exams,
  loading = false,
}) => {
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
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {exam.User.full_name || exam.User.user_name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {exam.Exam.exam_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    Điểm: {exam.total_score}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(exam.submitted_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentCompletedExams;
