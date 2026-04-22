import { Mail, Lock, User, Eye, EyeOff, Phone, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/authContext";
import { useToast } from "../../shared/components/Toast/Toast";

const Register = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    verifyEmail: verifyEmailContext,
    loginWithGoogle,
    loginWithFacebook,
  } = useAuth();
  const { showToast } = useToast();

  // OTP Verification States
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // 5 minutes
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  // Register form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // OTP Timer
  useEffect(() => {
    if (!showOTPVerification) return;

    if (otpTimeLeft <= 0) {
      showToast("error", "OTP đã hết hạn!");
      setShowOTPVerification(false);
      return;
    }

    const timer = setInterval(() => {
      setOtpTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOTPVerification, otpTimeLeft, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      showToast("error", "Vui lòng đồng ý với điều khoản sử dụng!");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
      );

      if (result.success) {
        showToast("success", "OTP đã được gửi đến email của bạn!");
        // Show OTP verification form
        setVerificationEmail(formData.email);
        setShowOTPVerification(true);
        setOtpTimeLeft(300); // Reset timer
        setOtp(""); // Clear OTP input
      } else {
        showToast("error", result.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      showToast("error", "Vui lòng nhập OTP 6 chữ số!");
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const result = await verifyEmailContext(verificationEmail, otp);

      if (result.success) {
        showToast("success", result.message);
        // Reset form and navigate to dashboard after 1 second
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 1000);
      } else {
        showToast("error", result.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await registerUser(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
      );

      if (result.success) {
        showToast("success", "OTP mới đã được gửi!");
        setOtpTimeLeft(300); // Reset timer
        setOtp(""); // Clear OTP input
      } else {
        showToast("error", result.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    loginWithFacebook();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {!showOTPVerification ? (
        // Register Form
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Tạo tài khoản mới
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Username */}{" "}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Tên đăng nhập
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Nhập tên đăng nhập"
                    />
                    <User className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Họ và tên
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Nhập họ và tên"
                    />
                    <User className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Nhập email"
                    />
                    <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Số điện thoại
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Nhập số điện thoại"
                    />
                    <Phone className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mật khẩu
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 pr-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Nhập mật khẩu"
                    />
                    <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 pr-10 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Nhập lại mật khẩu"
                    />
                    <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    required
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-2 block text-sm text-slate-900"
                  >
                    Tôi đồng ý với{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-500"
                    >
                      Điều khoản sử dụng
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-500"
                    >
                      Chính sách bảo mật
                    </a>
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">
                      Hoặc đăng ký bằng
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center py-3 px-4 border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="w-full inline-flex justify-center py-3 px-4 border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // OTP Verification Form
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <KeyRound className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Xác thực Email
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Chúng tôi đã gửi mã OTP đến email <br />
              <span className="font-medium text-slate-900">
                {verificationEmail}
              </span>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleVerifyOTP}>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mã OTP (6 chữ số)
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="appearance-none block w-full px-3 py-3 pl-10 text-center text-2xl tracking-[0.5em] border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-bold"
                      placeholder="000000"
                    />
                    <KeyRound className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                  <div className="mt-2 text-right">
                    <span
                      className={`text-sm font-medium ${otpTimeLeft <= 60 ? "text-red-600" : "text-slate-600"}`}
                    >
                      Hết hạn trong: {Math.floor(otpTimeLeft / 60)}:
                      {String(otpTimeLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isVerifyingOTP || otp.length !== 6}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOTP ? "Đang xác thực..." : "Xác thực OTP"}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Không nhận được OTP?{" "}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="font-medium text-purple-600 hover:text-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Đang gửi..." : "Gửi lại"}
                    </button>
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowOTPVerification(false);
                    setOtp("");
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Quay lại đăng ký
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
