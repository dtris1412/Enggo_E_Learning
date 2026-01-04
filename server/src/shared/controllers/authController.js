import {
  register as registerService,
  login as loginService,
} from "../services/authService.js";

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
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in login controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { register, login };
