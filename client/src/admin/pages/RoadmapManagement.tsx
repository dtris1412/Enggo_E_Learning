import {
  Search,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  Route,
  Target,
  Clock,
} from "lucide-react";
import { useState } from "react";

const RoadmapManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const roadmaps = [
    {
      id: 1,
      title: "Lộ trình IELTS từ 0 đến 7.0+",
      description: "Lộ trình học IELTS hoàn chỉnh cho người mới bắt đầu",
      target: "IELTS 7.0+",
      duration: "6 tháng",
      courses: 4,
      students: 850,
      status: "active",
      difficulty: "Trung cấp",
      createdDate: "2023-12-01",
    },
    {
      id: 2,
      title: "Lộ trình TOEIC 990 điểm",
      description: "Chinh phục điểm số tối đa trong kỳ thi TOEIC",
      target: "TOEIC 990",
      duration: "4 tháng",
      courses: 3,
      students: 620,
      status: "active",
      difficulty: "Nâng cao",
      createdDate: "2023-11-15",
    },
    {
      id: 3,
      title: "Lộ trình Business English chuyên nghiệp",
      description: "Phát triển kỹ năng tiếng Anh trong môi trường doanh nghiệp",
      target: "Business Fluency",
      duration: "8 tháng",
      courses: 5,
      students: 420,
      status: "draft",
      difficulty: "Nâng cao",
      createdDate: "2024-01-10",
    },
    {
      id: 4,
      title: "Lộ trình giao tiếp cơ bản đến thành thạo",
      description: "Từ người mới bắt đầu đến giao tiếp thành thạo",
      target: "Conversational Fluency",
      duration: "12 tháng",
      courses: 6,
      students: 1200,
      status: "active",
      difficulty: "Cơ bản",
      createdDate: "2023-10-01",
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRoadmaps = roadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lộ trình</h1>
          <p className="text-gray-600">
            Tạo và quản lý các lộ trình học tập có hệ thống
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tạo lộ trình mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm lộ trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Route className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {roadmap.title}
                  </h3>
                  <p className="text-sm text-gray-600">{roadmap.description}</p>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  roadmap.status
                )}`}
              >
                {roadmap.status === "active"
                  ? "Hoạt động"
                  : roadmap.status === "draft"
                  ? "Bản nháp"
                  : "Không hoạt động"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Mục tiêu: {roadmap.target}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Thời gian: {roadmap.duration}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-4">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{roadmap.courses}</span> khóa
                  học
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{roadmap.students}</span> học
                  viên
                </span>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                  roadmap.difficulty
                )}`}
              >
                {roadmap.difficulty}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Tạo ngày: {roadmap.createdDate}
              </span>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors duration-200">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50 transition-colors duration-200">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors duration-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Route className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng lộ trình</p>
              <p className="text-2xl font-bold text-gray-900">
                {roadmaps.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {roadmaps.filter((r) => r.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Edit className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bản nháp</p>
              <p className="text-2xl font-bold text-gray-900">
                {roadmaps.filter((r) => r.status === "draft").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {roadmaps.reduce((sum, r) => sum + r.students, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapManagement;
