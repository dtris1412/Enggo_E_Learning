import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocument } from "../../contexts/documentContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import DocumentListItem from "./DocumentListItem";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  TrendingUp,
  Home,
  ChevronRight as ChevronRightIcon,
  Eye,
  Download,
} from "lucide-react";

const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const {
    documents,
    totalDocuments,
    currentPage,
    totalPages,
    loading,
    error,
    fetchDocumentsPaginated,
    downloadDocument,
  } = useDocument();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("");
  const [accessTypeFilter, setAccessTypeFilter] = useState("");
  const [itemsPerPage] = useState(12);
  const [topDocuments, setTopDocuments] = useState<any[]>([]);
  const [userHasPremium, setUserHasPremium] = useState(false);

  // Fetch user subscription status
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setUserHasPremium(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/subscriptions/active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();
        if (result.success && result.planName) {
          setUserHasPremium(result.planName.toLowerCase() === "premium");
        } else {
          setUserHasPremium(false);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setUserHasPremium(false);
      }
    };

    fetchUserSubscription();
  }, []);

  // Initial load
  useEffect(() => {
    fetchDocumentsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      documentTypeFilter,
      accessTypeFilter,
    );
  }, []);

  // Fetch top documents for sidebar (independent of search/filter)
  useEffect(() => {
    const fetchTopDocuments = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        const response = await fetch(
          `${API_URL}/user/documents?page=1&limit=5&sortBy=download_count&sortOrder=DESC`,
        );
        const data = await response.json();
        if (data.success) {
          setTopDocuments(data.data.documents || []);
        }
      } catch (error) {
        console.error("Failed to fetch top documents:", error);
      }
    };
    fetchTopDocuments();
  }, []);

  // Auto-search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDocumentsPaginated(
        searchTerm,
        1,
        itemsPerPage,
        documentTypeFilter,
        accessTypeFilter,
      );
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Auto-fetch when filters change
  useEffect(() => {
    fetchDocumentsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      documentTypeFilter,
      accessTypeFilter,
    );
  }, [documentTypeFilter, accessTypeFilter]);

  const handlePageChange = (page: number) => {
    fetchDocumentsPaginated(
      searchTerm,
      page,
      itemsPerPage,
      documentTypeFilter,
      accessTypeFilter,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = async (document_id: number) => {
    const result = await downloadDocument(document_id);
    if (result.success) {
      showToast("success", "Document is downloading...");
      // Refresh list to update download count
      fetchDocumentsPaginated(
        searchTerm,
        currentPage,
        itemsPerPage,
        documentTypeFilter,
        accessTypeFilter,
      );
    } else {
      // Check if it's a premium access issue - only redirect if user doesn't have premium
      if (
        !userHasPremium &&
        (result.message?.toLowerCase().includes("premium") ||
          result.message?.toLowerCase().includes("subscription"))
      ) {
        showToast(
          "info",
          "Tài liệu này yêu cầu gói Premium. Đang chuyển hướng...",
        );
        setTimeout(() => {
          navigate("/subscription");
        }, 1500);
      } else {
        showToast(
          "error",
          result.message || "Failed to download document. Please login first.",
        );
      }
    }
  };

  const documentTypes = [
    { value: "", label: "All Types" },
    { value: "learning", label: "Learning" },
    { value: "reference", label: "Reference" },
    { value: "guideline", label: "Guideline" },
    { value: "other", label: "Other" },
  ];

  const accessTypes = [
    { value: "", label: "Tất cả" },
    { value: "free", label: "Miễn phí" },
    { value: "premium", label: "Premium" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Background */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              TÀI LIỆU HỌC TẬP
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Kho tài liệu học tiếng Anh phong phú, chất lượng cao
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <a href="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </a>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Tài liệu học tập</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Content - Main Documents List */}
          <div className="lg:col-span-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tài liệu..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              {documentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDocumentTypeFilter(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    documentTypeFilter === type.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  {type.label}
                </button>
              ))}

              <div className="w-px bg-gray-300 mx-2"></div>

              {accessTypes.map((access) => (
                <button
                  key={access.value}
                  onClick={() => setAccessTypeFilter(access.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    accessTypeFilter === access.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  {access.label}
                </button>
              ))}
            </div>

            {/* Result Count */}
            <div className="mb-4 text-sm text-gray-600">
              Tìm thấy <span className="font-semibold">{totalDocuments}</span>{" "}
              tài liệu
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && documents.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg">
                <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy tài liệu
                </h3>
                <p className="text-gray-500">
                  Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            )}

            {/* Document List */}
            {!loading && documents.length > 0 && (
              <>
                <div className="space-y-0">
                  {documents.map((doc) => (
                    <DocumentListItem
                      key={doc.document_id}
                      document={doc}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              {/* Popular Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-5 py-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    TÀI LIỆU PHỔ BIẾN
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {topDocuments.length > 0 ? (
                    topDocuments.map((doc) => (
                      <div
                        key={doc.document_id}
                        onClick={() =>
                          navigate(`/documents/${doc.document_id}`)
                        }
                        className="p-4 hover:bg-blue-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-20 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                              {doc.document_name}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {doc.view_count || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {doc.download_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Chưa có tài liệu</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Info */}
              <div className="mt-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg p-6 shadow-lg">
                <BookOpen className="w-12 h-12 mb-4 text-blue-200" />
                <h3 className="font-bold text-lg mb-2">
                  Tài liệu chất lượng cao
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Truy cập hàng trăm tài liệu học tập được tuyển chọn kỹ lưỡng
                  từ các nguồn uy tín.
                </p>
                <div className="text-sm text-blue-100">
                  ✓ Cập nhật liên tục
                  <br />
                  ✓ Đa dạng chủ đề
                  <br />✓ Dễ dàng tải xuống
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
