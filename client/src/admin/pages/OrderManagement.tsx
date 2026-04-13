import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import {
  useOrderPayment,
  Order,
  Payment,
} from "../contexts/orderPaymentContext";
import OrdersTable from "../components/OrderManagement/OrdersTable";
import PaymentsTable from "../components/OrderManagement/PaymentsTable";
import UpdatePaymentStatusModal from "../components/OrderManagement/UpdatePaymentStatusModal.tsx";
import OrderDetailsModal from "../components/OrderManagement/OrderDetailsModal.tsx";
import PaymentDetailsModal from "../components/OrderManagement/PaymentDetailsModal.tsx";

const OrderManagement = () => {
  const {
    orders,
    totalOrders,
    orderPagination,
    orderStatistics,
    orderLoading,
    orderError,
    fetchOrders,
    getOrderStatistics,
    payments,
    totalPayments,
    paymentPagination,
    paymentStatistics,
    paymentLoading,
    paymentError,
    fetchPayments,
    getPaymentStatistics,
  } = useOrderPayment();

  // Order filters
  const [orderLimit] = useState(2);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Payment filters
  const [paymentLimit] = useState(2);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // URL-based pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const orderPage = Math.max(
    1,
    parseInt(searchParams.get("orderPage") || "1", 10),
  );
  const paymentPage = Math.max(
    1,
    parseInt(searchParams.get("paymentPage") || "1", 10),
  );
  const setOrderPage = (page: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("orderPage", String(page));
      return next;
    });
  const setPaymentPage = (page: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("paymentPage", String(page));
      return next;
    });

  // Modal states
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showUpdatePaymentStatus, setShowUpdatePaymentStatus] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchOrders(orderPage, orderLimit, orderStatus, orderSearch);
    getOrderStatistics();
  }, [orderPage, orderLimit, orderStatus, orderSearch]);

  useEffect(() => {
    fetchPayments(paymentPage, paymentLimit, paymentStatus, paymentMethod);
    getPaymentStatistics();
  }, [paymentPage, paymentLimit, paymentStatus, paymentMethod]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const handleUpdatePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowUpdatePaymentStatus(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi đơn hàng và thanh toán từ người dùng
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {activeTab === "orders" && orderStatistics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orderStatistics.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium capitalize">
                    {stat.status === "pending"
                      ? "Đang chờ"
                      : stat.status === "completed"
                        ? "Hoàn thành"
                        : "Thất bại"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.count}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="text-lg font-bold text-blue-600">
                    {parseFloat(stat.total_amount).toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Statistics */}
      {activeTab === "payments" && paymentStatistics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentStatistics.slice(0, 4).map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.payment_method === "credit_card"
                      ? "Thẻ tín dụng"
                      : stat.payment_method === "paypal"
                        ? "PayPal"
                        : "Chuyển khoản"}{" "}
                    - {stat.status}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.count}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="text-lg font-bold text-green-600">
                    {parseFloat(stat.total_amount).toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-medium text-center transition-colors relative ${
            activeTab === "orders"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đơn hàng ({totalOrders})
          {activeTab === "orders" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 font-medium text-center transition-colors relative ml-4 ${
            activeTab === "payments"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thanh toán ({totalPayments})
          {activeTab === "payments" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên/email người dùng..."
                  value={orderSearch}
                  onChange={(e) => {
                    setOrderSearch(e.target.value);
                    setOrderPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={orderStatus}
                onChange={(e) => {
                  setOrderStatus(e.target.value);
                  setOrderPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="completed">Hoàn thành</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <OrdersTable
            orders={orders}
            loading={orderLoading}
            error={orderError}
            pagination={orderPagination}
            onViewOrder={handleViewOrder}
            onPageChange={setOrderPage}
          />
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <select
                value={paymentStatus}
                onChange={(e) => {
                  setPaymentStatus(e.target.value);
                  setPaymentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="completed">Hoàn thành</option>
                <option value="failed">Thất bại</option>
              </select>

              {/* Payment Method Filter */}
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả phương thức</option>
                <option value="credit_card">Thẻ tín dụng</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Chuyển khoản</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <PaymentsTable
            payments={payments}
            loading={paymentLoading}
            error={paymentError}
            pagination={paymentPagination}
            onViewPayment={handleViewPayment}
            onUpdatePayment={handleUpdatePayment}
            onPageChange={setPaymentPage}
          />
        </div>
      )}

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={showOrderDetails}
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {selectedPayment && (
        <>
          <PaymentDetailsModal
            isOpen={showPaymentDetails}
            payment={selectedPayment}
            onClose={() => {
              setShowPaymentDetails(false);
              setSelectedPayment(null);
            }}
          />

          <UpdatePaymentStatusModal
            isOpen={showUpdatePaymentStatus}
            payment={selectedPayment}
            onClose={() => {
              setShowUpdatePaymentStatus(false);
              setSelectedPayment(null);
            }}
            onSuccess={() => {
              setShowUpdatePaymentStatus(false);
              setSelectedPayment(null);
              fetchPayments(
                paymentPage,
                paymentLimit,
                paymentStatus,
                paymentMethod,
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default OrderManagement;
