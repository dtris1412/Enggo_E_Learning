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
}

interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  features: Record<string, any>;
  monthly_ai_token_quota: number;
  code: string;
  is_active: boolean;
  Subscription_Prices: SubscriptionPrice[];
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  billingType: "monthly" | "yearly" | "weekly";
  setBillingType: (type: "monthly" | "yearly" | "weekly") => void;
  fetchSubscriptionPlans: (
    billing_type?: "monthly" | "yearly" | "weekly",
  ) => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [billingType, setBillingType] = useState<
    "monthly" | "yearly" | "weekly"
  >("monthly");

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

  const value = {
    plans,
    loading,
    error,
    billingType,
    setBillingType,
    fetchSubscriptionPlans,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
