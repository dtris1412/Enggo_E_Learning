import { Clock, Users, Award, Play, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const OnlineTests = () => {
  const [selectedTest, setSelectedTest] = useState(null);

  const testCategories = [
    {
      id: 'ielts',
      name: 'IELTS',
      description: 'Bài thi thử IELTS với format chính thức',
      testCount: 25,
      color: 'blue'
    },
    {
      id: 'toeic',
      name: 'TOEIC',
      description: 'Luyện thi TOEIC với đề thi cập nhật',
      testCount: 30,
      color: 'green'
    },
    {
      id: 'placement',
      name: 'Kiểm tra trình độ',
      description: 'Đánh giá trình độ tiếng Anh hiện tại',
      testCount: 10,
      color: 'purple'
    },
    {
      id: 'skills',
      name: 'Kỹ năng chuyên biệt',
      description: 'Luyện tập từng kỹ năng riêng biệt',
      testCount: 40,
      color: 'orange'
    }
  ];

  const featuredTests = [
    {
      id: 1,
      title: "IELTS Academic Reading Test 2024",
      category: 'IELTS Academic',
      duration: '60 phút',
      questions: 40,
      participants: 1250,
      difficulty: 'Trung bình',
      description: 'Bài test Reading chính thức với 3 passages và 40 câu hỏi',
      features: ['Chấm điểm tự động', 'Giải thích chi tiết', 'Thống kê kết quả', 'So sánh với người khác'],
      image: 'https://images.pexels.com/photos/1181242/pexels-photo-1181242.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: "TOEIC Listening & Reading Full Test",
      category: 'TOEIC',
      duration: '120 phút',
      questions: 200,
      participants: 980,
      difficulty: 'Nâng cao',
      description: 'Bài thi TOEIC đầy đủ với 200 câu hỏi theo format mới nhất',
      features: ['Format chính thức', 'Audio chất lượng cao', 'Báo cáo chi tiết', 'Dự đoán điểm số'],
      image: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: "Business English Placement Test",
      category: 'Placement',
      duration: '45 phút',
      questions: 50,
      participants: 650,
      difficulty: 'Đa cấp độ',
      description: 'Đánh giá trình độ tiếng Anh thương mại của bạn',
      features: ['Đa cấp độ', 'Kết quả ngay lập tức', 'Gợi ý khóa học', 'Chứng chỉ hoàn thành'],
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const skillTests = [
    {
      skill: 'Listening',
      tests: 15,
      icon: '🎧',
      description: 'Luyện nghe với nhiều giọng khác nhau'
    },
    {
      skill: 'Reading',
      tests: 12,
      icon: '📖',
      description: 'Đọc hiểu với các chủ đề đa dạng'
    },
    {
      skill: 'Grammar',
      tests: 20,
      icon: '📝',
      description: 'Kiểm tra ngữ pháp từ cơ bản đến nâng cao'
    },
    {
      skill: 'Vocabulary',
      tests: 18,
      icon: '📚',
      description: 'Mở rộng vốn từ vựng theo chủ đề'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Thi thử Online
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Hệ thống thi thử trực tuyến với hàng trăm đề thi chuẩn quốc tế, 
              chấm điểm tự động và phân tích kết quả chi tiết
            </p>
          </div>
        </div>
      </section>

      {/* Test Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Danh mục bài thi
            </h2>
            <p className="text-xl text-gray-600">
              Chọn loại bài thi phù hợp với mục tiêu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testCategories.map((category) => (
              <div key={category.id} className="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-blue-600 card-hover cursor-pointer">
                <div className={`w-16 h-16 bg-${category.color}-100 text-${category.color}-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                  {category.testCount}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {category.description}
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  {category.testCount} bài thi có sẵn
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tests */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Bài thi nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Được nhiều học viên lựa chọn và đánh giá cao
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredTests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden card-hover">
                <img
                  src={test.image}
                  alt={test.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      {test.category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {test.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {test.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {test.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">{test.duration}</span>
                    </div>
                    <div>
                      <Award className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">{test.questions} câu</span>
                    </div>
                    <div>
                      <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">{test.participants} người</span>
                    </div>
                  </div>

                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    {test.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center">
                    <Play className="h-4 w-4 mr-2" />
                    Bắt đầu thi thử
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill-based Tests */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Luyện tập theo kỹ năng
            </h2>
            <p className="text-xl text-gray-600">
              Tập trung vào từng kỹ năng để cải thiện hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillTests.map((test, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 card-hover">
                <div className="text-4xl mb-4">{test.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {test.skill}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {test.description}
                </p>
                <div className="text-blue-600 font-medium mb-4">
                  {test.tests} bài thi
                </div>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-md">
                  Luyện tập ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Features */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-blue-100">
              Hệ thống thi thử hiện đại với nhiều tính năng hỗ trợ học tập
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chấm điểm tự động</h3>
              <p className="text-blue-100">Kết quả chính xác ngay sau khi hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý thời gian</h3>
              <p className="text-blue-100">Đồng hồ đếm ngược giống thi thật</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phân tích chi tiết</h3>
              <p className="text-blue-100">Báo cáo kết quả với gợi ý cải thiện</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OnlineTests;