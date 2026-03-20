import db from "../../models/index.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Lấy thông tin profile của user
const getUserProfile = async (user_id) => {
  if (!user_id) {
    return { success: false, message: "User ID is required." };
  }

  const user = await db.User.findByPk(user_id, {
    attributes: [
      "user_id",
      "user_name",
      "user_email",
      "full_name",
      "user_phone",
      "user_address",
      "avatar",
      "user_status",
      "role",
      "created_at",
      "updated_at",
    ],
  });

  if (!user) {
    return { success: false, message: "User not found." };
  }

  return { success: true, data: user };
};

// Cập nhật thông tin profile của user
const updateUserProfile = async (
  user_id,
  full_name,
  user_phone,
  user_address,
  avatar,
) => {
  if (!user_id) {
    return { success: false, message: "User ID is required." };
  }

  const user = await db.User.findByPk(user_id);
  if (!user) {
    return { success: false, message: "User not found." };
  }

  // Kiểm tra xem tài khoản có bị khóa không
  if (user.user_status === 0 || user.user_status === false) {
    return {
      success: false,
      message: "Your account is locked. Please contact administrator.",
    };
  }

  const updateData = {
    updated_at: new Date(),
  };

  // Chỉ cập nhật các field được gửi lên
  if (full_name !== undefined) {
    updateData.full_name = full_name;
  }
  if (user_phone !== undefined) {
    updateData.user_phone = user_phone;
  }
  if (user_address !== undefined) {
    updateData.user_address = user_address;
  }
  if (avatar !== undefined) {
    updateData.avatar = avatar;
  }

  await db.User.update(updateData, { where: { user_id } });

  const updatedUser = await db.User.findByPk(user_id, {
    attributes: [
      "user_id",
      "user_name",
      "user_email",
      "full_name",
      "user_phone",
      "user_address",
      "avatar",
      "user_status",
      "role",
      "created_at",
      "updated_at",
    ],
  });

  return {
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  };
};

// Đổi mật khẩu
const changePassword = async (user_id, current_password, new_password) => {
  if (!user_id) {
    return { success: false, message: "User ID is required." };
  }

  if (!current_password || !new_password) {
    return {
      success: false,
      message: "Current password and new password are required.",
    };
  }

  // Validate new password length
  if (new_password.length < 6) {
    return {
      success: false,
      message: "New password must be at least 6 characters.",
    };
  }

  const user = await db.User.findByPk(user_id);
  if (!user) {
    return { success: false, message: "User not found." };
  }

  // Kiểm tra xem tài khoản có bị khóa không
  if (user.user_status === 0 || user.user_status === false) {
    return {
      success: false,
      message: "Your account is locked. Please contact administrator.",
    };
  }

  // Kiểm tra current password
  const isPasswordValid = await bcrypt.compare(
    current_password,
    user.user_password,
  );
  if (!isPasswordValid) {
    return { success: false, message: "Current password is incorrect." };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);

  // Cập nhật password
  await db.User.update(
    {
      user_password: hashedPassword,
      updated_at: new Date(),
    },
    { where: { user_id } },
  );

  return {
    success: true,
    message: "Password changed successfully",
  };
};

export { getUserProfile, updateUserProfile, changePassword };
