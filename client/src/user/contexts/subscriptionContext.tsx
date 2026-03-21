import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface SubscriptionPrice {
  subscription_price_id: number;
  billing_type: "monthly" | "yearly" | "weekly";
  duration_days: number;
  price: number;
  discount_percentage: number;
  Subscription_Plan?: SubscriptionPlan;
}

interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  features: Record<string, any>;
  monthly_ai_token_quota: number;
  code: string;
  is_active: boolean;
  Subscription_Prices?: SubscriptionPrice[];
}

interface ActiveSubscription {
  user_subscription_id: number;
  started_at: string;
  expired_at: string;
  status: "active" | "expired" | "canceled";
  Subscription_Price?: SubscriptionPrice;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  activeSubscription: ActiveSubscription | null;
  loading: boolean;
  error: string | null;
  billingType: "monthly" | "yearly" | "weekly";
  setBillingType: (type: "monthly" | "yearly" | "weekly") => void;
  fetchSubscriptionPlans: (
    billing_type?: "monthly" | "yearly" | "weekly",
  ) => Promise<void>;
  getActiveSubscription: () => Promise<void>;
  cancelSubscription: (
    subscriptionId: number,
  ) => Promise<{ success: boolean; message?: string }>;
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
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [billingType, setBillingType] = useState<
    "monthly" | "yearly" | "weekly"
  >("monthly");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchSubscriptionPlans = useCallback(
    async (billing_type?: "monthly" | "yearly" | "weekly") => {
      setLoading(true);
      setError(null);

      try {
        const queryParam = billing_type ? `?billing_type=${billing_type}` : "";
        const response = await fetch(
          `${API_URL}/user/subscription-plans${queryParam}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch plans");
        }

        const data = await response.json();

        if (data.success) {
          // Ensure features is properly parsed (safety check)
          const formattedPlans = data.data.map((plan: any) => {
            // If features is still a string (shouldn't happen with backend fix, but safety first)
            if (typeof plan.features === "string") {
              try {
                plan.features = JSON.parse(plan.features);
              } catch (e) {
                console.error("Error parsing features for plan:", plan.name, e);
                plan.features = {};
              }
            } else if (!plan.features) {
              plan.features = {};
            }
            return plan;
          });

          setPlans(formattedPlans);
        } else {
          throw new Error(data.message || "Failed to fetch plans");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching subscription plans:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getActiveSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/user/subscriptions/active`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActiveSubscription(data.data);
      } else {
        setActiveSubscription(null);
      }
    } catch (err) {
      console.error("Error fetching active subscription:", err);
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(
    async (
      subscriptionId: number,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const response = await fetch(
          `${API_URL}/user/subscriptions/${subscriptionId}/cancel`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Refresh active subscription after cancellation
          await getActiveSubscription();
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.message };
        }
      } catch (err) {
        console.error("Error canceling subscription:", err);
        return {
          success: false,
          message: "An error occurred while canceling subscription",
        };
      }
    },
    [getActiveSubscription],
  );

  const value = {
    plans,
    activeSubscription,
    loading,
    error,
    billingType,
    setBillingType,
    fetchSubscriptionPlans,
    getActiveSubscription,
    cancelSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
