import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Certificate {
  certificate_id: number;
  certificate_name: string;
}

interface Exam {
  exam_id: number;
  exam_title: string;
  exam_duration: number;
  exam_code: string;
  year: number;
  certificate_id?: number;
  exam_type: "TOEIC" | "IELTS";
  source?: string;
  total_questions: number;
  created_at: string;
  updated_at?: string;
  Certificate?: Certificate;
}

interface ExamContainer {
  container_id: number;
  exam_id: number;
  skill?: "listening" | "reading" | "writing" | "speaking";
  type:
    | "toeic_group"
    | "toeic_single"
    | "ielts_passage"
    | "writing_task"
    | "speaking_part";
  order: number;
  content: string;
  instruction?: string;
  image_url?: string;
  audio_url?: string;
  time_limit?: number;
  created_at: string;
  updated_at?: string;
  Container_Questions?: ContainerQuestion[];
}

interface Question {
  question_id: number;
  question_content: string;
  explanation?: string;
  created_at: string;
  updated_at?: string;
}

interface ContainerQuestion {
  container_question_id: number;
  container_id: number;
  question_id: number;
  order: number;
  image_url?: string;
  score?: number;
  created_at?: string;
  Question?: Question;
  Question_Options?: QuestionOption[];
}

interface QuestionOption {
  question_option_id: number;
  container_question_id: number;
  label: string;
  content: string;
  is_correct: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

interface ExamMedia {
  media_id: number;
  exam_id: number;
  audio_url: string;
  duration: number;
  created_at: string;
  updated_at?: string;
}

interface ExamPaginationResult {
  exams: Exam[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ExamContextType {
  exams: Exam[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;

  // Exam CRUD
  fetchExamsPaginated: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    exam_type?: string;
    difficulty_level?: string;
    certificate_id?: number;
    exam_status?: string;
    sortBy?: string;
    order?: string;
  }) => Promise<void>;
  getExamById: (exam_id: number) => Promise<Exam | null>;
  getExamWithDetails: (exam_id: number) => Promise<any>;
  createExam: (examData: Partial<Exam>) => Promise<boolean>;
  updateExam: (exam_id: number, examData: Partial<Exam>) => Promise<boolean>;
  deleteExam: (exam_id: number) => Promise<boolean>;

  // Container Management
  getContainersByExamId: (exam_id: number) => Promise<ExamContainer[]>;
  createExamContainer: (containerData: {
    exam_id: number;
    skill?: "listening" | "reading" | "writing" | "speaking";
    type:
      | "toeic_group"
      | "toeic_single"
      | "ielts_passage"
      | "writing_task"
      | "speaking_part";
    order: number;
    content: string;
    instruction?: string;
    image_url?: string;
    audio_url?: string;
    time_limit?: number;
  }) => Promise<boolean>;
  updateExamContainer: (
    container_id: number,
    containerData: Partial<ExamContainer>,
  ) => Promise<boolean>;
  deleteExamContainer: (container_id: number) => Promise<boolean>;

  // Question Management
  createQuestion: (questionData: {
    question_content: string;
    explanation?: string;
  }) => Promise<number | null>;
  updateQuestion: (
    question_id: number,
    questionData: Partial<Question>,
  ) => Promise<boolean>;
  deleteQuestion: (question_id: number) => Promise<boolean>;

  // Container-Question Relationship
  addQuestionToContainer: (data: {
    container_id: number;
    question_id: number;
    order: number;
    image_url?: string;
    score?: number;
  }) => Promise<number | null>;
  removeQuestionFromContainer: (
    container_question_id: number,
  ) => Promise<boolean>;
  updateQuestionOrderInContainer: (
    container_question_id: number,
    order: number,
    image_url?: string,
    score?: number,
  ) => Promise<boolean>;

  // Question Options
  createQuestionOption: (optionData: {
    container_question_id: number;
    label: string;
    content: string;
    is_correct: boolean;
    order_index: number;
  }) => Promise<boolean>;
  updateQuestionOption: (
    question_option_id: number,
    optionData: Partial<QuestionOption>,
  ) => Promise<boolean>;
  deleteQuestionOption: (question_option_id: number) => Promise<boolean>;

  // Exam Media
  getExamMediaByExamId: (exam_id: number) => Promise<ExamMedia[]>;
  createExamMedia: (mediaData: {
    exam_id: number;
    audio_url: string;
    duration: number;
  }) => Promise<boolean>;
  deleteExamMedia: (media_id: number) => Promise<boolean>;

  // File Upload
  uploadExamAudio: (file: File) => Promise<string | null>;
  uploadExamImages: (files: File[]) => Promise<string[] | null>;
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
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==================== EXAM CRUD ====================
  const fetchExamsPaginated = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      exam_type?: string;
      difficulty_level?: string;
      certificate_id?: number;
      exam_status?: string;
      sortBy?: string;
      order?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.exam_type)
          queryParams.append("exam_type", params.exam_type);
        if (params?.difficulty_level)
          queryParams.append("difficulty_level", params.difficulty_level);
        if (params?.certificate_id)
          queryParams.append(
            "certificate_id",
            params.certificate_id.toString(),
          );
        if (params?.exam_status)
          queryParams.append("exam_status", params.exam_status);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.order) queryParams.append("order", params.order);

