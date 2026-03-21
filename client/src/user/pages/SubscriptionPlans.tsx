import { useEffect } from "react";
import { useSubscription } from "../contexts/subscriptionContext";
import PricingCard from "../components/SubscriptionComponent/PricingCard";
import { Loader2, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionPlans = () => {
  const {
    plans,
    loading,
    error,
    billingType,
    setBillingType,
    fetchSubscriptionPlans,
  } = useSubscription();

  useEffect(() => {
    fetchSubscriptionPlans(billingType);
  }, [billingType, fetchSubscriptionPlans]);

  // Get discount percentage for billing type selector
  const getDiscountLabel = (type: "monthly" | "yearly" | "weekly") => {
    if (type === "yearly") return "-34%";
    if (type === "monthly") return "-12%";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Chọn gói phù hợp với bạn
          </h1>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Nâng cấp để trải nghiệm đầy đủ tính năng và học tập hiệu quả hơn
          </p>
          <div className="mt-4">
            <Link
              to="/subscription-compare"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Scale className="w-4 h-4" />
              <span className="font-medium">So sánh chi tiết các gói</span>
            </Link>
          </div>
        </div>

        {/* Billing Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-900 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingType("yearly")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingType === "yearly"
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-400 hover:text-white"
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
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-400 hover:text-white"
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
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-400 hover:text-white"
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

        {/* Pricing Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              // Get the first price for the selected billing type
              const price = plan.Subscription_Prices[0];

              // Determine if this is the popular plan (usually "Pro")
              const isPopular = plan.code === "pro";

              return (
                <PricingCard
                  key={plan.subscription_plan_id}
                  name={plan.name}
                  code={plan.code}
                  price={price}
                  features={plan.features}
                  monthlyTokens={plan.monthly_ai_token_quota}
                  isPopular={isPopular}
                  billingType={billingType}
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Không có gói subscription nào khả dụng
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Tôi có thể hủy đăng ký bất kỳ lúc nào không?
              </h3>
              <p className="text-gray-400">
                Có, bạn có thể hủy đăng ký bất kỳ lúc nào. Bạn sẽ vẫn có quyền
                truy cập cho đến hết thời gian đăng ký hiện tại.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Credits AI là gì?
              </h3>
              <p className="text-gray-400">
                Credits AI cho phép bạn sử dụng trợ lý AI để hỗ trợ học tập,
                giải đáp thắc mắc và tạo nội dung học tập cá nhân hóa.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Tôi có thể nâng cấp/hạ cấp gói sau này không?
              </h3>
              <p className="text-gray-400">
                Có, bạn có thể thay đổi gói đăng ký bất kỳ lúc nào. Số tiền sẽ
                được tính theo tỷ lệ thời gian sử dụng.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Phương thức thanh toán nào được chấp nhận?
              </h3>
              <p className="text-gray-400">
                Chúng tôi chấp nhận thẻ tín dụng/ghi nợ, ví điện tử (Momo,
                ZaloPay) và chuyển khoản ngân hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
