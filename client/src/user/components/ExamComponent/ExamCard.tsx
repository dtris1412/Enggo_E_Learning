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
        return "bg-blue-100 text-blue-800";
      case "IELTS":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group"
    >
      {/* Header with Icon */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getExamTypeIcon()}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getExamTypeColor()}`}
                >
                  {exam.exam_type}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  {exam.year}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-mono">
                {exam.exam_code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {exam.exam_title}
        </h3>

        {exam.Certificate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>{exam.Certificate.certificate_name}</span>
          </div>
        )}

        {exam.source && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            Source: {exam.source}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{exam.exam_duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>{exam.total_questions} questions</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar className="w-3 h-3" />
          <span>
            Created: {new Date(exam.created_at).toLocaleDateString("en-US")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCardClick}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={handleStartExam}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
