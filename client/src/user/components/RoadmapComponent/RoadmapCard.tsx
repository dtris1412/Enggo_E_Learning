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
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "intermediate":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "advanced":
        return "bg-violet-100 text-violet-800 border-violet-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
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
      className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`${getLevelColor(roadmap.roadmap_level)} text-sm px-4 py-1.5 rounded font-semibold border flex items-center gap-2`}
          >
            <span>{getLevelIcon(roadmap.roadmap_level)}</span>
            {roadmap.roadmap_level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-violet-600 transition-colors">
          {roadmap.roadmap_title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 mb-4 text-sm line-clamp-2 min-h-[2.5rem]">
          {roadmap.roadmap_description}
        </p>

        {/* Certificate */}
        {roadmap.Certificate && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-2">
              <Award className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {roadmap.Certificate.certificate_name}
                </p>
                <p className="text-xs text-amber-700 line-clamp-1">
                  {roadmap.Certificate.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            {roadmap.estimated_duration} ngày -{" "}
            {Math.round(roadmap.estimated_duration / 7)} tuần
          </span>
        </div>

        {/* CTA */}
        <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-bold transition-colors flex items-center justify-center gap-2">
          <span>Xem lộ trình</span>
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
};

export default RoadmapCard;
