import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface UserSubscription {
  user_subscription_id: number;
  user_id: number;
  subscription_price_id: number;
  order_id?: number | null;
  started_at: string;
  expired_at: string;
  status: "active" | "expired" | "canceled";
  User?: {
    user_id: number;
    user_name: string;
    full_name?: string;
    user_email: string;
    avatar?: string | null;
  };
  Subscription_Price?: {
    subscription_price_id: number;
    billing_type: string;
    duration_days: number;
    price: number;
    discount_percentage: number | null;
    Subscription_Plan?: {
      subscription_plan_id: number;
      name: string;
      code: string;
      monthly_ai_token_quota: number;
      features?: string[] | null;
    };
  };
  Order?: {
    order_id: number;
    amount: number;
    status: string;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface UserSubscriptionTrackingContextType {
  subscriptions: UserSubscription[];
  totalSubscriptions: number;
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;

  fetchSubscriptions: (
    page?: number,
    limit?: number,
    status?: string,
    search?: string,
  ) => Promise<void>;

  getSubscriptionById: (
    subscriptionId: number,
  ) => Promise<UserSubscription | null>;

  getSubscriptionsByUserId: (userId: number) => Promise<UserSubscription[]>;

  expireSubscription: (subscriptionId: number) => Promise<boolean>;

  getSubscriptionStatistics: () => Promise<{
    total: number;
    active: number;
    expired: number;
    cancelled: number;
  } | null>;
}

const UserSubscriptionTrackingContext = createContext<
  UserSubscriptionTrackingContextType | undefined
>(undefined);

export const useUserSubscriptionTracking = () => {
  const context = useContext(UserSubscriptionTrackingContext);
  if (!context) {
    throw new Error(
      "useUserSubscriptionTracking must be used within a UserSubscriptionTrackingProvider",
    );
  }
  return context;
};

export const UserSubscriptionTrackingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchSubscriptions = useCallback(
    async (page = 1, limit = 10, status = "", search = "") => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (status) params.append("status", status);
        if (search) params.append("search", search);

        const response = await fetch(
          `${API_URL}/admin/user-subscriptions?${params.toString()}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        const result = await response.json();
        if (result.success) {
          setSubscriptions(result.data || []);
          setTotalSubscriptions(result.pagination?.total || 0);
          setPagination(
            result.pagination
              ? {
                  currentPage: result.pagination.page,
                  totalPages: result.pagination.pages,
                  total: result.pagination.total,
                  limit: result.pagination.limit,
                }
              : null,
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscriptions");
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSubscriptionById = useCallback(async (subscriptionId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/user-subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Subscription not found");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch subscription");
      console.error("Error fetching subscription:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubscriptionsByUserId = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/users/${userId}/subscriptions`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user subscriptions");
      }

      const result = await response.json();
      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (err: any) {
      setError(err.message || "Failed to fetch user subscriptions");
      console.error("Error fetching user subscriptions:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const expireSubscription = async (
    subscriptionId: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/user-subscriptions/${subscriptionId}/expire`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Refresh subscriptions
        await fetchSubscriptions();
        return true;
      } else {
        setError(result.message || "Failed to expire subscription");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Failed to expire subscription");
      console.error("Error expiring subscription:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/admin/user-subscriptions/statistics`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subscription statistics");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch subscription statistics");
      console.error("Error fetching subscription statistics:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserSubscriptionTrackingContext.Provider
      value={{
        subscriptions,
        totalSubscriptions,
        pagination,
        loading,
        error,
        fetchSubscriptions,
        getSubscriptionById,
        getSubscriptionsByUserId,
        expireSubscription,
        getSubscriptionStatistics,
      }}
    >
      {children}
    </UserSubscriptionTrackingContext.Provider>
  );
};
