import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Roadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_description: string;
  roadmap_aim: string;
  roadmap_level: string;
  estimated_duration: number;
  roadmap_status: boolean;
  certificate_id: number;
  discount_percent: number;
  roadmap_price: number;
  created_at: string;
  updated_at: string;
}

interface RoadmapContextType {
  roadmaps: Roadmap[];
  totalRoadmaps: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchRoadmapsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    roadmap_level?: string,
    roadmap_status?: boolean,
  ) => Promise<void>;
  getRoadmapById: (roadmap_id: number) => Promise<Roadmap | null>;
  createRoadmap: (
    roadmap_title: string,
    roadmap_description: string,
    roadmap_aim: string,
    roadmap_level: string,
    estimated_duration: number,
    roadmap_status: boolean,
    certificate_id: number,
    discount_percent: number,
    roadmap_price: number,
  ) => Promise<boolean>;
  updateRoadmap: (
    roadmap_id: number,
    roadmap_title: string,
    roadmap_description: string,
    roadmap_aim: string,
    roadmap_level: string,
    estimated_duration: number,
    roadmap_status: boolean,
    certificate_id: number,
    discount_percent: number,
  ) => Promise<boolean>;
  lockRoadmap: (roadmap_id: number) => Promise<boolean>;
  unlockRoadmap: (roadmap_id: number) => Promise<boolean>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
};

interface RoadmapProviderProps {
  children: ReactNode;
}

export const RoadmapProvider: React.FC<RoadmapProviderProps> = ({
  children,
}) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [totalRoadmaps, setTotalRoadmaps] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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

  // Fetch roadmaps paginated
  const fetchRoadmapsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 10,
      roadmap_level?: string,
      roadmap_status?: boolean,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          search,
          page: page.toString(),
          limit: limit.toString(),
        });

        if (roadmap_level) {
          queryParams.append("roadmap_level", roadmap_level);
        }

        if (roadmap_status !== undefined) {
          queryParams.append("roadmap_status", roadmap_status.toString());
        }

        const response = await fetch(
          `${apiUrl}/admin/roadmaps/paginated?${queryParams}`,
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
          setRoadmaps(result.data || []);
          setTotalRoadmaps(result.pagination?.total || 0);
          setCurrentPage(Number(result.pagination?.page) || 1);
          setTotalPages(result.pagination?.totalPages || 0);
        } else {
          setError(result.message || "Failed to fetch roadmaps");
          setRoadmaps([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setRoadmaps([]);
        console.error("Error fetching roadmaps:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get roadmap by ID
  const getRoadmapById = useCallback(
    async (roadmap_id: number): Promise<Roadmap | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/roadmaps/${roadmap_id}`, {
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
          setError(result.message || "Failed to fetch roadmap");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching roadmap by ID:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create roadmap
  const createRoadmap = useCallback(
    async (
      roadmap_title: string,
      roadmap_description: string,
      roadmap_aim: string,
      roadmap_level: string,
      estimated_duration: number,
      roadmap_status: boolean,
      certificate_id: number,
      discount_percent: number,
      roadmap_price: number,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/roadmaps`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            roadmap_title,
            roadmap_description,
            roadmap_aim,
            roadmap_level,
            estimated_duration,
            roadmap_status,
            certificate_id,
            discount_percent,
            roadmap_price,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Refresh roadmaps list
          await fetchRoadmapsPaginated();
          return true;
        } else {
          setError(result.message || "Failed to create roadmap");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error creating roadmap:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchRoadmapsPaginated],
  );

  // Update roadmap
  const updateRoadmap = useCallback(
    async (
      roadmap_id: number,
      roadmap_title: string,
      roadmap_description: string,
      roadmap_aim: string,
      roadmap_level: string,
      estimated_duration: number,
      roadmap_status: boolean,
      certificate_id: number,
      discount_percent: number,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/roadmaps/${roadmap_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            roadmap_title,
            roadmap_description,
            roadmap_aim,
            roadmap_level,
            estimated_duration,
            roadmap_status,
            certificate_id,
            discount_percent,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setRoadmaps((prev) =>
            prev.map((roadmap) =>
              roadmap.roadmap_id === roadmap_id ? result.data : roadmap,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to update roadmap");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating roadmap:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Lock roadmap
  const lockRoadmap = useCallback(
    async (roadmap_id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/roadmaps/${roadmap_id}/lock`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setRoadmaps((prev) =>
            prev.map((roadmap) =>
              roadmap.roadmap_id === roadmap_id
                ? { ...roadmap, roadmap_status: false }
                : roadmap,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to lock roadmap");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error locking roadmap:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Unlock roadmap
  const unlockRoadmap = useCallback(
    async (roadmap_id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/roadmaps/${roadmap_id}/unlock`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setRoadmaps((prev) =>
            prev.map((roadmap) =>
              roadmap.roadmap_id === roadmap_id
                ? { ...roadmap, roadmap_status: true }
                : roadmap,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to unlock roadmap");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error unlocking roadmap:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value: RoadmapContextType = {
    roadmaps,
    totalRoadmaps,
    currentPage,
    totalPages,
    loading,
    error,
    fetchRoadmapsPaginated,
    getRoadmapById,
    createRoadmap,
    updateRoadmap,
    lockRoadmap,
    unlockRoadmap,
  };

  return (
    <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
  );
};
