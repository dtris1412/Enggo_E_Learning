import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Filter,
} from "lucide-react";
import { useState } from "react";

const ReportManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const reportTypes = [
    {
      id: "overview",
      name: "Tổng quan",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    { id: "students", name: "Học viên", icon: <Users className="h-5 w-5" /> },
    { id: "courses", name: "Khóa học", icon: <BookOpen className="h-5 w-5" /> },
    { id: "tests", name: "Bài thi", icon: <Award className="h-5 w-5" /> },
    {
      id: "revenue",
      name: "Doanh thu",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  const overviewData = {
    totalStudents: 3970,
    newStudents: 485,
    activeCourses: 24,
    completedTests: 15632,
    revenue: 2850000000,
    growth: {
      students: 12,
      courses: 8,
      tests: 15,
      revenue: 18,
    },
  };

  const monthlyData = [
    { month: "T1", students: 320, revenue: 180000000, tests: 1200 },
    { month: "T2", students: 380, revenue: 220000000, tests: 1450 },
    { month: "T3", students: 420, revenue: 250000000, tests: 1680 },
    { month: "T4", students: 450, revenue: 280000000, tests: 1820 },
    { month: "T5", students: 485, revenue: 320000000, tests: 1950 },
    { month: "T6", students: 520, revenue: 350000000, tests: 2100 },
  ];

  const topCourses = [
    {
      name: "IELTS Foundation",
      students: 1250,
      revenue: 3125000000,
      completion: 89,
    },
    {
      name: "TOEIC Complete",
      students: 980,
      revenue: 2744000000,
      completion: 92,
    },
    {
      name: "Business English Pro",
      students: 750,
      revenue: 2625000000,
      completion: 85,
    },
    {
      name: "Giao tiếp cơ bản",
      students: 1500,
      revenue: 2700000000,
      completion: 78,
    },
  ];

  const studentStats = [
    {
      category: "Học viên mới",
      value: 485,
      change: "+12%",
      color: "text-green-600",
    },
    {
      category: "Học viên hoạt động",
      value: 3220,
      change: "+8%",
      color: "text-green-600",
    },
    {
      category: "Tỷ lệ hoàn thành",
      value: "86%",
      change: "+3%",
      color: "text-green-600",
    },
    {
      category: "Điểm trung bình",
      value: "7.2",
      change: "+0.3",
      color: "text-green-600",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý báo cáo</h1>
          <p className="text-gray-600">
            Thống kê và phân tích dữ liệu hệ thống
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedReport === type.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.icon}
              <span className="ml-2">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Report */}
      {selectedReport === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Tổng học viên
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.totalStudents.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    +{overviewData.growth.students}% so với tháng trước
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Khóa học hoạt động
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.activeCourses}
                  </p>
                  <p className="text-sm text-green-600">
                    +{overviewData.growth.courses}% so với tháng trước
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Bài thi hoàn thành
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewData.completedTests.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    +{overviewData.growth.tests}% so với tháng trước
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(overviewData.revenue)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{overviewData.growth.revenue}% so với tháng trước
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Growth Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tăng trưởng theo tháng
              </h3>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {data.month}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-900">
                        {data.students} học viên
                      </span>
                      <span className="text-sm text-green-600">
                        {formatCurrency(data.revenue)}
                      </span>
                      <span className="text-sm text-blue-600">
                        {data.tests} bài thi
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Khóa học hàng đầu
              </h3>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {course.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {course.students} học viên • {course.completion}% hoàn
                        thành
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(course.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Student Report */}
      {selectedReport === "students" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.category}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân tích học viên chi tiết
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Phân bố theo độ tuổi
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">18-25 tuổi</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">26-35 tuổi</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">36-45 tuổi</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trên 45 tuổi</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Phân bố theo khu vực
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      TP. Hồ Chí Minh
                    </span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hà Nội</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Đà Nẵng</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Các tỉnh khác</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <Download className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Xuất báo cáo Excel</h3>
            <p className="text-sm text-gray-600">Tải xuống báo cáo chi tiết</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <Calendar className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Lên lịch báo cáo</h3>
            <p className="text-sm text-gray-600">Tự động gửi báo cáo định kỳ</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <Filter className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Tùy chỉnh báo cáo</h3>
            <p className="text-sm text-gray-600">Tạo báo cáo theo yêu cầu</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
