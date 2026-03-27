import React from "react";

const AboutProblemSolution: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Bối cảnh
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">
            Vấn đề &amp; <span className="text-blue-600">Giải pháp</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <h3 className="text-2xl font-black text-slate-900 mb-5">
              Thách thức trong học tiếng Anh
            </h3>
            <div className="space-y-4 text-slate-600">
              <p>
                Trong bối cảnh hội nhập quốc tế, các chứng chỉ tiếng Anh như{" "}
                <strong className="text-slate-800">IELTS, TOEIC</strong> đã trở
                thành yêu cầu quan trọng cho học tập, xin học bổng và cơ hội
                nghề nghiệp.
              </p>
              <p className="font-medium text-slate-700">
                Nhiều người gặp khó khăn do:
              </p>
              <ul className="space-y-2">
                {[
                  "Thiếu môi trường phù hợp để luyện tập",
                  "Không có lộ trình học tập cá nhân hóa",
                  "Chi phí các trung tâm Anh ngữ rất đắt đỏ",
                  "Không nhận được phản hồi chi tiết về điểm yếu",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-black mb-5">Giải pháp với AI</h3>
            <div className="space-y-4 text-blue-100">
              <p>
                Enggo kết hợp{" "}
                <strong className="text-white">trí tuệ nhân tạo</strong> với
                phương pháp giảng dạy hiện đại để mang đến trải nghiệm học tập
                vượt trội:
              </p>
              <ul className="space-y-2">
                {[
                  "Đánh giá năng lực tự động và chính xác",
                  "Phân tích điểm mạnh/yếu của từng cá nhân",
                  "Gợi ý lộ trình học tập dựa trên AI",
                  "Luyện tập mọi lúc, mọi nơi với chi phí hợp lý",
                  "Phản hồi chi tiết cho từng bài làm",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-bold text-amber-300 pt-2">
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
