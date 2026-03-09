import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface Order {
  order_id: string;
  user_id: number;
  subscription_price_id: number;
  status: "pending" | "completed" | "failed";
  amount: number;
  content: string;
  order_date: string;
  Subscription_Price?: any;
}

interface PaymentContextType {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createOrder: (subscriptionPriceId: number) => Promise<Order | null>;
  createMomoPayment: (orderId: string) => Promise<void>;
  createVnpayPayment: (orderId: string, bankCode?: string) => Promise<void>;
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
    createOrder,
    createMomoPayment,
    createVnpayPayment,
    clearOrder,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
