import db from "../../models/index.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9,11}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
const SALT_ROUDS = 10;

const register = async (
  user_name,
  user_email,
  user_password,
  full_name,
  user_phone,
  user_address,
  avatar,
  user_status,
  role
) => {
  //Kiểm tra dữ liệu bắt buộc
  if (!user_name || !user_email || !user_password) {
    return {
      success: false,
      message: "Username, email and password are required.",
    };
  }
  //Kiểm tra định dạng email
  if (!emailRegex.test(user_email)) {
    return {
      success: false,
      message: "Invalid email format.",
    };
  }
  if (!passwordRegex.test(user_password)) {
    return {
      success: false,
      message:
        "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.",
    };
  }
  //kiểm tra đã tồn tại
  const existingUser = await db.User.findOne({
    where: {
      [Op.or]: [{ user_name }, { user_email }],
    },
  });
  if (existingUser) {
    return {
      success: false,
      message: "Username or email already exists.",
    };
  }
  //Mã hóa mật khẩu (hash password)
  const hashedPassword = await bcrypt.hash(user_password, SALT_ROUDS);

  //Tạo user mới
  const newUser = await db.User.create({
    user_name,
    user_email,
    user_password: hashedPassword,
    full_name,
    user_phone,
    user_address,
    avatar: avatar || null,
    user_status: user_status !== undefined ? user_status : true,
    role: role || 2,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const token = jwt.sign(
    { user_id: newUser.user_id, roles: newUser.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "7h" }
  );

  return {
    success: true,
    message: "User created successfully",
    user: newUser,
    token,
  };
};

const login = async (user_name, user_password) => {
  console.log("AuthService login called with:", user_name);
  const user = await db.User.findOne({ where: { user_name } });
  if (!user) return { success: false, message: "User not found" };
  //Kiểm tra mật khẩu
  const isMatchPassword = await bcrypt.compare(
    user_password,
    user.user_password
  );
  if (!isMatchPassword)
    return { success: false, message: "Incorrect password" };
  //Kiểm tra trạng thái user
  if (!user.user_status) {
    return {
      success: false,
      message: "User account is deactivated. Please contact support.",
    };
  }
  console.log("User found and password is valid:", user.user_name);

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7h" }
  );
  return {
    success: true,
    message: "Login successful",
    user,
    token,
  };
};
export { register, login };
