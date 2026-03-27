import React, { useState } from "react";
import CourseList from "../components/CourseComponent/CourseList";
import RoadmapList from "../components/RoadmapComponent/RoadmapList";
import { BookOpen, Map } from "lucide-react";

type ViewMode = "courses" | "roadmaps";

const Courses: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("courses");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Chương trình học</h1>
          <p className="text-blue-100 text-lg max-w-3xl">
            Khám phá các khóa học và lộ trình học tập được thiết kế để phát
            triển kỹ năng của bạn
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setViewMode("courses")}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors
                ${
                  viewMode === "courses"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }
              `}
            >
              <BookOpen className="w-5 h-5" />
              <span>Khóa học</span>
            </button>
            <button
              onClick={() => setViewMode("roadmaps")}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors
                ${
                  viewMode === "roadmaps"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }
              `}
            >
              <Map className="w-5 h-5" />
              <span>Lộ trình học tập</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "courses" ? <CourseList /> : <RoadmapList />}
      </div>
    </div>
  );
};

export default Courses;
