import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Search, Eye, XCircle, Calendar, User, Award } from "lucide-react";
import Pagination from "../../shared/components/Pagination";
import {
  useUserSubscriptionTracking,
  UserSubscription,
} from "../contexts/userSubscriptionTrackingContext";
import UserSubscriptionsTable from "../components/UserSubscriptionTracking/UserSubscriptionsTable";
import ViewSubscriptionModal from "../components/UserSubscriptionTracking/ViewSubscriptionModal";

const UserSubscriptionTracking = () => {
  const {
    subscriptions,
    totalSubscriptions,
    pagination,
    loading,
    error,
    fetchSubscriptions,
    expireSubscription,
  } = useUserSubscriptionTracking();

  const [limit] = useState(9);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSubscription, setSelectedSubscription] =
    useState<UserSubscription | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const urlPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const resetPage = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  const totalPages = Math.ceil(totalSubscriptions / limit) || 1;

  // Fetch initial data on component mount
  useEffect(() => {
    fetchSubscriptions(1, limit, "", "");
  }, []);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchSubscriptions(urlPage, limit, status, search);
  }, [urlPage, limit, status, search, fetchSubscriptions]);

  const handleViewSubscription = (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setShowViewModal(true);
  };

  const handleExpireSubscription = async (subscriptionId: number) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đăng ký này?")) {
      return;
    }

    const success = await expireSubscription(subscriptionId);
    if (success) {
      alert("Hủy đăng ký thành công");
      fetchSubscriptions(urlPage, limit, status, search);
    } else {
      alert("Lỗi khi hủy đăng ký");
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      active: "Đang hoạt động",
      expired: "Hết hạn",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Theo dõi đăng ký người dùng
          </h1>
          <p className="text-gray-600 mt-2">
            Kiểm tra hoạt động đăng ký của người dùng
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg">
          Tổng cộng: <span className="font-bold">{totalSubscriptions}</span>{" "}
          đăng ký
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {subscriptions.filter((s) => s.status === "active").length}
              </p>
            </div>
            <Award className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Hết hạn</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {subscriptions.filter((s) => s.status === "expired").length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {subscriptions.filter((s) => s.status === "cancelled").length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên/email người dùng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="expired">Hết hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Subscriptions List */}
      <UserSubscriptionsTable
        subscriptions={subscriptions}
        loading={loading}
        pagination={pagination}
        onViewSubscription={handleViewSubscription}
        onExpireSubscription={handleExpireSubscription}
        currentPage={urlPage}
        totalPages={totalPages}
        buildPageUrl={buildPageUrl}
        onPageChange={(newPage) => {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(newPage));
            return next;
          });
        }}
      />

      <Pagination
        currentPage={urlPage}
        totalPages={totalPages}
        buildPageUrl={buildPageUrl}
        className="py-4"
      />

      {/* View Subscription Modal */}
      {selectedSubscription && (
        <ViewSubscriptionModal
          isOpen={showViewModal}
          subscription={selectedSubscription}
          onClose={() => {
            setShowViewModal(false);
            setSelectedSubscription(null);
          }}
        />
      )}
    </div>
  );
};

export default UserSubscriptionTracking;
