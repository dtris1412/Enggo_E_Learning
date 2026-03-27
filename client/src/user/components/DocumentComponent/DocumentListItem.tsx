import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Eye, Lock, File } from "lucide-react";

interface Document {
  document_id: number;
  document_name: string;
  document_description: string | null;
  document_type: string;
  file_type: string | null;
  document_size: string | null;
  access_type: string;
  view_count: number;
  download_count: number;
  created_at: string;
}

interface DocumentListItemProps {
  document: Document;
  onDownload: (document_id: number) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDownload,
}) => {
  const navigate = useNavigate();

  const getFileIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FileText className="w-14 h-14 text-white" />;
      case "docx":
      case "doc":
        return <FileText className="w-14 h-14 text-white" />;
      case "mp3":
      case "audio":
        return <File className="w-14 h-14 text-white" />;
      default:
        return <FileText className="w-14 h-14 text-white" />;
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case "learning":
        return "from-blue-500 to-blue-700";
      case "reference":
        return "from-purple-500 to-purple-700";
      case "guideline":
        return "from-green-500 to-green-700";
      default:
        return "from-slate-500 to-slate-700";
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
        return "Khác";
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(document.document_id);
  };

  return (
    <div
      onClick={() => navigate(`/documents/${document.document_id}`)}
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 cursor-pointer group mb-4"
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <div className="relative sm:w-56 h-40 flex-shrink-0 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getTypeBgColor(document.document_type)} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
          >
            {getFileIcon(document.file_type || "")}
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">
              {getTypeLabel(document.document_type)}
            </span>
          </div>

          {/* Premium Badge */}
          {document.access_type === "premium" && (
            <div className="absolute top-2 right-2">
              <span className="bg-amber-400 text-slate-900 px-2 py-1 rounded flex items-center gap-1 text-xs font-bold">
                <Lock className="w-3 h-3" />
                PREMIUM
              </span>
            </div>
          )}

          {/* File Type */}
          <div className="absolute bottom-2 left-2">
            <span className="bg-white bg-opacity-90 text-slate-800 px-2 py-1 rounded text-xs font-semibold">
              {document.file_type?.toUpperCase() || "FILE"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {document.document_name}
            </h3>
            <p className="text-slate-500 text-sm mb-3 line-clamp-2">
              {document.document_description ||
                "Tài liệu học tập chất lượng cao, được cập nhật liên tục từ các nguồn uy tín."}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{document.view_count || 0}</span>
                <span className="hidden sm:inline">lượt xem</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span className="font-medium">
                  {document.download_count || 0}
                </span>
                <span className="hidden sm:inline">lượt tải</span>
              </div>
              {document.document_size && (
                <span className="text-xs">• {document.document_size}</span>
              )}
            </div>

            <button
              onClick={handleDownloadClick}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl hover:shadow-md transition-all text-sm font-bold flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Tải xuống
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentListItem;
