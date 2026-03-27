import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/authContext";
import {
  GraduationCap,
  BookOpen,
  Clock,
  PlayCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface EnrolledCourse {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  access_type: string;
  estimated_time: number;
  course_thumbnail?: string;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed?: string;
  started_at: string;
}

const MyLearning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }

    fetchEnrolledCourses();
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/courses/enrolled`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        setEnrolledCourses(result.data || []);
      } else {
        setError(result.message || "Không thể tải danh sách khóa học");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải dữ liệu");
      console.error("Error fetching enrolled courses:", err);
    } finally {
      setLoading(false);
    }
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
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Đang tải khóa học của bạn...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Đã xảy ra lỗi
            </h2>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchEnrolledCourses}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Góc học tập</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Tiếp tục hành trình học tập của bạn và hoàn thành các khóa học đã
            đăng ký
          </p>
        </div>

        {/* Stats Summary */}
        {enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Khóa học đang học
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {enrolledCourses.length}
                  </p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Bài học hoàn thành
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {enrolledCourses.reduce(
                      (sum, course) => sum + course.completed_lessons,
                      0,
                    )}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Tiến độ trung bình
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {Math.round(
                      enrolledCourses.reduce(
                        (sum, course) => sum + course.progress_percentage,
                        0,
                      ) / enrolledCourses.length,
                    )}
                    %
                  </p>
                </div>
                <GraduationCap className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Course List */}
        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Bạn chưa đăng ký khóa học nào
            </h3>
            <p className="text-slate-600 mb-6">
              Khám phá các khóa học của chúng tôi và bắt đầu hành trình học tập
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course.course_id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
              >
                {/* Course Thumbnail */}
                {course.course_thumbnail && (
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                    <img
                      src={course.course_thumbnail}
                      alt={course.course_title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                          course.course_level,
                        )}`}
                      >
                        {course.course_level}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Course Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    {course.course_title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Tiến độ
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {Math.round(course.progress_percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress_percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {course.completed_lessons} / {course.total_lessons} bài
                      học hoàn thành
                    </p>
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.estimated_time} phút</span>
                    </div>
                    {course.last_accessed && (
                      <div className="text-xs text-slate-500">
                        Truy cập: {formatDate(course.last_accessed)}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/learning/${course.course_id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span>Tiếp tục học</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
