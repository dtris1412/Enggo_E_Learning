import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface ModuleLesson {
  module_lesson_id: number;
  module_id: number;
  lesson_id: number;
  description: string | null;
  order_index: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  Lesson?: {
    lesson_id: number;
    lesson_title: string;
    lesson_type: string;
    lesson_content: string;
    duration: number;
    is_preview: boolean;
  };
}

interface ModuleLessonContextType {
  moduleLessons: ModuleLesson[];
  loading: boolean;
  error: string | null;
  fetchModuleLessonsByModuleId: (moduleId: number) => Promise<void>;
  addLessonToModule: (
    moduleId: number,
    lessonId: number,
    description: string,
    orderIndex: number,
    status: boolean,
  ) => Promise<boolean>;
  updateModuleLesson: (
    moduleLessonId: number,
    orderIndex: number,
    status: boolean,
  ) => Promise<boolean>;
  removeLessonFromModule: (moduleLessonId: number) => Promise<boolean>;
}

const ModuleLessonContext = createContext<ModuleLessonContextType | undefined>(
  undefined,
);

export const useModuleLesson = () => {
  const context = useContext(ModuleLessonContext);
  if (!context) {
    throw new Error(
      "useModuleLesson must be used within a ModuleLessonProvider",
    );
  }
  return context;
};

interface ModuleLessonProviderProps {
  children: ReactNode;
}

export const ModuleLessonProvider: React.FC<ModuleLessonProviderProps> = ({
  children,
}) => {
  const [moduleLessons, setModuleLessons] = useState<ModuleLesson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchModuleLessonsByModuleId = useCallback(async (moduleId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/modules/${moduleId}/module-lessons`,
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
        setModuleLessons(result.data || []);
      } else {
        setError(result.message || "Failed to fetch module lessons");
        setModuleLessons([]);
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching module lessons",
      );
      setModuleLessons([]);
      console.error("Error fetching module lessons:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLessonToModule = useCallback(
    async (
      moduleId: number,
      lessonId: number,
      description: string,
      orderIndex: number,
      status: boolean,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/modules/${moduleId}/module-lessons`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              lesson_id: lessonId,
              description,
              order_index: orderIndex,
              status,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          await fetchModuleLessonsByModuleId(moduleId);
          return true;
        } else {
          setError(result.message || "Failed to add lesson to module");
          return false;
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while adding lesson to module",
        );
        console.error("Error adding lesson to module:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchModuleLessonsByModuleId],
  );

  const updateModuleLesson = useCallback(
    async (
      moduleLessonId: number,
      orderIndex: number,
      status: boolean,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/module-lessons/${moduleLessonId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              order_index: orderIndex,
              status,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // Update local state
          setModuleLessons((prev) =>
            prev.map((ml) =>
              ml.module_lesson_id === moduleLessonId
                ? { ...ml, order_index: orderIndex, status }
                : ml,
            ),
          );
          return true;
        } else {
          setError(result.message || "Failed to update module lesson");
          return false;
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while updating module lesson",
        );
        console.error("Error updating module lesson:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeLessonFromModule = useCallback(
    async (moduleLessonId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/module-lessons/${moduleLessonId}`,
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
          setModuleLessons((prev) =>
            prev.filter((ml) => ml.module_lesson_id !== moduleLessonId),
          );
          return true;
        } else {
          setError(result.message || "Failed to remove lesson from module");
          return false;
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while removing lesson from module",
        );
        console.error("Error removing lesson from module:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <ModuleLessonContext.Provider
      value={{
        moduleLessons,
        loading,
        error,
        fetchModuleLessonsByModuleId,
        addLessonToModule,
        updateModuleLesson,
        removeLessonFromModule,
      }}
    >
      {children}
    </ModuleLessonContext.Provider>
  );
};
