import {
  getUserProfile as getUserProfileService,
  updateUserProfile as updateUserProfileService,
  changePassword as changePasswordService,
} from "../services/userService.js";

// Lấy thông tin profile của user đang đăng nhập
const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await getUserProfileService(user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in get user profile controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Cập nhật thông tin profile của user
const updateUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { full_name, user_phone, user_address, avatar } = req.body;

    const result = await updateUserProfileService(
      user_id,
      full_name,
      user_phone,
      user_address,
      avatar,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in update user profile controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { current_password, new_password } = req.body;

    const result = await changePasswordService(
      user_id,
      current_password,
      new_password,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in change password controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { getUserProfile, updateUserProfile, changePassword };
