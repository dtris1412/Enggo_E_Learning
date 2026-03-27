import React from "react";
import { ACHIEVEMENTS } from "./aboutConstants";

const AboutAchievements: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-amber-300 text-sm font-semibold uppercase tracking-wider">
            Thành tựu
          </span>
          <h2 className="text-4xl font-black mt-2">Kết quả đạt được</h2>
          <p className="text-blue-100 mt-3">
            Những đổi mới mang tính đột phá trong giáo dục tiếng Anh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-black mb-2">{item.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAchievements;
