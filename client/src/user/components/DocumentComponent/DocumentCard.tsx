import React from "react";
import { FileText, Download, Eye, Calendar, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentCardProps {
  document: {
    document_id: number;
    document_type: string;
    document_name: string;
    document_description: string | null;
    document_url: string;
    document_size: string | null;
    file_type: string | null;
    view_count: number;
    download_count: number;
    access_type: "free" | "premium";
    created_at: string;
  };
  onDownload?: (document_id: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
}) => {
  const navigate = useNavigate();

  const formatFileSize = (bytes: string | null) => {
    if (!bytes) return "N/A";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="w-12 h-12 text-gray-400" />;
    if (fileType.includes("pdf"))
      return <FileText className="w-12 h-12 text-red-500" />;
    if (fileType.includes("word") || fileType.includes("docx"))
      return <FileText className="w-12 h-12 text-blue-500" />;
    if (fileType.includes("audio"))
      return <FileText className="w-12 h-12 text-green-500" />;
    return <FileText className="w-12 h-12 text-gray-400" />;
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

  const handleCardClick = () => {
    navigate(`/documents/${document.document_id}`);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(document.document_id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group"
    >
      {/* Header with Icon */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getFileIcon(document.file_type)}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                    document.document_type,
                  )}`}
                >
                  {document.document_type}
                </span>
                {document.access_type === "premium" && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {document.document_name}
        </h3>

        {document.document_description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {document.document_description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{document.view_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{document.download_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(document.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{document.file_type || "N/A"}</span>
            {" • "}
            <span>{formatFileSize(document.document_size)}</span>
          </div>

          <button
            onClick={handleDownloadClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
