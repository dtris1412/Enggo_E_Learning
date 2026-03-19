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
}

interface ExamMedia {
  media_id: number;
  audio_url: string;
  duration: number;
}

interface Exam {
  exam_id: number;
  exam_title: string;
  exam_code: string;
  exam_duration: number;
  year: number;
  exam_type: "TOEIC" | "IELTS";
  source: string | null;
  total_questions: number;
  created_at: string;
  Certificate?: Certificate;
  Exam_Medias?: ExamMedia[];
}

interface QuestionOption {
  question_option_id: number;
  label: string;
  content: string;
  order_index: number;
  is_correct?: boolean;
}

interface Question {
  question_id: number;
  question_content: string;
  explanation?: string;
}

interface ContainerQuestion {
  container_question_id: number;
  order: number;
  image_url: string | null;
  score: number;
  Question: Question;
  Question_Options: QuestionOption[];
}

interface ExamContainer {
  container_id: number;
  skill: "listening" | "reading" | "writing" | "speaking";
  type: string;
  order: number;
  content: string;
  instruction: string | null;
  image_url: string | null;
  audio_url: string | null;
  time_limit: number | null;
  Container_Questions: ContainerQuestion[];
}

interface ExamForTaking extends Exam {
  Exam_Containers: ExamContainer[];
}

// UserExam interface - for future use
// interface UserExam {
//   user_exam_id: number;
//   started_at: string;
//   submitted_at: string;
//   status: "submitted" | "graded" | "revised";
//   total_score: number | null;
//   selected_parts: string[];
//   Exam: Exam;
// }

interface ExamResult {
  user_exam_id: number;
  exam: Exam;
  started_at: string;
  submitted_at: string;
  status: string;
  total_score: number;
  statistics: {
    total_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    percentage: string;
  };
  answers: any[];
}

interface ExamContextType {
  exams: Exam[];
  totalExams: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchExamsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    exam_type?: string,
    year?: number,
    certificate_id?: number,
  ) => Promise<void>;
  getExamById: (exam_id: number) => Promise<Exam | null>;
  getExamForTaking: (
    exam_id: number,
    user_exam_id?: number,
  ) => Promise<ExamForTaking | null>;
  getUserExamHistory: (
    page?: number,
    limit?: number,
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  startExam: (
    exam_id: number,
    selected_parts?: string[],
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  saveAnswers: (
    user_exam_id: number,
    answers: Array<{
      container_question_id: number;
      question_option_id: number | null;
    }>,
  ) => Promise<{ success: boolean; message?: string }>;
  submitExam: (
    user_exam_id: number,
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  getExamResult: (
    user_exam_id: number,
  ) => Promise<{ success: boolean; data?: ExamResult; message?: string }>;
  abandonExam: (
    user_exam_id: number,
  ) => Promise<{ success: boolean; message?: string }>;
  getOngoingExam: () => Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [totalExams, setTotalExams] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch exams with pagination
  const fetchExamsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 12,
      exam_type?: string,
      year?: number,
      certificate_id?: number,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (exam_type) params.append("exam_type", exam_type);
        if (year) params.append("year", year.toString());
        if (certificate_id)
          params.append("certificate_id", certificate_id.toString());

        const response = await fetch(
          `${API_URL}/user/exams?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }

        const result = await response.json();
        if (result.success) {
          setExams(result.data.exams);
          setTotalExams(result.data.pagination.total);
          setCurrentPage(result.data.pagination.page);
          setTotalPages(result.data.pagination.totalPages);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch exams");
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get exam by ID
  const getExamById = useCallback(async (exam_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/exams/${exam_id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch exam");
      console.error("Error fetching exam:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get exam for taking (with questions but no answers)
  const getExamForTaking = useCallback(
    async (exam_id: number, user_exam_id?: number) => {
      setLoading(true);
      setError(null);
      try {
        const url = user_exam_id
          ? `${API_URL}/user/exams/${exam_id}/take?user_exam_id=${user_exam_id}`
          : `${API_URL}/user/exams/${exam_id}/take`;
        const response = await fetch(url, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch exam for taking");
        }

        const result = await response.json();
        if (result.success) {
          return result.data;
        }
        return null;
      } catch (err: any) {
        setError(err.message || "Failed to fetch exam for taking");
        console.error("Error fetching exam for taking:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get user exam history
  const getUserExamHistory = async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(
        `${API_URL}/user/exams/history?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error fetching exam history:", err);
      return { success: false, message: err.message };
    }
  };

  // Start exam
  const startExam = async (exam_id: number, selected_parts = ["all"]) => {
    try {
      const response = await fetch(`${API_URL}/user/user-exams/start`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ exam_id, selected_parts }),
      });

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error starting exam:", err);
      return { success: false, message: err.message };
    }
  };

  // Save answers
  const saveAnswers = async (
    user_exam_id: number,
    answers: Array<{
      container_question_id: number;
      question_option_id: number | null;
    }>,
  ) => {
    try {
      const response = await fetch(`${API_URL}/user/user-exams/save-answers`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_exam_id, answers }),
      });

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error saving answers:", err);
      return { success: false, message: err.message };
    }
  };

  // Submit exam
  const submitExam = async (user_exam_id: number) => {
    try {
      const response = await fetch(`${API_URL}/user/user-exams/submit`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_exam_id }),
      });

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error submitting exam:", err);
      return { success: false, message: err.message };
    }
  };

  // Get exam result
  const getExamResult = async (user_exam_id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/user/user-exams/${user_exam_id}/result`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error fetching exam result:", err);
      return { success: false, message: err.message };
    }
  };

  // Abandon exam
  const abandonExam = async (user_exam_id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/user/user-exams/${user_exam_id}/abandon`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error abandoning exam:", err);
      return { success: false, message: err.message };
    }
  };

  // Get ongoing exam
  const getOngoingExam = async () => {
    try {
      const response = await fetch(`${API_URL}/user/user-exams/ongoing`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Error fetching ongoing exam:", err);
      return { success: false, message: err.message };
    }
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        totalExams,
        currentPage,
        totalPages,
        loading,
        error,
        fetchExamsPaginated,
        getExamById,
        getExamForTaking,
        getUserExamHistory,
        startExam,
        saveAnswers,
        submitExam,
        getExamResult,
        abandonExam,
        getOngoingExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};
