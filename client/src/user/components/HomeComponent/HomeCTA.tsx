import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Zap } from "lucide-react";

const HomeCTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-14">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />

      <div className="relative max-w-3xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />
          Bắt đầu học miễn phí hôm nay
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
          Hành trình ngàn dặm
          <span className="block text-amber-300">bắt đầu từ bước đầu tiên</span>
        </h2>
        <p className="text-blue-100 text-lg mb-6 leading-relaxed">
          Tham gia cùng cùng Enggo E-Learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-base hover:bg-amber-300 hover:text-slate-900 transition-colors shadow-xl"
          >
            Đăng ký miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/roadmaps"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-10 py-4 rounded-xl font-semibold text-base hover:bg-white/10 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Xem lộ trình
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
