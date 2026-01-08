import React from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Lock,
  Unlock,
  Edit2,
} from "lucide-react";

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  full_name?: string;
  user_phone?: string;
  user_address?: string;
  avatar?: string;
  user_status: boolean;
  role: number;
  created_at?: string;
  updated_at?: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
  onLock: (user_id: number) => void;
  onUnlock: (user_id: number) => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
  onLock,
  onUnlock,
}) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleText = (role: number) => {
    return role === 1 ? "Admin" : "Người dùng";
  };

  const getRoleColor = (role: number) => {
    return role === 1
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (status: boolean) => {
    return status ? "Hoạt động" : "Đã khóa";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin người dùng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning for locked account */}
          {!user.user_status && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="font-semibold text-red-800">
                    Tài khoản đã bị khóa
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Tài khoản này không thể chỉnh sửa cho đến khi được mở khóa.
                    Chỉ có thao tác mở khóa được phép.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                  src={user.avatar}
                  alt={user.full_name || user.user_name}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                  <span className="text-blue-600 font-bold text-3xl">
                    {(user.full_name || user.user_name).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {user.full_name || user.user_name}
              </h3>
              <p className="text-gray-600 mt-1">@{user.user_name}</p>
              <div className="flex gap-2 mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                    user.role
                  )}`}
                >
                  <Shield className="h-3 w-3 inline mr-1" />
                  {getRoleText(user.role)}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    user.user_status
                  )}`}
                >
                  {getStatusText(user.user_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                  Email
                </p>
                <p className="text-sm text-gray-900 break-all">
                  {user.user_email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                  Số điện thoại
                </p>
                <p className="text-sm text-gray-900">
                  {user.user_phone || "-"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                  Địa chỉ
                </p>
                <p className="text-sm text-gray-900">
                  {user.user_address || "-"}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                  Ngày tạo
                </p>
                <p className="text-sm text-gray-900">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>

            {/* Updated At */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                  Cập nhật lần cuối
                </p>
                <p className="text-sm text-gray-900">
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 uppercase font-medium mb-1">
              ID Người dùng
            </p>
            <p className="text-sm font-mono text-blue-900">{user.user_id}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          <div className="flex gap-3">
            {user.user_status ? (
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn khóa tài khoản này?")) {
                    onLock(user.user_id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Khóa tài khoản
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) {
                    onUnlock(user.user_id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
              >
                <Unlock className="h-4 w-4" />
                Mở khóa tài khoản
              </button>
            )}
            <button
              onClick={() => {
                if (user.user_status) {
                  onEdit(user);
                  onClose();
                }
              }}
              disabled={!user.user_status}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                user.user_status
                  ? "text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "text-gray-400 bg-gray-200 cursor-not-allowed"
              }`}
              title={user.user_status ? "Chỉnh sửa" : "Tài khoản đã bị khóa"}
            >
              <Edit2 className="h-4 w-4" />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
