import {
  register as registerService,
  login as loginService,
  refreshToken as refreshTokenService,
  logout as logoutService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  verifyOTP as verifyOTPService,
} from "../services/authService.js";
import jwt from "jsonwebtoken";
const forgotPassword = async (req, res) => {
  try {
    const { user_email } = req.body;
    const result = await forgotPasswordService(user_email);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in forgot password controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { user_email, otp } = req.body;
    const result = await verifyOTPService(user_email, otp);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in verify OTP controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { user_name, user_email, otp, new_password } = req.body;
    const result = await resetPasswordService(
      user_name,
      user_email,
      otp,
      new_password,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in reset password controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await refreshTokenService(refreshToken);
    if (!result.success) {
      return res.status(401).json(result);
    }
    res.status(200).json({ accessToken: result.accessToken });
  } catch (err) {
    console.error("Error in refresh token controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const { user_name, user_email, user_password } = req.body;
    const result = await registerService(user_name, user_email, user_password);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in register controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const { user_name, user_password, remember } = req.body;
    const result = await loginService(user_name, user_password);
    if (!result.success) {
      return res.status(401).json(result);
    }
    //Set refresh token vào cookie http-Only
    //Nếu remember = true, cookie tồn tại 7 ngày. Nếu không, cookie chỉ tồn tại trong session (xóa khi đóng browser)
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    if (remember) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    }

    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    //trả access token và user về client

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (err) {
    console.error("Error in login controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    //xóa cookie refresh token ở client
    res.clearCookie("refreshToken");
    const result = await logoutService();
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in logout controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const socialLoginCallBack = (req, res) => {
  try {
    const user = req.user;
    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Redirect to frontend callback with token and user data
    const frontendUrl =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "http://localhost:8080"
        : "http://localhost:5173";

    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(
      `${frontendUrl}/auth/callback?token=${accessToken}&user=${userData}`,
    );
  } catch (err) {
    console.error("Error in social login callback controller:", err);
    const frontendUrl =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "http://localhost:8080"
        : "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=social_login_failed`);
  }
};

export {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  socialLoginCallBack,
};
