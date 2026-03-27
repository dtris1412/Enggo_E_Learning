import React from "react";

const AboutProblemSolution: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Thách thức trong học tiếng Anh
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                Trong bối cảnh hội nhập quốc tế, các chứng chỉ tiếng Anh như{" "}
                <strong>IELTS, TOEIC</strong> đã trở thành yêu cầu quan trọng
                cho học tập, xin học bổng và cơ hội nghề nghiệp.
              </p>
              <p>Tuy nhiên, nhiều người gặp khó khăn do:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Thiếu môi trường phù hợp để luyện tập</li>
                <li>Không có lộ trình học tập cá nhân hóa</li>
                <li>Chi phí các trung tâm Anh ngữ rất đắt đỏ</li>
                <li>Không nhận được phản hồi chi tiết về điểm yếu</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Giải pháp với AI
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                EnglishMaster kết hợp <strong>trí tuệ nhân tạo</strong> với
                phương pháp giảng dạy hiện đại để mang đến trải nghiệm học tập
                vượt trội:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Đánh giá năng lực tự động và chính xác</li>
                <li>Phân tích điểm mạnh/yếu của từng cá nhân</li>
                <li>Gợi ý lộ trình học tập dựa trên AI</li>
                <li>Luyện tập mọi lúc, mọi nơi với chi phí hợp lý</li>
                <li>Phản hồi chi tiết cho từng bài làm</li>
              </ul>
              <p className="font-semibold text-blue-600">
                Học thông minh hơn, tiến bộ nhanh hơn!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProblemSolution;
