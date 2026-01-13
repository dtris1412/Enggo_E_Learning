import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  BookOpen,
  Filter,
  Calendar,
} from "lucide-react";
import { useCourse } from "../contexts/courseContext";
import AddCourseModal from "../components/CourseManagement/Course/AddCourseModal";
import EditCourseModal from "../components/CourseManagement/Course/EditCourseModal";

const CourseManagement = () => {
  const {
    courses,
    loading,
    fetchCoursesPaginated,
    createCourse,
    updateCourse,
    lockCourse,
    unlockCourse,
  } = useCourse();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  useEffect(() => {
    fetchCoursesPaginated("", 100, 1);
  }, [fetchCoursesPaginated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoursesPaginated(searchTerm, 100, 1, undefined, selectedTag);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedTag, fetchCoursesPaginated]);

  const handleCreateCourse = () => {
    setShowAddModal(true);
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setShowEditModal(true);
  };

  const handleSubmitAddCourse = async (data: any) => {
    const success = await createCourse(
      data.course_title,
      data.description,
      data.course_level,
      data.course_aim,
      data.estimate_duration,
      data.course_status,
      data.tag
    );
    if (success) {
      setShowAddModal(false);
    }
  };

  const handleSubmitEditCourse = async (data: any) => {
    if (editingCourse) {
      const success = await updateCourse(
        editingCourse.course_id,
        data.course_title,
        data.description,
        data.course_level,
        data.course_aim,
        data.estimate_duration,
        data.course_status,
        data.tag
      );
      if (success) {
        setShowEditModal(false);
      }
    }
  };

  const handleToggleCourseStatus = async (course: any) => {
    if (course.course_status) {
      await lockCourse(course.course_id);
    } else {
      await unlockCourse(course.course_id);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-orange-100 text-orange-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "Beginner":
        return "Cơ bản";
      case "Intermediate":
        return "Trung cấp";
      case "Advanced":
        return "Nâng cao";
      default:
        return level;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả các khóa học trong hệ thống
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo khóa học mới
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Lọc theo tag (IELTS, TOEIC, ...)"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Không tìm thấy khóa học nào</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {course.course_title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                            course.course_level
                          )}`}
                        >
                          {getLevelText(course.course_level)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {course.tag}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            course.course_status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.course_status ? "Hoạt động" : "Khóa"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Mục tiêu:</span>
                    <span className="text-gray-700 text-right truncate ml-2">
                      {course.course_aim}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Thời lượng:</span>
                    <span className="font-medium text-gray-900">
                      {course.estimate_duration} tuần
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo:
                    </span>
                    <span className="text-gray-700">
                      {formatDate(course.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleCourseStatus(course)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      course.course_status
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {course.course_status ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Khóa
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" />
                        Mở khóa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAddCourse}
      />

      <EditCourseModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEditCourse}
        initialData={
          editingCourse || {
            course_title: "",
            description: "",
            course_level: "Beginner",
            course_aim: "",
            estimate_duration: "",
            course_status: true,
            tag: "",
          }
        }
      />
    </div>
  );
};

export default CourseManagement;
