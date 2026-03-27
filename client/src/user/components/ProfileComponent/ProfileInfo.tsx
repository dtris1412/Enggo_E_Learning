import React, { useState, useEffect, useRef } from "react";
import { useUserProfile } from "../../contexts/userContext";
import {
  Camera,
  Save,
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const ProfileInfo: React.FC = () => {
  const { profile, loading, updateUserProfile, changePassword } =
    useUserProfile();
  const [activeTab, setActiveTab] = useState<"view" | "edit" | "password">(
    "view",
  );
  const [formData, setFormData] = useState({
    full_name: "",
    user_phone: "",
    user_address: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Change password states
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Check if user is logged in via social providers
  const isSocialLogin = profile?.google_id || profile?.facebook_id;

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        user_phone: profile.user_phone || "",
        user_address: profile.user_address || "",
      });
      setPreviewUrl(profile.avatar || "");
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Compress image
  const compressImage = (
    file: File,
    maxWidth = 800,
    quality = 0.8,
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Canvas to Blob failed"));
              }
            },
            "image/jpeg",
            quality,
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Vui lòng chọn file ảnh" }));
      setMessage({
        type: "error",
        text: "Vui lòng chọn file ảnh!",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Kích thước ảnh tối đa 5MB" }));
      setMessage({
        type: "error",
        text: "Kích thước file không được vượt quá 5MB!",
      });
      return;
    }

    try {
      // Compress image
      const compressedFile = await compressImage(file, 800, 0.85);
      setSelectedFile(compressedFile);
      setErrors((prev) => ({ ...prev, avatar: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
      setMessage(null);
    } catch (error) {
      console.error("Compress image error:", error);
      // Use original file if compression fails
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/upload/avatar`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return result.data.url;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload avatar error:", error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.user_phone && !/^[0-9]{10,11}$/.test(formData.user_phone)) {
      newErrors.user_phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUpdating(true);
    setMessage(null);

    try {
      let avatarUrl = profile?.avatar;

      // Upload avatar if new file selected
      if (selectedFile) {
        setMessage({
          type: "success",
          text: "Đang tải ảnh lên...",
        });
        const uploadedUrl = await uploadAvatar(selectedFile);
        if (!uploadedUrl) {
          throw new Error("Failed to upload avatar");
        }
        avatarUrl = uploadedUrl;
      }

      // Update profile
      const result = await updateUserProfile({
        full_name: formData.full_name.trim() || undefined,
        user_phone: formData.user_phone.trim() || undefined,
        user_address: formData.user_address.trim() || undefined,
        avatar: avatarUrl || undefined,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Cập nhật thành công!",
        });
        setSelectedFile(null);
        setTimeout(() => {
          setMessage(null);
          setActiveTab("view");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Cập nhật thất bại!",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra!",
      });
    }

    setUpdating(false);
  };

  const validatePasswordForm = () => {
    if (!passwordData.current_password) {
      setMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại" });
      return false;
    }
    if (!passwordData.new_password) {
      setMessage({ type: "error", text: "Vui lòng nhập mật khẩu mới" });
      return false;
    }
    if (passwordData.new_password.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
      return false;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return false;
    }
    if (passwordData.current_password === passwordData.new_password) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải khác mật khẩu hiện tại",
      });
      return false;
    }
    return true;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validatePasswordForm()) {
      return;
    }

    setUpdating(true);

    const result = await changePassword(
      passwordData.current_password,
      passwordData.new_password,
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Đổi mật khẩu thành công!",
      });
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({
        type: "error",
        text: result.message || "Đổi mật khẩu thất bại!",
      });
    }

    setUpdating(false);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setPreviewUrl(profile?.avatar || "");
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        user_phone: profile.user_phone || "",
        user_address: profile.user_address || "",
      });
      setPreviewUrl(profile.avatar || "");
    }
    setSelectedFile(null);
    setErrors({});
    setMessage(null);
    setActiveTab("view");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-32 bg-slate-300 rounded-full mx-auto"></div>
          <div className="h-6 bg-slate-300 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-center text-slate-500">
          Không tìm thấy thông tin người dùng
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header Banner with Avatar */}
      <div className="relative h-40 bg-gradient-to-r from-orange-400 via-blue-500 to-cyan-400 rounded-t-lg">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-lg">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-slate-400" />
              )}
            </div>
            {activeTab === "edit" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow-md"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Info Header */}
      <div className="pt-20 px-8 pb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {profile.user_name || profile.user_name}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {profile.role === 1 ? "Admin" : "Học viên"}
        </p>
        <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm">
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              profile.user_status ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span
            className={profile.user_status ? "text-green-600" : "text-red-600"}
          >
            {profile.user_status ? "Đang hoạt động" : "Bị khóa"}
          </span>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="border-b border-slate-200 px-8">
        <nav className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab("view");
              setMessage(null);
            }}
            className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "view"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Thông tin
            {activeTab === "view" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("edit");
              setMessage(null);
            }}
            className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "edit"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Chỉnh sửa
            {activeTab === "edit" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          {!isSocialLogin && (
            <button
              onClick={() => {
                setActiveTab("password");
                setMessage(null);
              }}
              className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
                activeTab === "password"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Đổi mật khẩu
              {activeTab === "password" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8">
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

        {/* View Tab */}
        {activeTab === "view" && (
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="text-slate-800 font-medium">
                  {profile.user_email}
                </p>
              </div>
            </div>

            {/* Phone */}
            {profile.user_phone && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">Số điện thoại</p>
                  <p className="text-slate-800 font-medium">
                    {profile.user_phone}
                  </p>
                </div>
              </div>
            )}

            {/* Address */}
            {profile.user_address && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-1">Địa chỉ</p>
                  <p className="text-slate-800 font-medium">
                    {profile.user_address}
                  </p>
                </div>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-1">Ngày tham gia</p>
                <p className="text-slate-800 font-medium">
                  {new Date(profile.created_at).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Social Login Info */}
            {isSocialLogin && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Phương thức đăng nhập:</span>{" "}
                  {profile.google_id && "Google"}
                  {profile.facebook_id && "Facebook"}
                  {" • "}
                  <span className="text-blue-600">
                    Không thể thay đổi mật khẩu
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Edit Tab */}
        {activeTab === "edit" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedFile && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                <span>Ảnh mới đã chọn: {selectedFile.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.avatar && (
              <p className="text-red-500 text-sm text-center">
                {errors.avatar}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username (readonly) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={profile.user_name}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.user_email}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.user_phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-blue-500"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.user_phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                name="user_address"
                value={formData.user_address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updating}
                className="flex items-center gap-2 px-6 py-3 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition disabled:bg-slate-200 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Đổi mật khẩu
                </h3>
                <p className="text-slate-500 text-sm">
                  Cập nhật mật khẩu của bạn để bảo mật tài khoản
                </p>
              </div>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {updating ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
