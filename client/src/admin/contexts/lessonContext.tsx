import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Lesson {
  lesson_id: number;
  lesson_title: string;
  lesson_type: string;
  difficulty_level: string;
  lesson_content: string | null;
  is_exam_format: boolean;
  estimated_time: number | null;
  skill_id: number;
  lesson_status: boolean;
  created_at: string;
  updated_at?: string;
  Skill?: {
    skill_id: number;
    skill_name: string;
  };
}

interface LessonContextType {
  lessons: Lesson[];
  totalLessons: number;
  loading: boolean;
  error: string | null;
  fetchLessonsPaginated: (
    search?: string,
    limit?: number,
    page?: number,
    lesson_type?: string,
    difficulty_level?: string,
    is_exam_format?: boolean,
    lesson_status?: boolean
  ) => Promise<void>;
  getLessonById: (lesson_id: number) => Promise<Lesson | null>;
  createLesson: (
    lesson_title: string,
    lesson_type: string,
    difficulty_level: string,
    lesson_content: string,
    is_exam_format: boolean,
    estimated_time: number,
    skill_id: number,
    lesson_status?: boolean
  ) => Promise<boolean>;
  updateLesson: (
    lesson_id: number,
    lesson_title: string,
    lesson_type: string,
    difficulty_level: string,
    lesson_content: string,
    is_exam_format: boolean,
    estimated_time: number,
    skill_id: number
  ) => Promise<boolean>;
  lockLesson: (lesson_id: number) => Promise<boolean>;
  unlockLesson: (lesson_id: number) => Promise<boolean>;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error("useLesson must be used within a LessonProvider");
  }
  return context;
};

export const LessonProvider = ({ children }: { children: ReactNode }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchLessonsPaginated = useCallback(
    async (
      search = "",
      limit = 10,
      page = 1,
      lesson_type?: string,
      difficulty_level?: string,
      is_exam_format?: boolean,
      lesson_status?: boolean
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("limit", limit.toString());
        params.append("page", page.toString());
        if (lesson_type) params.append("lesson_type", lesson_type);
        if (difficulty_level)
          params.append("difficulty_level", difficulty_level);
        if (is_exam_format !== undefined)
          params.append("is_exam_format", is_exam_format.toString());
        if (lesson_status !== undefined)
          params.append("lesson_status", lesson_status.toString());

        const response = await fetch(
          `${API_URL}/admin/lessons/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const result = await response.json();
        if (result.success) {
          setLessons(result.lessons || []);
          setTotalLessons(result.totalLessons || 0);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch lessons");
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getLessonById = useCallback(async (lesson_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lessons/${lesson_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lesson");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch lesson");
      console.error("Error fetching lesson:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = async (
    lesson_title: string,
    lesson_type: string,
    difficulty_level: string,
    lesson_content: string,
    is_exam_format: boolean,
    estimated_time: number,
    skill_id: number,
    lesson_status = true
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lessons`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          lesson_title,
          lesson_type,
          difficulty_level,
          lesson_content,
          is_exam_format,
          estimated_time,
          skill_id,
          lesson_status,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create lesson");
      console.error("Error creating lesson:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (
    lesson_id: number,
    lesson_title: string,
    lesson_type: string,
    difficulty_level: string,
    lesson_content: string,
    is_exam_format: boolean,
    estimated_time: number,
    skill_id: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lessons/${lesson_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          lesson_title,
          lesson_type,
          difficulty_level,
          lesson_content,
          is_exam_format,
          estimated_time,
          skill_id,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update lesson");
      console.error("Error updating lesson:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const lockLesson = async (lesson_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lessons/${lesson_id}/lock`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to lock lesson");
      console.error("Error locking lesson:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlockLesson = async (lesson_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lessons/${lesson_id}/unlock`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to unlock lesson");
      console.error("Error unlocking lesson:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LessonContext.Provider
      value={{
        lessons,
        totalLessons,
        loading,
        error,
        fetchLessonsPaginated,
        getLessonById,
        createLesson,
        updateLesson,
        lockLesson,
        unlockLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
