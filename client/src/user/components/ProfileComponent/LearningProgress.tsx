import React, { useState, useEffect } from "react";
import { BookOpen, TrendingUp, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface EnrolledCourse {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  access_type: string;
  estimate_duration: number;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  started_at: string;
}

const ITEMS_PER_PAGE = 4;

const LearningProgress: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    if (progress >= 50) return "bg-violet-600";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-slate-400";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-300 rounded w-1/3"></div>
          <div className="h-24 bg-slate-300 rounded"></div>
          <div className="h-24 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  const completedCourses = courses.filter((c) => c.progress_percentage === 100);
  const inProgressCourses = courses.filter(
    (c) => c.progress_percentage > 0 && c.progress_percentage < 100,
  );
  const averageProgress =
    courses.length > 0
      ? courses.reduce((sum, c) => sum + c.progress_percentage, 0) /
        courses.length
      : 0;

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tiến độ học tập</h2>
          <p className="text-slate-500 text-sm">
            Theo dõi quá trình học tập của bạn
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-violet-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-700">
                {courses.length}
              </div>
              <div className="text-sm text-violet-600">Khóa học đã đăng ký</div>
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

        <div className="bg-violet-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-violet-700">
                {inProgressCourses.length}
              </div>
              <div className="text-sm text-violet-600">Đang học</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8 p-6 bg-violet-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">
            Tiến độ trung bình
          </span>
          <span className="text-sm font-bold text-violet-600">
            {averageProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getProgressColor(averageProgress)}`}
            style={{ width: `${averageProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-slate-500 mb-4">
            Bắt đầu hành trình học tập của bạn ngay hôm nay
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-2.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
          >
            Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800 mb-4">
            Khóa học của bạn
          </h3>
          {paginatedCourses.map((course) => (
            <div
              key={course.course_id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* Placeholder thumbnail */}
                <div className="w-24 h-24 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800 hover:text-violet-600">
                        <Link to={`/courses/${course.course_id}`}>
                          {course.course_title}
                        </Link>
                      </h4>
                      <span className="text-xs text-slate-500">
                        {course.course_level}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.progress_percentage === 100
                          ? "bg-green-100 text-green-700"
                          : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {course.progress_percentage === 100
                        ? "Hoàn thành"
                        : "Đang học"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-600">
                        Tiến độ ({course.completed_lessons}/
                        {course.total_lessons} bài)
                      </span>
                      <span className="font-medium text-slate-700">
                        {course.progress_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(course.progress_percentage)}`}
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>
                      Bắt đầu:{" "}
                      {new Date(course.started_at).toLocaleDateString("vi-VN")}
                    </span>
                    {course.progress_percentage === 100 && (
                      <span className="text-green-600">✓ Đã hoàn thành</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Trang {currentPage}/{totalPages} &bull; {courses.length} khóa
                học
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ‹ Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                        currentPage === p
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Sau ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningProgress;
