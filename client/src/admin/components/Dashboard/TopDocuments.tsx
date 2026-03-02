import React from "react";
import { FileText, Download } from "lucide-react";

interface Document {
  document_id: number;
  document_name: string;
  document_type: string;
  document_size: string;
  download_count: number;
}

interface TopDocumentsProps {
  documents: Document[];
  loading?: boolean;
}

const TopDocuments: React.FC<TopDocumentsProps> = ({
  documents,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Document được tải nhiều nhất
      </h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : documents.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có document nào
          </p>
        ) : (
          documents.map((doc, index) => (
            <div
              key={doc.document_id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600 text-xs">
                  {index + 1}
                </div>
              </div>
              <div className="flex-shrink-0">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.document_name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {doc.document_type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {doc.document_size}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 text-blue-600">
                  <Download className="h-3 w-3" />
                  <span className="text-xs font-semibold">
                    {doc.download_count.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopDocuments;
