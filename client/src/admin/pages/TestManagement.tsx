import {
  Search,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Award,
  Filter,
} from "lucide-react";
import { useState } from "react";

const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const tests = [
    {
      id: 1,
      title: "IELTS Academic Reading Test 2024",
      category: "IELTS",
      type: "Reading",
      duration: "60 phút",
      questions: 40,
      participants: 1250,
      difficulty: "Trung cấp",
      status: "active",
      averageScore: 6.5,
      createdDate: "2024-01-15",
      description: "Bài test Reading chính thức với 3 passages và 40 câu hỏi",
    },
    {
      id: 2,
      title: "TOEIC Listening & Reading Full Test",
      category: "TOEIC",
      type: "Full Test",
      duration: "120 phút",
      questions: 200,
      participants: 980,
      difficulty: "Nâng cao",
      status: "active",
      averageScore: 750,
      createdDate: "2024-01-12",
      description: "Bài thi TOEIC đầy đủ với 200 câu hỏi theo format mới nhất",
    },
    {
      id: 3,
      title: "Business English Placement Test",
      category: "Business",
      type: "Placement",
      duration: "45 phút",
      questions: 50,
      participants: 650,
      difficulty: "Đa cấp độ",
      status: "draft",
      averageScore: 0,
      createdDate: "2024-01-10",
      description: "Đánh giá trình độ tiếng Anh thương mại của học viên",
    },
    {
      id: 4,
      title: "Grammar Assessment Test",
      category: "Grammar",
      type: "Assessment",
      duration: "30 phút",
      questions: 25,
      participants: 1500,
      difficulty: "Cơ bản",
      status: "active",
      averageScore: 18.5,
      createdDate: "2024-01-08",
      description: "Kiểm tra kiến thức ngữ pháp cơ bản đến nâng cao",
    },
    {
      id: 5,
      title: "IELTS Speaking Mock Test",
      category: "IELTS",
      type: "Speaking",
      duration: "15 phút",
      questions: 3,
      participants: 420,
      difficulty: "Trung cấp",
      status: "inactive",
      averageScore: 6.0,
      createdDate: "2024-01-05",
      description: "Bài thi thử Speaking IELTS với 3 parts chuẩn",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Cơ bản":
        return "bg-blue-100 text-blue-800";
      case "Trung cấp":
        return "bg-orange-100 text-orange-800";
      case "Nâng cao":
        return "bg-red-100 text-red-800";
      case "Đa cấp độ":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thi thử</h1>
          <p className="text-gray-600">
            Tạo và quản lý các bài thi thử trực tuyến
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài thi mới
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
                placeholder="Tìm kiếm bài thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEIC">TOEIC</option>
              <option value="Business">Business</option>
              <option value="Grammar">Grammar</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {test.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {test.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                    {test.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                      test.difficulty
                    )}`}
                  >
                    {test.difficulty}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  test.status
                )}`}
              >
                {test.status === "active"
                  ? "Hoạt động"
                  : test.status === "draft"
                  ? "Bản nháp"
                  : "Không hoạt động"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">{test.duration}</span>
              </div>
              <div className="text-center">
                <Award className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">
                  {test.questions} câu
                </span>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-sm text-gray-600">
                  {test.participants}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-600">Điểm TB: </span>
                <span className="font-medium text-gray-900">
                  {test.averageScore > 0 ? test.averageScore : "N/A"}
                </span>
              </div>
              <span className="text-sm text-gray-500">{test.createdDate}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm">
                <Eye className="h-4 w-4 mr-1" />
                Xem
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-sm">
                <Edit className="h-4 w-4 mr-1" />
                Sửa
              </button>
              <button className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bài thi</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng thí sinh</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests
                  .reduce((sum, t) => sum + t.participants, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.filter((t) => t.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Edit className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bản nháp</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.filter((t) => t.status === "draft").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestManagement;
