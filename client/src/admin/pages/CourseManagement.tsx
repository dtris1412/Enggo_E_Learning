import {
  Search,
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { useState } from "react";

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const courses = [
    {
      id: 1,
      title: "IELTS Foundation - Nền tảng vững chắc",
      category: "IELTS",
      level: "Cơ bản",
      duration: "12 tuần",
      students: 1200,
      rating: 4.8,
      price: "2,500,000 VNĐ",
      status: "active",
      instructor: "Dr. Nguyễn Minh Hạnh",
      createdDate: "2023-12-01",
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 2,
      title: "TOEIC Complete - Chinh phục 990",
      category: "TOEIC",
      level: "Trung cấp",
      duration: "10 tuần",
      students: 750,
      rating: 4.7,
      price: "2,800,000 VNĐ",
      status: "active",
      instructor: "Mr. James Wilson",
      createdDate: "2023-11-15",
      image:
        "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 3,
      title: "Business English Pro",
      category: "Business",
      level: "Nâng cao",
      duration: "16 tuần",
      students: 520,
      rating: 4.8,
      price: "3,500,000 VNĐ",
      status: "draft",
      instructor: "Ms. Trần Thùy Linh",
      createdDate: "2024-01-10",
      image:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      id: 4,
      title: "Giao tiếp tiếng Anh căn bản",
      category: "General",
      level: "Cơ bản",
      duration: "6 tuần",
      students: 1500,
      rating: 4.6,
      price: "1,800,000 VNĐ",
      status: "active",
      instructor: "Ms. Sarah Johnson",
      createdDate: "2023-10-20",
      image:
        "https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=300",
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

  const getLevelColor = (level: string) => {
    switch (level) {
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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600">
            Quản lý nội dung và thông tin các khóa học
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tạo khóa học mới
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
                placeholder="Tìm kiếm khóa học hoặc giảng viên..."
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
            <option value="IELTS">IELTS</option>
            <option value="TOEIC">TOEIC</option>
            <option value="Business">Business English</option>
            <option value="General">Giao tiếp</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                    course.level
                  )}`}
                >
                  {course.level}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    course.status
                  )}`}
                >
                  {course.status === "active"
                    ? "Hoạt động"
                    : course.status === "draft"
                    ? "Bản nháp"
                    : "Không hoạt động"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3">
                Giảng viên: {course.instructor}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">{course.duration}</span>
                <Users className="h-4 w-4 mr-1" />
                <span className="mr-4">{course.students}</span>
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>{course.rating}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-blue-600">
                  {course.price}
                </span>
                <span className="text-sm text-gray-500">
                  {course.createdDate}
                </span>
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
          </div>
        ))}
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
              <p className="text-2xl font-bold text-gray-900">3,970</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
              <p className="text-2xl font-bold text-gray-900">4.7</p>
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
                Khóa học hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">3</p>
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
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
