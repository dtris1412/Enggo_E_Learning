import { Check, X, Crown, Zap, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatters";
import { useAuth } from "../../../shared/contexts/authContext";

interface SubscriptionPrice {
  subscription_price_id: number;
  billing_type: "monthly" | "yearly" | "weekly";
  duration_days: number;
  price: number;
  discount_percentage: number;
}

interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  code: string;
  features: Record<string, any>;
  monthly_ai_token_quota: number;
  is_active: boolean;
  Subscription_Prices?: SubscriptionPrice[];
}

interface PlanComparisonProps {
  plans: SubscriptionPlan[];
  billingType: "monthly" | "yearly" | "weekly";
}

const PlanComparison = ({ plans, billingType }: PlanComparisonProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get all unique features across all plans
  const getAllFeatures = () => {
    const allFeatures = new Set<string>();
    plans.forEach((plan) => {
      if (plan.features && typeof plan.features === "object") {
        Object.keys(plan.features).forEach((key) => allFeatures.add(key));
      }
    });
    return Array.from(allFeatures);
  };

  const allFeatures = getAllFeatures();

  const handleSelectPlan = (price?: SubscriptionPrice) => {
    if (!price) return;

    if (!isAuthenticated) {
      navigate(
        `/login?redirect=/payment/checkout?plan=${price.subscription_price_id}`,
      );
      return;
    }

    navigate(`/payment/checkout?plan=${price.subscription_price_id}`);
  };

  const formatFeatureName = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getFeatureValue = (plan: SubscriptionPlan, featureKey: string) => {
    if (!plan.features || typeof plan.features !== "object") return null;
    return plan.features[featureKey];
  };

  const renderFeatureCell = (value: any) => {
    if (value === undefined || value === null) {
      return (
        <div className="flex justify-center">
          <X className="w-5 h-5 text-slate-400" />
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div className="flex justify-center">
          {value ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <X className="w-5 h-5 text-red-400" />
          )}
        </div>
      );
    }

    return (
      <div className="text-center">
        <span className="text-sm text-slate-700 font-medium">{value}</span>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => {
          const price = plan.Subscription_Prices?.[0];
          const isPopular = plan.code === "pro";

          return (
            <div
              key={plan.subscription_plan_id}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
                isPopular ? "border-blue-500" : "border-slate-200"
              }`}
            >
              {isPopular && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    PHỔ BIẾN NHẤT
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-slate-800">
                    {plan.name}
                  </h3>
                </div>

                {price && (
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-slate-900">
                      {formatCurrency(price.price)}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {billingType === "monthly" && "/ tháng"}
                      {billingType === "yearly" && "/ năm"}
                      {billingType === "weekly" && "/ tuần"}
                    </div>
                    {price.discount_percentage > 0 && (
                      <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Giảm {price.discount_percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-800">
                    AI Credits
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {plan.monthly_ai_token_quota.toLocaleString()} tokens/tháng
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-slate-800 text-sm">
                  Tính năng:
                </h4>
                {allFeatures.map((feature) => {
                  const value = getFeatureValue(plan, feature);
                  return (
                    <div
                      key={feature}
                      className="flex items-center justify-between py-2 border-b border-slate-100"
                    >
                      <span className="text-sm text-slate-700">
                        {formatFeatureName(feature)}
                      </span>
                      {renderFeatureCell(value)}
                    </div>
                  );
                })}
              </div>

              {price && (
                <button
                  onClick={() => handleSelectPlan(price)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isPopular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  Chọn gói {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <th className="p-4 text-left font-semibold sticky left-0 bg-gradient-to-r from-slate-900 to-slate-800 z-10">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  <span>Tính năng</span>
                </div>
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.subscription_plan_id}
                  className="p-4 text-center font-semibold min-w-[200px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      <span>{plan.name}</span>
                    </div>
                    {plan.code === "pro" && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        PHỔ BIẾN
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Pricing Row */}
            <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-slate-300">
              <td className="p-4 font-semibold text-slate-800 sticky left-0 bg-gradient-to-r from-blue-50 to-purple-50 z-10">
                Giá
              </td>
              {plans.map((plan) => {
                const price = plan.Subscription_Prices?.[0];
                return (
                  <td
                    key={plan.subscription_plan_id}
                    className="p-4 text-center"
                  >
                    {price ? (
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {formatCurrency(price.price)}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {billingType === "monthly" && "/ tháng"}
                          {billingType === "yearly" && "/ năm"}
                          {billingType === "weekly" && "/ tuần"}
                        </div>
                        {price.discount_percentage > 0 && (
                          <div className="mt-2">
                            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                              Giảm {price.discount_percentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">-</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* AI Credits Row */}
            <tr className="bg-purple-50 border-b border-slate-200">
              <td className="p-4 font-semibold text-slate-800 sticky left-0 bg-purple-50 z-10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  AI Credits (hàng tháng)
                </div>
              </td>
              {plans.map((plan) => (
                <td key={plan.subscription_plan_id} className="p-4 text-center">
                  <span className="text-lg font-bold text-purple-600">
                    {plan.monthly_ai_token_quota.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-600 ml-1">tokens</span>
                </td>
              ))}
            </tr>

            {/* Feature Rows */}
            {allFeatures.map((feature, idx) => (
              <tr
                key={feature}
                className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <td className="p-4 text-slate-700 sticky left-0 bg-inherit z-10">
                  {formatFeatureName(feature)}
                </td>
                {plans.map((plan) => (
                  <td
                    key={plan.subscription_plan_id}
                    className="p-4 text-center"
                  >
                    {renderFeatureCell(getFeatureValue(plan, feature))}
                  </td>
                ))}
              </tr>
            ))}

            {/* Action Row */}
            <tr className="bg-slate-50">
              <td className="p-4 font-semibold text-slate-800 sticky left-0 bg-slate-50 z-10">
                Chọn gói
              </td>
              {plans.map((plan) => {
                const price = plan.Subscription_Prices?.[0];
                const isPopular = plan.code === "pro";
                return (
                  <td
                    key={plan.subscription_plan_id}
                    className="p-4 text-center"
                  >
                    {price && (
                      <button
                        onClick={() => handleSelectPlan(price)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          isPopular
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
                            : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                        }`}
                      >
                        Chọn gói
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanComparison;
