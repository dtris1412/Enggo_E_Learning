import React from "react";
import { FEATURES } from "./aboutConstants";

const AboutFeatures: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Công nghệ
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">
            Tính năng <span className="text-blue-600">nổi bật</span>
          </h2>
          <p className="text-slate-500 mt-3">
            Công nghệ AI tiên tiến giúp tối ưu hóa quá trình học tập
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mb-4" />
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFeatures;
