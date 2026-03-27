import { useEffect, useState } from "react";
import { useSubscription } from "../contexts/subscriptionContext";
import PlanComparison from "../components/SubscriptionComponent/PlanComparison";
import { Loader2, ArrowLeft, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const CompareSubscriptions = () => {
  const {
    plans,
    loading,
    error,
    billingType,
    setBillingType,
    fetchSubscriptionPlans,
  } = useSubscription();

  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    fetchSubscriptionPlans(billingType);
  }, [billingType, fetchSubscriptionPlans]);

  // Show comparison after plans are loaded
  useEffect(() => {
    if (plans.length > 0 && !loading) {
      // Small delay for smooth transition
      setTimeout(() => setShowComparison(true), 100);
    }
  }, [plans, loading]);

  // Get discount percentage for billing type selector
  const getDiscountLabel = (type: "monthly" | "yearly" | "weekly") => {
    if (type === "yearly") return "-34%";
    if (type === "monthly") return "-12%";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/subscription-plans"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Scale className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                So sánh gói đăng ký
              </h1>
            </div>
            <p className="text-base text-slate-400 max-w-2xl mx-auto">
              So sánh chi tiết tính năng và giá của các gói để chọn gói phù hợp
              nhất
            </p>
          </div>
        </div>

        {/* Billing Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-slate-900 rounded-full p-1 shadow-lg border border-slate-700">
            <button
              onClick={() => setBillingType("yearly")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingType === "yearly"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hàng năm
              {billingType === "yearly" && (
                <span className="ml-1.5 text-green-500 text-xs font-semibold">
                  {getDiscountLabel("yearly")}
                </span>
              )}
            </button>
            <button
              onClick={() => setBillingType("monthly")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingType === "monthly"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hàng tháng
              {billingType === "monthly" && (
                <span className="ml-1.5 text-green-500 text-xs font-semibold">
                  {getDiscountLabel("monthly")}
                </span>
              )}
            </button>
            <button
              onClick={() => setBillingType("weekly")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingType === "weekly"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hàng tuần
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => fetchSubscriptionPlans(billingType)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Comparison Table */}
        {!loading && !error && showComparison && plans.length > 0 && (
          <div
            className="animate-fade-in"
            style={{
              animation: "fadeIn 0.5s ease-in-out",
            }}
          >
            <PlanComparison plans={plans} billingType={billingType} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              Không có gói subscription nào để so sánh
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-lg p-6 border border-blue-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">
              💡 Gợi ý chọn gói
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div>
                <span className="font-semibold text-blue-400">Free:</span>
                <p className="mt-1">
                  Phù hợp để khám phá và trải nghiệm nền tảng
                </p>
              </div>
              <div>
                <span className="font-semibold text-purple-400">Standard:</span>
                <p className="mt-1">
                  Tốt cho người học cá nhân muốn nâng cao kỹ năng
                </p>
              </div>
              <div>
                <span className="font-semibold text-yellow-400">Pro:</span>
                <p className="mt-1">
                  Hoàn hảo cho người học chuyên nghiệp và AI credits cao
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CompareSubscriptions;
