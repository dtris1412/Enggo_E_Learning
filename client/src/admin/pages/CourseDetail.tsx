import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  Play,
  FileText,
  Video,
  Headphones,
  CheckCircle,
  Award,
  Calendar,
  Plus,
  CreditCard as Edit,
  Trash2,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCourse } from "../contexts/courseContext";
import { useModule } from "../contexts/moduleContext";
import AddModuleModal from "../components/CourseManagement/Module/AddModuleModal";
import EditModuleModal from "../components/CourseManagement/Module/EditModuleModal";

const CourseDetail = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const { courses } = useCourse();
  const { modules, loading, fetchModulesByCourse, createModule, updateModule } =
    useModule();

  const [activeModule, setActiveModule] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);

  // Get course data from context
  const course = courses.find((c) => c.course_id === Number(course_id));

  useEffect(() => {
    if (course_id) {
      fetchModulesByCourse(Number(course_id));
    }
  }, [course_id, fetchModulesByCourse]);

  const handleAddModule = () => {
    setShowAddModal(true);
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    setShowEditModal(true);
  };

  const handleSubmitAddModule = async (data: any) => {
    if (!course_id) return;
    const success = await createModule(
      Number(course_id),
      data.module_title,
      data.module_description,
      data.order_index,
      data.estimated_time
    );
    if (success) {
      setShowAddModal(false);
    }
  };

  const handleSubmitEditModule = async (data: any) => {
    if (editingModule) {
      const success = await updateModule(
        editingModule.module_id,
        data.module_title,
        data.module_description,
        data.order_index,
        data.estimated_time
      );
      if (success) {
        setShowEditModal(false);
      }
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Khóa học không tồn tại</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/courses"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {course.course_title}
            </h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddModule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Module
          </button>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modules</p>
              <p className="text-2xl font-bold text-gray-900">
                {modules.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cấp độ</p>
              <p className="text-lg font-bold text-gray-900">
                {getLevelText(course.course_level)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thời lượng</p>
              <p className="text-lg font-bold text-gray-900">
                {course.estimate_duration}
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
              <p className="text-sm font-medium text-gray-600">Tag</p>
              <p className="text-lg font-bold text-gray-900">{course.tag}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Nội dung khóa học
              </h2>
              <p className="text-gray-600">Chi tiết các module và bài học</p>
            </div>
            <button
              onClick={handleAddModule}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Module
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Chưa có module nào</p>
              <button
                onClick={handleAddModule}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Module đầu tiên
              </button>
            </div>
          ) : (
            <>
              {/* Module Tabs Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                {modules
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((module, index) => (
                    <button
                      key={module.module_id}
                      onClick={() => setActiveModule(index)}
                      className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeModule === index
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Module {module.order_index}
                    </button>
                  ))}
              </div>

              {/* Active Module Content */}
              {modules
                .sort((a, b) => a.order_index - b.order_index)
                .map((module, index) => (
                  <div
                    key={module.module_id}
                    className={`${activeModule === index ? "block" : "hidden"}`}
                  >
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {module.module_title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {module.module_description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              Thời gian: {module.estimated_time} giờ
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Đang hoạt động
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditModule(module)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Chỉnh sửa
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Tiến độ module
                          </span>
                          <span className="text-sm text-gray-600">0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lessons in Module */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          Bài học trong module
                        </h4>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                          <Plus className="h-4 w-4" />
                          Thêm bài học
                        </button>
                      </div>

                      {/* Placeholder for lessons - will be replaced with actual lesson data */}
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">
                          Chưa có bài học nào trong module này
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Thêm bài học đầu tiên
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Objectives */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mục tiêu khóa học
          </h3>
          <div className="text-gray-700 whitespace-pre-line">
            {course.course_aim}
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin khóa học
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Giá:</span>
              <span className="font-semibold text-gray-900">
                {course.is_free
                  ? "Miễn phí"
                  : `${course.price.toLocaleString("vi-VN")} VNĐ`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  course.course_status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {course.course_status ? "Hoạt động" : "Khóa"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="text-gray-900">
                {new Date(course.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cập nhật lần cuối:</span>
              <span className="text-gray-900">
                {new Date(course.updated_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddModuleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAddModule}
        existingModulesCount={modules.length}
      />

      <EditModuleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEditModule}
        initialData={
          editingModule || {
            module_title: "",
            module_description: "",
            order_index: 1,
            estimated_time: 0,
          }
        }
      />
    </div>
  );
};

export default CourseDetail;
