import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Lesson {
  lesson_id: number;
  lesson_name: string;
  course_id: number;
  lesson_order: number;
  lesson_content: string;
  lesson_type: string;
  duration: string;
  created_at: string;
  updated_at: string;
}

interface LessonContextType {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  fetchLessonsByCourse: (course_id: number) => Promise<void>;
  fetchLessonsPaginated: (
    search?: string,
    limit?: number,
    page?: number
  ) => Promise<void>;
  createLesson: (
    lesson_name: string,
    course_id: number,
    lesson_order: number,
    lesson_content: string,
    lesson_type: string,
    duration: string
  ) => Promise<boolean>;
  updateLesson: (
    lesson_id: number,
    lesson_name: string,
    lesson_order: number,
    lesson_content: string,
    lesson_type: string,
    duration: string
  ) => Promise<boolean>;
  deleteLesson: (lesson_id: number) => Promise<boolean>;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchLessonsByCourse = useCallback(async (course_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lessons/course/${course_id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      setLessons(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch lessons");
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLessonsPaginated = useCallback(
    async (search = "", limit = 100, page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          search,
          limit: limit.toString(),
          page: page.toString(),
        });

        const response = await fetch(
          `${API_URL}/admin/lessons/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        setLessons(data.lessons || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch lessons");
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createLesson = async (
    lesson_name: string,
    course_id: number,
    lesson_order: number,
    lesson_content: string,
    lesson_type: string,
    duration: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lessons`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          lesson_name,
          course_id,
          lesson_order,
          lesson_content,
          lesson_type,
          duration,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 201) {
        await fetchLessonsPaginated();
        return true;
      }
      return false;
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
    lesson_name: string,
    lesson_order: number,
    lesson_content: string,
    lesson_type: string,
    duration: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lessons/${lesson_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          lesson_name,
          lesson_order,
          lesson_content,
          lesson_type,
          duration,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 200) {
        await fetchLessonsPaginated();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to update lesson");
      console.error("Error updating lesson:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lesson_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lessons/${lesson_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return false;
      }

      if (response.status === 200) {
        await fetchLessonsPaginated();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to delete lesson");
      console.error("Error deleting lesson:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LessonContext.Provider
      value={{
        lessons,
        loading,
        error,
        fetchLessonsByCourse,
        fetchLessonsPaginated,
        createLesson,
        updateLesson,
        deleteLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
