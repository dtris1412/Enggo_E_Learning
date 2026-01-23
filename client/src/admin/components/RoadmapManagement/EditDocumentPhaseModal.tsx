import React, { useState } from "react";
import { X } from "lucide-react";

interface EditDocumentPhaseModalProps {
  onClose: () => void;
  onSubmit: (orderIndex: number) => Promise<void>;
  currentOrderIndex: number;
  documentName: string;
}

const EditDocumentPhaseModal: React.FC<EditDocumentPhaseModalProps> = ({
  onClose,
  onSubmit,
  currentOrderIndex,
  documentName,
}) => {
  const [orderIndex, setOrderIndex] = useState(currentOrderIndex);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await onSubmit(orderIndex);
    } catch (error) {
      console.error("Error updating document phase:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa thứ tự tài liệu
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Name */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tài liệu:</p>
            <p className="font-medium text-gray-900">{documentName}</p>
          </div>

          {/* Order Index */}
          <div>
            <label
              htmlFor="order_index"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              id="order_index"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Số thứ tự để sắp xếp tài liệu (0 = mặc định)
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentPhaseModal;
