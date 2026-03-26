import { Link } from "react-router-dom";
import { ArrowRight, Map, Clock, ChevronRight } from "lucide-react";
import { LEVEL_GRADIENT, LEVEL_BG } from "./homeConstants";

interface Props {
  roadmaps: any[];
}

const FALLBACK_ROADMAPS = [
  {
    roadmap_id: 1,
    roadmap_title: "Tiếng Anh Cơ Bản",
    roadmap_description: "Xây dựng nền tảng vững chắc cho người mới bắt đầu.",
    roadmap_level: "Beginner",
    estimated_duration: 60,
  },
  {
    roadmap_id: 2,
    roadmap_title: "TOEIC 600+",
    roadmap_description:
      "Luyện thi TOEIC chuyên sâu, đạt 600 điểm trong 2 tháng.",
    roadmap_level: "Intermediate",
    estimated_duration: 60,
  },
  {
    roadmap_id: 3,
    roadmap_title: "IELTS 7.0 Master",
    roadmap_description: "Chương trình chuẩn bị IELTS toàn diện bốn kỹ năng.",
    roadmap_level: "Advanced",
    estimated_duration: 90,
  },
  {
    roadmap_id: 4,
    roadmap_title: "Business English Pro",
    roadmap_description: "Tiếng Anh thương mại cho môi trường công sở quốc tế.",
    roadmap_level: "Advanced",
    estimated_duration: 75,
  },
];

const HomeRoadmaps: React.FC<Props> = ({ roadmaps }) => {
  const data = roadmaps.length > 0 ? roadmaps : FALLBACK_ROADMAPS;
  const featured = data[0] ?? null;
  const sideList = data.slice(1, 4);

  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
              Lộ trình học tập
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-1">
              Chọn hành trình
              <br />
              <span className="text-blue-600">phù hợp với bạn</span>
            </h2>
          </div>
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all text-sm"
          >
            Xem tất cả lộ trình
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {roadmaps.length === 0 && data === FALLBACK_ROADMAPS ? (
          /* Skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-80 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((k) => (
                <div
                  key={k}
                  className="h-24 bg-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Featured roadmap — large card (3/5) */}
            {featured && (
              <Link
                to={`/roadmaps/${featured.roadmap_id}`}
                className="lg:col-span-3 group relative rounded-2xl overflow-hidden bg-slate-900 min-h-72 flex flex-col justify-end hover:shadow-2xl transition-shadow"
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${LEVEL_GRADIENT[featured.roadmap_level] ?? "from-blue-400 to-indigo-600"} opacity-30`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                {/* Large icon backdrop */}
                <div className="absolute top-8 right-8 opacity-10">
                  <Map className="w-44 h-44 text-white" />
                </div>

                <div className="relative p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${LEVEL_GRADIENT[featured.roadmap_level] ?? "from-blue-400 to-indigo-500"} text-white`}
                    >
                      {featured.roadmap_level}
                    </span>
                    {featured.estimated_duration && (
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.estimated_duration} ngày
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {featured.roadmap_title}
                  </h3>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                    {featured.roadmap_description}
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-xl text-sm font-bold group-hover:bg-amber-400 transition-colors">
                    Xem lộ trình <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* Side list — stacked rows (2/5) */}
            <div className="lg:col-span-2 space-y-4">
              {sideList.map((rm) => (
                <Link
                  to={`/roadmaps/${rm.roadmap_id}`}
                  key={rm.roadmap_id}
                  className="group flex items-center gap-4 bg-white hover:bg-slate-100 rounded-xl p-4 border border-slate-200 transition-colors"
                >
                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${LEVEL_GRADIENT[rm.roadmap_level] ?? "from-blue-400 to-indigo-500"} flex items-center justify-center shadow-sm`}
                  >
                    <Map className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 text-sm leading-tight truncate group-hover:text-blue-600 transition-colors">
                      {rm.roadmap_title}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold border ${LEVEL_BG[rm.roadmap_level] ?? "bg-blue-50 text-blue-700 border-blue-200"}`}
                      >
                        {rm.roadmap_level}
                      </span>
                      {rm.estimated_duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rm.estimated_duration} ngày
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                </Link>
              ))}

              {/* View all anchor card */}
              <Link
                to="/roadmaps"
                className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold text-sm transition-colors"
              >
                Xem tất cả lộ trình
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeRoadmaps;
