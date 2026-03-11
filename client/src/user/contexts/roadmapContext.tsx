import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Certificate {
  certificate_id: number;
  certificate_name: string;
  description: string;
}

interface Roadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_description: string;
  roadmap_aim: string;
  roadmap_level: "Beginner" | "Intermediate" | "Advanced";
  estimated_duration: number;
  roadmap_status: boolean;
  certificate_id: number;
  created_at: string;
  updated_at: string;
  Certificate?: Certificate;
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

interface Module {
  module_id: number;
  module_title: string;
  module_description: string;
  order_index: number;
  estimated_time: number;
  Module_Lessons?: ModuleLesson[];
}

interface Course {
  course_id: number;
  course_title: string;
  description: string;
  course_level: string;
  estimate_duration: number;
  tag: string;
  access_type: "free" | "premium";
  Modules?: Module[];
}

interface PhaseCourse {
  phase_course_id: number;
  order_number: number;
  is_required: boolean;
  Course: Course;
}

interface Document {
  document_id: number;
  document_type: string;
  document_name: string;
  document_description: string;
  document_url: string;
  file_type: string;
  access_type: "free" | "premium";
}

interface DocumentPhase {
  document_phase_id: number;
  order_index: number;
  Document: Document;
}

interface Phase {
  phase_id: number;
  phase_name: string;
  phase_description: string;
  order: number;
  phase_aims: string;
  Phase_Courses?: PhaseCourse[];
  Document_Phases?: DocumentPhase[];
}

interface RoadmapDetail extends Roadmap {
  Phases: Phase[];
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
    certificate_id?: number,
    sortBy?: string,
    sortOrder?: string,
  ) => Promise<void>;
  getRoadmapById: (roadmap_id: number) => Promise<RoadmapDetail | null>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
};

export const RoadmapProvider = ({ children }: { children: ReactNode }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [totalRoadmaps, setTotalRoadmaps] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmapsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 12,
      roadmap_level?: string,
      certificate_id?: number,
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
        if (roadmap_level) params.append("roadmap_level", roadmap_level);
        if (certificate_id)
          params.append("certificate_id", certificate_id.toString());
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);

        const response = await fetch(
          `${API_URL}/user/roadmaps?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch roadmaps");
        }

        const result = await response.json();
        if (result.success) {
          setRoadmaps(result.data.roadmaps);
          setTotalRoadmaps(result.data.totalItems);
          setCurrentPage(result.data.currentPage);
          setTotalPages(result.data.totalPages);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch roadmaps");
        console.error("Error fetching roadmaps:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getRoadmapById = useCallback(async (roadmap_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/roadmaps/${roadmap_id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch roadmap");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch roadmap");
      console.error("Error fetching roadmap:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RoadmapContext.Provider
      value={{
        roadmaps,
        totalRoadmaps,
        currentPage,
        totalPages,
        loading,
        error,
        fetchRoadmapsPaginated,
        getRoadmapById,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};
