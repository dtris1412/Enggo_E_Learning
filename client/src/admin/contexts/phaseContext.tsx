import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Phase {
  phase_id: number;
  phase_name: string;
  phase_description: string;
  order: number;
  phase_aims: string;
  roadmap_id: number;
  created_at: string;
  updated_at: string;
}

interface PhaseContextType {
  phases: Phase[];
  loading: boolean;
  error: string | null;
  getPhasesByRoadmapId: (roadmap_id: number) => Promise<void>;
  getPhaseById: (phase_id: number) => Promise<Phase | null>;
  createPhase: (
    roadmap_id: number,
    phase_name: string,
    phase_description: string,
    order: number,
    phase_aims: string,
  ) => Promise<boolean>;
  updatePhase: (
    phase_id: number,
    phase_name: string,
    phase_description: string,
    order: number,
    phase_aims: string,
  ) => Promise<boolean>;
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

export const usePhase = () => {
  const context = useContext(PhaseContext);
  if (!context) {
    throw new Error("usePhase must be used within a PhaseProvider");
  }
  return context;
};

interface PhaseProviderProps {
  children: ReactNode;
}

export const PhaseProvider: React.FC<PhaseProviderProps> = ({ children }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No access token found in localStorage");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Get phases by roadmap ID
  const getPhasesByRoadmapId = useCallback(async (roadmap_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiUrl}/admin/roadmaps/${roadmap_id}/phases`,
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
        setPhases(result.data || []);
      } else {
        setError(result.message || "Failed to fetch phases");
        setPhases([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPhases([]);
      console.error("Error fetching phases:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get phase by ID
  const getPhaseById = useCallback(
    async (phase_id: number): Promise<Phase | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/phases/${phase_id}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          return result.data;
        } else {
          setError(result.message || "Failed to fetch phase");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching phase by ID:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create phase
  const createPhase = useCallback(
    async (
      roadmap_id: number,
      phase_name: string,
      phase_description: string,
      order: number,
      phase_aims: string,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/roadmaps/${roadmap_id}/phases`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              phase_name,
              phase_description,
              order,
              phase_aims,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Refresh phases list
          await getPhasesByRoadmapId(roadmap_id);
          return true;
        } else {
          setError(result.message || "Failed to create phase");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error creating phase:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getPhasesByRoadmapId],
  );

  // Update phase
  const updatePhase = useCallback(
    async (
      phase_id: number,
      phase_name: string,
      phase_description: string,
      order: number,
      phase_aims: string,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/phases/${phase_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            phase_name,
            phase_description,
            order,
            phase_aims,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setPhases((prev) =>
            prev.map((phase) =>
              phase.phase_id === phase_id ? result.data : phase,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to update phase");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating phase:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value: PhaseContextType = {
    phases,
    loading,
    error,
    getPhasesByRoadmapId,
    getPhaseById,
    createPhase,
    updatePhase,
  };

  return (
    <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>
  );
};
