import { Check, Sparkles, Crown } from "lucide-react";

interface SubscriptionPrice {
  subscription_price_id: number;
  billing_type: "monthly" | "yearly" | "weekly";
  duration_days: number;
  price: number;
  discount_percentage: number;
}

interface PricingCardProps {
  name: string;
  code: string;
  price?: SubscriptionPrice;
  features: Record<string, any>;
  monthlyTokens: number;
  isPopular?: boolean;
  billingType: "monthly" | "yearly" | "weekly";
}

const PricingCard = ({
  name,
  code,
  price,
  features,
  monthlyTokens,
  isPopular = false,
  billingType,
}: PricingCardProps) => {
  // Calculate original price if there's a discount
  const getOriginalPrice = () => {
    if (!price || !price.discount_percentage) return null;
    return Math.round(price.price / (1 - price.discount_percentage / 100));
  };

  // Get renewal price (same as current price for monthly, different calculation for yearly)
  const getRenewalPrice = () => {
    if (!price) return null;
    if (billingType === "yearly") {
      return Math.round(price.price / 12); // Monthly equivalent
    }
    return price.price;
  };

  // Card styling based on plan
  const getCardStyle = () => {
    switch (code) {
      case "free":
        return "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700";
      case "pro":
        return "bg-gradient-to-br from-gray-900 to-gray-800 border-blue-500";
      case "premium":
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-500 shadow-2xl shadow-yellow-500/20";
      default:
        return "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700";
    }
  };

  const originalPrice = getOriginalPrice();
  const renewalPrice = getRenewalPrice();

  return (
    <div
      className={`relative rounded-2xl border-2 ${getCardStyle()} p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isPopular ? "ring-2 ring-blue-400" : ""
      } ${code === "premium" ? "ring-2 ring-yellow-500" : ""}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Phổ biến nhất
          </span>
        </div>
      )}

      {/* Premium Badge */}
      {code === "premium" && (
        <div className="absolute -top-4 right-4">
          <Crown className="w-8 h-8 text-yellow-500 fill-yellow-300" />
        </div>
      )}

      {/* Plan Name */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          {code === "premium" && (
            <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
        {price && price.discount_percentage > 0 && (
          <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Tiết kiệm {Math.round(price.discount_percentage)}%
          </span>
        )}
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        {price ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-gray-400">$</span>
              <span className="text-5xl font-bold text-white">
                {(price.price / 1000).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">
                /{" "}
                {billingType === "monthly"
                  ? "Tháng"
                  : billingType === "yearly"
                    ? "Năm"
                    : "Tuần"}
              </span>
            </div>

            {originalPrice && (
              <div className="text-gray-400 line-through text-sm mb-2">
                ${(originalPrice / 1000).toFixed(2)}
              </div>
            )}

            {renewalPrice && billingType !== "monthly" && (
              <div className="text-xs text-gray-400">
                Tương đương: ${(renewalPrice / 1000).toFixed(2)} (
                {Math.round(price.discount_percentage)}% off)
              </div>
            )}
          </>
        ) : (
          <div className="text-5xl font-bold text-white">Miễn phí</div>
        )}
      </div>

      {/* Subscribe Button - Hidden for free plan */}
      {code !== "free" && (
        <>
          <button
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 ${
              code === "premium"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
            }`}
          >
            Đăng ký ngay
          </button>

          {price && (
            <p className="text-xs text-center text-gray-400 mb-6">
              Chỉ giảm giá cho lần đăng ký đầu tiên, hủy bất kỳ lúc nào
            </p>
          )}
        </>
      )}

      {/* AI Tokens */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-white">
              {monthlyTokens > 0 ? monthlyTokens.toLocaleString() : "Không có"}{" "}
              Credits
            </span>
          </div>
          <span className="text-xs text-gray-400">mỗi tháng</span>
        </div>
        {monthlyTokens > 0 && (
          <div className="text-xs text-gray-400">
            Tương đương ${((monthlyTokens * 0.01) / 100).toFixed(2)} mỗi 100
            Credits
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-300 mb-3">
          Tính năng bao gồm:
        </p>
        {Object.entries(features).map(([key, value]) => {
          const featureLabel = getFriendlyFeatureName(key);
          const isIncluded = value === true || value === -1;
          const featureValue =
            typeof value === "number" && value !== -1
              ? ` (${value})`
              : value === -1
                ? " (Không giới hạn)"
                : "";

          return (
            <div key={key} className="flex items-start gap-3">
              <Check
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isIncluded ? "text-green-400" : "text-gray-600"
                }`}
              />
              <span
                className={`text-sm ${
                  isIncluded ? "text-gray-200" : "text-gray-500"
                }`}
              >
                {featureLabel}
                {featureValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to convert feature keys to friendly names
const getFriendlyFeatureName = (key: string): string => {
  const nameMap: Record<string, string> = {
    max_courses: "Khóa học tối đa",
    ai_assistance: "Trợ lý AI",
    download_documents: "Tải tài liệu",
    priority_support: "Hỗ trợ ưu tiên",
    custom_learning_path: "Lộ trình học tập tùy chỉnh",
    offline_access: "Truy cập offline",
    certificates: "Chứng chỉ",
    live_sessions: "Buổi học trực tiếp",
  };

  return nameMap[key] || key.replace(/_/g, " ");
};

export default PricingCard;
