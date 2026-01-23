import React, { useState, useEffect } from "react";
import { useDocument } from "../../contexts/documentContext";
import { X, FileText, Loader, ExternalLink } from "lucide-react";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document: any;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  document,
}) => {
  const { updateDocument, uploadDocument } = useDocument();

  const [formData, setFormData] = useState({
    document_type: "",
    document_name: "",
    document_description: "",
    document_url: "",
    document_size: "",
    file_type: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (document) {
      setFormData({
        document_type: document.document_type || "",
        document_name: document.document_name || "",
        document_description: document.document_description || "",
        document_url: document.document_url || "",
        document_size: document.document_size || "",
        file_type: document.file_type || "",
      });
    }
  }, [document]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        file: "Only PDF, DOCX, DOC, and audio files are allowed",
      }));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev: any) => ({
        ...prev,
        file: "File size must be less than 50MB",
      }));
      return;
    }

    setSelectedFile(file);
    setErrors((prev: any) => ({ ...prev, file: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.document_type) {
      newErrors.document_type = "Document type is required";
    }
    if (!formData.document_name.trim()) {
      newErrors.document_name = "Document name is required";
    }
    if (!formData.document_url && !selectedFile) {
      newErrors.file = "Document URL is required or select a new file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let documentUrl = formData.document_url;
      let documentSize = formData.document_size;
      let fileType = formData.file_type;

      // If user selected a new file, upload it first
      if (selectedFile) {
        const uploadResult = await uploadDocument(selectedFile);

        if (!uploadResult.success) {
          setErrors((prev: any) => ({
            ...prev,
            file: uploadResult.message || "Upload failed",
          }));
          setIsSubmitting(false);
          return;
        }

        documentUrl = uploadResult.data.url;
        documentSize = uploadResult.data.bytes?.toString() || "";
        fileType = uploadResult.data.format || "";
      }

      // Update document with new or existing file data
      const success = await updateDocument(
        document.document_id,
        formData.document_type,
        formData.document_name,
        formData.document_description,
        documentUrl,
        documentSize,
        fileType,
      );

      if (success) {
        alert("Document updated successfully!");
        handleClose();
        onSuccess();
      } else {
        alert("Failed to update document");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      document_type: "",
      document_name: "",
      document_description: "",
      document_url: "",
      document_size: "",
      file_type: "",
    });
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  const getFileType = (file: File) => {
    if (file.type.includes("pdf")) return "PDF";
    if (file.type.includes("word") || file.type.includes("docx")) return "DOCX";
    if (file.type.includes("audio")) return "Audio";
    return "Document";
  };

  const formatFileSize = (bytes: number | string) => {
    const size = typeof bytes === "string" ? parseInt(bytes) : bytes;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Edit Document
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              name="document_type"
              value={formData.document_type}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.document_type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select type</option>
              <option value="learning">Learning Material</option>
              <option value="reference">Reference</option>
              <option value="guideline">Guideline</option>
              <option value="other">Other</option>
            </select>
            {errors.document_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.document_type}
              </p>
            )}
          </div>

          {/* Current File Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current File
            </label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {document?.document_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.file_type} •{" "}
                      {formData.document_size &&
                        formatFileSize(formData.document_size)}
                    </p>
                  </div>
                </div>
                <a
                  href={formData.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </a>
              </div>
            </div>
          </div>

          {/* Replace File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Replace File (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.mp3,.wav,.ogg,.webm"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">
                Supported formats: PDF, DOCX, DOC, MP3, WAV, OGG, WebM (Max
                50MB)
              </p>

              {selectedFile && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFileType(selectedFile)} •{" "}
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errors.file && (
                <p className="text-red-500 text-sm">{errors.file}</p>
              )}
            </div>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="document_name"
              value={formData.document_name}
              onChange={handleInputChange}
              placeholder="Enter document name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.document_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.document_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.document_name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="document_description"
              value={formData.document_description}
              onChange={handleInputChange}
              placeholder="Enter document description (optional)"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Document"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentModal;
