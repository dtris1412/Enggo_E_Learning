import React from "react";
import { RESEARCH_OBJECTIVES } from "./aboutConstants";

const AboutResearch: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Nghiên cứu
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">
            Mục tiêu <span className="text-blue-600">nghiên cứu</span>
          </h2>
          <p className="text-slate-500 mt-3">
            Nền tảng khoa học và công nghệ đằng sau hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_OBJECTIVES.map((objective, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {index + 1}
                </div>
                <p className="text-slate-600">{objective}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutResearch;
