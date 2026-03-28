import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomeCTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-violet-800 py-14">
      {/* Subtle blob */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />

      <div className="relative max-w-3xl mx-auto text-center px-4">
        <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest mb-4">
          Bắt đầu học miễn phí hôm nay
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
          Hành trình ngàn dặm
          <span className="block text-violet-300">
            bắt đầu từ bước đầu tiên
          </span>
        </h2>
        <p className="text-violet-100 text-lg mb-8 leading-relaxed">
          Tham gia cùng Enggo E-Learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-violet-800 px-10 py-4 rounded-md font-bold text-base hover:bg-violet-50 transition-colors"
          >
            Đăng ký miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/roadmaps"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-10 py-4 rounded-md font-semibold text-base hover:bg-white/10 transition-colors"
          >
            Xem lộ trình
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
