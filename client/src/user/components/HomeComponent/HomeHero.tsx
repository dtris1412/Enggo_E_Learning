import { Link } from "react-router-dom";
import { ArrowRight, Play, ChevronRight, Target, Map } from "lucide-react";
import { LEVEL_GRADIENT, SKILLS } from "./homeConstants";

interface Props {
  roadmaps: any[];
}

const FALLBACK_ROADMAPS = [
  {
    roadmap_id: 1,
    roadmap_title: "Tiếng Anh Cơ Bản",
    roadmap_level: "Beginner",
    tag: "Foundation",
  },
  {
    roadmap_id: 2,
    roadmap_title: "TOEIC 600+",
    roadmap_level: "Intermediate",
    tag: "TOEIC",
  },
  {
    roadmap_id: 3,
    roadmap_title: "IELTS 7.0 Master",
    roadmap_level: "Advanced",
    tag: "IELTS",
  },
];

const HomeHero: React.FC<Props> = ({ roadmaps }) => {
  const displayRoadmaps =
    roadmaps.length > 0 ? roadmaps.slice(0, 3) : FALLBACK_ROADMAPS;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — Dark split layout
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex items-center">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            {/* ── Left content (3/5) ── */}
            <div className="lg:col-span-3 space-y-5">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                <span className="block text-white">Chinh phục</span>
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  tiếng Anh
                </span>
                <span className="block text-slate-300 text-4xl sm:text-5xl lg:text-6xl">
                  theo cách của bạn
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                Lộ trình cá nhân hóa, kiểm tra thực chiến và AI hỗ trợ 24/7 —
                mọi thứ bạn cần để đạt mục tiêu tiếng Anh trong một nền tảng.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/roadmaps"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                >
                  Bắt đầu miễn phí
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/exams"
                  className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Thi thử ngay
                </Link>
              </div>
            </div>

            {/* ── Right: floating roadmap cards (2/5) ── */}
            <div className="lg:col-span-2 relative hidden lg:flex flex-col gap-4">
              {displayRoadmaps.map((rm, i) => (
                <div
                  key={rm.roadmap_id}
                  className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl"
                  style={{
                    transform: `translateX(${i % 2 === 0 ? "0px" : "24px"})`,
                  }}
                >
                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${LEVEL_GRADIENT[rm.roadmap_level] ?? "from-blue-400 to-indigo-500"} flex items-center justify-center shadow-md`}
                  >
                    <Map className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate text-sm">
                      {rm.roadmap_title}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {rm.roadmap_level} · {rm.tag ?? "Lộ trình"}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 ml-auto" />
                </div>
              ))}

              {/* AI accent card */}
              <div className="mt-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span className="text-white font-semibold text-sm">
                    AI Lộ trình cá nhân
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Trợ lý AI phân tích điểm mạnh và tạo lộ trình học tối ưu riêng
                  cho bạn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-slate-600" />
          <span className="text-xs tracking-widest uppercase">Khám phá</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TICKER — Seamless scrolling skill strip
      ═══════════════════════════════════════════════ */}
      <div className="bg-slate-900 border-y border-slate-800 py-4 overflow-hidden select-none">
        <div className="flex gap-10 animate-marquee whitespace-nowrap w-max">
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 text-slate-400 text-sm font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              {skill}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeHero;
