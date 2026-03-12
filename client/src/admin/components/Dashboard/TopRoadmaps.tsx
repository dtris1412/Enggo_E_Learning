import React from "react";
import { Map, TrendingUp, Clock } from "lucide-react";

interface TopRoadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_level: string;
  roadmap_status: boolean;
  estimated_duration: number;
  enrolled_users_count: number;
}

interface TopRoadmapsProps {
  roadmaps: TopRoadmap[];
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

const TopRoadmaps: React.FC<TopRoadmapsProps> = ({
  roadmaps,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Map className="h-5 w-5 text-indigo-500" />
        Top Lộ Trình Phổ Biến
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : roadmaps.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có lộ trình nào
          </p>
        ) : (
          roadmaps.map((roadmap, index) => (
            <div
              key={roadmap.roadmap_id}
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-start gap-3">
                {/* Ranking Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    index === 0
                      ? "bg-indigo-100 text-indigo-700"
                      : index === 1
                        ? "bg-purple-100 text-purple-700"
                        : index === 2
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Roadmap Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                    {roadmap.roadmap_title}
                  </h4>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                        roadmap.roadmap_level,
                      )}`}
                    >
                      {getLevelText(roadmap.roadmap_level)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {roadmap.estimated_duration} tháng
                    </span>
                  </div>

                  {/* Enrollment Count */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      <span className="font-semibold text-green-600">
                        {roadmap.enrolled_users_count.toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">đang học</span>
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

export default TopRoadmaps;
