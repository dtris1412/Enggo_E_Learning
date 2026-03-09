import { Check, Sparkles, Crown } from "lucide-react";
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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Ensure features is an object (safety check)
  const safeFeatures =
    typeof features === "object" && features !== null ? features : {};

  const handleSubscribe = () => {
    if (!price) return;

    // Check if user is logged in
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(
        `/login?redirect=/payment/checkout?plan=${price.subscription_price_id}`,
      );
      return;
    }

    // Navigate to checkout page with plan ID
    navigate(`/payment/checkout?plan=${price.subscription_price_id}`);
  };

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
      className={`relative rounded-xl border-2 ${getCardStyle()} p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        isPopular ? "ring-2 ring-blue-400" : ""
      } ${code === "premium" ? "ring-2 ring-yellow-500" : ""}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Phổ biến nhất
          </span>
        </div>
      )}

      {/* Premium Badge */}
      {code === "premium" && (
        <div className="absolute -top-3 right-3">
          <Crown className="w-6 h-6 text-yellow-500 fill-yellow-300" />
        </div>
      )}

      {/* Plan Name */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {code === "premium" && (
            <span className="bg-yellow-500 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
              NEW
            </span>
          )}
        </div>
        {price && price.discount_percentage > 0 && (
          <span className="inline-block bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Tiết kiệm {Math.round(price.discount_percentage)}%
          </span>
        )}
      </div>

      {/* Pricing */}
      <div className="text-center mb-4">
        {price ? (
          <>
            <div className="mb-1.5">
              <span className="text-3xl font-bold text-white">
                {formatCurrency(price.price, { showCurrency: false })}
              </span>
              <span className="text-xs text-gray-400 ml-1">
                VNĐ/{" "}
                {billingType === "monthly"
                  ? "Tháng"
                  : billingType === "yearly"
                    ? "Năm"
                    : "Tuần"}
              </span>
            </div>

            {originalPrice && (
              <div className="text-gray-400 line-through text-xs mb-1">
                {formatCurrency(originalPrice)}
              </div>
            )}

            {renewalPrice && billingType !== "monthly" && (
              <div className="text-[10px] text-gray-400">
                Tương đương: {formatCurrency(renewalPrice)}/tháng
              </div>
            )}
          </>
        ) : (
          <div className="text-3xl font-bold text-white">Miễn phí</div>
        )}
      </div>

      {/* Subscribe Button - Hidden for free plan */}
      {code !== "free" && (
        <>
          <button
            onClick={handleSubscribe}
            className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 mb-3 ${
              code === "premium"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:shadow-lg hover:shadow-yellow-500/50 hover:scale-[1.02]"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02]"
            }`}
          >
            Đăng ký ngay
          </button>

          {price && (
            <p className="text-[10px] text-center text-gray-400 mb-3">
              Chỉ giảm giá cho lần đăng ký đầu tiên, hủy bất kỳ lúc nào
            </p>
          )}
        </>
      )}

      {/* AI Tokens */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {monthlyTokens > 0 ? monthlyTokens.toLocaleString() : "Không có"}{" "}
              Credits
            </span>
          </div>
          <span className="text-[10px] text-gray-400">mỗi tháng</span>
        </div>
        {monthlyTokens > 0 && (
          <div className="text-[10px] text-gray-400">
            Tương đương ${((monthlyTokens * 0.01) / 100).toFixed(2)} mỗi 100
            Credits
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-300 mb-2">
          Tính năng bao gồm:
        </p>
        {Object.entries(safeFeatures).map(([key, value]) => {
          const featureLabel = getFriendlyFeatureName(key);
          const isIncluded = value === true || value === -1;
          const featureValue =
            typeof value === "number" && value !== -1
              ? ` (${value})`
              : value === -1
                ? " (Không giới hạn)"
                : "";

          return (
            <div key={key} className="flex items-start gap-2">
              <Check
                className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  isIncluded ? "text-green-400" : "text-gray-600"
                }`}
              />
              <span
                className={`text-xs ${
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
