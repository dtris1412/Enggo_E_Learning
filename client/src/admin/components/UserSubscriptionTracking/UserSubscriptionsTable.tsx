import * as React from "react";
import {
  Eye,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Award,
} from "lucide-react";
import { UserSubscription } from "../../contexts/userSubscriptionTrackingContext";

interface UserSubscriptionsTableProps {
  subscriptions: UserSubscription[];
  loading: boolean;
  pagination: any;
  onViewSubscription: (subscription: UserSubscription) => void;
  onExpireSubscription: (subscriptionId: number) => void;
  onPageChange: (page: number) => void;
}

const UserSubscriptionsTable = ({
  subscriptions,
  loading,
  pagination,
  onViewSubscription,
  onExpireSubscription,
  onPageChange,
}: UserSubscriptionsTableProps) => {
  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      active:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
      expired:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
      canceled:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
    };
    const labels: { [key: string]: string } = {
      active: "Đang hoạt động",
      expired: "Hết hạn",
      canceled: "Đã hủy",
    };
    return { className: colors[status], label: labels[status] };
  };

  const isExpiringSoon = (expiredAt: string) => {
    if (!expiredAt) return false;
    const days = Math.ceil(
      (new Date(expiredAt).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days > 0 && days <= 7;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Đang tải đăng ký...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Không tìm thấy đăng ký nào
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Người dùng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Gói
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Token/tháng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Ngày bắt đầu
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Ngày kết thúc
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((sub) => {
                  const statusBadge = getStatusBadge(sub.status);
                  const expiringSoon = isExpiringSoon(sub.expired_at);
                  return (
                    <tr
                      key={sub.user_subscription_id}
                      className={`hover:bg-gray-50 transition-colors ${
                        expiringSoon ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {sub.User?.avatar ? (
                            <img
                              src={sub.User.avatar}
                              alt={sub.User.full_name || sub.User.user_name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {sub.User?.full_name ||
                                sub.User?.user_name ||
                                "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sub.User?.user_email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {sub.Subscription_Price?.Subscription_Plan?.name ||
                              "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {sub.Subscription_Price?.Subscription_Plan?.code ||
                              "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {(
                          sub.Subscription_Price?.Subscription_Plan
                            ?.monthly_ai_token_quota ?? 0
                        ).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(sub.started_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div
                          className={`${
                            expiringSoon
                              ? "font-bold text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {sub.expired_at
                            ? new Date(sub.expired_at).toLocaleDateString(
                                "vi-VN",
                              )
                            : "—"}
                          {expiringSoon && (
                            <p className="text-xs text-red-600 mt-1">
                              Sắp hết hạn
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={statusBadge.className}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewSubscription(sub)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {sub.status === "active" && (
                            <button
                              onClick={() =>
                                onExpireSubscription(sub.user_subscription_id)
                              }
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Hủy subscription"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Trang {pagination.currentPage} của {pagination.totalPages} •
                Tổng: {pagination.total} đăng ký
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onPageChange(Math.max(1, pagination.currentPage - 1))
                  }
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    onPageChange(
                      Math.min(
                        pagination.totalPages,
                        pagination.currentPage + 1,
                      ),
                    )
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserSubscriptionsTable;
