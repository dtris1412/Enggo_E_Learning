import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/authContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        // Navigate to OTP verification page with email
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Quên mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập email của bạn để nhận mã OTP
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Nhập email của bạn"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
