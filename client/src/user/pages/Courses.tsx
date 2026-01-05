import { Clock, Users, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "ielts", name: "IELTS" },
    { id: "toeic", name: "TOEIC" },
    { id: "business", name: "Business English" },
    { id: "general", name: "Tiếng Anh giao tiếp" },
  ];

  const allCourses = [
    {
      id: 1,
      title: "IELTS Foundation - Nền tảng vững chắc",
      category: "ielts",
      level: "Cơ bản",
      duration: "12 tuần",
      students: 1200,
      rating: 4.8,
      price: "2,500,000 VNĐ",
      originalPrice: "3,000,000 VNĐ",
      description:
        "Khóa học dành cho người mới bắt đầu, xây dựng nền tảng vững chắc cho IELTS",
      features: [
        "4 kỹ năng cơ bản",
        "Từ vựng chuyên sâu",
        "Ngữ pháp nền tảng",
        "Bài tập thực hành",
      ],
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      title: "IELTS Intensive - Đột phá điểm số",
      category: "ielts",
      level: "Trung cấp",
      duration: "8 tuần",
      students: 890,
      rating: 4.9,
      price: "3,200,000 VNĐ",
      originalPrice: "3,800,000 VNĐ",
      description:
        "Khóa học chuyên sâu giúp học viên đạt điểm IELTS mục tiêu trong thời gian ngắn",
      features: [
        "Luyện đề chuyên sâu",
        "Kỹ thuật làm bài",
        "Mock test hàng tuần",
        "Chấm chữa chi tiết",
      ],
      image:
        "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      title: "TOEIC Complete - Chinh phục 990",
      category: "toeic",
      level: "Trung cấp",
      duration: "10 tuần",
      students: 750,
      rating: 4.7,
      price: "2,800,000 VNĐ",
      originalPrice: "3,300,000 VNĐ",
      description:
        "Lộ trình hoàn chỉnh cho kỳ thi TOEIC với phương pháp học hiệu quả",
      features: [
        "Listening intensive",
        "Reading strategies",
        "Vocabulary building",
        "5+ mock tests",
      ],
      image:
        "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      title: "Business English Pro",
      category: "business",
      level: "Nâng cao",
      duration: "16 tuần",
      students: 520,
      rating: 4.8,
      price: "3,500,000 VNĐ",
      originalPrice: "4,200,000 VNĐ",
      description: "Tiếng Anh chuyên ngành cho môi trường làm việc quốc tế",
      features: [
        "Presentation skills",
        "Email writing",
        "Meeting English",
        "Negotiation skills",
      ],
      image:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 5,
      title: "Giao tiếp tiếng Anh căn bản",
      category: "general",
      level: "Cơ bản",
      duration: "6 tuần",
      students: 1500,
      rating: 4.6,
      price: "1,800,000 VNĐ",
      originalPrice: "2,200,000 VNĐ",
      description:
        "Học tiếng Anh giao tiếp hàng ngày một cách tự nhiên và hiệu quả",
      features: [
        "Conversation practice",
        "Pronunciation training",
        "Daily situations",
        "Cultural insights",
      ],
      image:
        "https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 6,
      title: "Giao tiếp tiếng Anh nâng cao",
      category: "general",
      level: "Nâng cao",
      duration: "8 tuần",
      students: 680,
      rating: 4.7,
      price: "2,400,000 VNĐ",
      originalPrice: "2,900,000 VNĐ",
      description: "Nâng cao kỹ năng giao tiếp tiếng Anh lưu loát và tự tin",
      features: [
        "Advanced speaking",
        "Debate skills",
        "Public speaking",
        "Accent reduction",
      ],
      image:
        "https://images.pexels.com/photos/1181242/pexels-photo-1181242.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const filteredCourses =
    selectedCategory === "all"
      ? allCourses
      : allCourses.filter((course) => course.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Chương trình học
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Khám phá các khóa học tiếng Anh được thiết kế bài bản, phù hợp với
              mọi trình độ và mục tiêu
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:text-blue-600 border border-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden card-hover"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-4">{course.duration}</span>
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.students} học viên</span>
                  </div>

                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowRight className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        {course.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {course.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Không tìm thấy khóa học phù hợp?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Liên hệ với chúng tôi để được tư vấn lộ trình học tập cá nhân hóa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Tư vấn miễn phí
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Liên hệ hotline
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
