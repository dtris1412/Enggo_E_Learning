import React from "react";
import { FileText, Calendar, Clock, BookOpen, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamCardProps {
  exam: {
    exam_id: number;
    exam_title: string;
    exam_code: string;
    exam_duration: number;
    year: number;
    exam_type: "TOEIC" | "IELTS";
    source: string | null;
    total_questions: number;
    created_at: string;
    Certificate?: {
      certificate_id: number;
      certificate_name: string;
    };
  };
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const navigate = useNavigate();

  const getExamTypeColor = () => {
    switch (exam.exam_type) {
      case "TOEIC":
        return "bg-violet-50 text-violet-700";
      case "IELTS":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getExamTypeIcon = () => {
    return <FileText className="w-12 h-12 text-blue-500" />;
  };

  const handleCardClick = () => {
    navigate(`/exams/${exam.exam_id}`);
  };

  const handleStartExam = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/exams/${exam.exam_id}/take`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 overflow-hidden group hover:-translate-y-1"
    >
      {/* Header with Icon */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getExamTypeIcon()}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded ${getExamTypeColor()}`}
                >
                  {exam.exam_type}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-800">
                  {exam.year}
                </span>
              </div>
              <span className="text-sm text-slate-400 font-mono">
                {exam.exam_code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {exam.exam_title}
        </h3>

        {exam.Certificate && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>{exam.Certificate.certificate_name}</span>
          </div>
        )}

        {exam.source && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {exam.source}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{exam.exam_duration} phút</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>{exam.total_questions} câu hỏi</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Calendar className="w-3 h-3" />
          <span>{new Date(exam.created_at).toLocaleDateString("vi-VN")}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCardClick}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Chi tiết
          </button>
          <button
            onClick={handleStartExam}
            className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors text-sm font-bold flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Làm bài
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
