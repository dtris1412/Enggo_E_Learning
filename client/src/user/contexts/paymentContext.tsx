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
  billing_type: string;
  duration_days: number;
  price: number;
  discount_percentage: number;
  Subscription_Plan?: {
    subscription_plan_id: number;
    name: string;
    code: string;
    monthly_ai_token_quota: number;
    features: Record<string, any>;
  };
}

interface Order {
  order_id: string;
  user_id: number;
  subscription_price_id: number;
  status: "pending" | "completed" | "failed";
  amount: number;
  content: string;
  order_date: string;
  Subscription_Price?: SubscriptionPrice;
  Payments?: Payment[];
}

interface Payment {
  payment_id: number;
  payment_method: string;
  provider: string;
  transaction_code: string;
  amount: number;
  payment_date: string;
  status: "pending" | "completed" | "failed";
  content: string;
  Order?: Order;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface PaymentContextType {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  payments: Payment[];
  orders: Order[];
  pagination: PaginationInfo | null;
  createOrder: (subscriptionPriceId: number) => Promise<Order | null>;
  createMomoPayment: (orderId: string) => Promise<void>;
  createVnpayPayment: (orderId: string, bankCode?: string) => Promise<void>;
  getUserPayments: (
    page?: number,
    limit?: number,
    status?: string,
  ) => Promise<void>;
  getUserOrders: (
    page?: number,
    limit?: number,
    status?: string,
  ) => Promise<void>;
  clearOrder: () => void;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  console.log("PaymentProvider rendered"); // Debug log

  const getAuthToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Create order
  const createOrder = useCallback(
    async (subscriptionPriceId: number): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Bạn cần đăng nhập để thực hiện thanh toán");
        }

        const response = await fetch(`${API_URL}/user/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subscription_price_id: subscriptionPriceId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể tạo đơn hàng");
        }

        const data = await response.json();

        if (data.success) {
          setCurrentOrder(data.data);
          return data.data;
        } else {
          throw new Error(data.message || "Không thể tạo đơn hàng");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setError(errorMessage);
        console.error("Error creating order:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create MoMo payment
  const createMomoPayment = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Bạn cần đăng nhập để thực hiện thanh toán");
      }

      const response = await fetch(`${API_URL}/payment/momo/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Không thể tạo yêu cầu thanh toán MoMo",
        );
      }

      const data = await response.json();

      if (data.success && data.data.payUrl) {
        // Redirect to MoMo payment page
        window.location.href = data.data.payUrl;
      } else {
        throw new Error(data.message || "Không thể tạo URL thanh toán MoMo");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lỗi không xác định";
      setError(errorMessage);
      console.error("Error creating MoMo payment:", err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Create VNPay payment
  const createVnpayPayment = useCallback(
    async (orderId: string, bankCode?: string) => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Bạn cần đăng nhập để thực hiện thanh toán");
        }

        const response = await fetch(`${API_URL}/payment/vnpay/${orderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bankCode: bankCode || "",
            language: "vn",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Không thể tạo yêu cầu thanh toán VNPay",
          );
        }

        const data = await response.json();

        if (data.success && data.data.paymentUrl) {
          // Redirect to VNPay payment page
          window.location.href = data.data.paymentUrl;
        } else {
          throw new Error(data.message || "Không thể tạo URL thanh toán VNPay");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setError(errorMessage);
        console.error("Error creating VNPay payment:", err);
        setLoading(false);
        throw err;
      }
    },
    [],
  );

  // Get user payments with pagination and optional status filter
  const getUserPayments = useCallback(
    async (page: number = 1, limit: number = 10, status: string = "") => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Bạn cần đăng nhập để xem lịch sử thanh toán");
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (status) {
          params.append("status", status);
        }

        const response = await fetch(`${API_URL}/user/payments?${params}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Không thể tải lịch sử thanh toán",
          );
        }

        const data = await response.json();

        if (data.success) {
          setPayments(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Không thể tải lịch sử thanh toán");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setError(errorMessage);
        console.error("Error fetching user payments:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get user orders with pagination and optional status filter
  const getUserOrders = useCallback(
    async (page: number = 1, limit: number = 10, status: string = "") => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Bạn cần đăng nhập để xem lịch sử đơn hàng");
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (status) {
          params.append("status", status);
        }

        const response = await fetch(`${API_URL}/user/orders?${params}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Không thể tải lịch sử đơn hàng",
          );
        }

        const data = await response.json();

        if (data.success) {
          setOrders(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Không thể tải lịch sử đơn hàng");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi không xác định";
        setError(errorMessage);
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    currentOrder,
    loading,
    error,
    payments,
    orders,
    pagination,
    createOrder,
    createMomoPayment,
    createVnpayPayment,
    getUserPayments,
    getUserOrders,
    clearOrder,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
