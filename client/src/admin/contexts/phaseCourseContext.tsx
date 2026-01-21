import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface PhaseCourse {
  phase_course_id: number;
  phase_id: number;
  course_id: number;
  order_number: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
  Course?: {
    course_id: number;
    course_title: string;
    description: string;
    course_level: string;
    estimate_duration: string;
    price: number;
  };
}

interface PhaseCourseContextType {
  phaseCourses: PhaseCourse[];
  loading: boolean;
  error: string | null;
  getPhaseCoursesByPhaseId: (phase_id: number) => Promise<void>;
  createPhaseCourse: (
    phase_id: number,
    course_id: number,
    order_number: number,
    is_required: boolean,
  ) => Promise<boolean>;
  updatePhaseCourse: (
    phase_course_id: number,
    order_number: number,
    is_required: boolean,
  ) => Promise<boolean>;
  removeCourseFromPhase: (phase_course_id: number) => Promise<boolean>;
}

const PhaseCourseContext = createContext<PhaseCourseContextType | undefined>(
  undefined,
);

export const usePhaseCourse = () => {
  const context = useContext(PhaseCourseContext);
  if (!context) {
    throw new Error("usePhaseCourse must be used within a PhaseCourseProvider");
  }
  return context;
};

interface PhaseCourseProviderProps {
  children: ReactNode;
}

export const PhaseCourseProvider: React.FC<PhaseCourseProviderProps> = ({
  children,
}) => {
  const [phaseCourses, setPhaseCourses] = useState<PhaseCourse[]>([]);
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

  // Get phase courses by phase ID
  const getPhaseCoursesByPhaseId = useCallback(async (phase_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiUrl}/admin/phases/${phase_id}/phase-courses`,
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
        setPhaseCourses(result.data || []);
      } else {
        setError(result.message || "Failed to fetch phase courses");
        setPhaseCourses([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPhaseCourses([]);
      console.error("Error fetching phase courses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create phase course
  const createPhaseCourse = useCallback(
    async (
      phase_id: number,
      course_id: number,
      order_number: number,
      is_required: boolean,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/phases/${phase_id}/phase-courses`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              course_id,
              order_number,
              is_required,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Refresh phase courses list
          await getPhaseCoursesByPhaseId(phase_id);
          return true;
        } else {
          setError(result.message || "Failed to create phase course");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error creating phase course:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getPhaseCoursesByPhaseId],
  );

  // Update phase course
  const updatePhaseCourse = useCallback(
    async (
      phase_course_id: number,
      order_number: number,
      is_required: boolean,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/phase-courses/${phase_course_id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              order_number,
              is_required,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setPhaseCourses((prev) =>
            prev.map((pc) =>
              pc.phase_course_id === phase_course_id ? result.data : pc,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to update phase course");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating phase course:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Remove course from phase
  const removeCourseFromPhase = useCallback(
    async (phase_course_id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/phase-courses/${phase_course_id}`,
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
          setPhaseCourses((prev) =>
            prev.filter((pc) => pc.phase_course_id !== phase_course_id),
          );
          return true;
        } else {
          setError(result.message || "Failed to remove course from phase");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error removing course from phase:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value: PhaseCourseContextType = {
    phaseCourses,
    loading,
    error,
    getPhaseCoursesByPhaseId,
    createPhaseCourse,
    updatePhaseCourse,
    removeCourseFromPhase,
  };

  return (
    <PhaseCourseContext.Provider value={value}>
      {children}
    </PhaseCourseContext.Provider>
  );
};
