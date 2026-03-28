import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../contexts/documentContext";
import { useToast } from "../../../shared/components/Toast/Toast";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { downloadDocument } = useDocument();
  const { showToast } = useToast();

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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

        const response = await fetch(`${API_URL}/user/subscriptions/active`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const headers: any = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/user/documents/${id}`, {
          method: "GET",
          headers,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setDocument(result.data);
        } else {
          // Check if it's a premium access error - only show modal if user doesn't have premium
          if (
            !userHasPremium &&
            (response.status === 401 ||
              response.status === 403 ||
              result.message?.toLowerCase().includes("premium") ||
              result.message?.toLowerCase().includes("authentication"))
          ) {
            setShowUpgradeModal(true);
          } else {
            showToast("error", result.message || "Không thể tải tài liệu");
            setTimeout(() => navigate("/documents"), 2000);
          }
        }
      } catch (error: any) {
        console.error("Error fetching document:", error);
        showToast("error", "Không thể tải tài liệu");
        setTimeout(() => navigate("/documents"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, userHasPremium]);

  const handleDownload = async () => {
    if (!document) return;

    const result = await downloadDocument(document.document_id);
    if (result.success) {
      showToast("success", "Đang tải tài liệu...");
      // Update download count in current view
      setDocument((prev: any) => ({
        ...prev,
        download_count: prev.download_count + 1,
      }));
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

  const getFileIcon = (fileType: string) => {
    const iconClass = "w-12 h-12";
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />;
      case "docx":
      case "doc":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "mp3":
      case "audio":
        return <FileText className={`${iconClass} text-purple-500`} />;
      default:
        return <FileText className={`${iconClass} text-slate-500`} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "learning":
        return "bg-blue-100 text-blue-800";
      case "reference":
        return "bg-purple-100 text-purple-800";
      case "guideline":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Premium Access Required Modal
  if (showUpgradeModal) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* Modal */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Header with gradient */}transition-all transform scale-100
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6 text-white relative">
              <div className="flex items-center justify-center mb-2">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <Lock className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center">
                Tài liệu Premium
              </h2>
            </div>
            {/* Body */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-700 leading-relaxed">
                    Tài liệu này yêu cầu gói Premium để xem và tải xuống.
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Nâng cấp ngay để truy cập kho tài liệu chất lượng cao và
                    nhiều tính năng độc quyền khác!
                  </p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 mb-6">
                <p className="font-semibold text-slate-800 mb-2 text-sm">
                  Lợi ích khi nâng cấp Premium:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Truy cập không giới hạn tài liệu Premium
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Hỗ trợ AI không giới hạn
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Tải xuống tài liệu offline
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Hỗ trợ ưu tiên 24/7
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    navigate("/documents");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={() => navigate("/subscription")}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Nâng cấp ngay
                </button>
              </div>

              {/* Additional info */}
              <p className="text-center text-xs text-slate-500 mt-4">
                Có thể hủy bất cứ lúc nào
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-center">
          <FileText className="w-20 h-20 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Không tìm thấy tài liệu
          </h3>
          <button
            onClick={() => navigate("/documents")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/documents")}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại tài liệu</span>
        </button>

        {/* Document Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white bg-opacity-20 rounded-lg">
                {getFileIcon(document.file_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <h1 className="text-3xl font-bold flex-1">
                    {document.document_name}
                  </h1>
                  {document.access_type === "premium" && (
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Premium
                    </span>
                  )}
                  {document.access_type === "free" && (
                    <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-sm font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Miễn phí
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(document.document_type)}`}
                  >
                    {document.document_type}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                    {document.file_type?.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                    {formatBytes(document.document_size)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Mô tả
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {document.description || "Chưa có mô tả."}
              </p>
            </div>

            {/* Document Viewer */}
            {document.document_url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">
                  Xem trước
                </h2>
                <div className="bg-slate-100 rounded-lg overflow-hidden">
                  {document.file_type?.toLowerCase() === "pdf" && (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.document_url)}&embedded=true`}
                      className="w-full h-[600px] border-0"
                      title="Xem PDF"
                    />
                  )}
                  {(document.file_type?.toLowerCase() === "mp3" ||
                    document.file_type?.toLowerCase() === "audio") && (
                    <div className="p-8">
                      <audio
                        controls
                        className="w-full"
                        src={document.document_url}
                      >
                        Trình duyệt của bạn không hỗ trợ phát âm thanh.
                      </audio>
                    </div>
                  )}
                  {(document.file_type?.toLowerCase() === "docx" ||
                    document.file_type?.toLowerCase() === "doc") && (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.document_url)}&embedded=true`}
                      className="w-full h-[600px] border-0"
                      title="Xem tài liệu"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Lượt xem</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {document.view_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Download className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">Lượt tải</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {document.download_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-slate-600">Ngày đăng</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDate(document.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Info */}
            {document.uploaded_by && (
              <div className="bg-slate-50 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-600">Đăng bởi</p>
                    <p className="font-semibold text-slate-900">
                      {document.uploaded_by}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <Download className="w-6 h-6" />
              Tải xuống tài liệu
            </button>

            {document.access_type === "premium" && !userHasPremium && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                <p className="text-center text-sm text-slate-700 mb-3 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">
                    Tài liệu Premium - Yêu cầu gói Premium để tải xuống
                  </span>
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Nâng cấp lên Premium
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
