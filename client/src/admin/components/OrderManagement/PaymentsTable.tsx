import * as React from "react";
import {
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import { Payment } from "../../contexts/orderPaymentContext";

interface PaymentsTableProps {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  pagination: any;
  onViewPayment: (payment: Payment) => void;
  onUpdatePayment: (payment: Payment) => void;
  onPageChange: (page: number) => void;
}

const PaymentsTable = ({
  payments,
  loading,
  error,
  pagination,
  onViewPayment,
  onUpdatePayment,
  onPageChange,
}: PaymentsTableProps) => {
  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
      completed:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
      failed:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
    };
    const labels: { [key: string]: string } = {
      pending: "Đang chờ",
      completed: "Hoàn thành",
      failed: "Thất bại",
    };
    return { className: colors[status], label: labels[status] };
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      credit_card: "Thẻ tín dụng",
      paypal: "PayPal",
      bank_transfer: "Chuyển khoản",
    };
    return labels[method] || method;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Đang tải thanh toán...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : payments.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Không tìm thấy thanh toán nào
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Mã thanh toán
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Mã đơn hàng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Phương thức
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Mã giao dịch
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Số tiền
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Ngày tạo
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status);
                  return (
                    <tr
                      key={payment.payment_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{payment.payment_id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{payment.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getPaymentMethodLabel(payment.payment_method)}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {payment.transaction_code}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {payment.amount.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={statusBadge.className}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(payment.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewPayment(payment)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {payment.status === "pending" && (
                            <button
                              onClick={() => onUpdatePayment(payment)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Cập nhật trạng thái"
                            >
                              <Edit2 className="h-4 w-4" />
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
                Tổng: {pagination.total} thanh toán
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

export default PaymentsTable;
