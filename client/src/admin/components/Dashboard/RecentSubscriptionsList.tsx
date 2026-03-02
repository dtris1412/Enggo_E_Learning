import React from "react";
import { Users } from "lucide-react";

interface RecentSubscription {
  user_subscription_id: number;
  started_at: string;
  User: {
    user_id: number;
    user_name: string;
    full_name: string;
    user_email: string;
  };
  Subscription_Price: {
    subscription_price_id: number;
    price: number;
    billing_type: string;
    Subscription_Plan: {
      subscription_plan_id: number;
      name: string;
      code: string;
    };
  };
  Order: {
    order_id: number;
    amount: number;
  } | null;
}

interface RecentSubscriptionsListProps {
  subscriptions: RecentSubscription[];
  loading: boolean;
}

const RecentSubscriptionsList: React.FC<RecentSubscriptionsListProps> = ({
  subscriptions,
  loading,
}) => {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-3">
        Lượt subscribe gần đây
      </h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-3 text-sm">Đang tải...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-center text-gray-500 py-3 text-sm">
            Chưa có lượt subscribe nào
          </p>
        ) : (
          subscriptions.map((item) => (
            <div
              key={item.user_subscription_id}
              className="flex items-start gap-2"
            >
              <div className="flex-shrink-0">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {item.User.full_name || item.User.user_name}
                </p>
                <p className="text-xs text-gray-600">
                  Đăng ký gói {item.Subscription_Price.Subscription_Plan.name} •{" "}
                  {item.Order
                    ? `${item.Order.amount.toLocaleString("vi-VN")} VNĐ`
                    : `${item.Subscription_Price.price.toLocaleString("vi-VN")} VNĐ`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {timeAgo(item.started_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentSubscriptionsList;
