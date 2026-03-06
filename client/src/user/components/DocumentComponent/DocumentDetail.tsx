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
} from "lucide-react";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocumentById, downloadDocument } = useDocument();
  const { showToast } = useToast();

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      setLoading(true);
      const doc = await getDocumentById(parseInt(id));

      if (doc) {
        setDocument(doc);
      } else {
        showToast("error", "Failed to load document");
      }
      setLoading(false);
    };

    fetchDocument();
  }, [id]);

  const handleDownload = async () => {
    if (!document) return;

    const result = await downloadDocument(document.document_id);
    if (result.success) {
      showToast("success", "Document is downloading...");
      // Update download count in current view
      setDocument((prev: any) => ({
        ...prev,
        download_count: prev.download_count + 1,
      }));
    } else {
      showToast(
        "error",
        result.message || "Failed to download document. Please login first.",
      );
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
        return <FileText className={`${iconClass} text-gray-500`} />;
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
        return "bg-gray-100 text-gray-800";
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Document not found
          </h3>
          <button
            onClick={() => navigate("/documents")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/documents")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Documents</span>
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
                      Free
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
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {document.description || "No description available."}
              </p>
            </div>

            {/* Document Viewer */}
            {document.document_url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Preview
                </h2>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {document.file_type?.toLowerCase() === "pdf" && (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.document_url)}&embedded=true`}
                      className="w-full h-[600px] border-0"
                      title="PDF Viewer"
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
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {(document.file_type?.toLowerCase() === "docx" ||
                    document.file_type?.toLowerCase() === "doc") && (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.document_url)}&embedded=true`}
                      className="w-full h-[600px] border-0"
                      title="Document Viewer"
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
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {document.view_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Download className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {document.download_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(document.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Info */}
            {document.uploaded_by && (
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Uploaded by</p>
                    <p className="font-semibold text-gray-900">
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
              Download Document
            </button>

            {document.access_type === "premium" && (
              <p className="text-center text-sm text-gray-500 mt-3">
                <Lock className="w-4 h-4 inline mr-1" />
                Premium content - Login required to download
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
