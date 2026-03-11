import { Clock, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Certificate {
  certificate_id: number;
  certificate_name: string;
  description: string;
}

interface Roadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_description: string;
  roadmap_aim: string;
  roadmap_level: "Beginner" | "Intermediate" | "Advanced";
  estimated_duration: number;
  roadmap_status: boolean;
  certificate_id: number;
  created_at: string;
  updated_at: string;
  Certificate?: Certificate;
}

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "🌱";
      case "intermediate":
        return "🚀";
      case "advanced":
        return "⭐";
      default:
        return "📚";
    }
  };

  return (
    <Link
      to={`/roadmaps/${roadmap.roadmap_id}`}
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`${getLevelColor(roadmap.roadmap_level)} text-sm px-4 py-1.5 rounded-full font-semibold border flex items-center gap-2`}
          >
            <span>{getLevelIcon(roadmap.roadmap_level)}</span>
            {roadmap.roadmap_level}
          </span>
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
          {roadmap.roadmap_title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2 min-h-[2.5rem]">
          {roadmap.roadmap_description}
        </p>

        {/* Certificate */}
        {roadmap.Certificate && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Award className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900">
                  {roadmap.Certificate.certificate_name}
                </p>
                <p className="text-xs text-yellow-700 line-clamp-1">
                  {roadmap.Certificate.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            {roadmap.estimated_duration} ngày -{" "}
            {Math.round(roadmap.estimated_duration / 7)} tuần
          </span>
        </div>

        {/* CTA */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <span>Xem lộ trình</span>
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
};

export default RoadmapCard;
