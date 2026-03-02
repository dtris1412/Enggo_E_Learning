import * as React from "react";
import { X, Calendar, DollarSign, CreditCard, CheckCircle } from "lucide-react";
import { Payment } from "../../contexts/orderPaymentContext";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  payment: Payment;
  onClose: () => void;
}

const PaymentDetailsModal = ({
  isOpen,
  payment,
  onClose,
}: PaymentDetailsModalProps) => {
  if (!isOpen) return null;

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      credit_card: "Thẻ tín dụng",
      paypal: "PayPal",
      bank_transfer: "Chuyển khoản",
    };
    return labels[method] || method;
  };

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

  const statusBadge = getStatusBadge(payment.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Chi tiết thanh toán #{payment.payment_id}
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
          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Mã thanh toán</p>
                <p className="text-sm font-medium text-gray-900">
                  #{payment.payment_id}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Mã đơn hàng</p>
                <p className="text-sm font-medium text-gray-900">
                  #{payment.order_id}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Mã giao dịch</p>
                <p className="text-sm font-mono text-gray-900">
                  {payment.transaction_code}
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
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Phương thức</p>
                <p className="text-sm font-medium text-gray-900">
                  {getPaymentMethodLabel(payment.payment_method)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Nhà cung cấp</p>
                <p className="text-sm font-medium text-gray-900">
                  {payment.provider || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-2">Số tiền giao dịch</p>
            <p className="text-3xl font-bold text-blue-600">
              {payment.amount.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tạo</p>
                  <p className="text-xs text-gray-600">
                    {new Date(payment.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              {payment.status === "completed" && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Hoàn thành
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(payment.updated_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Info */}
          {payment.Order && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Thông tin đơn hàng
              </h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Mã đơn hàng</p>
                    <p className="text-sm font-medium text-gray-900">
                      #{payment.Order.order_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Số tiền</p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.Order.amount?.toLocaleString("vi-VN") || 0} VNĐ
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600">Trạng thái đơn hàng</p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.Order.status === "pending"
                        ? "Đang chờ"
                        : payment.Order.status === "completed"
                          ? "Hoàn thành"
                          : "Thất bại"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
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

export default PaymentDetailsModal;
