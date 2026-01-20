import { createContext, useContext, useState, ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface LessonQuestion {
  lesson_question_id: number;
  lesson_id: number;
  order_index: number;
  question_type: string;
  content: string;
  correct_answer: string;
  explaination: string | null;
  difficulty_level: string;
  options: string | null;
  generate_by_ai: boolean;
  ai_model: string | null;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

interface LessonQuestionContextType {
  questions: LessonQuestion[];
  totalQuestions: number;
  loading: boolean;
  error: string | null;
  fetchQuestionsByLessonId: (lessonId: number) => Promise<void>;
  fetchQuestionsPaginated: (
    search?: string,
    limit?: number,
    page?: number,
  ) => Promise<void>;
  createQuestion: (data: {
    lesson_id: number;
    order_index: number;
    question_type: string;
    content: string;
    correct_answer: string;
    explaination: string;
    difficulty_level: string;
    options: string;
    ai_model?: string;
    status?: boolean;
  }) => Promise<boolean>;
  updateQuestion: (
    questionId: number,
    data: {
      order_index: number;
      question_type: string;
      content: string;
      correct_answer: string;
      explaination: string;
      difficulty_level: string;
      options: string;
      ai_model?: string;
      status?: boolean;
    },
  ) => Promise<boolean>;
  lockQuestion: (questionId: number) => Promise<boolean>;
  unlockQuestion: (questionId: number) => Promise<boolean>;
}

const LessonQuestionContext = createContext<
  LessonQuestionContextType | undefined
>(undefined);

export const useLessonQuestion = () => {
  const context = useContext(LessonQuestionContext);
  if (!context) {
    throw new Error(
      "useLessonQuestion must be used within a LessonQuestionProvider",
    );
  }
  return context;
};

export const LessonQuestionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchQuestionsByLessonId = async (lessonId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lessons/${lessonId}/questions`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const result = await response.json();
      if (result.success) {
        setQuestions(result.questions || []);
        setTotalQuestions(result.totalQuestions || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch questions");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsPaginated = async (search = "", limit = 10, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", limit.toString());
      params.append("page", page.toString());

      const response = await fetch(
        `${API_URL}/admin/lesson-questions/paginated?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const result = await response.json();
      if (result.success) {
        setQuestions(result.questions || []);
        setTotalQuestions(result.totalQuestions || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch questions");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (data: {
    lesson_id: number;
    order_index: number;
    question_type: string;
    content: string;
    correct_answer: string;
    explaination: string;
    difficulty_level: string;
    options: string;
    ai_model?: string;
    status?: boolean;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/lesson-questions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh questions list
        if (data.lesson_id) {
          await fetchQuestionsByLessonId(data.lesson_id);
        }
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create question");
      console.error("Error creating question:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (
    questionId: number,
    data: {
      order_index: number;
      question_type: string;
      content: string;
      correct_answer: string;
      explaination: string;
      difficulty_level: string;
      options: string;
      ai_model?: string;
      status?: boolean;
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lesson-questions/${questionId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Update local state
        setQuestions((prev) =>
          prev.map((q) =>
            q.lesson_question_id === questionId ? { ...q, ...data } : q,
          ),
        );
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update question");
      console.error("Error updating question:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const lockQuestion = async (questionId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lesson-questions/${questionId}/lock`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.lesson_question_id === questionId ? { ...q, status: false } : q,
          ),
        );
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to lock question");
      console.error("Error locking question:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlockQuestion = async (questionId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/lesson-questions/${questionId}/unlock`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.lesson_question_id === questionId ? { ...q, status: true } : q,
          ),
        );
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to unlock question");
      console.error("Error unlocking question:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LessonQuestionContext.Provider
      value={{
        questions,
        totalQuestions,
        loading,
        error,
        fetchQuestionsByLessonId,
        fetchQuestionsPaginated,
        createQuestion,
        updateQuestion,
        lockQuestion,
        unlockQuestion,
      }}
    >
      {children}
    </LessonQuestionContext.Provider>
  );
};
