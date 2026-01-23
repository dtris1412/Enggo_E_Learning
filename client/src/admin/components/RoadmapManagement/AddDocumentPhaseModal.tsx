import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useDocument } from "../../contexts/documentContext.tsx";

interface Document {
  document_id: number;
  document_type: string;
  document_name: string;
  document_description: string;
  document_url: string;
  document_size: number;
  file_type: string;
}

interface AddDocumentPhaseModalProps {
  onClose: () => void;
  onSubmit: (data: {
    document_id: number;
    order_index: number;
  }) => Promise<void>;
  existingDocumentIds: number[];
}

const AddDocumentPhaseModal: React.FC<AddDocumentPhaseModalProps> = ({
  onClose,
  onSubmit,
  existingDocumentIds,
}) => {
  const { documents, fetchDocumentsPaginated } = useDocument();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [orderIndex, setOrderIndex] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDocumentsPaginated(searchTerm, 1, 100, "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const availableDocuments = documents.filter(
    (doc) => !existingDocumentIds.includes(doc.document_id),
  );

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedDocument) {
      newErrors.document = "Vui lòng chọn tài liệu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedDocument) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        document_id: selectedDocument.document_id,
        order_index: orderIndex,
      });
      setSelectedDocument(null);
      setOrderIndex(0);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedDocument(null);
    setOrderIndex(0);
    setErrors({});
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      reference: "Tài liệu tham khảo",
      guide: "Hướng dẫn",
      exercise: "Bài tập",
      other: "Khác",
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Thêm tài liệu hỗ trợ vào giai đoạn
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Search Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm tài liệu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên tài liệu..."
              />
            </div>
          </div>

          {/* Document List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn tài liệu <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg max-h-80 overflow-y-auto">
              {availableDocuments.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Không có tài liệu nào khả dụng
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableDocuments.map((doc) => (
                    <div
                      key={doc.document_id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedDocument?.document_id === doc.document_id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {doc.document_name}
                          </h4>
                          {doc.document_description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {doc.document_description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {getDocumentTypeLabel(doc.document_type)}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded uppercase">
                              {doc.file_type}
                            </span>
                            <span>{formatFileSize(doc.document_size)}</span>
                          </div>
                        </div>
                        {selectedDocument?.document_id === doc.document_id && (
                          <div className="ml-4">
                            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.document && (
              <p className="mt-1 text-sm text-red-600">{errors.document}</p>
            )}
          </div>

          {/* Order Index */}
          <div>
            <label
              htmlFor="order_index"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              id="order_index"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Số thứ tự để sắp xếp tài liệu (0 = mặc định)
            </p>
          </div>

          {/* Selected Document Summary */}
          {selectedDocument && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Tài liệu đã chọn:
              </h4>
              <p className="text-sm text-gray-700">
                <span className="font-medium">
                  {selectedDocument.document_name}
                </span>
                {" - "}
                <span className="text-gray-600">
                  {getDocumentTypeLabel(selectedDocument.document_type)}
                </span>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedDocument}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Đang thêm..." : "Thêm tài liệu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentPhaseModal;
