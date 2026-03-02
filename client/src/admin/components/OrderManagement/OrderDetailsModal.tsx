import * as React from "react";
import { X, Calendar, DollarSign, CreditCard, Package } from "lucide-react";
import { Order } from "../../contexts/orderPaymentContext";

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal = ({
  isOpen,
  order,
  onClose,
}: OrderDetailsModalProps) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    const labels: { [key: string]: string } = {
      pending: "Đang chờ",
      completed: "Hoàn thành",
      failed: "Thất bại",
    };
    return { className: colors[status], label: labels[status] };
  };

  const statusBadge = getStatusBadge(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            Chi tiết đơn hàng #{order.order_id}
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
          {/* Order Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Mã đơn hàng</p>
                <p className="text-sm font-medium text-gray-900">
                  #{order.order_id}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Trạng thái</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBadge.className}`}
                >
                  {statusBadge.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600">Ngày tạo</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Cập nhật lần cuối</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.updated_at).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Thông tin người dùng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Tên</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.User?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.User?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {order.Subscription_Price && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Thông tin gói đăng ký
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Tên gói</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.Subscription_Price.Subscription_Plan?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Thời hạn</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.Subscription_Price.duration_months || 0} tháng
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Token hàng tháng</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.Subscription_Price.Subscription_Plan?.monthly_ai_token_quota?.toLocaleString(
                      "vi-VN",
                    ) || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Giá gốc</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.Subscription_Price?.price?.toLocaleString("vi-VN") ||
                    0}{" "}
                  VNĐ
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Giảm giá</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.Subscription_Price?.discount || 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Số tiền thanh toán</p>
                <p className="text-lg font-bold text-blue-600">
                  {order.amount.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
          </div>

          {/* Payments List */}
          {order.Payments && order.Payments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Lịch sử thanh toán
              </h3>
              <div className="space-y-2">
                {order.Payments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        #{payment.payment_id} - {payment.transaction_code}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(payment.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {payment.amount.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status === "completed"
                          ? "Hoàn thành"
                          : payment.status === "pending"
                            ? "Đang chờ"
                            : "Thất bại"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default OrderDetailsModal;
