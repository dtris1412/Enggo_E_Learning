import React, { useState } from "react";
import CourseList from "../components/CourseComponent/CourseList";
import RoadmapList from "../components/RoadmapComponent/RoadmapList";
import { BookOpen, Map } from "lucide-react";

type ViewMode = "courses" | "roadmaps";

const Courses: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("courses");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-10 overflow-hidden">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-violet-700/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Khám phá
            </span>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight">
              <span className="text-white">Chương trình</span>{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                học tập
              </span>
            </h1>
          </div>
        </div>
      </section>

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
