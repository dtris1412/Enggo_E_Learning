import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Module {
  module_id: number;
  module_title: string;
  module_description: string;
  order_index: number;
  estimated_time: number;
}

interface Lesson {
  lesson_id: number;
  lesson_type: string;
  lesson_title: string;
  lesson_content: string;
  estimated_time: number;
}

interface ModuleLesson {
  module_lesson_id: number;
  description: string;
  order_index: number;
  status: boolean;
  Lesson: Lesson;
}

interface ModuleWithLessons extends Module {
  Module_Lessons?: ModuleLesson[];
}

interface Course {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  course_aim: string;
  estimate_duration: number;
  course_status: boolean;
  tag: string;
  access_type: "free" | "premium";
  created_at: string;
  updated_at: string;
  Modules?: Module[];
}

interface CourseDetail extends Course {
  Modules: ModuleWithLessons[];
}

interface UserCourseProgress {
  user_course_id: number;
  user_id: number;
  course_id: number;
  started_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  completedLessons?: number;
  totalLessons?: number;
}

interface LessonProgress {
  user_lesson_progress_id: number;
  user_id: number;
  lesson_id: number;
  started_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CourseContextType {
  courses: Course[];
  totalCourses: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchCoursesPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    course_level?: string,
    access_type?: string,
    tag?: string,
    sortBy?: string,
    sortOrder?: string,
  ) => Promise<void>;
  getCourseById: (course_id: number) => Promise<CourseDetail | null>;
  startCourse: (course_id: number) => Promise<boolean>;
  getCourseProgress: (
    course_id: number,
  ) => Promise<{ started: boolean; progress: UserCourseProgress | null }>;
  updateLessonProgress: (
    lesson_id: number,
    progressPercentage: number,
    isCompleted?: boolean,
  ) => Promise<boolean>;
  getLessonProgress: (
    lesson_id: number,
  ) => Promise<{ started: boolean; progress: LessonProgress | null }>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoursesPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 12,
      course_level?: string,
      access_type?: string,
      tag?: string,
      sortBy = "created_at",
      sortOrder = "DESC",
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (course_level) params.append("course_level", course_level);
        if (access_type) params.append("access_type", access_type);
        if (tag) params.append("tag", tag);
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);

        const response = await fetch(
          `${API_URL}/user/courses?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const result = await response.json();
        if (result.success) {
          setCourses(result.data.courses);
          setTotalCourses(result.data.totalItems);
          setCurrentPage(result.data.currentPage);
          setTotalPages(result.data.totalPages);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getCourseById = useCallback(async (course_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/courses/${course_id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch course");
      console.error("Error fetching course:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const startCourse = useCallback(async (course_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("You must be logged in to start a course");
      }

      const response = await fetch(
        `${API_URL}/user/courses/${course_id}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start course");
      }

      const result = await response.json();
      return result.success;
    } catch (err: any) {
      setError(err.message || "Failed to start course");
      console.error("Error starting course:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourseProgress = useCallback(async (course_id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return { started: false, progress: null };
      }

      const response = await fetch(
        `${API_URL}/user/courses/${course_id}/progress`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch course progress");
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      console.error("Error fetching course progress:", err);
      return { started: false, progress: null };
    }
  }, []);

  const updateLessonProgress = useCallback(
    async (
      lesson_id: number,
      progressPercentage: number,
      isCompleted = false,
    ) => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("You must be logged in to update progress");
        }

        const response = await fetch(
          `${API_URL}/user/lessons/${lesson_id}/progress`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ progressPercentage, isCompleted }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update lesson progress");
        }

        const result = await response.json();
        return result.success;
      } catch (err: any) {
        console.error("Error updating lesson progress:", err);
        return false;
      }
    },
    [],
  );

  const getLessonProgress = useCallback(async (lesson_id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return { started: false, progress: null };
      }

      const response = await fetch(
        `${API_URL}/user/lessons/${lesson_id}/progress`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lesson progress");
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      console.error("Error fetching lesson progress:", err);
      return { started: false, progress: null };
    }
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        totalCourses,
        currentPage,
        totalPages,
        loading,
        error,
        fetchCoursesPaginated,
        getCourseById,
        startCourse,
        getCourseProgress,
        updateLessonProgress,
        getLessonProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
