import { useEffect, useState, useCallback } from "react";
import {
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react";
import { useSubscription } from "../contexts/subscriptionContext";
import EditSubscriptionPriceModal from "../components/SubscriptionManagement/EditSubscriptionPriceModal";

interface SubscriptionPrice {
  subscription_price_id: number;
  subscription_plan_id: number;
  billing_type: string;
  duration_days: number;
  price: number;
  discount_percentage: number | null;
  final_price: number;
  is_active: boolean;
  Subscription_Plan?: {
    name: string;
    code: string;
  };
}

interface ExpandedPlan {
  [key: number]: boolean;
}

const SubscriptionManagement = () => {
  const {
    subscriptionPlans,
    totalSubscriptionPlans,
    loading,
    error,
    fetchSubscriptionPlansPaginated,
    deleteSubscriptionPrice,
    toggleSubscriptionPriceStatus,
    toggleSubscriptionPlanStatus,
  } = useSubscription();

  const [page, setPage] = useState(1);
  const limit = 1000; // Show all plans without pagination
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<boolean | string>("");
  const [expandedPlans, setExpandedPlans] = useState<ExpandedPlan>({});
  const [planPrices, setPlanPrices] = useState<{
    [key: number]: SubscriptionPrice[];
  }>({});
  const [editingPrice, setEditingPrice] = useState<SubscriptionPrice | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    fetchSubscriptionPlansPaginated(page, limit, isActive, search);
  }, [page, limit, isActive, search, fetchSubscriptionPlansPaginated]);

  const togglePlanExpand = async (planId: number) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));

    // Fetch prices if not already loaded
    if (!planPrices[planId] && !expandedPlans[planId]) {
      setLoadingPrices((prev) => ({ ...prev, [planId]: true }));
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/admin/subscription-plans/${planId}/prices`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        const result = await response.json();
        if (result.success) {
          setPlanPrices((prev) => ({
            ...prev,
            [planId]: result.data,
          }));
        }
      } catch (err) {
        console.error("Error fetching prices:", err);
      } finally {
        setLoadingPrices((prev) => ({ ...prev, [planId]: false }));
      }
    }
  };

  const handleEditPrice = (price: SubscriptionPrice) => {
    setEditingPrice(price);
    setIsModalOpen(true);
  };

  const handleDeletePrice = useCallback(
    async (priceId: number) => {
      if (!window.confirm("Bạn chắc chắn muốn xóa gói giá này?")) {
        return;
      }

      const success = await deleteSubscriptionPrice(priceId);
      if (success) {
        // Refresh all plans and prices
        fetchSubscriptionPlansPaginated(page, limit, isActive, search);

        // Also update local state
        const updates: { [key: number]: SubscriptionPrice[] } = {};
        for (const [key, prices] of Object.entries(planPrices)) {
          updates[parseInt(key)] = prices.filter(
            (p) => p.subscription_price_id !== priceId,
          );
        }
        setPlanPrices(updates);
      }
    },
    [
      deleteSubscriptionPrice,
      page,
      limit,
      isActive,
      search,
      planPrices,
      fetchSubscriptionPlansPaginated,
    ],
  );

  const handleToggleStatus = useCallback(
    async (priceId: number) => {
      const success = await toggleSubscriptionPriceStatus(priceId);
      if (success) {
        // Refresh all plans and prices
        fetchSubscriptionPlansPaginated(page, limit, isActive, search);

        // Also update local state
        const updates = { ...planPrices };
        for (const [key, prices] of Object.entries(updates)) {
          updates[parseInt(key)] = prices.map((p) =>
            p.subscription_price_id === priceId
              ? { ...p, is_active: !p.is_active }
              : p,
          );
        }
        setPlanPrices(updates);
      }
    },
    [
      toggleSubscriptionPriceStatus,
      page,
      limit,
      isActive,
      search,
      planPrices,
      fetchSubscriptionPlansPaginated,
    ],
  );

  const handleTogglePlanStatus = useCallback(
    async (planId: number) => {
      const success = await toggleSubscriptionPlanStatus(planId);
      if (success) {
        // Refresh all plans
        fetchSubscriptionPlansPaginated(page, limit, isActive, search);
      }
    },
    [
      toggleSubscriptionPlanStatus,
      page,
      limit,
      isActive,
      search,
      fetchSubscriptionPlansPaginated,
    ],
  );

  const getBillingTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      monthly: "Hàng tháng",
      yearly: "Hàng năm",
      weekly: "Hàng tuần",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý gói đăng ký
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý các gói giá và thông tin chi tiết
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg">
          Tổng cộng: <span className="font-bold">{totalSubscriptionPlans}</span>{" "}
          gói
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
              placeholder="Tìm gói đăng ký..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Is Active Filter */}
          <select
            value={isActive === "" ? "" : isActive.toString()}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang kích hoạt</option>
            <option value="false">Vô hiệu hóa</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-3">
        {loading && subscriptionPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Đang tải gói đăng ký...</p>
          </div>
        ) : subscriptionPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Không tìm thấy gói đăng ký nào</p>
          </div>
        ) : (
          subscriptionPlans.map((plan) => (
            <div
              key={plan.subscription_plan_id}
              className="bg-white rounded-lg shadow"
            >
              {/* Plan Header */}
              <button
                onClick={() => togglePlanExpand(plan.subscription_plan_id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    {expandedPlans[plan.subscription_plan_id] ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mã: <span className="font-mono">{plan.code}</span> • Token
                      hàng tháng:{" "}
                      {plan.monthly_ai_token_quota.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {plan.is_active ? "Kích hoạt" : "Vô hiệu hóa"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlanStatus(plan.subscription_plan_id);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title={plan.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </button>

              {/* Plan Details & Prices */}
              {expandedPlans[plan.subscription_plan_id] && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-4">
                  {/* Features */}
                  {plan.features && Array.isArray(plan.features) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Tính năng:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {plan.features.map((feature, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-green-600 font-bold">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prices Table */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Giá:</h4>
                    {loadingPrices[plan.subscription_plan_id] ? (
                      <p className="text-sm text-gray-600">Đang tải giá...</p>
                    ) : planPrices[plan.subscription_plan_id]?.length === 0 ? (
                      <p className="text-sm text-gray-600">
                        Không có giá nào cho gói này
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-white">
                            <tr>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Loại thanh toán
                              </th>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Thời hạn
                              </th>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Giá gốc
                              </th>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Giảm giá
                              </th>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Giá cuối
                              </th>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Trạng thái
                              </th>
                              <th className="text-left px-4 py-2 font-medium text-gray-900">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {planPrices[plan.subscription_plan_id]?.map(
                              (price) => (
                                <tr key={price.subscription_price_id}>
                                  <td className="px-4 py-3 text-gray-900">
                                    {getBillingTypeLabel(price.billing_type)}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">
                                    {price.duration_days} ngày
                                  </td>
                                  <td className="px-4 py-3 text-gray-900 font-medium">
                                    {price.price.toLocaleString("vi-VN")} VNĐ
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">
                                    {price.discount_percentage
                                      ? `${price.discount_percentage}%`
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-blue-600 font-bold">
                                    {price.final_price.toLocaleString("vi-VN")}{" "}
                                    VNĐ
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        price.is_active
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {price.is_active
                                        ? "Kích hoạt"
                                        : "Vô hiệu hóa"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleEditPrice(price)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Chỉnh sửa"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleToggleStatus(
                                            price.subscription_price_id,
                                          )
                                        }
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                        title={
                                          price.is_active
                                            ? "Vô hiệu hóa"
                                            : "Kích hoạt"
                                        }
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeletePrice(
                                            price.subscription_price_id,
                                          )
                                        }
                                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Xóa"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Price Modal */}
      <EditSubscriptionPriceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPrice(null);
          // Refresh after modal closes
          fetchSubscriptionPlansPaginated(page, limit, isActive, search);
        }}
        subscriptionPrice={editingPrice}
      />
    </div>
  );
};

export default SubscriptionManagement;
