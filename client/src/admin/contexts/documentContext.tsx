import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Document {
  document_id: number;
  document_type: string;
  document_name: string;
  document_description: string | null;
  document_url: string;
  document_size: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

interface DocumentContextType {
  documents: Document[];
  totalDocuments: number;
  loading: boolean;
  error: string | null;
  fetchDocumentsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    document_type?: string,
    file_type?: string,
  ) => Promise<void>;
  getDocumentById: (document_id: number) => Promise<Document | null>;
  createDocument: (
    document_type: string,
    document_name: string,
    document_description: string,
    document_url: string,
    document_size: string,
    file_type: string,
  ) => Promise<boolean>;
  updateDocument: (
    document_id: number,
    document_type: string,
    document_name: string,
    document_description: string,
    document_url: string,
    document_size: string,
    file_type: string,
  ) => Promise<boolean>;
  deleteDocument: (document_id: number) => Promise<boolean>;
  uploadDocument: (file: File) => Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined,
);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchDocumentsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 10,
      document_type?: string,
      file_type?: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (document_type) params.append("document_type", document_type);
        if (file_type) params.append("file_type", file_type);

        const response = await fetch(
          `${API_URL}/admin/documents/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const result = await response.json();
        if (result.success) {
          setDocuments(result.data.documents);
          setTotalDocuments(result.data.totalItems);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch documents");
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getDocumentById = useCallback(async (document_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/documents/${document_id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch document");
      console.error("Error fetching document:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = async (
    document_type: string,
    document_name: string,
    document_description: string,
    document_url: string,
    document_size: string,
    file_type: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/documents`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          document_type,
          document_name,
          document_description,
          document_url,
          document_size,
          file_type,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to create document");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create document");
      console.error("Error creating document:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (
    document_id: number,
    document_type: string,
    document_name: string,
    document_description: string,
    document_url: string,
    document_size: string,
    file_type: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/documents/${document_id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            document_type,
            document_name,
            document_description,
            document_url,
            document_size,
            file_type,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to update document");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update document");
      console.error("Error updating document:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (document_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/documents/${document_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to delete document");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
      console.error("Error deleting document:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    file: File,
  ): Promise<{ success: boolean; data?: any; message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(`${API_URL}/upload/document`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Failed to upload document");
        return { success: false, message: result.message };
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
      console.error("Error uploading document:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        totalDocuments,
        loading,
        error,
        fetchDocumentsPaginated,
        getDocumentById,
        createDocument,
        updateDocument,
        deleteDocument,
        uploadDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
