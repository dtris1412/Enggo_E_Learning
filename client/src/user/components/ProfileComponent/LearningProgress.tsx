import React, { useState, useEffect } from "react";
import { BookOpen, TrendingUp, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface EnrolledCourse {
  user_course_id: number;
  progress_percentage: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  Course: {
    course_id: number;
    course_name: string;
    course_thumbnail: string;
    course_level: string;
  };
}

const LearningProgress: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/user/courses/enrolled`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCourses(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const completedCourses = courses.filter((c) => c.status === "completed");
  const inProgressCourses = courses.filter((c) => c.status === "in_progress");
  const averageProgress =
    courses.length > 0
      ? courses.reduce((sum, c) => sum + c.progress_percentage, 0) /
        courses.length
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tiến độ học tập</h2>
          <p className="text-gray-500 text-sm">
            Theo dõi quá trình học tập của bạn
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {courses.length}
              </div>
              <div className="text-sm text-blue-600">Khóa học đã đăng ký</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {completedCourses.length}
              </div>
              <div className="text-sm text-green-600">Đã hoàn thành</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {inProgressCourses.length}
              </div>
              <div className="text-sm text-purple-600">Đang học</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Tiến độ trung bình
          </span>
          <span className="text-sm font-bold text-blue-600">
            {averageProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getProgressColor(averageProgress)}`}
            style={{ width: `${averageProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bắt đầu hành trình học tập của bạn ngay hôm nay
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 mb-4">Khóa học của bạn</h3>
          {courses.map((course) => (
            <div
              key={course.user_course_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <img
                  src={course.Course.course_thumbnail || "/placeholder.jpg"}
                  alt={course.Course.course_name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 hover:text-blue-600">
                        <Link to={`/courses/${course.Course.course_id}`}>
                          {course.Course.course_name}
                        </Link>
                      </h4>
                      <span className="text-xs text-gray-500">
                        {course.Course.course_level}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {course.status === "completed"
                        ? "Hoàn thành"
                        : "Đang học"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-medium text-gray-700">
                        {course.progress_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(course.progress_percentage)}`}
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>
                      Bắt đầu:{" "}
                      {new Date(course.started_at).toLocaleDateString("vi-VN")}
                    </span>
                    {course.completed_at && (
                      <span>
                        Hoàn thành:{" "}
                        {new Date(course.completed_at).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningProgress;
