import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Course {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  course_aim: string;
  estimate_duration: string;
  course_status: boolean;
  tag: string;
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
    limit?: number,
    page?: number,
    course_status?: boolean,
    course_level?: string,
    tag?: string
  ) => Promise<void>;
  createCourse: (
    course_title: string,
    description: string,
    course_level: string,
    course_aim: string,
    estimate_duration: string,
    course_status: boolean,
    tag: string
  ) => Promise<boolean>;
  updateCourse: (
    course_id: number,
    course_title: string,
    description: string,
    course_level: string,
    course_aim: string,
    estimate_duration: string,
    course_status: boolean,
    tag: string
  ) => Promise<boolean>;
  lockCourse: (course_id: number) => Promise<boolean>;
  unlockCourse: (course_id: number) => Promise<boolean>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
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

  const fetchCoursesPaginated = useCallback(
    async (
      search: string = "",
      limit: number = 10,
      page: number = 1,
      course_status?: boolean,
      course_level?: string,
      tag?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          search,
          limit: limit.toString(),
          page: page.toString(),
        });

        if (course_status !== undefined) {
          params.append("course_status", course_status.toString());
        }

        if (course_level) {
          params.append("course_level", course_level);
        }

        if (tag) {
          params.append("tag", tag);
        }

        const response = await fetch(
          `${apiUrl}/admin/courses/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
          setTotalCourses(data.total);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        } else {
          setError(data.message || "Failed to fetch courses");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCourse = useCallback(
    async (
      course_title: string,
      description: string,
      course_level: string,
      course_aim: string,
      estimate_duration: string,
      course_status: boolean,
      tag: string
    ): Promise<boolean> => {
      try {
        const response = await fetch(`${apiUrl}/admin/courses`, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            course_title,
            description,
            course_level,
            course_aim,
            estimate_duration,
            course_status,
            tag,
          }),
        });

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCoursesPaginated();
          return true;
        }
        setError(data.message || "Failed to create course");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to create course");
        console.error("Create course error:", err);
        return false;
      }
    },
    [fetchCoursesPaginated]
  );

  const updateCourse = useCallback(
    async (
      course_id: number,
      course_title: string,
      description: string,
      course_level: string,
      course_aim: string,
      estimate_duration: string,
      course_status: boolean,
      tag: string
    ): Promise<boolean> => {
      try {
        const response = await fetch(`${apiUrl}/admin/courses/${course_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            course_title,
            description,
            course_level,
            course_aim,
            estimate_duration,
            course_status,
            tag,
          }),
        });

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCoursesPaginated();
          return true;
        }
        setError(data.message || "Failed to update course");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to update course");
        console.error("Update course error:", err);
        return false;
      }
    },
    [fetchCoursesPaginated]
  );

  const lockCourse = useCallback(
    async (course_id: number): Promise<boolean> => {
      try {
        const response = await fetch(
          `${apiUrl}/admin/courses/${course_id}/lock`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCoursesPaginated();
          return true;
        }
        setError(data.message || "Failed to lock course");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to lock course");
        console.error("Lock course error:", err);
        return false;
      }
    },
    [fetchCoursesPaginated]
  );

  const unlockCourse = useCallback(
    async (course_id: number): Promise<boolean> => {
      try {
        const response = await fetch(
          `${apiUrl}/admin/courses/${course_id}/unlock`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );

        // Kiểm tra unauthorized
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return false;
        }

        const data = await response.json();

        if (data.success) {
          await fetchCoursesPaginated();
          return true;
        }
        setError(data.message || "Failed to unlock course");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to unlock course");
        console.error("Unlock course error:", err);
        return false;
      }
    },
    [fetchCoursesPaginated]
  );

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
        createCourse,
        updateCourse,
        lockCourse,
        unlockCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
