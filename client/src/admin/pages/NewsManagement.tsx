import {
  Search,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import { useState } from "react";

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const news = [
    {
      id: 1,
      title: "10 Mẹo học từ vựng tiếng Anh hiệu quả nhất",
      excerpt:
        "Khám phá những phương pháp học từ vựng được chứng minh khoa học, giúp bạn ghi nhớ lâu dài và ứng dụng linh hoạt trong giao tiếp.",
      category: "Mẹo học tập",
      author: "Nguyễn Minh Hạnh",
      status: "published",
      publishDate: "2024-01-15",
      views: 2500,
      likes: 180,
      comments: 45,
      image:
        "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 2,
      title: "Chiến lược làm bài thi IELTS Reading đạt điểm cao",
      excerpt:
        "Hướng dẫn chi tiết các kỹ thuật đọc hiểu và quản lý thời gian trong phần Reading của kỳ thi IELTS.",
      category: "IELTS",
      author: "Ms. Sarah Johnson",
      status: "published",
      publishDate: "2024-01-12",
      views: 1800,
      likes: 120,
      comments: 32,
      image:
        "https://images.pexels.com/photos/1181242/pexels-photo-1181242.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 3,
      title: "Cách cải thiện phát âm tiếng Anh như người bản ngữ",
      excerpt:
        "Những bài tập và kỹ thuật giúp bạn có phát âm chuẩn, tự tin giao tiếp trong mọi tình huống.",
      category: "Phát âm",
      author: "Mr. James Wilson",
      status: "draft",
      publishDate: "2024-01-10",
      views: 0,
      likes: 0,
      comments: 0,
      image:
        "https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 4,
      title: "Ngữ pháp tiếng Anh: Thì hiện tại hoàn thành",
      excerpt:
        "Giải thích chi tiết và bài tập thực hành về thì hiện tại hoàn thành - một trong những thì khó nhất.",
      category: "Ngữ pháp",
      author: "Trần Thùy Linh",
      status: "published",
      publishDate: "2024-01-08",
      views: 1200,
      likes: 95,
      comments: 28,
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 5,
      title: "TOEIC Listening: Bí quyết đạt điểm tối đa",
      excerpt:
        "Phân tích từng part trong TOEIC Listening và chia sẻ những mẹo làm bài hiệu quả nhất.",
      category: "TOEIC",
      author: "Lê Văn Nam",
      status: "scheduled",
      publishDate: "2024-01-20",
      views: 0,
      likes: 0,
      comments: 0,
      image:
        "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Mẹo học tập", "IELTS", "TOEIC", "Ngữ pháp", "Phát âm"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
          <p className="text-gray-600">
            Tạo và quản lý nội dung blog, tin tức giáo dục
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài viết mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xuất bản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thống kê
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {article.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {article.author}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        article.status
                      )}`}
                    >
                      {article.status === "published"
                        ? "Đã xuất bản"
                        : article.status === "draft"
                        ? "Bản nháp"
                        : article.status === "scheduled"
                        ? "Đã lên lịch"
                        : "Đã lưu trữ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {article.publishDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{article.views} lượt xem</div>
                      <div className="text-gray-500">
                        {article.likes} thích • {article.comments} bình luận
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold text-gray-900">{news.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter((n) => n.status === "published").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bản nháp</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.filter((n) => n.status === "draft").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng lượt xem</p>
              <p className="text-2xl font-bold text-gray-900">
                {news.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsManagement;
