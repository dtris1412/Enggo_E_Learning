import * as React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { Payment } from "../../contexts/orderPaymentContext";
import { useOrderPayment } from "../../contexts/orderPaymentContext";

interface UpdatePaymentStatusModalProps {
  isOpen: boolean;
  payment: Payment;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdatePaymentStatusModal = ({
  isOpen,
  payment,
  onClose,
  onSuccess,
}: UpdatePaymentStatusModalProps) => {
  const { paymentLoading, updatePaymentStatus } = useOrderPayment();
  const [selectedStatus, setSelectedStatus] = useState(payment.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selectedStatus === payment.status) {
      onClose();
      return;
    }

    setSaving(true);
    const success = await updatePaymentStatus(
      payment.payment_id,
      selectedStatus,
    );
    setSaving(false);

    if (success) {
      alert("Cập nhật trạng thái thanh toán thành công!");
      onSuccess();
    } else {
      alert("Lỗi khi cập nhật trạng thái thanh toán");
    }
  };

  if (!isOpen) return null;

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "Đang chờ",
      completed: "Hoàn thành",
      failed: "Thất bại",
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cập nhật trạng thái thanh toán
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Current Status */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Trạng thái hiện tại
            </p>
            <p className="text-sm text-gray-600">
              {getStatusLabel(payment.status)}
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Mã thanh toán:</span> #
              {payment.payment_id}
            </p>
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Mã đơn hàng:</span> #
              {payment.order_id}
            </p>
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Số tiền:</span>{" "}
              {payment.amount.toLocaleString("vi-VN")} VNĐ
            </p>
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Mã giao dịch:</span>{" "}
              {payment.transaction_code}
            </p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Cập nhật trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as "pending" | "completed" | "failed",
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Đang chờ</option>
              <option value="completed">Hoàn thành ✓ (Cấp subscription)</option>
              <option value="failed">Thất bại ✗</option>
            </select>
            {selectedStatus === "completed" && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800">
                  ⚠️ Khi cập nhật thành "Hoàn thành", hệ thống sẽ tự động:
                  <br />
                  • Hủy subscription cũ (nếu có)
                  <br />
                  • Tạo subscription mới
                  <br />
                  • Cộng token vào wallet người dùng
                  <br />• Tạo transaction record
                </p>
              </div>
            )}
            {selectedStatus === "failed" && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-800">
                  ⚠️ Người dùng có thể sử dụng "Retry Payment" để thanh toán lại
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving || paymentLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving || paymentLoading}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving || paymentLoading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePaymentStatusModal;
