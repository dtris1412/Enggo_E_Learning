import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface SystemAIQuota {
  quota_id: number;
  open_ai_credit: number;
  system_open_ai_token: number;
  ai_token_unit: number;
  ai_token_totals: number;
  ai_token_used: number;
  buffer_percent: number;
  price_per_milion: number;
  total_cost: number;
}

interface QuotaStats {
  credit: {
    total: number;
    used: string;
    remaining: string;
    usagePercent: number;
  };
  openAITokens: {
    total: number;
    buffer: number;
    available: number;
    used: number;
    remaining: number;
    usagePercent: number;
  };
  aiTokens: {
    total: number;
    used: number;
    remaining: number;
    usagePercent: number;
  };
  config: {
    pricePerMillion: number;
    bufferPercent: number;
    aiTokenUnit: number;
  };
}

interface SystemAIQuotaContextType {
  quota: SystemAIQuota | null;
  stats: QuotaStats | null;
  loading: boolean;
  error: string | null;
  fetchQuota: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateCredit: (data: {
    credit: number;
    pricePerMillion?: number;
    bufferPercent?: number;
    aiTokenUnit?: number;
  }) => Promise<boolean>;
  updateConfig: (data: {
    pricePerMillion?: number;
    bufferPercent?: number;
    aiTokenUnit?: number;
  }) => Promise<boolean>;
}

const SystemAIQuotaContext = createContext<
  SystemAIQuotaContextType | undefined
>(undefined);

export const useSystemAIQuota = () => {
  const context = useContext(SystemAIQuotaContext);
  if (!context) {
    throw new Error(
      "useSystemAIQuota must be used within a SystemAIQuotaProvider",
    );
  }
  return context;
};

export const SystemAIQuotaProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [quota, setQuota] = useState<SystemAIQuota | null>(null);
  const [stats, setStats] = useState<QuotaStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchQuota = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/ai-quota`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI quota");
      }

      const result = await response.json();
      if (result.success) {
        setQuota(result.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI quota");
      console.error("Error fetching AI quota:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/ai-quota/stats`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI quota stats");
      }

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI quota stats");
      console.error("Error fetching AI quota stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCredit = async (data: {
    credit: number;
    pricePerMillion?: number;
    bufferPercent?: number;
    aiTokenUnit?: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/ai-quota/credit`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setQuota(result.data.quota);
        await fetchStats(); // Refresh stats after update
        return true;
      } else {
        setError(result.error || result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update credit");
      console.error("Error updating credit:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (data: {
    pricePerMillion?: number;
    bufferPercent?: number;
    aiTokenUnit?: number;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/ai-quota/config`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setQuota(result.data.quota);
        await fetchStats();
        return true;
      } else {
        setError(result.error || result.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update config");
      console.error("Error updating config:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SystemAIQuotaContext.Provider
      value={{
        quota,
        stats,
        loading,
        error,
        fetchQuota,
        fetchStats,
        updateCredit,
        updateConfig,
      }}
    >
      {children}
    </SystemAIQuotaContext.Provider>
  );
};
