import React from "react";
import { RESEARCH_OBJECTIVES } from "./aboutConstants";

const AboutResearch: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Mục tiêu nghiên cứu
          </h2>
          <p className="text-xl text-gray-600">
            Nền tảng khoa học và công nghệ đằng sau hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_OBJECTIVES.map((objective, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {index + 1}
                </div>
                <p className="text-gray-700">{objective}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutResearch;
