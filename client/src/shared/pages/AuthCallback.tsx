import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useToast } from "../components/Toast/Toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthData } = useAuth();
  const { showToast } = useToast();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent processing multiple times
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      // Redirect to login with error
      navigate("/login?error=" + error);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", token);

        // Update auth context
        if (setAuthData) {
          setAuthData(user, token);
        }

        // Show success toast
        showToast("success", "Đăng nhập thành công!");

        // Get redirect path from sessionStorage or default to home
        let redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");

        // Prevent redirecting back to auth pages
        const authPages = [
          "/login",
          "/register",
          "/forgot-password",
          "/verify-otp",
          "/reset-password",
          "/auth/callback",
        ];
        if (authPages.includes(redirectPath)) {
          redirectPath = "/";
        }

        // Redirect to previous page or home
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error("Error parsing auth callback data:", err);
        navigate("/login?error=invalid_callback_data");
      }
    } else {
      // Missing required params
      navigate("/login?error=missing_auth_data");
    }
  }, [searchParams, navigate, setAuthData, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
