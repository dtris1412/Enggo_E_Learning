import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface CertificateSkill {
  certificate_skill_id: number;
  certificate_id: number;
  skill_id: number;
  weight: number;
  description: string;
  Certificate?: {
    certificate_id: number;
    certificate_name: string;
    description: string;
  };
}

interface Skill {
  skill_id: number;
  skill_name: string;
  created_at: string;
  updated_at?: string;
  Certificate_Skills?: CertificateSkill[];
}

interface SkillContextType {
  skills: Skill[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  fetchSkills: (
    search?: string,
    limit?: number,
    page?: number
  ) => Promise<void>;
  getSkillById: (skill_id: number) => Promise<Skill | null>;
  createSkill: (skill_name: string) => Promise<boolean>;
  updateSkill: (skill_id: number, skill_name: string) => Promise<boolean>;

  // Certificate-Skill management
  certificateSkills: CertificateSkill[];
  fetchCertificateSkills: (
    certificate_id?: number,
    limit?: number,
    page?: number
  ) => Promise<void>;
  createCertificateSkill: (
    certificate_id: number,
    skill_id: number,
    weight: number,
    description?: string
  ) => Promise<boolean>;
  updateCertificateSkill: (
    certificate_skill_id: number,
    skill_id?: number,
    certificate_id?: number,
    weight?: number,
    description?: string
  ) => Promise<boolean>;
  deleteCertificateSkill: (certificate_skill_id: number) => Promise<boolean>;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkill = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkill must be used within a SkillProvider");
  }
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificateSkills, setCertificateSkills] = useState<
    CertificateSkill[]
  >([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchSkills = useCallback(async (search = "", limit = 10, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", limit.toString());
      params.append("page", page.toString());

      const response = await fetch(
        `${apiUrl}/admin/skills/paginated?${params.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const result = await response.json();
      if (result.success) {
        setSkills(result.data.skills);
        setTotalItems(result.data.totalItems);
        setTotalPages(result.data.totalPages);
        setCurrentPage(result.data.currentPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSkillById = useCallback(async (skill_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/admin/skills/${skill_id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch skill");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching skill:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSkill = useCallback(async (skill_name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/admin/skills`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ skill_name }),
      });

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating skill:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSkill = useCallback(
    async (skill_id: number, skill_name: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/skills/${skill_id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ skill_name }),
        });

        const result = await response.json();
        if (result.success) {
          return true;
        } else {
          setError(result.message);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating skill:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Certificate-Skill functions
  const fetchCertificateSkills = useCallback(
    async (certificate_id?: number, limit = 10, page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (certificate_id)
          params.append("certificate_id", certificate_id.toString());
        params.append("limit", limit.toString());
        params.append("page", page.toString());

        const response = await fetch(
          `${apiUrl}/admin/certificate-skills/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch certificate skills");
        }

        const result = await response.json();
        if (result.success) {
          setCertificateSkills(result.data.certificateSkills);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching certificate skills:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCertificateSkill = useCallback(
    async (
      certificate_id: number,
      skill_id: number,
      weight: number,
      description = ""
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/admin/certificate-skills`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            certificate_id,
            skill_id,
            weight,
            description,
          }),
        });

        const result = await response.json();
        if (result.success) {
          return true;
        } else {
          setError(result.message);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error creating certificate skill:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCertificateSkill = useCallback(
    async (
      certificate_skill_id: number,
      skill_id?: number,
      certificate_id?: number,
      weight?: number,
      description?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const body: any = {};
        if (skill_id) body.skill_id = skill_id;
        if (certificate_id) body.certificate_id = certificate_id;
        if (weight !== undefined) body.weight = weight;
        if (description !== undefined) body.description = description;

        const response = await fetch(
          `${apiUrl}/admin/certificate-skills/${certificate_skill_id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
          }
        );

        const result = await response.json();
        if (result.success) {
          return true;
        } else {
          setError(result.message);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating certificate skill:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCertificateSkill = useCallback(
    async (certificate_skill_id: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/admin/certificate-skills/${certificate_skill_id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();
        if (result.success) {
          return true;
        } else {
          setError(result.message);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error deleting certificate skill:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <SkillContext.Provider
      value={{
        skills,
        totalItems,
        totalPages,
        currentPage,
        loading,
        error,
        fetchSkills,
        getSkillById,
        createSkill,
        updateSkill,
        certificateSkills,
        fetchCertificateSkills,
        createCertificateSkill,
        updateCertificateSkill,
        deleteCertificateSkill,
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};
