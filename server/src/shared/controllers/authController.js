import {
  register as registerService,
  login as loginService,
  refreshToken as refreshTokenService,
} from "../services/authService.js";

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
    const { user_name, user_password } = req.body;
    const result = await loginService(user_name, user_password);
    if (!result.success) {
      return res.status(401).json(result);
    }
    //Set refresh token vào cookie http-Only
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
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

export { register, login, refreshToken };
