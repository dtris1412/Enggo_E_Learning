import * as React from "react";
import { X, Calendar, Award, User, DollarSign } from "lucide-react";
import { UserSubscription } from "../../contexts/userSubscriptionTrackingContext";

interface ViewSubscriptionModalProps {
  isOpen: boolean;
  subscription: UserSubscription;
  onClose: () => void;
}

const ViewSubscriptionModal = ({
  isOpen,
  subscription,
  onClose,
}: ViewSubscriptionModalProps) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      canceled: "bg-gray-100 text-gray-800",
    };
    const labels: { [key: string]: string } = {
      active: "Đang hoạt động",
      expired: "Hết hạn",
      canceled: "Đã hủy",
    };
    return { className: colors[status], label: labels[status] };
  };

  const statusBadge = getStatusBadge(subscription.status);

  const daysRemaining = subscription.expired_at
    ? Math.ceil(
        (new Date(subscription.expired_at).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const isExpiring = daysRemaining > 0 && daysRemaining <= 7;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            Chi tiết đăng ký #{subscription.user_subscription_id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Status Alert */}
          {isExpiring && subscription.status === "active" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Đăng ký sắp hết hạn - Còn {daysRemaining} ngày
              </p>
            </div>
          )}

          {/* User Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Thông tin người dùng
            </h3>
            <div className="flex items-center gap-4">
              {subscription.User?.avatar ? (
                <img
                  src={subscription.User.avatar}
                  alt={
                    subscription.User.full_name || subscription.User.user_name
                  }
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {subscription.User?.full_name ||
                    subscription.User?.user_name ||
                    "N/A"}
                </p>
                <p className="text-xs text-gray-600">
                  {subscription.User?.user_email || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  User ID: {subscription.user_id}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Trạng thái đăng ký
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Trạng thái</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBadge.className}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              {daysRemaining > 0 && subscription.status === "active" && (
                <div>
                  <p className="text-xs text-gray-600">Còn lại</p>
                  <p className="text-sm font-medium text-gray-900">
                    {daysRemaining} ngày
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Plan Info */}
          {subscription.Subscription_Price?.Subscription_Plan && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Gói đăng ký
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Tên gói</p>
                  <p className="text-sm font-medium text-gray-900">
                    {subscription.Subscription_Price.Subscription_Plan.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Mã gói</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">
                    {subscription.Subscription_Price.Subscription_Plan.code}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Token/tháng</p>
                  <p className="text-sm font-medium text-gray-900">
                    {(
                      subscription.Subscription_Price.Subscription_Plan
                        .monthly_ai_token_quota ?? 0
                    ).toLocaleString("vi-VN")}
                  </p>
                </div>
                {subscription.Subscription_Price.Subscription_Plan.features &&
                  Array.isArray(
                    subscription.Subscription_Price.Subscription_Plan.features,
                  ) && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-2">Tính năng:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {subscription.Subscription_Price.Subscription_Plan.features.map(
                          (feature, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              ✓ {feature}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Khoảng thời gian
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Ngày bắt đầu</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(subscription.started_at).toLocaleDateString(
                    "vi-VN",
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Ngày kết thúc</p>
                <p
                  className={`text-sm font-medium ${
                    isExpiring ? "text-red-600 font-bold" : "text-gray-900"
                  } flex items-center gap-1`}
                >
                  <Calendar className="h-4 w-4" />
                  {subscription.expired_at
                    ? new Date(subscription.expired_at).toLocaleDateString(
                        "vi-VN",
                      )
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          {subscription.Order && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Thông tin đơn hàng
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Mã đơn hàng</p>
                  <p className="text-sm font-medium text-gray-900">
                    #{subscription.Order.order_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Số tiền</p>
                  <p className="text-sm font-medium text-gray-900">
                    {subscription.Order.amount?.toLocaleString("vi-VN") || 0}{" "}
                    VNĐ
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-600">Trạng thái</p>
                  <p className="text-sm font-medium text-gray-900">
                    {subscription.Order.status === "pending"
                      ? "Đang chờ"
                      : subscription.Order.status === "completed"
                        ? "Hoàn thành"
                        : "Thất bại"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                    <Award className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tạo</p>
                  <p className="text-xs text-gray-600">
                    {new Date(subscription.started_at).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionModal;
