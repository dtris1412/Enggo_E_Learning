import { Download, BookOpen, Video, FileText, Headphones } from 'lucide-react';

const Resources = () => {
  const resourceCategories = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Sách và Giáo trình",
      description: "Tài liệu học tập chính thức từ Cambridge, Oxford",
      count: "50+ tài liệu"
    },
    {
      icon: <Video className="h-8 w-8 text-red-600" />,
      title: "Video bài giảng",
      description: "Thư viện video bài giảng từ giảng viên chuyên nghiệp",
      count: "200+ videos"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Đề thi mẫu",
      description: "Bộ sưu tập đề thi IELTS, TOEIC cập nhật mới nhất",
      count: "100+ đề thi"
    },
    {
      icon: <Headphones className="h-8 w-8 text-purple-600" />,
      title: "Audio & Listening",
      description: "Tài liệu nghe với nhiều giọng và tốc độ khác nhau",
      count: "300+ files"
    }
  ];

  const featuredResources = [
    {
      id: 1,
      title: "Cambridge IELTS 18 - Official Practice Tests",
      category: "IELTS",
      type: "PDF + Audio",
      downloads: 2500,
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Bộ đề thi thực hành chính thức từ Cambridge với đáp án chi tiết"
    },
    {
      id: 2,
      title: "TOEIC Listening & Reading Test Prep",
      category: "TOEIC",
      type: "PDF",
      downloads: 1800,
      image: "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Bộ tài liệu luyện thi TOEIC với 1000+ câu hỏi thực hành"
    },
    {
      id: 3,
      title: "Business English Vocabulary Builder",
      category: "Business",
      type: "PDF + Audio",
      downloads: 1200,
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "1500 từ vựng tiếng Anh thương mại thiết yếu với ví dụ thực tế"
    },
    {
      id: 4,
      title: "English Grammar in Use - Advanced",
      category: "Grammar",
      type: "PDF",
      downloads: 3200,
      image: "https://images.pexels.com/photos/1181242/pexels-photo-1181242.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Sách ngữ pháp tiếng Anh nâng cao với bài tập thực hành"
    },
    {
      id: 5,
      title: "Pronunciation Workshop Videos",
      category: "Pronunciation",
      type: "Video Series",
      downloads: 950,
      image: "https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Chuỗi video hướng dẫn phát âm chuẩn với kỹ thuật chuyên nghiệp"
    },
    {
      id: 6,
      title: "Daily English Conversation Practice",
      category: "Speaking",
      type: "Audio + Transcript",
      downloads: 1600,
      image: "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "100 tình huống giao tiếp hàng ngày với audio và transcript"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Tài liệu học tập
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Kho tài liệu học tiếng Anh phong phú với chất lượng cao, 
              được cập nhật liên tục từ các nguồn uy tín
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Danh mục tài liệu
            </h2>
            <p className="text-xl text-gray-600">
              Tất cả những gì bạn cần để nâng cao trình độ tiếng Anh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 card-hover">
                <div className="flex justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {category.description}
                </p>
                <div className="text-sm font-medium text-blue-600">
                  {category.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tài liệu nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Được tải nhiều nhất và đánh giá cao bởi cộng đồng học viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden card-hover">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      {resource.category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="h-4 w-4 mr-1" />
                      <span>{resource.downloads} lượt tải</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Notice */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Truy cập toàn bộ tài liệu
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Đăng ký thành viên để được truy cập không giới hạn vào kho tài liệu 
              với hơn 1000+ tài liệu chất lượng cao
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Đăng ký ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;