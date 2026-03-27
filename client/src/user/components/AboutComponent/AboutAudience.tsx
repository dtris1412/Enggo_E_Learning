import React from "react";
import { AUDIENCE } from "./aboutConstants";

const AboutAudience: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Đối tượng sử dụng
          </h2>
        </div>

        <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-xl border-2 border-blue-200">
          <p className="text-lg text-gray-700 text-center leading-relaxed mb-4">
            EnglishMaster được thiết kế phù hợp với{" "}
            <strong>mọi lứa tuổi</strong>, đặc biệt là:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {AUDIENCE.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="font-semibold text-gray-900">{item.title}</div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAudience;
