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
  certificate_id: number;
  course_aim: string;
  estimate_duration: string;
  course_status: boolean;
  created_at: string;
  updated_at: string;
}

interface CourseContextType {
  courses: Course[];
  totalCourses: number;
  loading: boolean;
  error: string | null;
  fetchCoursesByCertificate: (certificate_id: number) => Promise<void>;
  fetchCoursesPaginated: (
    search?: string,
    limit?: number,
    page?: number,
    course_status?: boolean
  ) => Promise<void>;
  createCourse: (
    course_title: string,
    description: string,
    course_level: string,
    certificate_id: number,
    course_aim: string,
    estimate_duration: string
  ) => Promise<boolean>;
  updateCourse: (
    course_id: number,
    course_title: string,
    description: string,
    course_level: string,
    course_aim: string,
    estimate_duration: string
  ) => Promise<boolean>;
  deleteCourse: (course_id: number) => Promise<boolean>;
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

  const fetchCoursesByCertificate = useCallback(
    async (certificate_id: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/certificates/${certificate_id}/courses`,
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
          setTotalCourses(data.data.length);
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

  const fetchCoursesPaginated = useCallback(
    async (
      search: string = "",
      limit: number = 10,
      page: number = 1,
      course_status?: boolean
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
      certificate_id: number,
      course_aim: string,
      estimate_duration: string
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
            certificate_id,
            course_aim,
            estimate_duration,
            course_status: true,
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
          await fetchCoursesByCertificate(certificate_id);
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
    [fetchCoursesByCertificate]
  );

  const updateCourse = useCallback(
    async (
      course_id: number,
      course_title: string,
      description: string,
      course_level: string,
      course_aim: string,
      estimate_duration: string
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
          // Refresh courses for the current certificate
          const course = courses.find((c) => c.course_id === course_id);
          if (course) {
            await fetchCoursesByCertificate(course.certificate_id);
          }
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
    [courses, fetchCoursesByCertificate]
  );

  const deleteCourse = useCallback(
    async (course_id: number): Promise<boolean> => {
      try {
        const response = await fetch(`${apiUrl}/admin/courses/${course_id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
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
          // Refresh courses for the current certificate
          const course = courses.find((c) => c.course_id === course_id);
          if (course) {
            await fetchCoursesByCertificate(course.certificate_id);
          }
          return true;
        }
        setError(data.message || "Failed to delete course");
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to delete course");
        console.error("Delete course error:", err);
        return false;
      }
    },
    [courses, fetchCoursesByCertificate]
  );

  return (
    <CourseContext.Provider
      value={{
        courses,
        totalCourses,
        loading,
        error,
        fetchCoursesByCertificate,
        fetchCoursesPaginated,
        createCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
