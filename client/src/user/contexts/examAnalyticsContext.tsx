import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ==================== Interfaces ====================

export interface WeaknessType {
  type: string;
  wrong_count: number;
}

export interface OverallStat {
  user_exam_stats_id: number;
  exam_id: number;
  exam_title: string;
  exam_type: "TOEIC" | "IELTS";
  total_correct: number;
  total_wrong: number;
  accuracy_rate: string;
  weakness_types: WeaknessType[];
  updated_at: string;
}

export interface ExamStat {
  user_exam_stats_id: number;
  exam_id: number;
  exam_title: string;
  exam_type: string;
  total_correct: number;
  total_wrong: number;
  accuracy_rate: string;
  weakness_types: WeaknessType[];
  updated_at: string;
}

export interface RecurringWeakness {
  type: string;
  appearances: number;
  total_wrong: number;
}

export interface SuggestedRoadmap {
  roadmap_id: number;
  roadmap_title: string;
  roadmap_level: "Beginner" | "Intermediate" | "Advanced";
  estimated_duration: number | null;
  certificate_name: string | null;
}

export interface SuggestedCourse {
  course_id: number;
  course_title: string;
  course_level: string;
  estimate_duration: number | null;
  tag: string | null;
}

export interface AIAnalysisResult {
  exam_info: {
    exam_id: number;
    exam_title: string;
    exam_type: string;
  };
  stats: {
    total_correct: number;
    total_wrong: number;
    accuracy_rate: string;
    total_score: number | null;
    weakness_types: WeaknessType[];
  };
  historical_context: {
    total_exams_taken: number;
    overall_avg_accuracy: string;
    progress_trend: string;
    recurring_weaknesses: RecurringWeakness[];
  };
  suggested_roadmaps: SuggestedRoadmap[];
  suggested_courses: SuggestedCourse[];
  ai_analysis: string;
  token_usage: {
    openai_tokens_used: number;
    ai_tokens_used: number;
  };
}

interface ExamAnalyticsContextType {
  overallStats: OverallStat[];
  loadingOverall: boolean;
  errorOverall: string | null;

  aiAnalysis: AIAnalysisResult | null;
  loadingAI: boolean;
  errorAI: string | null;

  fetchOverallStats: () => Promise<void>;
  fetchAIAnalysis: (user_exam_id: number) => Promise<void>;
  clearAIAnalysis: () => void;
}

// ==================== Context ====================

const ExamAnalyticsContext = createContext<
  ExamAnalyticsContextType | undefined
>(undefined);

export const useExamAnalytics = () => {
  const context = useContext(ExamAnalyticsContext);
  if (!context) {
    throw new Error(
      "useExamAnalytics must be used within ExamAnalyticsProvider",
    );
  }
  return context;
};

// ==================== Provider ====================

export const ExamAnalyticsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [overallStats, setOverallStats] = useState<OverallStat[]>([]);
  const [loadingOverall, setLoadingOverall] = useState(false);
  const [errorOverall, setErrorOverall] = useState<string | null>(null);

  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  /** GET /api/user/exam-stats — lấy thống kê tổng thể */
  const fetchOverallStats = useCallback(async () => {
    setLoadingOverall(true);
    setErrorOverall(null);
    try {
      const res = await fetch(`${API_URL}/user/exam-stats`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setOverallStats(json.data || []);
      } else {
        setErrorOverall(json.message || "Không thể tải thống kê.");
      }
    } catch {
      setErrorOverall("Lỗi kết nối máy chủ.");
    } finally {
      setLoadingOverall(false);
    }
  }, []);

  /** POST /api/user/user-exams/:user_exam_id/ai-analysis — AI phân tích */
  const fetchAIAnalysis = useCallback(async (user_exam_id: number) => {
    setLoadingAI(true);
    setErrorAI(null);
    setAIAnalysis(null);
    try {
      const res = await fetch(
        `${API_URL}/user/user-exams/${user_exam_id}/ai-analysis`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );
      const json = await res.json();
      if (json.success) {
        setAIAnalysis(json.data);
      } else {
        setErrorAI(json.message || "Không thể phân tích bài thi.");
      }
    } catch {
      setErrorAI("Lỗi kết nối máy chủ.");
    } finally {
      setLoadingAI(false);
    }
  }, []);

  const clearAIAnalysis = useCallback(() => {
    setAIAnalysis(null);
    setErrorAI(null);
  }, []);

  return (
    <ExamAnalyticsContext.Provider
      value={{
        overallStats,
        loadingOverall,
        errorOverall,
        aiAnalysis,
        loadingAI,
        errorAI,
        fetchOverallStats,
        fetchAIAnalysis,
        clearAIAnalysis,
      }}
    >
      {children}
    </ExamAnalyticsContext.Provider>
  );
};
