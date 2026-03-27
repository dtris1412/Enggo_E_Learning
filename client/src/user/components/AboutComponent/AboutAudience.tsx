import React from "react";
import { AUDIENCE } from "./aboutConstants";

const AboutAudience: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Đối tượng
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">
            Dành cho <span className="text-blue-600">tất cả mọi người</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-slate-500 text-center mb-8">
            Enggo E-Learning được thiết kế phù hợp với{" "}
            <strong className="text-slate-800">mọi lứa tuổi</strong>, đặc biệt
            là:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCE.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <div className="font-black text-slate-900">{item.title}</div>
                <p className="text-sm text-slate-500 mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAudience;
