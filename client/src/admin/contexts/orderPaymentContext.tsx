import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { authenticatedFetch } from "../../utils/authUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface Order {
  order_id: number;
  user_id: number;
  subscription_price_id: number;
  status: "pending" | "completed" | "failed";
  amount: number;
  created_at: string;
  updated_at: string;
  User?: {
    user_id: number;
    name: string;
    email: string;
  };
  Subscription_Price?: {
    price_id: number;
    duration_months?: number;
    price: number;
    discount: number;
    Subscription_Plan?: {
      plan_id: number;
      name: string;
      monthly_ai_token_quota: number;
    };
  };
  Payments?: Payment[];
}

export interface Payment {
  payment_id: number;
  order_id: number;
  payment_method: "credit_card" | "paypal" | "bank_transfer";
  provider: string;
  transaction_code: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  Order?: Order;
}

export interface OrderStatistics {
  status: string;
  count: string;
  total_amount: string;
}

export interface PaymentStatistics {
  status: string;
  payment_method: string;
  count: string;
  total_amount: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface OrderPaymentContextType {
  // Orders
  orders: Order[];
  totalOrders: number;
  orderPagination: PaginationData | null;
  orderStatistics: OrderStatistics[];
  orderLoading: boolean;
  orderError: string | null;

  fetchOrders: (
    page?: number,
    limit?: number,
    status?: string,
    search?: string,
  ) => Promise<void>;

  getOrderById: (orderId: number) => Promise<Order | null>;

  updateOrderStatus: (orderId: number, status: string) => Promise<boolean>;

  getOrderStatistics: () => Promise<void>;

  // Payments
  payments: Payment[];
  totalPayments: number;
  paymentPagination: PaginationData | null;
  paymentStatistics: PaymentStatistics[];
  paymentLoading: boolean;
  paymentError: string | null;

  fetchPayments: (
    page?: number,
    limit?: number,
    status?: string,
    paymentMethod?: string,
  ) => Promise<void>;

  getPaymentById: (paymentId: number) => Promise<Payment | null>;

  updatePaymentStatus: (paymentId: number, status: string) => Promise<boolean>;

  getPaymentsByOrderId: (orderId: number) => Promise<Payment[]>;

  getPaymentStatistics: () => Promise<void>;
}

const OrderPaymentContext = createContext<OrderPaymentContextType | undefined>(
  undefined,
);

export const useOrderPayment = () => {
  const context = useContext(OrderPaymentContext);
  if (!context) {
    throw new Error(
      "useOrderPayment must be used within an OrderPaymentProvider",
    );
  }
  return context;
};

export const OrderPaymentProvider = ({ children }: { children: ReactNode }) => {
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderPagination, setOrderPagination] = useState<PaginationData | null>(
    null,
  );
  const [orderStatistics, setOrderStatistics] = useState<OrderStatistics[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Payments state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [paymentPagination, setPaymentPagination] =
    useState<PaginationData | null>(null);
  const [paymentStatistics, setPaymentStatistics] = useState<
    PaymentStatistics[]
  >([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ================== ORDERS ==================

  const fetchOrders = useCallback(
    async (page = 1, limit = 10, status = "", search = "") => {
      setOrderLoading(true);
      setOrderError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (status) params.append("status", status);
        if (search) params.append("search", search);

        const response = await authenticatedFetch(
          `${API_URL}/admin/orders?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const result = await response.json();
        if (result.success) {
          setOrders(result.data || []);
          setTotalOrders(result.pagination?.total || 0);
          setOrderPagination(result.pagination || null);
        }
      } catch (err: any) {
        setOrderError(err.message || "Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setOrderLoading(false);
      }
    },
    [],
  );

  const getOrderById = useCallback(async (orderId: number) => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/orders/${orderId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setOrderError(err.message || "Failed to fetch order");
      console.error("Error fetching order:", err);
      return null;
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const updateOrderStatus = async (
    orderId: number,
    status: string,
  ): Promise<boolean> => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Refresh orders list
        await fetchOrders();
        return true;
      } else {
        setOrderError(result.message || "Failed to update order status");
        return false;
      }
    } catch (err: any) {
      setOrderError(err.message || "Failed to update order status");
      console.error("Error updating order status:", err);
      return false;
    } finally {
      setOrderLoading(false);
    }
  };

  const getOrderStatistics = useCallback(async () => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/orders/statistics`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order statistics");
      }

      const result = await response.json();
      if (result.success) {
        setOrderStatistics(result.data.statistics || []);
      }
    } catch (err: any) {
      setOrderError(err.message || "Failed to fetch order statistics");
      console.error("Error fetching order statistics:", err);
    } finally {
      setOrderLoading(false);
    }
  }, []);

  // ================== PAYMENTS ==================

  const fetchPayments = useCallback(
    async (page = 1, limit = 10, status = "", paymentMethod = "") => {
      setPaymentLoading(true);
      setPaymentError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (status) params.append("status", status);
        if (paymentMethod) params.append("payment_method", paymentMethod);

        const response = await authenticatedFetch(
          `${API_URL}/admin/payments?${params.toString()}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        const result = await response.json();
        if (result.success) {
          setPayments(result.data || []);
          setTotalPayments(result.pagination?.total || 0);
          setPaymentPagination(result.pagination || null);
        }
      } catch (err: any) {
        setPaymentError(err.message || "Failed to fetch payments");
        console.error("Error fetching payments:", err);
      } finally {
        setPaymentLoading(false);
      }
    },
    [],
  );

  const getPaymentById = useCallback(async (paymentId: number) => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/payments/${paymentId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Payment not found");
      }

      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err: any) {
      setPaymentError(err.message || "Failed to fetch payment");
      console.error("Error fetching payment:", err);
      return null;
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  const updatePaymentStatus = async (
    paymentId: number,
    status: string,
  ): Promise<boolean> => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/payments/${paymentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const result = await response.json();
      if (result.success) {
        // Refresh payments list
        await fetchPayments();
        return true;
      } else {
        setPaymentError(result.message || "Failed to update payment status");
        return false;
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to update payment status");
      console.error("Error updating payment status:", err);
      return false;
    } finally {
      setPaymentLoading(false);
    }
  };

  const getPaymentsByOrderId = useCallback(async (orderId: number) => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/orders/${orderId}/payments`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const result = await response.json();
      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (err: any) {
      setPaymentError(err.message || "Failed to fetch payments");
      console.error("Error fetching payments:", err);
      return [];
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  const getPaymentStatistics = useCallback(async () => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const response = await authenticatedFetch(
        `${API_URL}/admin/payments/statistics`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment statistics");
      }

      const result = await response.json();
      if (result.success) {
        setPaymentStatistics(result.data.statistics || []);
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to fetch payment statistics");
      console.error("Error fetching payment statistics:", err);
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  return (
    <OrderPaymentContext.Provider
      value={{
        // Orders
        orders,
        totalOrders,
        orderPagination,
        orderStatistics,
        orderLoading,
        orderError,
        fetchOrders,
        getOrderById,
        updateOrderStatus,
        getOrderStatistics,
        // Payments
        payments,
        totalPayments,
        paymentPagination,
        paymentStatistics,
        paymentLoading,
        paymentError,
        fetchPayments,
        getPaymentById,
        updatePaymentStatus,
        getPaymentsByOrderId,
        getPaymentStatistics,
      }}
    >
      {children}
    </OrderPaymentContext.Provider>
  );
};
