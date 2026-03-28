import React from "react";
import { FileText, Download, Eye, Calendar, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentListItemProps {
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

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDownload,
}) => {
  const navigate = useNavigate();

  const formatFileSize = (bytes: string | null) => {
    if (!bytes) return "N/A";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileColor = (fileType: string | null) => {
    if (!fileType) return "text-slate-400";
    if (fileType.includes("pdf")) return "text-red-500";
    if (fileType.includes("word") || fileType.includes("docx"))
      return "text-violet-500";
    if (fileType.includes("audio")) return "text-green-500";
    return "text-slate-400";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "learning":
        return "bg-violet-50 text-violet-700";
      case "reference":
        return "bg-purple-50 text-purple-700";
      case "guideline":
        return "bg-green-50 text-green-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "learning":
        return "Học tập";
      case "reference":
        return "Tham khảo";
      case "guideline":
        return "Hướng dẫn";
      default:
        return type;
    }
  };

  const handleClick = () => {
    navigate(`/documents/${document.document_id}`);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) onDownload(document.document_id);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      {/* File Icon */}
      <div className="flex-shrink-0">
        <FileText className={`w-8 h-8 ${getFileColor(document.file_type)}`} />
      </div>

      {/* Name & Description */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate group-hover:text-violet-600 transition-colors">
          {document.document_name}
        </p>
        {document.document_description && (
          <p className="text-sm text-slate-500 truncate">
            {document.document_description}
          </p>
        )}
      </div>

      {/* Type Badge */}
      <span
        className={`hidden sm:inline-block flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium ${getTypeColor(document.document_type)}`}
      >
        {getTypeLabel(document.document_type)}
      </span>

      {/* Size */}
      <span className="hidden md:block flex-shrink-0 text-xs text-slate-400 w-16 text-right">
        {formatFileSize(document.document_size)}
      </span>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-3 flex-shrink-0 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {document.view_count}
        </span>
        <span className="flex items-center gap-1">
          <Download className="w-3.5 h-3.5" />
          {document.download_count}
        </span>
      </div>

      {/* Date */}
      <span className="hidden xl:flex items-center gap-1 flex-shrink-0 text-xs text-slate-400">
        <Calendar className="w-3.5 h-3.5" />
        {new Date(document.created_at).toLocaleDateString("vi-VN")}
      </span>

      {/* Access Badge / Download */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {document.access_type === "premium" && (
          <Lock className="w-4 h-4 text-violet-500" />
        )}
        <button
          onClick={handleDownload}
          className="p-1.5 rounded hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"
          title="Tải xuống"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DocumentListItem;
