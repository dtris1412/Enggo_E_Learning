import { useEffect, useState } from "react";
import { useLesson } from "../contexts/lessonContext";
import { useSkill } from "../contexts/skillContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  BookOpen,
  Calendar,
  Target,
  Clock,
  Award,
  Eye,
} from "lucide-react";
import AddLessonModal from "../components/LessonManagement/AddLessonModal.tsx";
import EditLessonModal from "../components/LessonManagement/EditLessonModal.tsx";
import ExportButton from "../components/ExportButton";

const LessonManagement = () => {
  const navigate = useNavigate();
  const {
    lessons,
    totalLessons,
    loading,
    fetchLessonsPaginated,
    createLesson,
    updateLesson,
    lockLesson,
    unlockLesson,
  } = useLesson();

  const { skills, fetchSkills } = useSkill();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterStatus, setFilterStatus] = useState<boolean | undefined>(
    undefined,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  useEffect(() => {
    fetchLessonsPaginated("", 100, 1);
    fetchSkills("", 100, 1);
  }, [fetchLessonsPaginated, fetchSkills]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLessonsPaginated(
        searchTerm,
        100,
        1,
        filterType,
        filterDifficulty,
        undefined,
        filterStatus,
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    filterType,
    filterDifficulty,
    filterStatus,
    fetchLessonsPaginated,
  ]);

  const handleCreateLesson = () => {
    setShowAddModal(true);
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setShowEditModal(true);
  };

  const handleSubmitAddLesson = async (data: any) => {
    const success = await createLesson(
      data.lesson_title,
      data.lesson_type,
      data.difficulty_level,
      data.lesson_content,
      data.is_exam_format,
      data.estimated_time,
      data.skill_id,
      data.lesson_status,
    );
    if (success) {
      setShowAddModal(false);
      fetchLessonsPaginated(
        searchTerm,
        100,
        1,
        filterType,
        filterDifficulty,
        undefined,
        filterStatus,
      );
    }
  };

  const handleSubmitEditLesson = async (data: any) => {
    if (editingLesson) {
      const success = await updateLesson(
        editingLesson.lesson_id,
        data.lesson_title,
        data.lesson_type,
        data.difficulty_level,
        data.lesson_content,
        data.is_exam_format,
        data.estimated_time,
        data.skill_id,
      );
      if (success) {
        setShowEditModal(false);
        fetchLessonsPaginated(
          searchTerm,
          100,
          1,
          filterType,
          filterDifficulty,
          undefined,
          filterStatus,
        );
      }
    }
  };

  const handleToggleLessonStatus = async (lesson: any) => {
    if (lesson.lesson_status) {
      await lockLesson(lesson.lesson_id);
    } else {
      await unlockLesson(lesson.lesson_id);
    }
    fetchLessonsPaginated(
      searchTerm,
      100,
      1,
      filterType,
      filterDifficulty,
      undefined,
      filterStatus,
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reading":
        return "text-blue-600";
      case "listening":
        return "text-purple-600";
      case "writing":
        return "text-green-600";
      case "speaking":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các bài học và nội dung học tập
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            type="lessons"
            filters={{
              search: searchTerm,
              lesson_type: filterType,
              lesson_difficult: filterDifficulty,
              lesson_status: filterStatus,
            }}
          />
          <button
            onClick={handleCreateLesson}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm bài học</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả loại</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="writing">Writing</option>
            <option value="speaking">Speaking</option>
            <option value="grammar">Grammar</option>
            <option value="vocabulary">Vocabulary</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả độ khó</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={
              filterStatus === undefined ? "" : filterStatus ? "true" : "false"
            }
            onChange={(e) =>
              setFilterStatus(
                e.target.value === "" ? undefined : e.target.value === "true",
              )
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Đã khóa</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Tổng số: <span className="font-semibold">{totalLessons}</span> bài học
        </div>
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có bài học nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề bài học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ khó
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ năng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <tr key={lesson.lesson_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{lesson.lesson_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen
                          className={`h-5 w-5 ${getTypeColor(
                            lesson.lesson_type,
                          )} mr-2`}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lesson.lesson_title}
                          </div>
                          {lesson.is_exam_format && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                              <Award className="h-3 w-3 mr-1" />
                              Định dạng thi
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {lesson.lesson_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(
                          lesson.difficulty_level,
                        )}`}
                      >
                        {lesson.difficulty_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Target className="h-4 w-4 text-blue-600 mr-1" />
                        {lesson.Skill?.skill_name || `ID: ${lesson.skill_id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.estimated_time
                          ? `${lesson.estimated_time} phút`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lesson.lesson_status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {lesson.lesson_status ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(lesson.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/lessons/${lesson.lesson_id}`)
                          }
                          className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleLessonStatus(lesson)}
                          className={`${
                            lesson.lesson_status
                              ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                              : "text-green-600 hover:text-green-800 hover:bg-green-50"
                          } p-2 rounded-lg`}
                          title={lesson.lesson_status ? "Khóa" : "Mở khóa"}
                        >
                          {lesson.lesson_status ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddLessonModal
        isOpen={showAddModal}
        skills={skills}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAddLesson}
      />

      <EditLessonModal
        isOpen={showEditModal}
        lesson={editingLesson}
        skills={skills}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEditLesson}
      />
    </div>
  );
};

export default LessonManagement;
