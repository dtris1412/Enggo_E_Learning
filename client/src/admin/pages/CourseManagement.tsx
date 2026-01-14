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
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  useEffect(() => {
    fetchCoursesPaginated("", 100, 1);
  }, [fetchCoursesPaginated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const statusFilter =
        selectedStatus === "" ? undefined : selectedStatus === "active";
      fetchCoursesPaginated(
        searchTerm,
        100,
        1,
        statusFilter,
        selectedLevel || undefined,
        selectedTag || undefined
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    selectedStatus,
    selectedLevel,
    selectedTag,
    fetchCoursesPaginated,
  ]);

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
      data.tag,
      data.price,
      data.is_free
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
        data.tag,
        data.price,
        data.is_free
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">Tất cả cấp độ</option>
              <option value="Beginner">Cơ bản</option>
              <option value="Intermediate">Trung cấp</option>
              <option value="Advanced">Nâng cao</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">Tất cả tag</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEIC">TOEIC</option>
              <option value="General English">General English</option>
              <option value="Business English">Business English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy khóa học nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left: Icon & Title */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {course.course_title}
                        </h3>
                        <div className="flex-shrink-0">
                          {course.is_free ? (
                            <span className="text-lg font-bold text-green-600">
                              MIỄN PHÍ
                            </span>
                          ) : (
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">
                                {new Intl.NumberFormat("vi-VN").format(
                                  course.price
                                )}{" "}
                                <span className="text-sm">VND</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        <span className="font-medium text-gray-700">
                          Mục tiêu:
                        </span>{" "}
                        {course.course_aim}
                      </p>

                      {/* Tags & Status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                            course.course_level
                          )}`}
                        >
                          {getLevelText(course.course_level)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {course.tag}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            course.course_status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.course_status ? "Hoạt động" : "Khóa"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {course.estimate_duration} tuần
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(course.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggleCourseStatus(course)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
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
            ))}
          </div>
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
            price: 0,
            is_free: false,
          }
        }
      />
    </div>
  );
};

export default CourseManagement;
