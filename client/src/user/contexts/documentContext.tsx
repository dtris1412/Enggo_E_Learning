import {
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
  view_count: number;
  download_count: number;
  access_type: "free" | "premium";
  created_at: string;
  updated_at: string;
}

interface DocumentContextType {
  documents: Document[];
  totalDocuments: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchDocumentsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    document_type?: string,
    access_type?: string,
  ) => Promise<void>;
  getDocumentById: (document_id: number) => Promise<Document | null>;
  downloadDocument: (document_id: number) => Promise<{
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
      limit = 12,
      document_type?: string,
      access_type?: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (document_type) params.append("document_type", document_type);
        if (access_type) params.append("access_type", access_type);

        const response = await fetch(
          `${API_URL}/user/documents?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const result = await response.json();
        if (result.success) {
          setDocuments(result.data.documents);
          setTotalDocuments(result.data.totalItems);
          setCurrentPage(result.data.currentPage);
          setTotalPages(result.data.totalPages);
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
      const response = await fetch(`${API_URL}/user/documents/${document_id}`, {
        method: "GET",
      });

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

  const downloadDocument = async (
    document_id: number,
  ): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/documents/${document_id}/download`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: "Please login to download documents",
          };
        }
        throw new Error("Failed to download document");
      }

      const result = await response.json();
      if (result.success) {
        // Open download link in new tab
        window.open(result.data.document_url, "_blank");
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err: any) {
      console.error("Error downloading document:", err);
      return { success: false, message: err.message };
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        totalDocuments,
        currentPage,
        totalPages,
        loading,
        error,
        fetchDocumentsPaginated,
        getDocumentById,
        downloadDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
