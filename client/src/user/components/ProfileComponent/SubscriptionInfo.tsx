import React, { useState, useEffect } from "react";
import { Crown, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  code: string;
  features: any;
  monthly_ai_token_quota: number;
}

interface SubscriptionPrice {
  subscription_price_id: number;
  billing_type: string;
  price: number;
  discount_percentage: number;
  Subscription_Plan: SubscriptionPlan;
}

interface ActiveSubscription {
  user_subscription_id: number;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled";
  auto_renew: boolean;
  Subscription_Price: SubscriptionPrice;
}

const SubscriptionInfo: React.FC = () => {
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSubscription();
  }, []);

  const fetchActiveSubscription = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/user/subscriptions/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSubscription(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching active subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
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
      cancelled: {
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

  if (!subscription) {
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
  if (!subscription.Subscription_Price?.Subscription_Plan) {
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

  const daysRemaining = getDaysRemaining(subscription.end_date);
  const isPremium =
    subscription.Subscription_Price?.Subscription_Plan?.code !== "FREE";

  return (
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
              {subscription.Subscription_Price?.Subscription_Plan?.name ||
                "Gói đăng ký"}
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
                {subscription.status === "active"
                  ? "Đang hoạt động"
                  : "Hết hạn"}
              </span>
            ) : (
              getStatusBadge(subscription.status)
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
              {new Date(subscription.end_date).toLocaleDateString("vi-VN")}
            </span>
          </div>

          {/* Days Remaining */}
          {subscription.status === "active" && (
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

          {/* Auto Renew */}
          {isPremium && (
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <span className="text-sm text-white/90">Tự động gia hạn</span>
              <span className="text-sm font-medium">
                {subscription.auto_renew ? "Bật" : "Tắt"}
              </span>
            </div>
          )}
        </div>

        {/* Upgrade Button */}
        {!isPremium && (
          <Link
            to="/subscription-plans"
            className="mt-4 block w-full text-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Nâng cấp Premium
          </Link>
        )}
      </div>

      {/* Features */}
      {isPremium &&
        subscription.Subscription_Price?.Subscription_Plan?.features && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Tính năng</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {Object.entries(
                subscription.Subscription_Price.Subscription_Plan.features,
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
        )}

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Quản lý đăng ký</h4>
        <div className="space-y-2">
          <Link
            to="/subscription-plans"
            className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Xem các gói đăng ký
          </Link>
          <button className="block text-sm text-gray-600 hover:text-gray-700 hover:underline">
            Lịch sử thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
