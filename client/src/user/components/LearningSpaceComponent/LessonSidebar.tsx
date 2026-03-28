import { useLearning } from "../../contexts/learningContext";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  FileText,
  Lock,
  ChevronRight,
  Circle,
} from "lucide-react";

const LessonSidebar: React.FC = () => {
  const { course, currentModuleLesson, selectLesson } = useLearning();

  if (!course) {
    return null;
  }

  const getLessonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-red-500" />;
      case "reading":
      case "text":
        return <FileText className="h-4 w-4 text-violet-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="h-full bg-white border-r border-slate-200 overflow-y-auto">
      {/* Course Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-violet-100">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {course.course_title}
        </h2>
        <p className="text-xs text-slate-600">{course.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
            {course.course_level}
          </span>
          {course.access_type === "premium" && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Modules & Lessons List */}
      <div className="p-3">
        {course.Modules?.sort((a, b) => a.order_index - b.order_index).map(
          (module, moduleIndex) => (
            <div key={module.module_id} className="mb-3">
              {/* Module Header */}
              <div className="flex items-start gap-2 mb-2 p-2 bg-slate-50 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  {moduleIndex + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-xs mb-0.5">
                    {module.module_title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {module.Module_Lessons?.length || 0} bài học •{" "}
                    {module.estimated_time} phút
                  </p>
                </div>
              </div>

              {/* Lessons in Module */}
              {module.Module_Lessons?.sort(
                (a, b) => a.order_index - b.order_index,
              ).map((moduleLesson, lessonIndex) => {
                const isActive =
                  currentModuleLesson?.module_lesson_id ===
                  moduleLesson.module_lesson_id;
                const isCompleted = moduleLesson.status;

                return (
                  <button
                    key={moduleLesson.module_lesson_id}
                    onClick={() => selectLesson(moduleLesson.module_lesson_id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all mb-1.5 text-left group ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {/* Lesson Icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle
                          className={`h-4 w-4 ${
                            isActive ? "text-white" : "text-green-500"
                          }`}
                        />
                      ) : (
                        <Circle
                          className={`h-4 w-4 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                      )}
                    </div>

                    {/* Lesson Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {getLessonIcon(moduleLesson.Lesson.lesson_type)}
                        <span
                          className={`text-xs font-medium ${
                            isActive ? "text-white" : "text-slate-500"
                          }`}
                        >
                          Bài {lessonIndex + 1}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-medium ${
                          isActive ? "text-white" : "text-slate-900"
                        } truncate`}
                      >
                        {moduleLesson.Lesson.lesson_title}
                      </h4>
                      <p
                        className={`text-xs ${
                          isActive ? "text-violet-100" : "text-slate-500"
                        } mt-0.5`}
                      >
                        {moduleLesson.Lesson.estimated_time} phút
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-white flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ),
        )}
      </div>

      {/* Progress Summary */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600">
          <p className="font-medium text-slate-900 mb-1.5">Tiến độ khóa học</p>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  course.Modules?.reduce((acc, m) => {
                    const completed =
                      m.Module_Lessons?.filter((ml) => ml.status).length || 0;
                    return acc + completed;
                  }, 0) || 0
                }%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {course.Modules?.reduce((acc, m) => {
              const completed =
                m.Module_Lessons?.filter((ml) => ml.status).length || 0;
              return acc + completed;
            }, 0) || 0}{" "}
            /{" "}
            {course.Modules?.reduce(
              (acc, m) => acc + (m.Module_Lessons?.length || 0),
              0,
            ) || 0}{" "}
            bài học hoàn thành
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonSidebar;
