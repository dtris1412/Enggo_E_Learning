import {
  Search,
  Star,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Eye,
  Reply,
} from "lucide-react";
import { useState } from "react";

const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const feedbacks = [
    {
      id: 1,
      user: {
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      },
      course: "IELTS Foundation",
      rating: 5,
      title: "Khóa học rất hữu ích và chất lượng",
      content:
        "Tôi rất hài lòng với khóa học này. Giảng viên nhiệt tình, tài liệu phong phú và phương pháp giảng dạy hiệu quả. Sau 3 tháng học, tôi đã cải thiện đáng kể kỹ năng tiếng Anh của mình.",
      date: "2024-01-20",
      status: "pending",
      type: "course",
    },
    {
      id: 2,
      user: {
        name: "Trần Thị B",
        email: "tranthib@email.com",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      },
      course: "TOEIC Complete",
      rating: 4,
      title: "Nội dung tốt nhưng cần cải thiện giao diện",
      content:
        "Khóa học có nội dung chất lượng và bài tập phong phú. Tuy nhiên, giao diện website có thể được cải thiện để dễ sử dụng hơn. Nhìn chung tôi khuyên mọi người nên tham gia.",
      date: "2024-01-19",
      status: "responded",
      type: "course",
    },
    {
      id: 3,
      user: {
        name: "Lê Văn C",
        email: "levanc@email.com",
        avatar:
          "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      },
      course: "Business English Pro",
      rating: 3,
      title: "Khóa học ổn nhưng giá hơi cao",
      content:
        "Nội dung khóa học khá tốt và phù hợp với nhu cầu công việc. Tuy nhiên, tôi cảm thấy mức giá hơi cao so với thời lượng khóa học. Hy vọng sẽ có thêm nhiều ưu đãi.",
      date: "2024-01-18",
      status: "pending",
      type: "course",
    },
    {
      id: 4,
      user: {
        name: "Phạm Thị D",
        email: "phamthid@email.com",
        avatar:
          "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      },
      course: "Giao tiếp cơ bản",
      rating: 5,
      title: "Tuyệt vời! Đúng như mong đợi",
      content:
        "Đây là khóa học tuyệt vời nhất tôi từng tham gia. Giảng viên rất chuyên nghiệp, hỗ trợ học viên tận tình. Tôi đã có thể giao tiếp tiếng Anh tự tin hơn rất nhiều.",
      date: "2024-01-17",
      status: "responded",
      type: "course",
    },
    {
      id: 5,
      user: {
        name: "Hoàng Văn E",
        email: "hoangvane@email.com",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      },
      course: "Hệ thống",
      rating: 2,
      title: "Gặp lỗi khi làm bài thi",
      content:
        "Tôi gặp lỗi khi làm bài thi trực tuyến. Hệ thống bị đứng và mất hết kết quả. Mong admin kiểm tra và khắc phục sớm.",
      date: "2024-01-16",
      status: "pending",
      type: "technical",
    },
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-800";
      case "technical":
        return "bg-red-100 text-red-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      selectedRating === "all" || feedback.rating.toString() === selectedRating;
    const matchesStatus =
      selectedStatus === "all" || feedback.status === selectedStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phản hồi</h1>
          <p className="text-gray-600">
            Theo dõi và phản hồi ý kiến của học viên
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng phản hồi</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedbacks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  feedbacks.reduce((sum, f) => sum + f.rating, 0) /
                  feedbacks.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Reply className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã phản hồi</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedbacks.filter((f) => f.status === "responded").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {feedbacks.filter((f) => f.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm kiếm phản hồi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="responded">Đã phản hồi</option>
              <option value="resolved">Đã giải quyết</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={feedback.user.avatar}
                  alt={feedback.user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {feedback.user.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        feedback.type
                      )}`}
                    >
                      {feedback.type === "course"
                        ? "Khóa học"
                        : feedback.type === "technical"
                        ? "Kỹ thuật"
                        : "Chung"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{feedback.user.email}</p>
                  <p className="text-sm text-gray-500">
                    Khóa học: {feedback.course}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    feedback.status
                  )}`}
                >
                  {feedback.status === "pending"
                    ? "Chờ xử lý"
                    : feedback.status === "responded"
                    ? "Đã phản hồi"
                    : "Đã giải quyết"}
                </span>
                <span className="text-sm text-gray-500">{feedback.date}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">{getRatingStars(feedback.rating)}</div>
                <span className="text-sm text-gray-600">
                  ({feedback.rating}/5)
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                {feedback.title}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {feedback.content}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors duration-200 flex items-center text-sm">
                <Eye className="h-4 w-4 mr-1" />
                Xem chi tiết
              </button>
              <button className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 transition-colors duration-200 flex items-center text-sm">
                <Reply className="h-4 w-4 mr-1" />
                Phản hồi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackManagement;
