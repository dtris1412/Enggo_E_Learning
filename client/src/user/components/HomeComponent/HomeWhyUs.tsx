const HomeWhyUs: React.FC = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Why us ── */}
        <div className="text-center mb-8">
          <span className="text-violet-600 text-sm font-semibold uppercase tracking-wider">
            Điểm khác biệt
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-2">
            Tại sao chọn{" "}
            <span className="text-violet-600">Enggo E-Learning?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Lộ trình cá nhân hóa",
              desc: "AI phân tích trình độ và mục tiêu của bạn để tạo ra kế hoạch học tập tối ưu nhất.",
            },
            {
              title: "Kiểm tra thực chiến",
              desc: "Bộ đề thi IELTS/TOEIC chuẩn format quốc tế, cập nhật liên tục theo xu hướng đề mới.",
            },
            {
              title: "Theo dõi tiến độ 360°",
              desc: "Dashboard trực quan cho thấy điểm mạnh, điểm yếu và hướng cải thiện từng ngày.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeWhyUs;
