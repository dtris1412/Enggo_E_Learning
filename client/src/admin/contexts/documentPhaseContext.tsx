import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface DocumentPhase {
  document_phase_id: number;
  phase_id: number;
  document_id: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  Document?: {
    document_id: number;
    document_type: string;
    document_name: string;
    document_description: string;
    document_url: string;
    document_size: number;
    file_type: string;
  };
}

interface DocumentPhaseContextType {
  documentPhases: DocumentPhase[];
  loading: boolean;
  error: string | null;
  fetchDocumentPhasesByPhaseId: (phaseId: number) => Promise<void>;
  addDocumentToPhase: (
    phaseId: number,
    documentId: number,
    orderIndex?: number,
  ) => Promise<boolean>;
  updateDocumentPhase: (
    documentPhaseId: number,
    orderIndex: number,
  ) => Promise<boolean>;
  removeDocumentFromPhase: (documentPhaseId: number) => Promise<boolean>;
}

const DocumentPhaseContext = createContext<
  DocumentPhaseContextType | undefined
>(undefined);

export const useDocumentPhase = () => {
  const context = useContext(DocumentPhaseContext);
  if (!context) {
    throw new Error(
      "useDocumentPhase must be used within a DocumentPhaseProvider",
    );
  }
  return context;
};

interface DocumentPhaseProviderProps {
  children: ReactNode;
}

export const DocumentPhaseProvider: React.FC<DocumentPhaseProviderProps> = ({
  children,
}) => {
  const [documentPhases, setDocumentPhases] = useState<DocumentPhase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchDocumentPhasesByPhaseId = useCallback(async (phaseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/phases/${phaseId}/document-phases`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setDocumentPhases(result.data || []);
      } else {
        setError(result.message || "Failed to fetch document phases");
        setDocumentPhases([]);
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching document phases",
      );
      setDocumentPhases([]);
      console.error("Error fetching document phases:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDocumentToPhase = useCallback(
    async (
      phaseId: number,
      documentId: number,
      orderIndex?: number,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/phases/${phaseId}/document-phases`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              document_id: documentId,
              order_index: orderIndex || 0,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          await fetchDocumentPhasesByPhaseId(phaseId);
          return true;
        } else {
          setError(result.message || "Failed to add document to phase");
          return false;
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while adding document to phase",
        );
        console.error("Error adding document to phase:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchDocumentPhasesByPhaseId],
  );

  const updateDocumentPhase = useCallback(
    async (documentPhaseId: number, orderIndex: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/document-phases/${documentPhaseId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              order_index: orderIndex,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // Update local state
          setDocumentPhases((prev) =>
            prev.map((dp) =>
              dp.document_phase_id === documentPhaseId
                ? { ...dp, order_index: orderIndex }
                : dp,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to update document phase");
          return false;
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while updating document phase",
        );
        console.error("Error updating document phase:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeDocumentFromPhase = useCallback(
    async (documentPhaseId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/document-phases/${documentPhaseId}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // Remove from local state
          setDocumentPhases((prev) =>
            prev.filter((dp) => dp.document_phase_id !== documentPhaseId),
          );
          return true;
        } else {
          setError(result.message || "Failed to remove document from phase");
          return false;
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while removing document from phase",
        );
        console.error("Error removing document from phase:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <DocumentPhaseContext.Provider
      value={{
        documentPhases,
        loading,
        error,
        fetchDocumentPhasesByPhaseId,
        addDocumentToPhase,
        updateDocumentPhase,
        removeDocumentFromPhase,
      }}
    >
      {children}
    </DocumentPhaseContext.Provider>
  );
};
