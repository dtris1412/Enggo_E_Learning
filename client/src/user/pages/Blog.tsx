import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'tips', name: 'Mẹo học tập' },
    { id: 'ielts', name: 'IELTS' },
    { id: 'toeic', name: 'TOEIC' },
    { id: 'grammar', name: 'Ngữ pháp' },
    { id: 'vocabulary', name: 'Từ vựng' }
  ];

  const allPosts = [
    {
      id: 1,
      title: "10 Mẹo học từ vựng tiếng Anh hiệu quả nhất",
      excerpt: "Khám phá những phương pháp học từ vựng được chứng minh khoa học, giúp bạn ghi nhớ lâu dài và ứng dụng linh hoạt trong giao tiếp.",
      content: "Việc học từ vựng tiếng Anh không chỉ là việc thuộc lòng mà còn là nghệ thuật...",
      author: "Nguyễn Minh Hạnh",
      date: "2024-01-15",
      readTime: "8 phút đọc",
      category: "vocabulary",
      tags: ["từ vựng", "học tập", "mẹo hay"],
      image: "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: true
    },
    {
      id: 2,
      title: "Chiến lược làm bài thi IELTS Reading đạt điểm cao",
      excerpt: "Hướng dẫn chi tiết các kỹ thuật đọc hiểu và quản lý thời gian trong phần Reading của kỳ thi IELTS.",
      content: "Phần Reading trong IELTS đòi hỏi không chỉ khả năng đọc hiểu mà còn...",
      author: "Ms. Sarah Johnson",
      date: "2024-01-12",
      readTime: "12 phút đọc",
      category: "ielts",
      tags: ["IELTS", "reading", "kỹ thuật thi"],
      image: "https://images.pexels.com/photos/1181242/pexels-photo-1181242.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: true
    },
    {
      id: 3,
      title: "Cách cải thiện phát âm tiếng Anh như người bản ngữ",
      excerpt: "Những bài tập và kỹ thuật giúp bạn có phát âm chuẩn, tự tin giao tiếp trong mọi tình huống.",
      content: "Phát âm chuẩn là chìa khóa để giao tiếp hiệu quả...",
      author: "Mr. James Wilson",
      date: "2024-01-10",
      readTime: "10 phút đọc",
      category: "tips",
      tags: ["phát âm", "speaking", "giao tiếp"],
      image: "https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: false
    },
    {
      id: 4,
      title: "Ngữ pháp tiếng Anh: Thì hiện tại hoàn thành",
      excerpt: "Giải thích chi tiết và bài tập thực hành về thì hiện tại hoàn thành - một trong những thì khó nhất.",
      content: "Thì hiện tại hoàn thành (Present Perfect) là một trong những thì...",
      author: "Trần Thùy Linh",
      date: "2024-01-08",
      readTime: "6 phút đọc",
      category: "grammar",
      tags: ["ngữ pháp", "thì", "present perfect"],
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: false
    },
    {
      id: 5,
      title: "TOEIC Listening: Bí quyết đạt điểm tối đa",
      excerpt: "Phân tích từng part trong TOEIC Listening và chia sẻ những mẹo làm bài hiệu quả nhất.",
      content: "Phần Listening của TOEIC gồm 4 parts với những đặc điểm riêng...",
      author: "Lê Văn Nam",
      date: "2024-01-05",
      readTime: "15 phút đọc",
      category: "toeic",
      tags: ["TOEIC", "listening", "tips"],
      image: "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: false
    },
    {
      id: 6,
      title: "5 Lỗi thường gặp khi học tiếng Anh và cách khắc phục",
      excerpt: "Những sai lầm phổ biến mà học viên thường mắc phải và hướng dẫn cách sửa chữa hiệu quả.",
      content: "Trong quá trình học tiếng Anh, nhiều người thường mắc phải...",
      author: "Nguyễn Minh Hạnh",
      date: "2024-01-03",
      readTime: "7 phút đọc",
      category: "tips",
      tags: ["học tập", "lỗi thường gặp", "cải thiện"],
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600",
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = allPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Blog EnglishMaster
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Chia sẻ kiến thức, kinh nghiệm và những mẹo hay 
              để học tiếng Anh hiệu quả hơn mỗi ngày
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Bài viết nổi bật
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden card-hover">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-3">
                        Nổi bật
                      </span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-all duration-200 hover:scale-105">
                        Đọc thêm
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:text-blue-600 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden card-hover">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center transition-all duration-200 hover:scale-105">
                      Đọc thêm
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Xem thêm bài viết
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Đăng ký nhận bài viết mới
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nhận thông báo về các bài viết mới và tips học tiếng Anh hữu ích
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
            />
            <button className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;