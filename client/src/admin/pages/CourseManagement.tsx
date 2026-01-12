import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  ArrowLeft,
  BookOpen,
  Award,
} from "lucide-react";
import { useCertificate } from "../contexts/certificateContext";
import { useCourse } from "../contexts/courseContext";
import AddCertificateModal from "../components/CourseManagement/Certificate/AddCertificateModal";
import EditCertificateModal from "../components/CourseManagement/Certificate/EditCertificateModal";
import AddCourseModal from "../components/CourseManagement/Course/AddCourseModal";
import EditCourseModal from "../components/CourseManagement/Course/EditCourseModal";

const CourseManagement = () => {
  const {
    certificates,
    loading: certLoading,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    lockCertificate,
    unlockCertificate,
  } = useCertificate();

  const {
    courses,
    loading: courseLoading,
    fetchCoursesByCertificate,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourse();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(
    null
  );
  const [selectedCertificateName, setSelectedCertificateName] = useState("");
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showEditCertificateModal, setShowEditCertificateModal] =
    useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  useEffect(() => {
    fetchCertificates("", 100, 1);
  }, [fetchCertificates]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (!selectedCertificate) {
        fetchCertificates(searchTerm, 100, 1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCertificate, fetchCertificates]);

  const handleSelectCertificate = (
    certificateId: number,
    certificateName: string
  ) => {
    setSelectedCertificate(certificateId);
    setSelectedCertificateName(certificateName);
    fetchCoursesByCertificate(certificateId);
  };

  const handleBackToCertificates = () => {
    setSelectedCertificate(null);
    setSelectedCertificateName("");
  };

  const handleCreateCertificate = () => {
    setShowAddCertificateModal(true);
  };

  const handleEditCertificate = (cert: any) => {
    setEditingCertificate(cert);
    setShowEditCertificateModal(true);
  };

  const handleSubmitAddCertificate = async (data: any) => {
    const success = await createCertificate(
      data.certificate_name,
      data.description,
      data.total_score
    );
    if (success) {
      setShowAddCertificateModal(false);
    }
  };

  const handleSubmitEditCertificate = async (data: any) => {
    if (editingCertificate) {
      const success = await updateCertificate(
        editingCertificate.certificate_id,
        data.certificate_name,
        data.description,
        data.total_score
      );
      if (success) {
        setShowEditCertificateModal(false);
      }
    }
  };

  const handleCreateCourse = () => {
    setShowAddCourseModal(true);
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setShowEditCourseModal(true);
  };

  const handleSubmitAddCourse = async (data: any) => {
    if (selectedCertificate) {
      const success = await createCourse(
        data.course_title,
        data.description,
        data.course_level,
        selectedCertificate,
        data.course_aim,
        data.estimate_duration
      );
      if (success) {
        setShowAddCourseModal(false);
      }
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
        data.estimate_duration
      );
      if (success) {
        setShowEditCourseModal(false);
      }
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      await deleteCourse(courseId);
    }
  };

  const handleToggleCertificateStatus = async (cert: any) => {
    if (cert.certificate_status) {
      await lockCertificate(cert.certificate_id);
    } else {
      await unlockCertificate(cert.certificate_id);
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
        <div className="flex items-center space-x-4">
          {selectedCertificate && (
            <button
              onClick={handleBackToCertificates}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCertificate ? "Quản lý khóa học" : "Quản lý chứng chỉ"}
            </h1>
            <p className="text-gray-600">
              {selectedCertificate
                ? `Các khóa học của chứng chỉ: ${selectedCertificateName}`
                : "Quản lý chứng chỉ và khóa học"}
            </p>
          </div>
        </div>
        <button
          onClick={
            selectedCertificate ? handleCreateCourse : handleCreateCertificate
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          {selectedCertificate ? "Tạo khóa học mới" : "Tạo chứng chỉ mới"}
        </button>
      </div>

      {/* Search Bar */}
      {!selectedCertificate && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm chứng chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      {!selectedCertificate && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certLoading ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Không có chứng chỉ nào</p>
            </div>
          ) : (
            certificates.map((cert) => (
              <div
                key={cert.certificate_id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cert.certificate_name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cert.certificate_status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cert.certificate_status ? "Hoạt động" : "Đã khóa"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {cert.description}
                </p>

                <div className="mb-4">
                  <span className="text-sm text-gray-500">Tổng điểm: </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {cert.total_score}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleSelectCertificate(
                        cert.certificate_id,
                        cert.certificate_name
                      )
                    }
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Xem khóa học
                  </button>
                  <button
                    onClick={() => handleEditCertificate(cert)}
                    className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleCertificateStatus(cert)}
                    className={`${
                      cert.certificate_status
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-3 py-2 rounded-lg transition-colors`}
                  >
                    {cert.certificate_status ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Courses List */}
      {selectedCertificate && (
        <div className="bg-white rounded-lg border border-gray-200">
          {courseLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Chưa có khóa học nào. Hãy tạo khóa học mới!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cấp độ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.course_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.course_title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {course.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                            course.course_level
                          )}`}
                        >
                          {getLevelText(course.course_level)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(course.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.course_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
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
      )}

      {/* Modals */}
      <AddCertificateModal
        isOpen={showAddCertificateModal}
        onClose={() => setShowAddCertificateModal(false)}
        onSubmit={handleSubmitAddCertificate}
      />

      <EditCertificateModal
        isOpen={showEditCertificateModal}
        onClose={() => setShowEditCertificateModal(false)}
        onSubmit={handleSubmitEditCertificate}
        initialData={
          editingCertificate || {
            certificate_name: "",
            description: "",
            total_score: 0,
          }
        }
      />

      <AddCourseModal
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        onSubmit={handleSubmitAddCourse}
      />

      <EditCourseModal
        isOpen={showEditCourseModal}
        onClose={() => setShowEditCourseModal(false)}
        onSubmit={handleSubmitEditCourse}
        initialData={
          editingCourse || {
            course_title: "",
            description: "",
            course_level: "Beginner",
            course_aim: "",
            estimate_duration: "",
          }
        }
      />
    </div>
  );
};

export default CourseManagement;
