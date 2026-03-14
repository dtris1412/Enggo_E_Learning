import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface FlashcardSet {
  flashcard_set_id: number;
  user_id: number;
  title: string;
  description: string | null;
  visibility: "public" | "private";
  created_by_type: "user" | "admin";
  total_cards: number;
  created_at: string;
  updated_at: string;
  User?: {
    user_id: number;
    user_name: string;
    user_email: string;
    avatar: string | null;
  };
  Flashcards?: Flashcard[];
}

interface Flashcard {
  flashcard_id: number;
  flashcard_set_id: number;
  front_content: string;
  back_content: string;
  example: string | null;
  difficulty_level: "easy" | "medium" | "hard" | null;
  pronunciation: string | null;
  audio_url: string | null;
}

interface FlashcardContextType {
  // Flashcard Sets
  flashcardSets: FlashcardSet[];
  totalFlashcardSets: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  // Flashcards
  flashcards: Flashcard[];
  totalFlashcards: number;
  flashcardsCurrentPage: number;
  flashcardsTotalPages: number;

  // Flashcard Set Methods
  fetchFlashcardSetsPaginated: (
    search?: string,
    page?: number,
    limit?: number,
    visibility?: string,
    created_by_type?: string,
    sortBy?: string,
    sortOrder?: string,
  ) => Promise<void>;
  fetchMyFlashcardSets: (
    search?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string,
  ) => Promise<void>;
  getFlashcardSetById: (
    flashcard_set_id: number,
  ) => Promise<FlashcardSet | null>;
  createFlashcardSet: (data: {
    title: string;
    description?: string;
    visibility?: "public" | "private";
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  updateFlashcardSet: (
    flashcard_set_id: number,
    data: {
      title?: string;
      description?: string;
      visibility?: "public" | "private";
    },
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteFlashcardSet: (flashcard_set_id: number) => Promise<{
    success: boolean;
    message?: string;
  }>;

  // Flashcard Methods
  fetchFlashcardsBySetId: (
    flashcard_set_id: number,
    page?: number,
    limit?: number,
    difficulty_level?: string,
  ) => Promise<void>;
  getFlashcardById: (flashcard_id: number) => Promise<Flashcard | null>;
  createFlashcard: (
    flashcard_set_id: number,
    data: {
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard" | null;
      pronunciation?: string;
    },
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  createMultipleFlashcards: (
    flashcard_set_id: number,
    flashcards: Array<{
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard" | null;
      pronunciation?: string;
    }>,
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  updateFlashcard: (
    flashcard_id: number,
    data: {
      front_content?: string;
      back_content?: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard" | null;
      pronunciation?: string;
    },
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteFlashcard: (flashcard_id: number) => Promise<{
    success: boolean;
    message?: string;
  }>;
  deleteMultipleFlashcards: (flashcard_ids: number[]) => Promise<{
    success: boolean;
    message?: string;
  }>;
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
  // Flashcard Sets State
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [totalFlashcardSets, setTotalFlashcardSets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [flashcardsCurrentPage, setFlashcardsCurrentPage] = useState(1);
  const [flashcardsTotalPages, setFlashcardsTotalPages] = useState(0);

  // Common State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // ==================== FLASHCARD SET METHODS ====================

  const fetchFlashcardSetsPaginated = useCallback(
    async (
      search = "",
      page = 1,
      limit = 12,
      visibility?: string,
      created_by_type?: string,
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
        if (visibility) params.append("visibility", visibility);
        if (created_by_type) params.append("created_by_type", created_by_type);
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);

        const response = await fetch(
          `${API_URL}/user/flashcard-sets?${params.toString()}`,
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
          setTotalFlashcardSets(result.data.totalItems);
          setCurrentPage(result.data.currentPage);
          setTotalPages(result.data.totalPages);
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

  const fetchMyFlashcardSets = useCallback(
    async (
      search = "",
      page = 1,
      limit = 12,
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
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);

        const response = await fetch(
          `${API_URL}/user/flashcard-sets/my-sets?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch your flashcard sets");
        }

        const result = await response.json();
        if (result.success) {
          setFlashcardSets(result.data.flashcardSets);
          setTotalFlashcardSets(result.data.totalItems);
          setCurrentPage(result.data.currentPage);
          setTotalPages(result.data.totalPages);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch your flashcard sets");
        console.error("Error fetching my flashcard sets:", err);
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
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}`,
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
    visibility?: "public" | "private";
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/user/flashcard-sets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to create flashcard set",
        };
      }

      return { success: true, data: result.data, message: result.message };
    } catch (err: any) {
      console.error("Error creating flashcard set:", err);
      return { success: false, message: err.message };
    }
  };

  const updateFlashcardSet = async (
    flashcard_set_id: number,
    data: {
      title?: string;
      description?: string;
      visibility?: "public" | "private";
    },
  ): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to update flashcard set",
        };
      }

      return { success: true, data: result.data, message: result.message };
    } catch (err: any) {
      console.error("Error updating flashcard set:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteFlashcardSet = async (
    flashcard_set_id: number,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete flashcard set",
        };
      }

      return { success: true, message: result.message };
    } catch (err: any) {
      console.error("Error deleting flashcard set:", err);
      return { success: false, message: err.message };
    }
  };

  // ==================== FLASHCARD METHODS ====================

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
          `${API_URL}/user/flashcard-sets/${flashcard_set_id}/flashcards?${params.toString()}`,
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
          setTotalFlashcards(result.data.totalItems);
          setFlashcardsCurrentPage(result.data.currentPage);
          setFlashcardsTotalPages(result.data.totalPages);
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
        `${API_URL}/user/flashcards/${flashcard_id}`,
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

  const createFlashcard = async (
    flashcard_set_id: number,
    data: {
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard" | null;
      pronunciation?: string;
    },
  ): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}/flashcards`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to create flashcard",
        };
      }

      return { success: true, data: result.data, message: result.message };
    } catch (err: any) {
      console.error("Error creating flashcard:", err);
      return { success: false, message: err.message };
    }
  };

  const createMultipleFlashcards = async (
    flashcard_set_id: number,
    flashcards: Array<{
      front_content: string;
      back_content: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard" | null;
      pronunciation?: string;
    }>,
  ): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcard-sets/${flashcard_set_id}/flashcards/bulk`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ flashcards }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to create flashcards",
        };
      }

      return { success: true, data: result.data, message: result.message };
    } catch (err: any) {
      console.error("Error creating flashcards:", err);
      return { success: false, message: err.message };
    }
  };

  const updateFlashcard = async (
    flashcard_id: number,
    data: {
      front_content?: string;
      back_content?: string;
      example?: string;
      difficulty_level?: "easy" | "medium" | "hard" | null;
      pronunciation?: string;
    },
  ): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcards/${flashcard_id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to update flashcard",
        };
      }

      return { success: true, data: result.data, message: result.message };
    } catch (err: any) {
      console.error("Error updating flashcard:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteFlashcard = async (
    flashcard_id: number,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/user/flashcards/${flashcard_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete flashcard",
        };
      }

      return { success: true, message: result.message };
    } catch (err: any) {
      console.error("Error deleting flashcard:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteMultipleFlashcards = async (
    flashcard_ids: number[],
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/user/flashcards/bulk-delete`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ flashcard_ids }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Failed to delete flashcards",
        };
      }

      return { success: true, message: result.message };
    } catch (err: any) {
      console.error("Error deleting flashcards:", err);
      return { success: false, message: err.message };
    }
  };

  return (
    <FlashcardContext.Provider
      value={{
        // Flashcard Sets State
        flashcardSets,
        totalFlashcardSets,
        currentPage,
        totalPages,
        loading,
        error,

        // Flashcards State
        flashcards,
        totalFlashcards,
        flashcardsCurrentPage,
        flashcardsTotalPages,

        // Flashcard Set Methods
        fetchFlashcardSetsPaginated,
        fetchMyFlashcardSets,
        getFlashcardSetById,
        createFlashcardSet,
        updateFlashcardSet,
        deleteFlashcardSet,

        // Flashcard Methods
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
