import React from "react";
import { CERTIFICATIONS } from "./aboutConstants";

const AboutCertifications: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Chứng chỉ hỗ trợ
          </h2>
          <p className="text-xl text-gray-600">
            Tài liệu chính thống từ các tổ chức uy tín quốc tế
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {CERTIFICATIONS.map((cert, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-5xl mb-4 text-center">{cert.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {cert.name}
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
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
