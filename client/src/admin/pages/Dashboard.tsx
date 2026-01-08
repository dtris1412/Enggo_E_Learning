import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Eye,
  Download,
  MessageSquare,
  Award,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Tổng học viên",
      value: "2,847",
      change: "+12%",
      changeType: "increase",
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Khóa học hoạt động",
      value: "24",
      change: "+3",
      changeType: "increase",
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
    },
    {
      title: "Bài thi đã hoàn thành",
      value: "15,632",
      change: "+8%",
      changeType: "increase",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: "87%",
      change: "+2%",
      changeType: "increase",
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "Hoàn thành khóa học IELTS Foundation",
      time: "2 phút trước",
      type: "course_completion",
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "Đăng ký khóa học TOEIC Intensive",
      time: "15 phút trước",
      type: "enrollment",
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "Hoàn thành bài thi thử IELTS Reading",
      time: "1 giờ trước",
      type: "test_completion",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "Gửi phản hồi về khóa học Business English",
      time: "2 giờ trước",
      type: "feedback",
    },
  ];

  const topCourses = [
    {
      id: 1,
      name: "IELTS Foundation",
      students: 1250,
      completion: 89,
      rating: 4.8,
    },
    {
      id: 2,
      name: "TOEIC Intensive",
      students: 980,
      completion: 92,
      rating: 4.7,
    },
    {
      id: 3,
      name: "Business English Pro",
      students: 750,
      completion: 85,
      rating: 4.9,
    },
    {
      id: 4,
      name: "Giao tiếp cơ bản",
      students: 1500,
      completion: 78,
      rating: 4.6,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống EnglishMaster</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} so với tháng trước
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Hoạt động gần đây
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === "course_completion" && (
                        <Award className="h-4 w-4 text-blue-600" />
                      )}
                      {activity.type === "enrollment" && (
                        <BookOpen className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "test_completion" && (
                        <FileText className="h-4 w-4 text-purple-600" />
                      )}
                      {activity.type === "feedback" && (
                        <MessageSquare className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Khóa học hàng đầu
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">
                      {course.students} học viên
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {course.completion}% hoàn thành
                    </p>
                    <p className="text-sm text-yellow-600">★ {course.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Tạo khóa học mới</h3>
            <p className="text-sm text-gray-600">Thêm khóa học vào hệ thống</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <FileText className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Tạo bài thi mới</h3>
            <p className="text-sm text-gray-600">Thêm bài thi thử mới</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <Users className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Quản lý người dùng</h3>
            <p className="text-sm text-gray-600">Xem và chỉnh sửa tài khoản</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
