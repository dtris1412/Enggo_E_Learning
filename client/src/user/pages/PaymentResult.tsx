import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Home, FileText } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const message = searchParams.get("message");

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false);

      // Notify Header to refresh subscription after successful payment
      if (success) {
        window.dispatchEvent(new Event("subscriptionUpdated"));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [success]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {success ? (
          /* Success State */
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-400">Đơn hàng của bạn đã được xác nhận</p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 space-y-3">
              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Mã đơn hàng:</span>
                  <span className="text-white font-mono font-semibold">
                    #{orderId}
                  </span>
                </div>
              )}

              {amount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Số tiền:</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(Number(amount))}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-700">
                <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Subscription đã được kích hoạt
                </p>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-400 text-sm">
                ✨ Bạn đã nhận được AI Tokens và có thể sử dụng đầy đủ các tính
                năng Premium ngay bây giờ!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Về trang chủ
              </button>

              <button
                onClick={() => navigate("/subscription-plans")}
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Xem gói của tôi
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 mt-6">
              Biên lai thanh toán đã được gửi về email của bạn
            </p>
          </div>
        ) : (
          /* Failed State */
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-400">
                Đơn hàng của bạn chưa được hoàn tất
              </p>
            </div>

            {/* Error Message */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">
                {message ||
                  "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
              </p>
            </div>

            {/* Order Info if available */}
            {orderId && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Mã đơn hàng:</span>
                  <span className="text-white font-mono">#{orderId}</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Đơn hàng vẫn ở trạng thái chờ thanh toán
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/subscription-plans")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Thử lại thanh toán
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Về trang chủ
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Cần hỗ trợ?</p>
              <a
                href="mailto:support@example.com"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Liên hệ chúng tôi
              </a>
            </div>
          </div>
        )}

        {/* Common Tips */}
        <div className="mt-6 bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            💡 Mẹo hữu ích
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Kiểm tra email để xem biên lai thanh toán</li>
            <li>• Lưu mã đơn hàng để tra cứu sau này</li>
            <li>• Liên hệ hỗ trợ nếu có thắc mắc</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
