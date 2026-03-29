import React, { useState } from "react";
import { useUserProfile } from "../../contexts/userContext";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

const ChangePassword: React.FC = () => {
  const { changePassword } = useUserProfile();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!formData.current_password) {
      setMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại" });
      return false;
    }
    if (!formData.new_password) {
      setMessage({ type: "error", text: "Vui lòng nhập mật khẩu mới" });
      return false;
    }
    if (formData.new_password.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
      return false;
    }
    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return false;
    }
    if (formData.current_password === formData.new_password) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải khác mật khẩu hiện tại",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await changePassword(
      formData.current_password,
      formData.new_password,
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Đổi mật khẩu thành công!",
      });
      setFormData({
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

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 rounded-lg">
          <Shield className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Đổi mật khẩu</h2>
          <p className="text-slate-500 text-sm">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </p>
        </div>
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
              value={formData.current_password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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
              value={formData.new_password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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

        {/* Security Tips */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <h3 className="font-semibold text-violet-800 mb-2">
            Lời khuyên bảo mật:
          </h3>
          <ul className="text-sm text-violet-700 space-y-1">
            <li>• Mật khẩu nên có ít nhất 6 ký tự</li>
            <li>• Sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
            <li>• Không sử dụng mật khẩu giống với các tài khoản khác</li>
            <li>• Thay đổi mật khẩu định kỳ để bảo mật tài khoản</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:bg-slate-400"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                current_password: "",
                new_password: "",
                confirm_password: "",
              });
              setMessage(null);
            }}
            disabled={loading}
            className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition disabled:bg-slate-200"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

