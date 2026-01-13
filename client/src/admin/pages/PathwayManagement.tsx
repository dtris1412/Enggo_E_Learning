import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  BookOpen,
  Calendar,
} from "lucide-react";
import { usePathway } from "../contexts/pathwayContext.tsx";

const PathwayManagement = () => {
  const { pathways, loading, fetchPathways, lockPathway, unlockPathway } =
    usePathway();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPathways();
  }, [fetchPathways]);

  const handleTogglePathwayStatus = async (pathway: any) => {
    if (pathway.pathway_status) {
      await lockPathway(pathway.pathway_id);
    } else {
      await unlockPathway(pathway.pathway_id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredPathways = pathways.filter((pathway: any) =>
    pathway.pathway_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lộ trình</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các lộ trình học trong hệ thống
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tạo lộ trình mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm lộ trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : filteredPathways.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">Không tìm thấy lộ trình nào</p>
          </div>
        ) : (
          filteredPathways.map((pathway: any) => (
            <div
              key={pathway.pathway_id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {pathway.pathway_title}
                      </h3>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          pathway.pathway_status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pathway.pathway_status ? "Hoạt động" : "Khóa"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pathway.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo:
                    </span>
                    <span className="text-gray-700">
                      {formatDate(pathway.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleTogglePathwayStatus(pathway)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      pathway.pathway_status
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {pathway.pathway_status ? (
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
    </div>
  );
};

export default PathwayManagement;
