import React from "react";
import { CERTIFICATIONS } from "./aboutConstants";

const AboutCertifications: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Chứng chỉ
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">
            Chứng chỉ <span className="text-blue-600">hỗ trợ</span>
          </h2>
          <p className="text-slate-500 mt-3">
            Tài liệu chính thống từ các tổ chức uy tín quốc tế
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {CERTIFICATIONS.map((cert, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="text-5xl mb-4">{cert.emoji}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {cert.name}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCertifications;
