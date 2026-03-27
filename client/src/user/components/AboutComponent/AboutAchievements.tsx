import React from "react";
import { ACHIEVEMENTS } from "./aboutConstants";

const AboutAchievements: React.FC = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Kết quả đạt được
          </h2>
          <p className="text-xl text-blue-100">
            Những đổi mới mang tính đột phá trong giáo dục tiếng Anh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACHIEVEMENTS.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-blue-100">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAchievements;
