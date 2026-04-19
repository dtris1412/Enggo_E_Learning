import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useDocument } from "../contexts/documentContext";
import AddDocumentModal from "../components/DocumentManagement/AddDocumentModal.tsx";
import EditDocumentModal from "../components/DocumentManagement/EditDocumentModal.tsx";
import ExportButton from "../components/ExportButton";
import Pagination from "../../shared/components/Pagination";
import { FileText, Search, Plus, Edit2, Trash2, Download } from "lucide-react";

const DocumentManagement: React.FC = () => {
  const {
    documents,
    totalDocuments,
    loading,
    error,
    fetchDocumentsPaginated,
    deleteDocument,
    incrementDownloadCount,
  } = useDocument();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(9);
  const [documentTypeFilter, setDocumentTypeFilter] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const urlPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const resetPage = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  useEffect(() => {
    fetchDocumentsPaginated(
      searchTerm,
      urlPage,
      itemsPerPage,
      documentTypeFilter,
      fileTypeFilter,
    );
  }, [urlPage, itemsPerPage, searchTerm, documentTypeFilter, fileTypeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    resetPage();
    fetchDocumentsPaginated(
      searchTerm,
      1,
      itemsPerPage,
      documentTypeFilter,
      fileTypeFilter,
    );
  };

  const handleEdit = (doc: any) => {
    setSelectedDocument(doc);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (document_id: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const success = await deleteDocument(document_id);
      if (success) {
        alert("Document deleted successfully");
        fetchDocumentsPaginated(
          searchTerm,
          urlPage,
          itemsPerPage,
          documentTypeFilter,
          fileTypeFilter,
        );
      }
    }
  };

  const handleDownload = async (
    document_id: number,
    url: string,
    name: string,
  ) => {
    // Increment download count
    await incrementDownloadCount(document_id);
    // Refresh the documents list to show updated count
    fetchDocumentsPaginated(
      searchTerm,
      urlPage,
      itemsPerPage,
      documentTypeFilter,
      fileTypeFilter,
    );
    // Open download link
    window.open(url, "_blank");
  };

  const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  const formatFileSize = (bytes: string | null) => {
    if (!bytes) return "N/A";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="w-5 h-5 text-gray-400" />;
    if (fileType.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes("word") || fileType.includes("docx"))
      return <FileText className="w-5 h-5 text-blue-500" />;
    if (fileType.includes("audio"))
      return <FileText className="w-5 h-5 text-green-500" />;
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Document Management
        </h1>
        <p className="text-gray-600">
          Manage and organize your documents, files, and resources
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Document Type Filter */}
            <div className="w-full md:w-48">
              <select
                value={documentTypeFilter}
                onChange={(e) => setDocumentTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="learning">Learning Material</option>
                <option value="reference">Reference</option>
                <option value="guideline">Guideline</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* File Type Filter */}
            <div className="w-full md:w-48">
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Files</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {/* Export and Add Buttons */}
            <div className="flex gap-3">
              <ExportButton
                type="documents"
                filters={{
                  search: searchTerm,
                  document_type: documentTypeFilter,
                  file_type: fileTypeFilter,
                }}
              />
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add Document
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No documents found</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.document_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.file_type)}
                        <div className="min-w-0">
                          <div
                            className="font-medium text-gray-900 truncate max-w-xs"
                            title={doc.document_name}
                          >
                            {doc.document_name}
                          </div>
                          {doc.document_description && (
                            <div
                              className="text-sm text-gray-500 truncate max-w-xs"
                              title={doc.document_description}
                            >
                              {doc.document_description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {doc.document_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          doc.acess_type === "premium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {doc.acess_type || "free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doc.file_type || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatFileSize(doc.document_size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doc.view_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doc.download_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleDownload(
                              doc.document_id,
                              doc.document_url,
                              doc.document_name,
                            )
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.document_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={urlPage}
          totalPages={totalPages}
          buildPageUrl={buildPageUrl}
          className="py-4"
        />
      </div>

      {/* Modals */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchDocumentsPaginated(
            searchTerm,
            urlPage,
            itemsPerPage,
            documentTypeFilter,
            fileTypeFilter,
          );
        }}
      />

      {selectedDocument && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedDocument(null);
            fetchDocumentsPaginated(
              searchTerm,
              urlPage,
              itemsPerPage,
              documentTypeFilter,
              fileTypeFilter,
            );
          }}
        />
      )}
    </div>
  );
};

export default DocumentManagement;
