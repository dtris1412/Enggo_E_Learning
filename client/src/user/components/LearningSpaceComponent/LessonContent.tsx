import { useLearning } from "../../contexts/learningContext";
import {
  Clock,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { LessonMediaGallery } from "./LessonMediaGallery";
import { LessonQuiz } from "./LessonQuiz";

const LessonContent: React.FC = () => {
  const {
    currentLesson,
    currentModuleLesson,
    lessonProgress,
    loading,
    markLessonComplete,
    getNextLesson,
    getPreviousLesson,
    selectLesson,
  } = useLearning();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!currentLesson || !currentModuleLesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Chọn một bài học để bắt đầu</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log("🎨 Rendering LessonContent");
  console.log("📚 Current lesson:", currentLesson.lesson_title);
  console.log("📊 Media available:", currentLesson.Lesson_Media?.length || 0);
  console.log(
    "❓ Questions available:",
    currentLesson.Lesson_Questions?.length || 0,
  );
  if (currentLesson.Lesson_Media) {
    console.log("🎬 Media data:", currentLesson.Lesson_Media);
  }
  if (currentLesson.Lesson_Questions) {
    console.log("📝 Questions data:", currentLesson.Lesson_Questions);
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();
  const isCompleted = lessonProgress?.is_completed || false;

  const handleComplete = async () => {
    await markLessonComplete();
  };

  const handlePrevious = () => {
    if (previousLesson) {
      selectLesson(previousLesson.module_lesson_id);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      selectLesson(nextLesson.module_lesson_id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Lesson Header */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {currentLesson.lesson_title}
            </h1>
            {isCompleted && (
              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                Đã hoàn thành
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4" />
            <span>{currentLesson.estimated_time} phút</span>
          </div>
        </div>

        {/* Progress Bar */}
        {lessonProgress && lessonProgress.progress_percentage > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600 font-medium">
                Tiến độ bài học
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {Math.round(lessonProgress.progress_percentage)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${lessonProgress.progress_percentage}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Media Gallery - Display First */}
          {(() => {
            console.log("🔍 Checking Lesson_Media condition:", {
              exists: !!currentLesson.Lesson_Media,
              isArray: Array.isArray(currentLesson.Lesson_Media),
              length: currentLesson.Lesson_Media?.length,
              shouldRender:
                currentLesson.Lesson_Media &&
                currentLesson.Lesson_Media.length > 0,
            });
            return currentLesson.Lesson_Media &&
              currentLesson.Lesson_Media.length > 0 ? (
              <LessonMediaGallery media={currentLesson.Lesson_Media} />
            ) : null;
          })()}

          {/* Main Content */}
          <div className="prose prose-sm max-w-none mt-6">
            <ReactMarkdown>{currentLesson.lesson_content}</ReactMarkdown>
          </div>

          {/* Quiz Section */}
          {(() => {
            console.log("🔍 Checking Lesson_Questions condition:", {
              exists: !!currentLesson.Lesson_Questions,
              isArray: Array.isArray(currentLesson.Lesson_Questions),
              length: currentLesson.Lesson_Questions?.length,
              shouldRender:
                currentLesson.Lesson_Questions &&
                currentLesson.Lesson_Questions.length > 0,
            });
            return currentLesson.Lesson_Questions &&
              currentLesson.Lesson_Questions.length > 0 ? (
              <LessonQuiz
                questions={currentLesson.Lesson_Questions}
                onComplete={(score, total) => {
                  console.log(`Quiz completed: ${score}/${total}`);
                  // Optionally update progress based on quiz score
                  if (score / total >= 0.7) {
                    // Pass threshold: 70%
                    console.log("Quiz passed!");
                  }
                }}
              />
            ) : null;
          })()}

          {/* Exam Format Note */}
          {currentLesson.is_exam_format && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Bài học này có định dạng bài kiểm tra.
                Hãy đảm bảo bạn đã nắm vững kiến thức trước khi tiếp tục.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={!previousLesson}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Bài trước</span>
          </button>

          {/* Complete Button */}
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Hoàn thành & Tiếp tục</span>
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!nextLesson}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-medium">Bài tiếp theo</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
