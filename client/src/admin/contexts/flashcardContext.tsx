import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface FlashcardSet {
  flashcard_set_id: number;
  user_id: number;
  user_exam_id: number | null;
  exam_id: number | null;
  source_type: string | null;
  title: string;
  description: string | null;
  visibility: string;
  created_by_type: "admin" | "user" | "AI";
  total_cards: number;
  created_at: string;
  updated_at: string;
  User?: {
    user_id: number;
    user_name: string;
    user_email: string;
    avatar: string;
  };
  Flashcards?: Flashcard[];
}

interface Flashcard {
  flashcard_id: number;
  flashcard_set_id: number;
  container_question_id: number | null;
  front_content: string;
  back_content: string;
  example: string | null;
  difficulty_level: string | null;
  pronunciation: string | null;
  audio_url: string | null;
  Flashcard_Set?: {
    flashcard_set_id: number;
    title: string;
    description: string;
  };
}

interface FlashcardContextType {
  // Flashcard Set
  flashcardSets: FlashcardSet[];
  totalFlashcardSets: number;
  loading: boolean;
  error: string | null;
  fetchFlashcardSetsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    visibility?: string,
    created_by_type?: string,
  ) => Promise<void>;
  getFlashcardSetById: (
    flashcard_set_id: number,
  ) => Promise<FlashcardSet | null>;
  createFlashcardSet: (data: {
    title: string;
    description?: string;
    visibility?: string;
    created_by_type?: string;
    user_exam_id?: number;
    exam_id?: number;
    source_type?: string;
  }) => Promise<boolean>;
  updateFlashcardSet: (
    flashcard_set_id: number,
    data: {
      title?: string;
      description?: string;
      visibility?: string;
      created_by_type?: string;
      user_exam_id?: number;
      exam_id?: number;
      source_type?: string;
    },
  ) => Promise<boolean>;
  deleteFlashcardSet: (flashcard_set_id: number) => Promise<boolean>;

  // Flashcard
  flashcards: Flashcard[];
  totalFlashcards: number;
  fetchFlashcardsBySetId: (
    flashcard_set_id: number,
    page?: number,
    limit?: number,
    difficulty_level?: string,
  ) => Promise<void>;
  getFlashcardById: (flashcard_id: number) => Promise<Flashcard | null>;
  createFlashcard: (data: {
    flashcard_set_id: number;
    front_content: string;
    back_content: string;
    example?: string;
    difficulty_level?: string;
    pronunciation?: string;
    container_question_id?: number;
  }) => Promise<boolean>;
  createMultipleFlashcards: (
    flashcard_set_id: number,
    flashcards: Array<{
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: string;
      pronunciation?: string;
    }>,
  ) => Promise<boolean>;
  updateFlashcard: (
    flashcard_id: number,
    data: {
      front_content?: string;
      back_content?: string;
      example?: string;
      difficulty_level?: string;
      pronunciation?: string;
      container_question_id?: number;
    },
  ) => Promise<boolean>;
  deleteFlashcard: (flashcard_id: number) => Promise<boolean>;
  deleteMultipleFlashcards: (flashcard_ids: number[]) => Promise<boolean>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined,
);

export const useFlashcard = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcard must be used within a FlashcardProvider");
  }
  return context;
};

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [totalFlashcardSets, setTotalFlashcardSets] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ================== FLASHCARD SET ==================

  const fetchFlashcardSetsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 10,
      visibility?: string,
      created_by_type?: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (visibility) params.append("visibility", visibility);
        if (created_by_type) params.append("created_by_type", created_by_type);

        const response = await fetch(
          `${API_URL}/admin/flashcard-sets/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch flashcard sets");
        }

        const result = await response.json();
        if (result.success) {
          setFlashcardSets(result.data.flashcardSets);
          setTotalFlashcardSets(result.data.pagination.total);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch flashcard sets");
        console.error("Error fetching flashcard sets:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getFlashcardSetById = useCallback(async (flashcard_set_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcard-sets/${flashcard_set_id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flashcard set");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch flashcard set");
      console.error("Error fetching flashcard set:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFlashcardSet = async (data: {
    title: string;
    description?: string;
    visibility?: string;
    created_by_type?: string;
    user_exam_id?: number;
    exam_id?: number;
    source_type?: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/flashcard-sets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to create flashcard set");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create flashcard set");
      console.error("Error creating flashcard set:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFlashcardSet = async (
    flashcard_set_id: number,
    data: {
      title?: string;
      description?: string;
      visibility?: string;
      created_by_type?: string;
      user_exam_id?: number;
      exam_id?: number;
      source_type?: string;
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcard-sets/${flashcard_set_id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to update flashcard set");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update flashcard set");
      console.error("Error updating flashcard set:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcardSet = async (
    flashcard_set_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcard-sets/${flashcard_set_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to delete flashcard set");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete flashcard set");
      console.error("Error deleting flashcard set:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ================== FLASHCARD ==================

  const fetchFlashcardsBySetId = useCallback(
    async (
      flashcard_set_id: number,
      page = 1,
      limit = 20,
      difficulty_level?: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (difficulty_level)
          params.append("difficulty_level", difficulty_level);

        const response = await fetch(
          `${API_URL}/admin/flashcard-sets/${flashcard_set_id}/flashcards?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch flashcards");
        }

        const result = await response.json();
        if (result.success) {
          setFlashcards(result.data.flashcards);
          setTotalFlashcards(result.data.pagination.total);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch flashcards");
        console.error("Error fetching flashcards:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getFlashcardById = useCallback(async (flashcard_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcards/${flashcard_id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flashcard");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch flashcard");
      console.error("Error fetching flashcard:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFlashcard = async (data: {
    flashcard_set_id: number;
    front_content: string;
    back_content: string;
    example?: string;
    difficulty_level?: string;
    pronunciation?: string;
    container_question_id?: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/flashcards`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to create flashcard");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create flashcard");
      console.error("Error creating flashcard:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createMultipleFlashcards = async (
    flashcard_set_id: number,
    flashcards: Array<{
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: string;
      pronunciation?: string;
    }>,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/flashcards/batch`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          flashcard_set_id,
          flashcards,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to create flashcards");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create flashcards");
      console.error("Error creating flashcards:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFlashcard = async (
    flashcard_id: number,
    data: {
      front_content?: string;
      back_content?: string;
      example?: string;
      difficulty_level?: string;
      pronunciation?: string;
      container_question_id?: number;
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcards/${flashcard_id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to update flashcard");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update flashcard");
      console.error("Error updating flashcard:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (flashcard_id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcards/${flashcard_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to delete flashcard");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete flashcard");
      console.error("Error deleting flashcard:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleFlashcards = async (
    flashcard_ids: number[],
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/flashcards/delete-multiple`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ flashcard_ids }),
        },
      );

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message || "Failed to delete flashcards");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete flashcards");
      console.error("Error deleting flashcards:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlashcardContext.Provider
      value={{
        // Flashcard Set
        flashcardSets,
        totalFlashcardSets,
        loading,
        error,
        fetchFlashcardSetsPaginated,
        getFlashcardSetById,
        createFlashcardSet,
        updateFlashcardSet,
        deleteFlashcardSet,
        // Flashcard
        flashcards,
        totalFlashcards,
        fetchFlashcardsBySetId,
        getFlashcardById,
        createFlashcard,
        createMultipleFlashcards,
        updateFlashcard,
        deleteFlashcard,
        deleteMultipleFlashcards,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};
