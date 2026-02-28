import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSubscription } from "../../contexts/subscriptionContext";

interface EditSubscriptionPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionPrice: {
    subscription_price_id: number;
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
  } | null;
}

const EditSubscriptionPriceModal = ({
  isOpen,
  onClose,
  subscriptionPrice,
}: EditSubscriptionPriceModalProps) => {
  const { updateSubscriptionPrice, loading } = useSubscription();
  const [formData, setFormData] = useState({
    price: 0,
    discount_percentage: 0 as number | null,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subscriptionPrice) {
      setFormData({
        price: subscriptionPrice.price,
        discount_percentage: subscriptionPrice.discount_percentage,
        is_active: subscriptionPrice.is_active,
      });
      setErrors({});
    }
  }, [subscriptionPrice, isOpen]);

  // Calculate final price in real-time
  const calculateFinalPrice = (
    price: number,
    discountPercentage: number | null,
  ) => {
    if (!discountPercentage || discountPercentage === 0) {
      return price;
    }
    const discount = (price * discountPercentage) / 100;
    return Math.round(price - discount);
  };

  const finalPrice = calculateFinalPrice(
    formData.price,
    formData.discount_percentage,
  );

  const handleValidation = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.price || formData.price < 0) {
      newErrors.price = "Giá phải là số dương";
    }

    if (
      formData.discount_percentage !== null &&
      formData.discount_percentage !== undefined
    ) {
      if (
        formData.discount_percentage < 0 ||
        formData.discount_percentage > 100
      ) {
        newErrors.discount_percentage = "Phần trăm giảm giá phải từ 0 đến 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidation() || !subscriptionPrice) {
      return;
    }

    const success = await updateSubscriptionPrice(
      subscriptionPrice.subscription_price_id,
      {
        price: formData.price,
        discount_percentage:
          formData.discount_percentage === 0 || !formData.discount_percentage
            ? null
            : formData.discount_percentage,
        is_active: formData.is_active,
      },
    );

    if (success) {
      onClose();
    }
  };

  if (!isOpen || !subscriptionPrice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Chỉnh sửa gói đăng ký
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {subscriptionPrice.Subscription_Plan?.name} -{" "}
              {subscriptionPrice.billing_type.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Billing Type Info */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <p>
              <span className="font-medium">Loại thanh toán:</span>{" "}
              {subscriptionPrice.billing_type.toUpperCase()}
            </p>
            <p>
              <span className="font-medium">Thời hạn:</span>{" "}
              {subscriptionPrice.duration_days} ngày
            </p>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  price: parseInt(e.target.value) || 0,
                });
                if (errors.price) {
                  setErrors({ ...errors, price: "" });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Discount Percentage */}
          <div>
            <label
              htmlFor="discount_percentage"
              className="block text-sm font-medium mb-2"
            >
              Phần trăm giảm giá (%){" "}
              <span className="text-gray-500">(Tùy chọn)</span>
            </label>
            <input
              type="number"
              id="discount_percentage"
              value={formData.discount_percentage || ""}
              onChange={(e) => {
                const val =
                  e.target.value === "" ? null : parseInt(e.target.value);
                setFormData({
                  ...formData,
                  discount_percentage: val,
                });
                if (errors.discount_percentage) {
                  setErrors({ ...errors, discount_percentage: "" });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              max="100"
            />
            {errors.discount_percentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount_percentage}
              </p>
            )}
          </div>

          {/* Final Price Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Giá cuối cùng:</span>{" "}
              <span className="text-lg font-bold text-blue-600">
                {finalPrice.toLocaleString("vi-VN")} VNĐ
              </span>
            </p>
            {formData.discount_percentage ? (
              <p className="text-xs text-gray-500 mt-1">
                {formData.price.toLocaleString("vi-VN")} VNĐ -{" "}
                {formData.discount_percentage}% ={" "}
                {finalPrice.toLocaleString("vi-VN")} VNĐ
              </p>
            ) : null}
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="is_active" className="text-sm font-medium">
              Kích hoạt
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, is_active: !formData.is_active })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.is_active ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionPriceModal;
