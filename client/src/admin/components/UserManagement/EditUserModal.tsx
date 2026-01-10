import React, { useState, useEffect } from "react";
import { X, Upload, User } from "lucide-react";

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  full_name?: string;
  user_phone?: string;
  user_address?: string;
  role: number;
  avatar?: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (
    user_id: number,
    userData: {
      full_name?: string;
      user_phone?: string;
      user_address?: string;
      avatar?: string;
    }
  ) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<{
    success: boolean;
    data?: { url: string; publicId: string };
    message?: string;
  }>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  onUploadAvatar,
}) => {
  const [formData, setFormData] = useState({
    full_name: "",
    user_phone: "",
    user_address: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        user_phone: user.user_phone || "",
        user_address: user.user_address || "",
      });
      setAvatarPreview(user.avatar || "");
      setAvatarFile(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.user_phone && !/^[0-9]{10,11}$/.test(formData.user_phone)) {
      newErrors.user_phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let avatarUrl = user?.avatar;

      // Upload avatar nếu có file mới
      if (avatarFile) {
        const uploadResult = await onUploadAvatar(avatarFile);
        if (uploadResult.success && uploadResult.data) {
          avatarUrl = uploadResult.data.url;
        } else {
          throw new Error(uploadResult.message || "Upload avatar thất bại");
        }
      }

      await onSubmit(user!.user_id, {
        full_name: formData.full_name.trim() || undefined,
        user_phone: formData.user_phone.trim() || undefined,
        user_address: formData.user_address.trim() || undefined,
        avatar: avatarUrl,
      });

      setErrors({});
      setAvatarFile(null);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Compress ảnh trước khi upload
  const compressImage = (
    file: File,
    maxWidth = 800,
    quality = 0.8
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

          // Resize nếu ảnh quá lớn
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
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Vui lòng chọn file ảnh" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Kích thước ảnh tối đa 5MB" }));
      return;
    }

    try {
      // Compress ảnh trước khi lưu
      const compressedFile = await compressImage(file, 800, 0.85);
      setAvatarFile(compressedFile);
      setErrors((prev) => ({ ...prev, avatar: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Compress image error:", error);
      // Nếu compress lỗi, dùng file gốc
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa tài khoản
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Avatar Upload Section */}
          <div className="flex items-center gap-6 pb-4 border-b border-gray-200">
            <div className="flex-shrink-0">
              {avatarPreview ? (
                <img
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                  src={avatarPreview}
                  alt="Avatar preview"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Hủy
                  </button>
                )}
              </div>
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
              )}
              {avatarFile && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ Đã chọn: {avatarFile.name}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                JPG, PNG hoặc GIF. Tối đa 5MB.
              </p>
            </div>
          </div>

          {/* Read-only info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Tên đăng nhập:</span>
              <span className="ml-2 text-gray-900">{user.user_name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{user.user_email}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Vai trò:</span>
              <span className="ml-2 text-gray-900">
                {user.role === 1 ? "Admin" : "Người dùng"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="user_phone"
                value={formData.user_phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.user_phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập số điện thoại"
              />
              {errors.user_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.user_phone}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              name="user_address"
              value={formData.user_address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
