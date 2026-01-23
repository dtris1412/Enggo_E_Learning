import React, { useState } from "react";
import { useDocument } from "../../contexts/documentContext";
import { X, FileText, Loader } from "lucide-react";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createDocument, uploadDocument } = useDocument();

  const [formData, setFormData] = useState({
    document_type: "learning",
    document_name: "",
    document_description: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

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
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
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

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev: any) => ({
        ...prev,
        file: "File size must be less than 50MB",
      }));
      return;
    }

    setSelectedFile(file);
    setErrors((prev: any) => ({ ...prev, file: "" }));

    // Auto-fill document name if empty
    if (!formData.document_name) {
      setFormData((prev) => ({
        ...prev,
        document_name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.document_type) {
      newErrors.document_type = "Document type is required";
    }
    if (!formData.document_name.trim()) {
      newErrors.document_name = "Document name is required";
    }
    if (!selectedFile) {
      newErrors.file = "Please select a file";
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
      // Upload file first
      const uploadResult = await uploadDocument(selectedFile!);

      if (!uploadResult.success) {
        setErrors((prev: any) => ({
          ...prev,
          file: uploadResult.message || "Upload failed",
        }));
        setIsSubmitting(false);
        return;
      }

      // Then create document with uploaded file data
      const success = await createDocument(
        formData.document_type,
        formData.document_name,
        formData.document_description,
        uploadResult.data.url,
        uploadResult.data.bytes?.toString() || "",
        uploadResult.data.format || "",
      );

      if (success) {
        alert("Document created successfully!");
        handleClose();
        onSuccess();
      } else {
        alert("Failed to create document");
      }
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      document_type: "learning",
      document_name: "",
      document_description: "",
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Add New Document
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

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File <span className="text-red-500">*</span>
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
                  Creating...
                </>
              ) : (
                "Create Document"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;
