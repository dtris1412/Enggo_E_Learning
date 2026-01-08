import {
  Search,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Filter,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const ProgressTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const studentProgress = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      course: "IELTS Foundation",
      progress: 75,
      lessonsCompleted: 18,
      totalLessons: 24,
      testsCompleted: 5,
      averageScore: 7.2,
      lastActivity: "2024-01-20",
      timeSpent: "45 giờ",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      course: "TOEIC Complete",
      progress: 60,
      lessonsCompleted: 12,
      totalLessons: 20,
      testsCompleted: 3,
      averageScore: 750,
      lastActivity: "2024-01-19",
      timeSpent: "32 giờ",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      course: "Business English Pro",
      progress: 40,
      lessonsCompleted: 8,
      totalLessons: 20,
      testsCompleted: 2,
      averageScore: 6.5,
      lastActivity: "2024-01-18",
      timeSpent: "28 giờ",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      course: "Giao tiếp cơ bản",
      progress: 90,
      lessonsCompleted: 14,
      totalLessons: 16,
      testsCompleted: 8,
      averageScore: 8.1,
      lastActivity: "2024-01-20",
      timeSpent: "38 giờ",
      avatar:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
  ];

  const courseStats = [
    {
      course: "IELTS Foundation",
      totalStudents: 1200,
      activeStudents: 980,
      averageProgress: 68,
      completionRate: 85,
    },
    {
      course: "TOEIC Complete",
      totalStudents: 750,
      activeStudents: 620,
      averageProgress: 72,
      completionRate: 88,
    },
    {
      course: "Business English Pro",
      totalStudents: 520,
      activeStudents: 420,
      averageProgress: 65,
      completionRate: 82,
    },
    {
      course: "Giao tiếp cơ bản",
      totalStudents: 1500,
      activeStudents: 1200,
      averageProgress: 75,
      completionRate: 90,
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const filteredProgress = studentProgress.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = [
    "IELTS Foundation",
    "TOEIC Complete",
    "Business English Pro",
    "Giao tiếp cơ bản",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi tiến độ</h1>
          <p className="text-gray-600">Giám sát tiến độ học tập của học viên</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Báo cáo tuần
          </button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng học viên</p>
              <p className="text-2xl font-bold text-gray-900">3,970</p>
              <p className="text-sm text-green-600">+12% so với tháng trước</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tiến độ trung bình
              </p>
              <p className="text-2xl font-bold text-gray-900">70%</p>
              <p className="text-sm text-green-600">+5% so với tháng trước</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tỷ lệ hoàn thành
              </p>
              <p className="text-2xl font-bold text-gray-900">86%</p>
              <p className="text-sm text-green-600">+3% so với tháng trước</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Điểm trung bình
              </p>
              <p className="text-2xl font-bold text-gray-900">7.2</p>
              <p className="text-sm text-green-600">+0.3 so với tháng trước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Thống kê theo khóa học
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courseStats.map((stat, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">{stat.course}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng học viên:</span>
                  <span className="font-medium">{stat.totalStudents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đang học:</span>
                  <span className="font-medium text-green-600">
                    {stat.activeStudents}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiến độ TB:</span>
                  <span className="font-medium">{stat.averageProgress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-medium text-blue-600">
                    {stat.completionRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
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
                placeholder="Tìm kiếm học viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả khóa học</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động cuối
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProgress.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(
                            student.progress
                          )}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lessonsCompleted}/{student.totalLessons}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.averageScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.timeSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
