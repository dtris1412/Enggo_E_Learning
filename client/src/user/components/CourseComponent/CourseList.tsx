import { useState, useEffect } from "react";
import { useCourse } from "../../contexts/courseContext";
import CourseCard from "./CourseCard";
import { Search, Filter, Loader2 } from "lucide-react";

const CourseList: React.FC = () => {
  const {
    courses,
    totalCourses,
    currentPage,
    totalPages,
    loading,
    error,
    fetchCoursesPaginated,
  } = useCourse();

  const [search, setSearch] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [accessType, setAccessType] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCoursesPaginated(
      search,
      currentPage,
      12,
      courseLevel,
      accessType,
      undefined,
      sortBy,
      sortOrder,
    );
  }, [currentPage, courseLevel, accessType, sortBy, sortOrder]);

  const handleSearch = () => {
    fetchCoursesPaginated(
      search,
      1,
      12,
      courseLevel,
      accessType,
      undefined,
      sortBy,
      sortOrder,
    );
  };

  const handlePageChange = (page: number) => {
    fetchCoursesPaginated(
      search,
      page,
      12,
      courseLevel,
      accessType,
      undefined,
      sortBy,
      sortOrder,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Tìm kiếm
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Bộ lọc
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trình độ
                </label>
                <select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loại khóa học
                </label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value="free">Miễn phí</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sắp xếp
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at-DESC">Mới nhất</option>
                  <option value="created_at-ASC">Cũ nhất</option>
                  <option value="course_title-ASC">Tên A-Z</option>
                  <option value="course_title-DESC">Tên Z-A</option>
                  <option value="estimate_duration-ASC">
                    Thời lượng tăng dần
                  </option>
                  <option value="estimate_duration-DESC">
                    Thời lượng giảm dần
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            Tìm thấy <span className="font-semibold">{totalCourses}</span> khóa
            học
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">
                  Không tìm thấy khóa học nào
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {courses.map((course) => (
                  <CourseCard key={course.course_id} course={course} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseList;
