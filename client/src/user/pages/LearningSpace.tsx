import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LearningProvider, useLearning } from "../contexts/learningContext";
import LessonSidebar from "../components/LearningSpaceComponent/LessonSidebar";
import LessonContent from "../components/LearningSpaceComponent/LessonContent";
import { ArrowLeft, AlertCircle } from "lucide-react";

const LearningSpaceContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { loadCourse, loading, error, course } = useLearning();

  useEffect(() => {
    if (courseId) {
      loadCourse(parseInt(courseId));
    }
  }, [courseId]);

  if (loading && !course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 font-medium">
            Đang tải khóa học...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-base font-semibold text-red-900 mb-2">
              Không thể tải khóa học
            </h2>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate("/courses")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Quay lại danh sách khóa học
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại khóa học</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Góc học tập</h1>
          <div className="w-32"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Fixed width */}
        <div className="w-72 flex-shrink-0">
          <LessonSidebar />
        </div>

        {/* Main Content - Flexible width */}
        <div className="flex-1 overflow-hidden">
          <LessonContent />
        </div>
      </div>
    </div>
  );
};

const LearningSpace: React.FC = () => {
  return (
    <LearningProvider>
      <LearningSpaceContent />
    </LearningProvider>
  );
};

export default LearningSpace;
