import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useRoadmap } from "../../contexts/roadmapContext";
import RoadmapCard from "./RoadmapCard";
import { Search, Filter, Loader2, MapPin } from "lucide-react";
import Pagination from "../../../shared/components/Pagination";

const RoadmapList: React.FC = () => {
  const {
    roadmaps,
    totalRoadmaps,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const urlPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  const resetPage = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });

  useEffect(() => {
    fetchRoadmapsPaginated(
      search,
      urlPage,
      12,
      roadmapLevel,
      undefined,
      sortBy,
      sortOrder,
    );
  }, [urlPage, roadmapLevel, sortBy, sortOrder]);

  const handleSearch = () => {
    resetPage();
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
    if (e.key === "Enter") handleSearch();
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
                  placeholder="Tìm kiếm lộ trình..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-violet-600 text-white px-6 py-2 rounded-md font-medium hover:bg-violet-700 transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trình độ
                </label>
                <select
                  value={roadmapLevel}
                  onChange={(e) => setRoadmapLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="">Tất cả</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
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
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
          <p className="text-slate-600">
            Tìm thấy <span className="font-semibold">{totalRoadmaps}</span> lộ
            trình
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
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
                <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
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
            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              buildPageUrl={buildPageUrl}
              onPageChange={handlePageChange}
              className="mb-8"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RoadmapList;
