import { Clock, BookOpen, Tag, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface Module {
  module_id: number;
  module_title: string;
  module_description: string;
  order_index: number;
  estimated_time: number;
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

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const moduleCount = course.Modules?.length || 0;
  const tags = course.tag.split(",").slice(0, 3);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-violet-100 text-violet-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Link
      to={`/courses/${course.course_id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`${getLevelColor(course.course_level)} text-xs px-3 py-1 rounded-full font-semibold`}
          >
            {course.course_level}
          </span>
          {course.access_type === "premium" && (
            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Premium
            </span>
          )}
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.course_title}
        </h3>

        <p className="text-slate-500 mb-4 text-sm line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center text-sm text-slate-500 mb-4 flex-wrap gap-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.estimate_duration} giờ</span>
          </div>
          {moduleCount > 0 && (
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{moduleCount} modules</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Tag className="h-4 w-4 text-slate-400" />
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 py-2 rounded-xl font-bold hover:shadow-md transition-all">
          Xem chi tiết
        </button>
      </div>
    </Link>
  );
};

export default CourseCard;
