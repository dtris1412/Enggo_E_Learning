import React from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTokens?: number;
  requiredTokens?: number;
}

const UpgradeTokenModal: React.FC<UpgradeTokenModalProps> = ({
  isOpen,
  onClose,
  currentTokens = 0,
  requiredTokens = 0,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate("/subscription-plans");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <h2 className="text-lg font-bold text-white">Token không đủ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-800 font-semibold mb-2">
              ⚠️ Bạn đã hết Token
            </p>
            <p className="text-orange-700 text-sm">
              Bạn cần <span className="font-bold">{requiredTokens} Token</span>{" "}
              nhưng chỉ còn{" "}
              <span className="font-bold">{currentTokens} Token</span>.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-gray-800 font-semibold mb-2">
                Nâng cấp gói để nhận thêm Token
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Các gói cao hơp cung cấp Token hàng tháng để bạn có thể:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">✓</span>
                  <span>Sử dụng AI Assistant không giới hạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">✓</span>
                  <span>Tạo Flashcard set bằng AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">✓</span>
                  <span>Nhận phản hồi từ chấm điểm AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">✓</span>
                  <span>Luyện thi Speaking với AI examiner</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-900 text-sm">
                <span className="font-semibold">💡 Mẹo:</span> Gói Premium cung
                cấp <span className="font-bold">10,000 Token/tháng</span> - đủ
                cho hầu hết các nhu cầu học tập.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Để sau
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <span>Nâng cấp gói</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeTokenModal;
