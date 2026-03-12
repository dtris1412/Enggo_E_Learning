import React from "react";
import { Trophy, Users } from "lucide-react";

interface TopCourse {
  course_id: number;
  course_title: string;
  course_level: string;
  course_status: boolean;
  tag: string;
  access_type: string;
  enrolled_users_count: number;
}

interface TopCoursesProps {
  courses: TopCourse[];
  loading?: boolean;
}

const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "bg-blue-100 text-blue-700";
    case "intermediate":
      return "bg-orange-100 text-orange-700";
    case "advanced":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getLevelText = (level: string) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "Cơ bản";
    case "intermediate":
      return "Trung cấp";
    case "advanced":
      return "Nâng cao";
    default:
      return level;
  }
};

const TopCourses: React.FC<TopCoursesProps> = ({
  courses,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Top Khóa Học Phổ Biến
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có khóa học nào
          </p>
        ) : (
          courses.map((course, index) => (
            <div
              key={course.course_id}
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-start gap-3">
                {/* Ranking Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                        ? "bg-gray-200 text-gray-700"
                        : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                      {course.course_title}
                    </h4>
                    <span
                      className={`text-xs font-bold flex-shrink-0 ${
                        course.access_type === "free"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {course.access_type === "free" ? "FREE" : "PRO"}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                        course.course_level,
                      )}`}
                    >
                      {getLevelText(course.course_level)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {course.tag}
                    </span>
                  </div>

                  {/* Enrollment Count */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-blue-500" />
                      <span className="font-semibold text-blue-600">
                        {course.enrolled_users_count.toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">người học</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopCourses;
