import { useState, useEffect } from "react";
import { useRoadmap } from "../../contexts/roadmapContext";
import RoadmapCard from "./RoadmapCard";
import { Search, Filter, Loader2, Map } from "lucide-react";

const RoadmapList: React.FC = () => {
  const {
    roadmaps,
    totalRoadmaps,
    currentPage,
    totalPages,
    loading,
    error,
    fetchRoadmapsPaginated,
  } = useRoadmap();

  const [search, setSearch] = useState("");
  const [roadmapLevel, setRoadmapLevel] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRoadmapsPaginated(
      search,
      currentPage,
      12,
      roadmapLevel,
      undefined,
      sortBy,
      sortOrder,
    );
  }, [currentPage, roadmapLevel, sortBy, sortOrder]);

  const handleSearch = () => {
    fetchRoadmapsPaginated(
      search,
      1,
      12,
      roadmapLevel,
      undefined,
      sortBy,
      sortOrder,
    );
  };

  const handlePageChange = (page: number) => {
    fetchRoadmapsPaginated(
      search,
      page,
      12,
      roadmapLevel,
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Map className="h-12 w-12 mr-3" />
              <h1 className="text-4xl lg:text-5xl font-bold">Lộ Trình Học</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Khám phá các lộ trình học tập có cấu trúc, từ cơ bản đến nâng cao
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lộ trình..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Bộ lọc
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trình độ
                </label>
                <select
                  value={roadmapLevel}
                  onChange={(e) => setRoadmapLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at-DESC">Mới nhất</option>
                  <option value="created_at-ASC">Cũ nhất</option>
                  <option value="roadmap_title-ASC">Tên A-Z</option>
                  <option value="roadmap_title-DESC">Tên Z-A</option>
                  <option value="estimated_duration-ASC">
                    Thời lượng ngắn nhất
                  </option>
                  <option value="estimated_duration-DESC">
                    Thời lượng dài nhất
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold">{totalRoadmaps}</span> lộ
            trình
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

        {/* Roadmaps Grid */}
        {!loading && !error && (
          <>
            {roadmaps.length === 0 ? (
              <div className="text-center py-20">
                <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Không tìm thấy lộ trình nào
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {roadmaps.map((roadmap) => (
                  <RoadmapCard key={roadmap.roadmap_id} roadmap={roadmap} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            : "border border-gray-300 hover:bg-gray-50"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default RoadmapList;
