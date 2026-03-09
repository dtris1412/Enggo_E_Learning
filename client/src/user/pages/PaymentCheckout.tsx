import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePayment } from "../contexts/paymentContext";
import { useSubscription } from "../contexts/subscriptionContext";
import {
  Loader2,
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

type PaymentMethod = "momo" | "vnpay" | null;

interface SubscriptionPrice {
  subscription_price_id: number;
  billing_type: "monthly" | "yearly" | "weekly";
  duration_days: number;
  price: number;
  discount_percentage: number;
  Subscription_Plan?: {
    name: string;
    code: string;
  };
}

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    error,
    createOrder,
    createMomoPayment,
    createVnpayPayment,
    clearError,
  } = usePayment();

  const {
    plans,
    loading: plansLoading,
    fetchSubscriptionPlans,
  } = useSubscription();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Get subscription_price_id from URL params
  const subscriptionPriceId = searchParams.get("plan");

  // Find subscription price info from context
  const subscriptionPrice: SubscriptionPrice | undefined = plans
    .flatMap((plan) =>
      (plan.Subscription_Prices || []).map((price) => ({
        ...price,
        Subscription_Plan: {
          name: plan.name,
          code: plan.code,
        },
      })),
    )
    .find(
      (price) =>
        price.subscription_price_id === parseInt(subscriptionPriceId || "0"),
    );

  // Fetch subscription plans if not loaded
  useEffect(() => {
    if (plans.length === 0 && !plansLoading) {
      fetchSubscriptionPlans();
    }
  }, [plans, plansLoading, fetchSubscriptionPlans]);

  const handlePayment = async () => {
    if (!subscriptionPriceId || !selectedMethod) return;

    setProcessingPayment(true);
    clearError();

    try {
      // Step 1: Create order
      const order = await createOrder(parseInt(subscriptionPriceId));
      if (!order) {
        throw new Error("Không thể tạo đơn hàng");
      }

      // Step 2: Create payment and redirect to gateway
      if (selectedMethod === "momo") {
        await createMomoPayment(order.order_id);
      } else if (selectedMethod === "vnpay") {
        // Test without bankCode first
        await createVnpayPayment(order.order_id, "");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setProcessingPayment(false);
    }
  };

  if (!subscriptionPriceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">
            Không tìm thấy thông tin gói đăng ký
          </p>
          <button
            onClick={() => navigate("/subscription-plans")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại chọn gói
          </button>
        </div>
      </div>
    );
  }

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-white">Đang tải thông tin gói...</p>
        </div>
      </div>
    );
  }

  if (!subscriptionPrice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium mb-4">
              Không tìm thấy gói đăng ký
            </p>
            <button
              onClick={() => navigate("/subscription-plans")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/subscription-plans")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-white">Thanh toán</h1>
          <p className="text-gray-400 mt-2">
            Chọn phương thức thanh toán phù hợp với bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Phương thức thanh toán
            </h2>

            {/* MoMo */}
            <div
              onClick={() => {
                setSelectedMethod("momo");
                setSelectedBank("");
              }}
              className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedMethod === "momo"
                  ? "border-pink-500 shadow-lg shadow-pink-500/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Ví MoMo</h3>
                  <p className="text-sm text-gray-400">
                    Thanh toán nhanh chóng qua ví điện tử MoMo
                  </p>
                </div>
                {selectedMethod === "momo" && (
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* VNPay */}
            <div
              onClick={() => setSelectedMethod("vnpay")}
              className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedMethod === "vnpay"
                  ? "border-blue-500 shadow-lg shadow-blue-500/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">VNPay</h3>
                  <p className="text-sm text-gray-400">
                    Thanh toán qua thẻ ATM/Visa/Mastercard
                  </p>
                </div>
                {selectedMethod === "vnpay" && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bank Selection */}
              {selectedMethod === "vnpay" && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chọn ngân hàng (tùy chọn)
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Tất cả phương thức</option>
                    <option value="NCB">Ngân hàng NCB</option>
                    <option value="BIDV">Ngân hàng BIDV</option>
                    <option value="VIETCOMBANK">Vietcombank</option>
                    <option value="TECHCOMBANK">Techcombank</option>
                    <option value="VNPAYQR">Thanh toán QR</option>
                  </select>
                </div>
              )}
            </div>

            {/* Credit Card (Coming Soon) */}
            <div className="bg-gray-800 border-2 border-gray-700 rounded-xl p-6 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-400">
                    Thẻ tín dụng/ghi nợ
                  </h3>
                  <p className="text-sm text-gray-500">Sắp ra mắt</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-4">
                Thông tin đơn hàng
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gói:</span>
                  <span className="text-white font-semibold">
                    {subscriptionPrice.Subscription_Plan?.name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Loại:</span>
                  <span className="text-white">
                    {subscriptionPrice.billing_type === "monthly"
                      ? "Hàng tháng"
                      : subscriptionPrice.billing_type === "yearly"
                        ? "Hàng năm"
                        : "Hàng tuần"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Thời gian:</span>
                  <span className="text-white">
                    {subscriptionPrice.duration_days} ngày
                  </span>
                </div>

                {subscriptionPrice.discount_percentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Giảm giá:</span>
                    <span className="text-green-400 font-semibold">
                      {subscriptionPrice.discount_percentage}%
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(subscriptionPrice.price)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || processingPayment}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận thanh toán"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Bằng cách thanh toán, bạn đồng ý với{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Điều khoản dịch vụ
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
