import {
  Brain,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Sparkles,
  Users,
  BarChart,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Trí tuệ nhân tạo tiên tiến",
      description:
        "Ứng dụng AI để đánh giá, chấm điểm tự động và phản hồi chi tiết cho từng kỹ năng Nghe - Nói - Đọc - Viết",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Lộ trình học cá nhân hóa",
      description:
        "Thuật toán thông minh phân tích điểm mạnh/yếu, đề xuất lộ trình học tập phù hợp với từng cá nhân",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-blue-600" />,
      title: "Luyện nói với AI",
      description:
        "Rèn luyện kỹ năng giao tiếp với trợ lý AI, nhận phản hồi tức thì về phát âm, ngữ pháp và từ vựng",
    },
    {
      icon: <BarChart className="h-8 w-8 text-blue-600" />,
      title: "Phân tích chi tiết",
      description:
        "Báo cáo chi tiết về tiến độ học tập, điểm số từng phần và gợi ý cải thiện dựa trên dữ liệu thực tế",
    },
  ];

  const certifications = [
    {
      name: "IELTS",
      icon: "🎓",
      description:
        "Đề thi chuẩn quốc tế từ Cambridge, bao gồm đầy đủ 4 kỹ năng Listening, Reading, Writing, Speaking",
    },
    {
      name: "TOEIC",
      icon: "📋",
      description:
        "Tài liệu chính thống từ ETS, tập trung vào kỹ năng tiếng Anh trong môi trường doanh nghiệp",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-yellow-300 mr-3" />
              <h1 className="text-4xl lg:text-5xl font-bold">EnglishMaster</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Hệ thống luyện thi tiếng Anh ứng dụng trí tuệ nhân tạo - Cá nhân
              hóa lộ trình học tập, nâng cao hiệu quả, tiết kiệm chi phí
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
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

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Công nghệ AI tiên tiến giúp tối ưu hóa quá trình học tập
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 card-hover"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
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
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-5xl mb-4 text-center">{cert.icon}</div>
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

      {/* Research Objectives */}
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
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <p className="text-gray-700">
                  Nghiên cứu và lựa chọn mô hình AI phù hợp để xử lý các kỹ năng
                  Nghe - Nói - Đọc - Viết
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <p className="text-gray-700">
                  Phát triển hệ thống tự động chấm điểm và phản hồi chi tiết cho
                  từng phần thi
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <p className="text-gray-700">
                  Xây dựng thuật toán gợi ý lộ trình học tập dựa trên lịch sử và
                  điểm mạnh/yếu cá nhân
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <p className="text-gray-700">
                  Tạo môi trường học tập thuận tiện, có thể truy cập mọi lúc mọi
                  nơi
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <p className="text-gray-700">
                  Ứng dụng kỹ thuật Prompt Engineering để tối ưu hóa tương tác
                  với AI
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  6
                </div>
                <p className="text-gray-700">
                  Đánh giá và thử nghiệm hiệu quả của hệ thống trên môi trường
                  thực tế
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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
              <div className="text-center">
                <div className="text-4xl mb-2">🎓</div>
                <div className="font-semibold text-gray-900">
                  Học sinh - Sinh viên
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Chuẩn bị cho kỳ thi, xin học bổng
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💼</div>
                <div className="font-semibold text-gray-900">
                  Người lao động
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Nâng cao kỹ năng nghề nghiệp
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <div className="font-semibold text-gray-900">Du học sinh</div>
                <p className="text-sm text-gray-600 mt-1">
                  Đáp ứng yêu cầu quốc tế
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Award className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Kết quả đạt được
            </h2>
            <p className="text-xl text-blue-100">
              Những đổi mới mang tính đột phá trong giáo dục tiếng Anh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Hệ thống AI hoàn chỉnh</h3>
              <p className="text-blue-100">
                Tích hợp AI vào toàn bộ quy trình học tập từ đánh giá, phân tích
                đến gợi ý cải thiện
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Phản hồi chi tiết</h3>
              <p className="text-blue-100">
                Phân tích từng phần thi, chỉ ra điểm mạnh/yếu và đề xuất cách
                cải thiện cụ thể
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🗣️</div>
              <h3 className="text-xl font-bold mb-3">Luyện nói với AI</h3>
              <p className="text-blue-100">
                Rèn luyện kỹ năng giao tiếp thực tế với trợ lý AI thông minh,
                phản hồi tức thì
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3">Lộ trình cá nhân hóa</h3>
              <p className="text-blue-100">
                Thuật toán thông minh phân tích dữ liệu học tập và đề xuất lộ
                trình tối ưu cho từng cá nhân
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Tiết kiệm chi phí</h3>
              <p className="text-blue-100">
                Giảm thiểu chi phí học tập so với các trung tâm truyền thống
                nhưng vẫn đảm bảo chất lượng
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Đổi mới giáo dục</h3>
              <p className="text-blue-100">
                Góp phần cải tiến phương pháp giảng dạy và học tập tiếng Anh tại
                Việt Nam
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
