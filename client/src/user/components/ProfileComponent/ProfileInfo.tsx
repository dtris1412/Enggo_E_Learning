import React, { useState, useEffect } from "react";
import { useUserProfile } from "../../contexts/userContext";
import { Camera, Save, X, User as UserIcon } from "lucide-react";

const ProfileInfo: React.FC = () => {
  const { profile, loading, updateUserProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    user_phone: "",
    user_address: "",
    avatar: "",
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        user_phone: profile.user_phone || "",
        user_address: profile.user_address || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    const result = await updateUserProfile(formData);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Cập nhật thành công!",
      });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({
        type: "error",
        text: result.message || "Cập nhật thất bại!",
      });
    }

    setUpdating(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        user_phone: profile.user_phone || "",
        user_address: profile.user_address || "",
        avatar: profile.avatar || "",
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-center text-gray-500">
          Không tìm thấy thông tin người dùng
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header Banner */}
      <div className="relative h-40 bg-gradient-to-r from-orange-400 via-blue-500 to-cyan-400 rounded-t-lg">
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 px-8 pb-8">
        {/* User Info Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.full_name || profile.user_name}
            </h2>
            <p className="text-gray-500 text-sm">
              {profile.role === 1 ? "Admin" : "Học viên"} • Trạng thái:{" "}
              <span
                className={
                  profile.user_status ? "text-green-600" : "text-red-600"
                }
              >
                {profile.user_status ? "Đang hoạt động" : "Bị khóa"}
              </span>
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={profile.user_name}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.user_email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                name="user_phone"
                value={formData.user_phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              name="user_address"
              value={formData.user_address}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing
                  ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-50 cursor-not-allowed"
              }`}
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Avatar URL */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Avatar
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập URL hình ảnh"
              />
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updating}
                className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
            </div>
          )}
        </form>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin tài khoản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="ml-2 text-gray-800 font-medium">
                {new Date(profile.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Cập nhật lần cuối:</span>
              <span className="ml-2 text-gray-800 font-medium">
                {new Date(profile.updated_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
