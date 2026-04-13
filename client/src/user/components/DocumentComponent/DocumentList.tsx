import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDocument } from "../../contexts/documentContext.tsx";
import { useToast } from "../../../shared/components/Toast/Toast.tsx";
import DocumentListItem from "./DocumentListItem";
import Pagination from "../../../shared/components/Pagination";
import { Search, FileText, TrendingUp, Eye, Download } from "lucide-react";

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
  const [itemsPerPage] = useState(2);
  const [topDocuments, setTopDocuments] = useState<any[]>([]);
  const [userHasPremium, setUserHasPremium] = useState(false);
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
      urlPage,
      itemsPerPage,
      documentTypeFilter,
      accessTypeFilter,
    );
  }, [urlPage, documentTypeFilter, accessTypeFilter]);

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
      resetPage();
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

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
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
  };

  const handleDownload = async (document_id: number) => {
    const result = await downloadDocument(document_id);
    if (result.success) {
      showToast("success", "Đang tải tài liệu...");
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
          result.message || "Tải xuống thất bại. Vui lòng đăng nhập trước.",
        );
      }
    }
  };

  const documentTypes = [
    { value: "", label: "Tất cả" },
    { value: "learning", label: "Học tập" },
    { value: "reference", label: "Tham khảo" },
    { value: "guideline", label: "Hướng dẫn" },
    { value: "other", label: "Khác" },
  ];

  const accessTypes = [
    { value: "", label: "Tất cả" },
    { value: "free", label: "Miễn phí" },
    { value: "premium", label: "Premium" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-[300px] h-[300px] bg-violet-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-violet-700/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Thư viện
            </span>
            <h1 className="text-3xl lg:text-4xl font-black leading-tight">
              <span className="text-white">Tài liệu</span>{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                học tập
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Content - Main Documents List */}
          <div className="lg:col-span-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tài liệu..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              {documentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDocumentTypeFilter(type.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    documentTypeFilter === type.value
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-300 hover:border-violet-500 hover:text-violet-600"
                  }`}
                >
                  {type.label}
                </button>
              ))}

              <div className="w-px bg-slate-300 mx-2"></div>

              {accessTypes.map((access) => (
                <button
                  key={access.value}
                  onClick={() => setAccessTypeFilter(access.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    accessTypeFilter === access.value
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-300 hover:border-violet-500 hover:text-violet-600"
                  }`}
                >
                  {access.label}
                </button>
              ))}
            </div>

            {/* Result Count */}
            <div className="mb-4 text-sm text-slate-600">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && documents.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg">
                <FileText className="w-20 h-20 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Không tìm thấy tài liệu
                </h3>
                <p className="text-slate-500">
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
                <Pagination
                  currentPage={urlPage}
                  totalPages={totalPages}
                  buildPageUrl={buildPageUrl}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              {/* Popular Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-violet-700 text-white px-5 py-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tài liệu phổ biến
                  </h3>
                </div>
                <div className="divide-y divide-slate-200">
                  {topDocuments.length > 0 ? (
                    topDocuments.map((doc) => (
                      <div
                        key={doc.document_id}
                        onClick={() =>
                          navigate(`/documents/${doc.document_id}`)
                        }
                        className="p-4 hover:bg-violet-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-20 h-16 bg-violet-700 rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 mb-1">
                              {doc.document_name}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
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
                    <div className="p-8 text-center text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">Chưa có tài liệu</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Info */}
              <div className="mt-6 bg-violet-800 text-white rounded-md p-6">
                <h3 className="font-bold text-lg mb-2">
                  Tài liệu chất lượng cao
                </h3>
                <p className="text-sm text-violet-200 mb-4">
                  Truy cập hàng trăm tài liệu học tập được tuyển chọn kỹ lưỡng
                  từ các nguồn uy tín.
                </p>
                <div className="text-sm text-violet-200">
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
