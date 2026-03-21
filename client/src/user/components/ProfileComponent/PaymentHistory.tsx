import { useEffect, useState } from "react";
import { usePayment } from "../../contexts/paymentContext";
import {
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PaymentHistory: React.FC = () => {
  const {
    orders,
    payments,
    loading,
    pagination,
    getUserOrders,
    getUserPayments,
  } = usePayment();

  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    if (activeTab === "orders") {
      getUserOrders(currentPage, 5, statusFilter);
    } else {
      getUserPayments(currentPage, 5, statusFilter);
    }
  }, [activeTab, currentPage, statusFilter, getUserOrders, getUserPayments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Hoàn thành",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Chờ",
        icon: Clock,
      },
      failed: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Thất bại",
        icon: XCircle,
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string, provider: string) => {
    if (provider === "momo") return "MoMo";
    if (provider === "vnpay") return "VNPay";
    return method || "N/A";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.pages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="animate-pulse space-y-1.5">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              setActiveTab("orders");
              setCurrentPage(1);
              setStatusFilter("");
              setExpandedId(null);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              activeTab === "orders"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Đơn hàng</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("payments");
              setCurrentPage(1);
              setStatusFilter("");
              setExpandedId(null);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              activeTab === "payments"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Thanh toán</span>
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="completed">Hoàn thành</option>
          <option value="pending">Chờ xử lý</option>
          <option value="failed">Thất bại</option>
        </select>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        {activeTab === "orders" ? (
          // Orders List - Compact View
          <div className="space-y-1.5">
            {orders.length === 0 ? (
              <div className="text-center py-6">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-1.5" />
                <p className="text-xs text-gray-500">Chưa có đơn hàng</p>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedId === order.order_id;
                return (
                  <div
                    key={order.order_id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition"
                  >
                    {/* Compact Header - Always visible */}
                    <div
                      onClick={() => toggleExpand(order.order_id)}
                      className="px-2.5 py-1.5 cursor-pointer hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Package className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              #{order.order_id}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {formatDate(order.order_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-blue-600 hidden sm:inline">
                            {formatCurrency(order.amount)}
                          </span>
                          {getStatusBadge(order.status)}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-2.5 pb-2 pt-1.5 bg-gray-50 border-t border-gray-100">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gói đăng ký:</span>
                            <span className="font-medium text-gray-800">
                              {order.Subscription_Price?.Subscription_Plan
                                ?.name || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loại:</span>
                            <span className="font-medium text-gray-800">
                              {order.Subscription_Price?.billing_type ===
                              "monthly"
                                ? "Hàng tháng"
                                : order.Subscription_Price?.billing_type ===
                                    "yearly"
                                  ? "Hàng năm"
                                  : order.Subscription_Price?.billing_type ===
                                      "weekly"
                                    ? "Hàng tuần"
                                    : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian:</span>
                            <span className="font-medium text-gray-800">
                              {formatDateTime(order.order_date)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-gray-600 font-medium">
                              Tổng tiền:
                            </span>
                            <span className="font-bold text-lg text-blue-600">
                              {formatCurrency(order.amount)}
                            </span>
                          </div>

                          {/* Payment info if exists */}
                          {order.Payments && order.Payments.length > 0 && (
                            <div className="mt-1.5 pt-1.5 border-t">
                              <p className="text-[10px] text-gray-500 mb-1">
                                Thông tin thanh toán:
                              </p>
                              {order.Payments.map((payment) => (
                                <div
                                  key={payment.payment_id}
                                  className="flex items-center justify-between text-[10px] bg-white rounded px-1.5 py-1"
                                >
                                  <span className="text-gray-700">
                                    {getPaymentMethodLabel(
                                      payment.payment_method,
                                      payment.provider,
                                    )}
                                  </span>
                                  {getStatusBadge(payment.status)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // Payments List - Compact View
          <div className="space-y-1.5">
            {payments.length === 0 ? (
              <div className="text-center py-6">
                <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-1.5" />
                <p className="text-xs text-gray-500">Chưa có giao dịch</p>
              </div>
            ) : (
              payments.map((payment) => {
                const isExpanded = expandedId === payment.payment_id;
                return (
                  <div
                    key={payment.payment_id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 transition"
                  >
                    {/* Compact Header - Always visible */}
                    <div
                      onClick={() => toggleExpand(payment.payment_id)}
                      className="px-2.5 py-1.5 cursor-pointer hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {getPaymentMethodLabel(
                                payment.payment_method,
                                payment.provider,
                              )}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {formatDate(payment.payment_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-purple-600 hidden sm:inline">
                            {formatCurrency(payment.amount)}
                          </span>
                          {getStatusBadge(payment.status)}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-2.5 pb-2 pt-1.5 bg-gray-50 border-t border-gray-100">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mã giao dịch:</span>
                            <span className="font-mono text-[10px] text-gray-800">
                              {payment.transaction_code}
                            </span>
                          </div>
                          {payment.Order && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Đơn hàng:</span>
                              <span className="font-medium text-gray-800">
                                #{payment.Order.order_id}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian:</span>
                            <span className="font-medium text-gray-800">
                              {formatDateTime(payment.payment_date)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-1.5 border-t">
                            <span className="text-gray-600 font-medium">
                              Số tiền:
                            </span>
                            <span className="font-bold text-base text-purple-600">
                              {formatCurrency(payment.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Compact Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-2 mt-0.5 border-t">
            <p className="text-[10px] text-gray-600">
              {pagination?.page}/{pagination?.pages} ({pagination?.total})
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (pagination?.pages || 1)}
                className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
