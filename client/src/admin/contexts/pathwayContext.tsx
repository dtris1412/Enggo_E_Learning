import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Pathway {
  pathway_id: number;
  pathway_title: string;
  description: string;
  pathway_status: boolean;
  created_at: string;
  updated_at: string;
}

interface PathwayContextType {
  pathways: Pathway[];
  loading: boolean;
  error: string | null;
  fetchPathways: () => Promise<void>;
  createPathway: (
    pathway_title: string,
    description: string
  ) => Promise<boolean>;
  updatePathway: (
    pathway_id: number,
    pathway_title: string,
    description: string
  ) => Promise<boolean>;
  lockPathway: (pathway_id: number) => Promise<boolean>;
  unlockPathway: (pathway_id: number) => Promise<boolean>;
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export const usePathway = () => {
  const context = useContext(PathwayContext);
  if (!context) {
    throw new Error("usePathway must be used within a PathwayProvider");
  }
  return context;
};

export const PathwayProvider = ({ children }: { children: ReactNode }) => {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchPathways = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/pathways`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      setPathways(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pathways");
      console.error("Error fetching pathways:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPathway = async (
    pathway_title: string,
    description: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/pathways`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          pathway_title,
          description,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 201) {
        await fetchPathways();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to create pathway");
      console.error("Error creating pathway:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePathway = async (
    pathway_id: number,
    pathway_title: string,
    description: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/pathways/${pathway_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          pathway_title,
          description,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 200) {
        await fetchPathways();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to update pathway");
      console.error("Error updating pathway:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const lockPathway = async (pathway_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/pathways/${pathway_id}/lock`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 200) {
        await fetchPathways();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to lock pathway");
      console.error("Error locking pathway:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlockPathway = async (pathway_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/pathways/${pathway_id}/unlock`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 200) {
        await fetchPathways();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to unlock pathway");
      console.error("Error unlocking pathway:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PathwayContext.Provider
      value={{
        pathways,
        loading,
        error,
        fetchPathways,
        createPathway,
        updatePathway,
        lockPathway,
        unlockPathway,
      }}
    >
      {children}
    </PathwayContext.Provider>
  );
};
