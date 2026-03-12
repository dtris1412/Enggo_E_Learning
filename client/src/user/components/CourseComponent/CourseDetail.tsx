import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCourse } from "../../contexts/courseContext";
import {
  Clock,
  BookOpen,
  Target,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  Lock,
  CheckCircle,
  Rocket,
} from "lucide-react";

interface Lesson {
  lesson_id: number;
  lesson_type: string;
  lesson_title: string;
  lesson_content: string;
  estimated_time: number;
}

interface ModuleLesson {
  module_lesson_id: number;
  description: string;
  order_index: number;
  status: boolean;
  Lesson: Lesson;
}

interface Module {
  module_id: number;
  module_title: string;
  module_description: string;
  order_index: number;
  estimated_time: number;
  Module_Lessons?: ModuleLesson[];
}

interface Course {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  course_aim: string;
  estimate_duration: number;
  course_status: boolean;
  tag: string;
  access_type: "free" | "premium";
  created_at: string;
  updated_at: string;
  Modules?: Module[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getCourseById,
    loading,
    startCourse,
    getCourseProgress,
    getLessonProgress,
  } = useCourse();

  const [course, setCourse] = useState<Course | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [courseProgress, setCourseProgress] = useState<{
    started: boolean;
    progress: any;
  } | null>(null);
  const [lessonProgressMap, setLessonProgressMap] = useState<
    Record<number, any>
  >({});
  const [startingCourse, setStartingCourse] = useState(false);
  const [userHasPremium, setUserHasPremium] = useState(false);

  // Fetch user subscription status
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setUserHasPremium(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/subscriptions/active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();
        if (result.success && result.planName) {
          setUserHasPremium(result.planName.toLowerCase() === "premium");
        } else {
          setUserHasPremium(false);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setUserHasPremium(false);
      }
    };

