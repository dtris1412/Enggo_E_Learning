import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../shared/contexts/authContext";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { forgotPassword, verifyOTP } = useAuth();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all filled
    if (index === 5 && value && newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();

    // Auto submit if all filled
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setIsLoading(true);
    setError("");

    try {
      if (otpCode.length !== 6) {
        setError("Vui lòng nhập đủ 6 số!");
        setIsLoading(false);
        return;
      }

      // Verify OTP with backend
      const result = await verifyOTP(email, otpCode);

      if (result.success) {
        // Navigate to reset password with email and OTP
        navigate(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${otpCode}`
        );
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đủ 6 số!");
      return;
    }

    handleVerify(otpCode);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        alert("Mã OTP mới đã được gửi đến email của bạn!");
        // Reset OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Không thể gửi lại OTP. Vui lòng thử lại!");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Xác thực OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập mã OTP đã được gửi đến email
        </p>
        <p className="mt-1 text-center text-sm font-medium text-blue-600">
          {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 rounded-lg shadow-lg sm:px-10 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Mã OTP (6 số)
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.some((digit) => !digit)}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? "Đang xác thực..." : "Xác nhận"}
              </button>
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Không nhận được mã?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? "Đang gửi..." : "Gửi lại"}
                </button>
              </p>

              <Link
                to="/forgot-password"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Thay đổi email
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
