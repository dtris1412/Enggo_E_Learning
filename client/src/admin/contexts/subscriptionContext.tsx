import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface SubscriptionPrice {
  subscription_price_id: number;
  subscription_plan_id: number;
  billing_type: "monthly" | "yearly" | "weekly";
  duration_days: number;
  price: number;
  discount_percentage: number | null;
  final_price: number;
  is_active: boolean;
  Subscription_Plan?: SubscriptionPlan;
}

interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  features: string[] | null;
  monthly_ai_token_quota: number;
  code: string;
  is_active: boolean;
  Subscription_Prices?: SubscriptionPrice[];
}

interface SubscriptionContextType {
  // Subscription Plans
  subscriptionPlans: SubscriptionPlan[];
  totalSubscriptionPlans: number;
  loading: boolean;
  error: string | null;

  fetchSubscriptionPlansPaginated: (
    page?: number,
    limit?: number,
    is_active?: boolean | string,
    search?: string,
  ) => Promise<void>;

  getSubscriptionPlanById: (
    subscription_plan_id: number,
  ) => Promise<SubscriptionPlan | null>;

  getSubscriptionPricesByPlanId: (
    subscription_plan_id: number,
  ) => Promise<SubscriptionPrice[]>;

  toggleSubscriptionPlanStatus: (
    subscription_plan_id: number,
  ) => Promise<boolean>;

  // Subscription Prices
  subscriptionPrices: SubscriptionPrice[];
  totalSubscriptionPrices: number;

  fetchSubscriptionPricesPaginated: (
    page?: number,
    limit?: number,
    subscription_plan_id?: number,
    billing_type?: string,
    is_active?: boolean | string,
  ) => Promise<void>;

  getSubscriptionPriceById: (
    subscription_price_id: number,
  ) => Promise<SubscriptionPrice | null>;

  updateSubscriptionPrice: (
    subscription_price_id: number,
    data: {
      billing_type?: string;
      duration_days?: number;
      price?: number;
      discount_percentage?: number | null;
      is_active?: boolean;
    },
  ) => Promise<boolean>;

  deleteSubscriptionPrice: (subscription_price_id: number) => Promise<boolean>;

  toggleSubscriptionPriceStatus: (
    subscription_price_id: number,
  ) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [totalSubscriptionPlans, setTotalSubscriptionPlans] = useState(0);
  const [subscriptionPrices, setSubscriptionPrices] = useState<
    SubscriptionPrice[]
  >([]);
  const [totalSubscriptionPrices, setTotalSubscriptionPrices] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ================== SUBSCRIPTION PLANS ==================

  const fetchSubscriptionPlansPaginated = useCallback(
    async (
      page = 1,
      limit = 10,
      is_active: boolean | string | undefined = undefined,
      search = "",
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (is_active !== undefined && is_active !== "")
          params.append("is_active", is_active.toString());
        if (search) params.append("search", search);

        const response = await fetch(
          `${API_URL}/admin/subscription-plans/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription plans");
        }

        const result = await response.json();
        if (result.success) {
          setSubscriptionPlans(result.data.subscriptionPlans || []);
          setTotalSubscriptionPlans(result.data.pagination?.total || 0);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription plans");
        console.error("Error fetching subscription plans:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSubscriptionPlanById = useCallback(
    async (subscription_plan_id: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/subscription-plans/${subscription_plan_id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Subscription plan not found");
        }

        const result = await response.json();
        if (result.success) {
          return result.data;
        }
        return null;
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription plan");
        console.error("Error fetching subscription plan:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSubscriptionPricesByPlanId = useCallback(
    async (subscription_plan_id: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/subscription-plans/${subscription_plan_id}/prices`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription prices");
        }

        const result = await response.json();
        if (result.success) {
          return result.data || [];
        }
        return [];
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription prices");
        console.error("Error fetching subscription prices:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ================== SUBSCRIPTION PRICES ==================

  const fetchSubscriptionPricesPaginated = useCallback(
    async (
      page = 1,
      limit = 20,
      subscription_plan_id: number | undefined = undefined,
      billing_type: string | undefined = undefined,
      is_active: boolean | string | undefined = undefined,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (subscription_plan_id)
          params.append(
            "subscription_plan_id",
            subscription_plan_id.toString(),
          );
        if (billing_type) params.append("billing_type", billing_type);
        if (is_active !== undefined && is_active !== "")
          params.append("is_active", is_active.toString());

        const response = await fetch(
          `${API_URL}/admin/subscription-prices/paginated?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription prices");
        }

        const result = await response.json();
        if (result.success) {
          setSubscriptionPrices(result.data.subscriptionPrices || []);
          setTotalSubscriptionPrices(result.data.pagination?.total || 0);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription prices");
        console.error("Error fetching subscription prices:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSubscriptionPriceById = useCallback(
    async (subscription_price_id: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/admin/subscription-prices/${subscription_price_id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Subscription price not found");
        }

        const result = await response.json();
        if (result.success) {
          return result.data;
        }
        return null;
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription price");
        console.error("Error fetching subscription price:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateSubscriptionPrice = async (
    subscription_price_id: number,
    data: {
      billing_type?: string;
      duration_days?: number;
      price?: number;
      discount_percentage?: number | null;
      is_active?: boolean;
    },
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/subscription-prices/${subscription_price_id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Fetch updated list
        await fetchSubscriptionPricesPaginated();
        return true;
      } else {
        setError(result.message || "Failed to update subscription price");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update subscription price");
      console.error("Error updating subscription price:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriptionPrice = async (
    subscription_price_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/subscription-prices/${subscription_price_id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Fetch updated list
        await fetchSubscriptionPricesPaginated();
        return true;
      } else {
        setError(result.message || "Failed to delete subscription price");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete subscription price");
      console.error("Error deleting subscription price:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionPriceStatus = async (
    subscription_price_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/subscription-prices/${subscription_price_id}/toggle-status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Fetch updated list
        await fetchSubscriptionPricesPaginated();
        return true;
      } else {
        setError(
          result.message || "Failed to toggle subscription price status",
        );
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to toggle subscription price status");
      console.error("Error toggling subscription price status:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionPlanStatus = async (
    subscription_plan_id: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/subscription-plans/${subscription_plan_id}/toggle-status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Fetch updated list
        await fetchSubscriptionPlansPaginated();
        return true;
      } else {
        setError(result.message || "Failed to toggle subscription plan status");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to toggle subscription plan status");
      console.error("Error toggling subscription plan status:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        // Plans
        subscriptionPlans,
        totalSubscriptionPlans,
        loading,
        error,
        fetchSubscriptionPlansPaginated,
        getSubscriptionPlanById,
        getSubscriptionPricesByPlanId,
        toggleSubscriptionPlanStatus,
        // Prices
        subscriptionPrices,
        totalSubscriptionPrices,
        fetchSubscriptionPricesPaginated,
        getSubscriptionPriceById,
        updateSubscriptionPrice,
        deleteSubscriptionPrice,
        toggleSubscriptionPriceStatus,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
