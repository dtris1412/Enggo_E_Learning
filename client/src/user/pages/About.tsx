import { Users, Award, BookOpen, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Mục tiêu rõ ràng",
      description: "Chúng tôi cam kết giúp học viên đạt được mục tiêu tiếng Anh một cách hiệu quả nhất"
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Chất lượng hàng đầu",
      description: "Đảm bảo chất lượng giảng dạy theo tiêu chuẩn quốc tế với đội ngũ giảng viên chuyên nghiệp"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Hỗ trợ tận tâm",
      description: "Đồng hành cùng học viên trong suốt quá trình học tập với sự hỗ trợ 24/7"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Phương pháp hiện đại",
      description: "Ứng dụng công nghệ và phương pháp giảng dạy tiên tiến để tối ưu hóa hiệu quả học tập"
    }
  ];

  const team = [
    {
      name: "Dr. Nguyễn Minh Hạnh",
      role: "Giám đốc Học thuật",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Tiến sĩ ngôn ngữ học, 15 năm kinh nghiệm giảng dạy IELTS"
    },
    {
      name: "Ms. Sarah Johnson",
      role: "Chuyên gia IELTS",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Cựu giám khảo IELTS, chứng chỉ CELTA, TESOL quốc tế"
    },
    {
      name: "Mr. James Wilson",
      role: "Chuyên gia TOEIC",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Thạc sĩ giáo dục, chuyên gia luyện thi TOEIC với 10 năm kinh nghiệm"
    },
    {
      name: "Ms. Trần Thùy Linh",
      role: "Chuyên gia Business English",
      image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "MBA quốc tế, 12 năm kinh nghiệm trong môi trường doanh nghiệp"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Về EnglishMaster
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Chúng tôi là nền tảng học tiếng Anh trực tuyến hàng đầu, 
              cam kết mang đến trải nghiệm học tập tối ưu cho mọi học viên
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ mệnh</h2>
              <p className="text-lg text-gray-700 mb-6">
                EnglishMaster được thành lập với sứ mệnh democratize English education - 
                làm cho việc học tiếng Anh chất lượng cao trở nên dễ dàng tiếp cận 
                với mọi người Việt Nam.
              </p>
              <p className="text-lg text-gray-700">
                Chúng tôi tin rằng ngôn ngữ là cầu nối kết nối con người với thế giới, 
                và mỗi cá nhân đều xứng đáng có cơ hội phát triển kỹ năng này một cách 
                hiệu quả và bền vững.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tầm nhìn</h2>
              <p className="text-lg text-gray-700 mb-6">
                Trở thành nền tảng giáo dục tiếng Anh trực tuyến số 1 tại Việt Nam, 
                được tin tưởng bởi hàng triệu học viên và đối tác.
              </p>
              <p className="text-lg text-gray-700">
                Chúng tôi hướng tới việc xây dựng một cộng đồng học tập năng động, 
                nơi mọi người có thể phát triển không chỉ kỹ năng ngôn ngữ mà còn 
                tự tin giao tiếp trên trường quốc tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 card-hover">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ chuyên gia
            </h2>
            <p className="text-xl text-gray-600">
              Những giảng viên hàng đầu với kinh nghiệm và chứng chỉ quốc tế
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 object-cover rounded-lg mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Thành tựu của chúng tôi
            </h2>
            <p className="text-xl text-blue-100">
              Những con số biết nói về hành trình phát triển
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-300 mb-2 hover:scale-110 transition-transform duration-300">10,000+</div>
              <div className="text-blue-100">Học viên đã tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-300 mb-2 hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-blue-100">Tỷ lệ đậu kỳ thi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-300 mb-2 hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-blue-100">Khóa học chất lượng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-300 mb-2 hover:scale-110 transition-transform duration-300">5</div>
              <div className="text-blue-100">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;