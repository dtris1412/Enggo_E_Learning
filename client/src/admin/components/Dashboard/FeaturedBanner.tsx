import { TrendingUp, ArrowRight } from "lucide-react";

const FeaturedBanner = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-lg p-6 overflow-hidden h-full">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-white rounded-lg transform -rotate-6"></div>
        <div className="absolute top-20 right-32 w-16 h-16 border-2 border-white rounded-lg"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
        <div>
          <h3 className="text-white text-xl font-bold mb-2">
            Nâng cấp trải nghiệm học tập
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            Khám phá các tính năng mới và cải tiến
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
            Tìm hiểu thêm
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            <div className="text-right">
              <p className="text-xs text-blue-100">Tăng trưởng</p>
              <p className="text-lg font-bold">+18.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
