import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Module {
  module_id: number;
  module_title: string;
  module_description: string;
  order_index: number;
  estimated_time: number;
  course_id: number;
  created_at: string;
  updated_at: string;
}

interface ModuleContextType {
  modules: Module[];
  totalModules: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchModulesByCourse: (course_id: number) => Promise<void>;
  fetchModulesPaginated: (
    search?: string,
    limit?: number,
    page?: number
  ) => Promise<void>;
  createModule: (
    course_id: number,
    module_title: string,
    module_description: string,
    order_index: number,
    estimated_time: number
  ) => Promise<boolean>;
  updateModule: (
    module_id: number,
    module_title: string,
    module_description: string,
    order_index: number,
    estimated_time: number
  ) => Promise<boolean>;
  getModuleById: (module_id: number) => Promise<Module | null>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
};

interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [totalModules, setTotalModules] = useState(0);
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

  // Fetch modules by course
  const fetchModulesByCourse = useCallback(async (course_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${apiUrl}/admin/courses/${course_id}/modules`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setModules(result.data || []);
        setTotalModules(result.total || 0);
        setCurrentPage(result.currentPage || 1);
        setTotalPages(result.totalPages || 0);
      } else {
        setError(result.message || "Failed to fetch modules");
        setModules([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setModules([]);
      console.error("Error fetching modules by course:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch modules paginated (all modules)
  const fetchModulesPaginated = useCallback(
    async (search = "", limit = 10, page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          search,
          limit: limit.toString(),
          page: page.toString(),
        });

        const response = await fetch(
          `${apiUrl}/admin/modules/paginated?${queryParams}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setModules(result.data || []);
          setTotalModules(result.total || 0);
          setCurrentPage(result.currentPage || 1);
          setTotalPages(result.totalPages || 0);
        } else {
          setError(result.message || "Failed to fetch modules");
          setModules([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setModules([]);
        console.error("Error fetching modules paginated:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create module
  const createModule = useCallback(
    async (
      course_id: number,
      module_title: string,
      module_description: string,
      order_index: number,
      estimated_time: number
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/courses/${course_id}/modules`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              module_title,
              module_description,
              order_index,
              estimated_time,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Refresh modules list
          await fetchModulesByCourse(course_id);
          return true;
        } else {
          setError(result.message || "Failed to create module");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error creating module:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchModulesByCourse]
  );

  // Update module
  const updateModule = useCallback(
    async (
      module_id: number,
      module_title: string,
      module_description: string,
      order_index: number,
      estimated_time: number
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/modules/${module_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            module_title,
            module_description,
            order_index,
            estimated_time,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setModules((prev) =>
            prev.map((mod) => (mod.module_id === module_id ? result.data : mod))
          );
          return true;
        } else {
          setError(result.message || "Failed to update module");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating module:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get module by ID
  const getModuleById = useCallback(
    async (module_id: number): Promise<Module | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/modules/${module_id}`, {
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
          setError(result.message || "Failed to fetch module");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching module by ID:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value: ModuleContextType = {
    modules,
    totalModules,
    currentPage,
    totalPages,
    loading,
    error,
    fetchModulesByCourse,
    fetchModulesPaginated,
    createModule,
    updateModule,
    getModuleById,
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
};
