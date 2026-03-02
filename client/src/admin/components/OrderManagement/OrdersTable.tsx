import * as React from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import { Order } from "../../contexts/orderPaymentContext";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: any;
  onViewOrder: (order: Order) => void;
  onPageChange: (page: number) => void;
}

const OrdersTable = ({
  orders,
  loading,
  error,
  pagination,
  onViewOrder,
  onPageChange,
}: OrdersTableProps) => {
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Đang tải đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Không tìm thấy đơn hàng nào
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Mã đơn hàng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Người dùng
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-900 text-sm">
                    Gói
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
                {orders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <tr
                      key={order.order_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.User?.name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.User?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.Subscription_Price?.Subscription_Plan
                              ?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.Subscription_Price?.duration_months || 0}{" "}
                            tháng
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.amount.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={statusBadge.className}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Chi tiết
                        </button>
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
                Tổng: {pagination.total} đơn hàng
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

export default OrdersTable;