        const response = await fetch(
          `${API_URL}/admin/exams/paginated?${queryParams.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }

        const result = await response.json();
        if (result.success) {
          setExams(result.data.exams || []);
          setPagination(result.data.pagination);
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

  const getExamById = useCallback(async (exam_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exams/${exam_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
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

  const getExamWithDetails = useCallback(async (exam_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/exams/${exam_id}/details`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exam details");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch exam details");
      console.error("Error fetching exam details:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createExam = async (examData: Partial<Exam>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exams`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create exam");
      console.error("Error creating exam:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (
    exam_id: number,
    examData: Partial<Exam>,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exams/${exam_id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update exam");
      console.error("Error updating exam:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (exam_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exams/${exam_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete exam");
      console.error("Error deleting exam:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== CONTAINER MANAGEMENT ====================
  const getContainersByExamId = async (
    exam_id: number,
  ): Promise<ExamContainer[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/exams/${exam_id}/containers`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch containers");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (err: any) {
      setError(err.message || "Failed to fetch containers");
      console.error("Error fetching containers:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createExamContainer = async (containerData: {
    exam_id: number;
    skill?: "listening" | "reading" | "writing" | "speaking";
    type:
      | "toeic_group"
      | "toeic_single"
      | "ielts_passage"
      | "writing_task"
      | "speaking_part";
    order: number;
    content: string;
    instruction?: string;
    image_url?: string;
    audio_url?: string;
    time_limit?: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exam-containers`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(containerData),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create container");
      console.error("Error creating container:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateExamContainer = async (
    container_id: number,
    containerData: Partial<ExamContainer>,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/exam-containers/${container_id}`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(containerData),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update container");
      console.error("Error updating container:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExamContainer = async (
    container_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/exam-containers/${container_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete container");
      console.error("Error deleting container:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== QUESTION MANAGEMENT ====================
  const createQuestion = async (questionData: {
    question_content: string;
    explanation?: string;
  }): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/questions`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const result = await response.json();
      if (result.success) {
        return result.data.question_id;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create question");
      console.error("Error creating question:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (
    question_id: number,
    questionData: Partial<Question>,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/questions/${question_id}`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        },
      );

      const result = await response.json();
      if (result.success) {
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

  const deleteQuestion = async (question_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/questions/${question_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete question");
      console.error("Error deleting question:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== CONTAINER-QUESTION RELATIONSHIP ====================
  const addQuestionToContainer = async (data: {
    container_id: number;
    question_id: number;
    order: number;
    image_url?: string;
    score?: number;
  }): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/container-questions`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        return result.data.container_question_id;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Failed to add question to container");
      console.error("Error adding question to container:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeQuestionFromContainer = async (
    container_question_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/container-questions/${container_question_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove question from container");
      console.error("Error removing question from container:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestionOrderInContainer = async (
    container_question_id: number,
    order: number,
    image_url?: string,
    score?: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/container-questions/${container_question_id}/order`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order, image_url, score }),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update question order");
      console.error("Error updating question order:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== QUESTION OPTIONS ====================
  const createQuestionOption = async (optionData: {
    container_question_id: number;
    label: string;
    content: string;
    is_correct: boolean;
    order_index: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/question-options`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(optionData),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create question option");
      console.error("Error creating question option:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestionOption = async (
    question_option_id: number,
    optionData: Partial<QuestionOption>,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/question-options/${question_option_id}`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(optionData),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update question option");
      console.error("Error updating question option:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestionOption = async (
    question_option_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/question-options/${question_option_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete question option");
      console.error("Error deleting question option:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== EXAM MEDIA ====================
  const getExamMediaByExamId = async (
    exam_id: number,
  ): Promise<ExamMedia[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exams/${exam_id}/media`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam media");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (err: any) {
      setError(err.message || "Failed to fetch exam media");
      console.error("Error fetching exam media:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createExamMedia = async (mediaData: {
    exam_id: number;
    audio_url: string;
    duration: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exam-media`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mediaData),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create exam media");
      console.error("Error creating exam media:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExamMedia = async (media_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/exam-media/${media_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete exam media");
      console.error("Error deleting exam media:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILE UPLOAD ====================
  const uploadExamAudio = async (file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch(`${API_URL}/upload/exam/audio`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return result.data.url;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload audio");
      console.error("Error uploading audio:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadExamImages = async (files: File[]): Promise<string[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`${API_URL}/upload/exam/images`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return result.data.urls;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
      console.error("Error uploading images:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        pagination,
        loading,
        error,
        fetchExamsPaginated,
        getExamById,
        getExamWithDetails,
        createExam,
        updateExam,
        deleteExam,
        getContainersByExamId,
        createExamContainer,
        updateExamContainer,
        deleteExamContainer,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        addQuestionToContainer,
        removeQuestionFromContainer,
        updateQuestionOrderInContainer,
        createQuestionOption,
        updateQuestionOption,
        deleteQuestionOption,
        getExamMediaByExamId,
        createExamMedia,
        deleteExamMedia,
        uploadExamAudio,
        uploadExamImages,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};
