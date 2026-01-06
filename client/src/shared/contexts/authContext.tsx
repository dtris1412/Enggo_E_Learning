import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface User {
  user_id: number;
  user_name: string;
  full_name?: string;
  user_email: string;
  user_phone?: string;
  user_address?: string;
  avatar?: string;
  role: number;
  user_level?: string;
  user_status: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    user_name: string,
    user_password: string,
    remember?: boolean
  ) => Promise<{ success: boolean; message: string; role?: number }>;
  register: (
    user_name: string,
    user_email: string,
    user_password: string,
    full_name?: string,
    user_phone?: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (
    user_email: string
  ) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (
    user_email: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    user_name: string,
    user_email: string,
    otp: string,
    new_password: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  setAuthData: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    user_name: string,
    user_password: string,
    remember: boolean = false
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ user_name, user_password, remember }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("accessToken", data.accessToken);
        return {
          success: true,
          message: data.message || "Đăng nhập thành công!",
          role: data.user.role,
        };
      } else {
        return {
          success: false,
          message: data.message || "Đăng nhập thất bại!",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  };

  const register = async (
    user_name: string,
    user_email: string,
    user_password: string,
    full_name?: string,
    user_phone?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name,
          user_email,
          user_password,
          full_name,
          user_phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          message: data.message || "Đăng ký thành công!",
        };
      } else {
        return { success: false, message: data.message || "Đăng ký thất bại!" };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  };

  const forgotPassword = async (
    user_email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email }),
      });

      const data = await response.json();
      return {
        success: data.success,
        message: data.message || "Đã gửi OTP đến email!",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  };

  const verifyOTP = async (
    user_email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email, otp }),
      });

      const data = await response.json();
      return {
        success: data.success,
        message: data.message || "Xác thực OTP thành công!",
      };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  };

  const resetPassword = async (
    user_name: string,
    user_email: string,
    otp: string,
    new_password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name, user_email, otp, new_password }),
      });

      const data = await response.json();
      return {
        success: data.success,
        message: data.message || "Đặt lại mật khẩu thành công!",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại!" };
    }
  };

  const loginWithGoogle = () => {
    // Save current location for redirect after login (except login/register pages)
    const currentPath = window.location.pathname;
    const authPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/verify-otp",
      "/reset-password",
    ];

    if (!authPages.includes(currentPath)) {
      sessionStorage.setItem("redirectAfterLogin", currentPath);
    }

    window.location.href = `${apiUrl}/auth/google`;
  };

  const loginWithFacebook = () => {
    // Save current location for redirect after login (except login/register pages)
    const currentPath = window.location.pathname;
    const authPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/verify-otp",
      "/reset-password",
    ];

    if (!authPages.includes(currentPath)) {
      sessionStorage.setItem("redirectAfterLogin", currentPath);
    }

    window.location.href = `${apiUrl}/auth/facebook`;
  };

  const setAuthData = useCallback((userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    verifyOTP,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    setAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
