import React, { useState, useEffect } from "react";
import {
  Crown,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  DollarSign,
  Zap,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSubscription } from "../../contexts/subscriptionContext";
import PaymentHistory from "./PaymentHistory.tsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface SubscriptionPrice {
  subscription_price_id: number;
  billing_type: "monthly" | "yearly" | "weekly";
  duration_days: number;
  price: number;
  discount_percentage: number;
}

interface PlanDetails {
  subscription_plan_id: number;
  name: string;
  features: Record<string, any>;
  monthly_ai_token_quota: number;
  code: string;
  is_active: boolean;
  Subscription_Prices: SubscriptionPrice[];
}

const SubscriptionInfo: React.FC = () => {
  const {
    activeSubscription,
    loading,
    getActiveSubscription,
    cancelSubscription,
  } = useSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loadingPlanDetails, setLoadingPlanDetails] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    getActiveSubscription();
  }, [getActiveSubscription]);

  const fetchPlanDetails = async (planCode: string) => {
    setLoadingPlanDetails(true);
    try {
      const response = await fetch(
        `${API_URL}/user/subscription-plans?billing_type=monthly`,
      );
      const data = await response.json();

      if (data.success) {
        const plan = data.data.find((p: PlanDetails) => p.code === planCode);

        if (plan) {
          // Fetch all billing types for this plan
          const allBillingTypes = ["monthly", "yearly", "weekly"];
          const allPrices: SubscriptionPrice[] = [];

          for (const billingType of allBillingTypes) {
            const res = await fetch(
              `${API_URL}/user/subscription-plans?billing_type=${billingType}`,
            );
            const billingData = await res.json();
            if (billingData.success) {
              const billingPlan = billingData.data.find(
                (p: PlanDetails) => p.code === planCode,
              );
              if (
                billingPlan &&
                billingPlan.Subscription_Prices &&
                billingPlan.Subscription_Prices.length > 0
              ) {
                allPrices.push(billingPlan.Subscription_Prices[0]);
              }
            }
          }

          setPlanDetails({ ...plan, Subscription_Prices: allPrices });
        }
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
    } finally {
      setLoadingPlanDetails(false);
    }
  };

  const handleViewPlanDetails = () => {
    const planCode =
      activeSubscription?.Subscription_Price?.Subscription_Plan?.code;
    if (planCode) {
      fetchPlanDetails(planCode);
      setShowPlanDetailsModal(true);
    }
  };

  const getBillingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      monthly: "Hàng tháng",
      yearly: "Hàng năm",
      weekly: "Hàng tuần",
    };
    return labels[type] || type;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    setCanceling(true);
    const result = await cancelSubscription(
      activeSubscription.user_subscription_id,
    );

    if (result.success) {
      alert("Đã hủy gói đăng ký thành công!");
      setShowCancelModal(false);
    } else {
      alert(`Lỗi: ${result.message}`);
    }
    setCanceling(false);
  };

  const getDaysRemaining = (expiredAt: string) => {
    if (!expiredAt) return 0;
    const end = new Date(expiredAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đang hoạt động",
        icon: CheckCircle,
      },
      expired: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Hết hạn",
        icon: XCircle,
      },
      canceled: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Đã hủy",
        icon: XCircle,
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.active;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!activeSubscription) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Chưa có gói Premium
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Nâng cấp để trải nghiệm đầy đủ tính năng
          </p>
          <Link
            to="/subscription-plans"
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Xem gói Premium
          </Link>
        </div>
      </div>
    );
  }

  // Check if Subscription_Price data exists
  if (!activeSubscription.Subscription_Price?.Subscription_Plan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Không thể tải thông tin gói đăng ký
          </p>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(activeSubscription.expired_at);
  const isPremium =
    activeSubscription.Subscription_Price?.Subscription_Plan?.code !== "FREE";
  const canCancel = isPremium && activeSubscription.status === "active";

  return (
    <>
      <div className="space-y-4">
        {/* Current Plan */}
        <div
          className={`rounded-lg shadow-md p-6 ${
            isPremium
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg ${
                isPremium ? "bg-white/20" : "bg-blue-100"
              }`}
            >
              <Crown
                className={`w-6 h-6 ${isPremium ? "text-white" : "text-blue-600"}`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${isPremium ? "text-white" : "text-gray-800"}`}
              >
                {activeSubscription.Subscription_Price?.Subscription_Plan
                  ?.name || "Gói đăng ký"}
              </h3>
              <p
                className={`text-sm ${isPremium ? "text-white/80" : "text-gray-500"}`}
              >
                Gói hiện tại
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${isPremium ? "text-white/90" : "text-gray-600"}`}
              >
                Trạng thái
              </span>
              {isPremium ? (
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {activeSubscription.status === "active"
                    ? "Đang hoạt động"
                    : "Hết hạn"}
                </span>
              ) : (
                getStatusBadge(activeSubscription.status)
              )}
            </div>

            {/* End Date */}
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${isPremium ? "text-white/90" : "text-gray-600"}`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                Hết hạn
              </span>
              <span className={`text-sm font-medium`}>
                {new Date(activeSubscription.expired_at).toLocaleDateString(
                  "vi-VN",
                )}
              </span>
            </div>

            {/* Days Remaining */}
            {activeSubscription.status === "active" && (
              <div
                className={`text-center py-3 rounded-lg ${
                  isPremium ? "bg-white/10" : "bg-blue-50"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${isPremium ? "text-white" : "text-blue-600"}`}
                >
                  {daysRemaining}
                </div>
                <div
                  className={`text-xs ${isPremium ? "text-white/80" : "text-gray-600"}`}
                >
                  ngày còn lại
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            {!isPremium ? (
              <Link
                to="/subscription-plans"
                className="block w-full text-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Nâng cấp Premium
              </Link>
            ) : (
              <>
                <button
                  onClick={handleViewPlanDetails}
                  className="w-full px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  Xem chi tiết gói
                </button>
                <Link
                  to="/subscription-compare"
                  className="block w-full text-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm"
                >
                  So sánh gói khác
                </Link>
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Hủy đăng ký
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Features */}
        {/* {isPremium &&
          activeSubscription.Subscription_Price?.Subscription_Plan
            ?.features && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Tính năng</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {Object.entries(
                  activeSubscription.Subscription_Price.Subscription_Plan
                    .features,
                ).map(([key, value]) => (
                  <li key={key} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      {typeof value === "boolean"
                        ? key.replace(/_/g, " ")
                        : `${key.replace(/_/g, " ")}: ${value}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            Quản lý đăng ký & thanh toán
          </h4>
          <div className="space-y-2">
            <Link
              to="/subscription-plans"
              className="block text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Xem tất cả gói đăng ký
            </Link>
            {isPremium && (
              <button
                onClick={handleViewPlanDetails}
                className="block text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                Chi tiết gói hiện tại
              </button>
            )}
            <button
              onClick={() => setShowPaymentHistory(true)}
              className="block text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Lịch sử thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Xác nhận hủy đăng ký
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Bạn có chắc chắn muốn hủy gói{" "}
                <span className="font-semibold">
                  {
                    activeSubscription.Subscription_Price?.Subscription_Plan
                      ?.name
                  }
                </span>
                ?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Sau khi hủy, bạn vẫn có thể sử dụng gói Premium đến hết
                  ngày{" "}
                  <span className="font-semibold">
                    {new Date(activeSubscription.expired_at).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                  . Sau đó tài khoản sẽ chuyển về gói Free.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {canceling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Details Modal */}
      {showPlanDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {planDetails?.name || "Chi tiết gói"}
                    </h3>
                    <p className="text-white/80 text-sm">
                      Thông tin chi tiết về gói đăng ký của bạn
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPlanDetailsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {loadingPlanDetails ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : planDetails ? (
                <div className="space-y-6">
                  {/* AI Token Quota */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          AI Credits hàng tháng
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {planDetails.monthly_ai_token_quota.toLocaleString()}{" "}
                          tokens
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Options */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Các gói thanh toán
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {planDetails.Subscription_Prices.map((price) => (
                        <div
                          key={price.subscription_price_id}
                          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
                        >
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              {getBillingTypeLabel(price.billing_type)}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                              {formatPrice(price.price)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {price.duration_days} ngày
                            </p>
                            {price.discount_percentage > 0 && (
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                  Giảm {price.discount_percentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {planDetails.features &&
                    Object.keys(planDetails.features).length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Tính năng
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(planDetails.features).map(
                              ([key, value]) => (
                                <li
                                  key={key}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">
                                    {typeof value === "boolean"
                                      ? key
                                          .replace(/_/g, " ")
                                          .replace(/\b\w/g, (l) =>
                                            l.toUpperCase(),
                                          )
                                      : `${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}: ${value}`}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* Current Subscription Info */}
                  {activeSubscription && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">
                        📌 Thông tin đăng ký hiện tại
                      </h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>
                          • Chu kỳ:{" "}
                          {getBillingTypeLabel(
                            activeSubscription.Subscription_Price
                              ?.billing_type || "",
                          )}
                        </p>
                        <p>
                          • Hết hạn:{" "}
                          {new Date(
                            activeSubscription.expired_at,
                          ).toLocaleDateString("vi-VN")}
                        </p>
                        <p>
                          • Trạng thái:{" "}
                          {activeSubscription.status === "active"
                            ? "Đang hoạt động"
                            : "Hết hạn"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Không thể tải thông tin chi tiết gói
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPlanDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
                <Link
                  to="/subscription-compare"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-center"
                  onClick={() => setShowPlanDetailsModal(false)}
                >
                  So sánh gói khác
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-blue-600" />
                Lịch sử thanh toán
              </h3>
              <button
                onClick={() => setShowPaymentHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Payment History Content */}
            <div className="p-6">
              <PaymentHistory />
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowPaymentHistory(false)}
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionInfo;
