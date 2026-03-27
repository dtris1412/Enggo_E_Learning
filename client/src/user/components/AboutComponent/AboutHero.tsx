import React from "react";

const AboutHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">EnglishMaster</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Hệ thống luyện thi tiếng Anh ứng dụng trí tuệ nhân tạo - Cá nhân hóa
            lộ trình học tập, nâng cao hiệu quả, tiết kiệm chi phí
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