    fetchUserSubscription();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      const courseData = await getCourseById(Number(id));
      if (courseData) {
        setCourse(courseData);
        // Expand first module by default
        if (courseData.Modules && courseData.Modules.length > 0) {
          setExpandedModules([courseData.Modules[0].module_id]);
        }

        // Fetch progress
        const progress = await getCourseProgress(Number(id));
        setCourseProgress(progress);

        // Fetch lesson progress for all lessons
        if (courseData.Modules) {
          const lessonProgressPromises: Promise<any>[] = [];
          courseData.Modules.forEach((module) => {
            module.Module_Lessons?.forEach((ml) => {
              lessonProgressPromises.push(
                getLessonProgress(ml.Lesson.lesson_id),
              );
            });
          });

          const lessonProgresses = await Promise.all(lessonProgressPromises);
          const progressMap: Record<number, any> = {};

          let lessonIndex = 0;
          courseData.Modules.forEach((module) => {
            module.Module_Lessons?.forEach((ml) => {
              progressMap[ml.Lesson.lesson_id] = lessonProgresses[lessonIndex];
              lessonIndex++;
            });
          });

          setLessonProgressMap(progressMap);
        }
      } else {
        navigate("/courses");
      }
    };

    fetchCourse();
  }, [id, getCourseById, getCourseProgress, getLessonProgress, navigate]);

  const handleStartCourse = async () => {
    if (!id) return;
    setStartingCourse(true);
    const success = await startCourse(Number(id));
    if (success) {
      // Navigate to learning space after starting course
      navigate(`/learning/${id}`);
    }
    setStartingCourse(false);
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <PlayCircle className="h-5 w-5 text-red-500" />;
      case "reading":
      case "text":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const totalLessons =
    course?.Modules?.reduce(
      (acc, module) => acc + (module.Module_Lessons?.length || 0),
      0,
    ) || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại danh sách khóa học
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`${getLevelColor(course.course_level)} text-sm px-3 py-1 rounded-full font-medium`}
                >
                  {course.course_level}
                </span>
                {course.access_type === "premium" && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Premium
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {course.course_title}
              </h1>

              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{course.estimate_duration} giờ</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>
                    {course.Modules?.length || 0} modules / {totalLessons} bài
                    học
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin khóa học
                </h3>

                {/* Progress Section */}
                {courseProgress?.started && courseProgress.progress ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tiến độ</span>
                      <span className="text-sm font-semibold">
                        {Math.round(
                          courseProgress.progress.progress_percentage,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${courseProgress.progress.progress_percentage}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-blue-100">
                      {courseProgress.progress.completedLessons || 0} /{" "}
                      {courseProgress.progress.totalLessons || 0} bài học hoàn
                      thành
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartCourse}
                    disabled={startingCourse}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {startingCourse ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        <span>Đang bắt đầu...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="h-5 w-5" />
                        <span>Bắt đầu học ngay</span>
                      </>
                    )}
                  </button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Target className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Mục tiêu</p>
                      <p className="text-blue-100">{course.course_aim}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nội dung khóa học
              </h2>

              {course.Modules && course.Modules.length > 0 ? (
                <div className="space-y-4">
                  {course.Modules.sort(
                    (a, b) => a.order_index - b.order_index,
                  ).map((module, index) => (
                    <div
                      key={module.module_id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(module.module_id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {module.module_title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {module.Module_Lessons?.length || 0} bài học •{" "}
                              {module.estimated_time} phút
                            </p>
                          </div>
                        </div>
                        {expandedModules.includes(module.module_id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>

                      {expandedModules.includes(module.module_id) && (
                        <div className="p-4 bg-white">
                          <p className="text-gray-600 mb-4">
                            {module.module_description}
                          </p>

                          {module.Module_Lessons &&
                            module.Module_Lessons.length > 0 && (
                              <div className="space-y-2">
                                {module.Module_Lessons.sort(
                                  (a, b) => a.order_index - b.order_index,
                                ).map((moduleLesson) => {
                                  const lessonProgress =
                                    lessonProgressMap[
                                      moduleLesson.Lesson.lesson_id
                                    ];
                                  const isCompleted =
                                    lessonProgress?.started &&
                                    lessonProgress?.progress?.is_completed;
                                  const progressPercentage =
                                    lessonProgress?.started &&
                                    lessonProgress?.progress
                                      ?.progress_percentage;

                                  return (
                                    <div
                                      key={moduleLesson.module_lesson_id}
                                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                        isCompleted
                                          ? "bg-green-50 border border-green-200"
                                          : "bg-gray-50 hover:bg-gray-100"
                                      }`}
                                    >
                                      {getLessonIcon(
                                        moduleLesson.Lesson.lesson_type,
                                      )}
                                      <div className="flex-1">
                                        <p
                                          className={`font-medium ${
                                            isCompleted
                                              ? "text-green-900"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {moduleLesson.Lesson.lesson_title}
                                        </p>
                                        {moduleLesson.description && (
                                          <p className="text-sm text-gray-500">
                                            {moduleLesson.description}
                                          </p>
                                        )}
                                        {progressPercentage > 0 &&
                                          !isCompleted && (
                                            <div className="mt-1">
                                              <div className="w-full bg-gray-200 rounded-full h-1">
                                                <div
                                                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                                  style={{
                                                    width: `${progressPercentage}%`,
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {moduleLesson.Lesson.estimated_time}{" "}
                                        phút
                                      </span>
                                      {isCompleted && (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Chưa có nội dung khóa học
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Bắt đầu học ngay
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modules</span>
                  <span className="font-semibold text-gray-900">
                    {course.Modules?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bài học</span>
                  <span className="font-semibold text-gray-900">
                    {totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Thời lượng</span>
                  <span className="font-semibold text-gray-900">
                    {course.estimate_duration} giờ
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Truy cập</span>
                  <span className="font-semibold text-gray-900">
                    {course.access_type === "free" ? "Miễn phí" : "Premium"}
                  </span>
                </div>
              </div>

              {course.access_type === "premium" && !userHasPremium ? (
                <Link
                  to="/subscription"
                  className="block w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold text-center hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="h-5 w-5" />
                  Nâng cấp Premium
                </Link>
              ) : (
                <button
                  onClick={handleStartCourse}
                  disabled={startingCourse}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {courseProgress?.started ? (
                    <>
                      <PlayCircle className="h-5 w-5" />
                      Tiếp tục học
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5" />
                      {startingCourse ? "Đang xử lý..." : "Bắt đầu học"}
                    </>
                  )}
                </button>
              )}

              {/* Tags */}
              {course.tag && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tag.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
