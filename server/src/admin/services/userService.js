import { where, Op } from "sequelize";
import db from "../../models/index.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
const getAllUsers = async () => {
  const users = await db.User.findAll();
  if (!users) return { success: false, message: "No users found" };
  return { success: true, data: users };
};
const getUserById = async (user_id) => {
  if (!user_id) return { success: false, message: "User ID is required" };
  const user = await db.User.findByPk(user_id);
  if (!user) return { success: false, message: "User not found" };
  return { success: true, data: user };
};
const createUser = async (
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
  if (!user_name || !user_email || !user_password) {
    return {
      success: false,
      message: "Username, email and password are required.",
    };
  }
  const existingUser = await db.User.findOne({
    where: { [Op.or]: [{ user_email }, { user_name }] },
  });
  if (existingUser) {
    return { success: false, message: "User already exists." };
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(user_password, SALT_ROUNDS);
  //Create new user
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
  return { success: true, message: "User created successfully", data: newUser };
};
const updateUserById = async (user_id, full_name, user_phone, user_address) => {
  if (!user_id) {
    return { success: false, message: "User ID is required" };
  }
  const user = await db.User.findByPk(user_id);
  if (!user) return { success: false, message: "User not found" };

  // Kiểm tra xem tài khoản có bị khóa không
  if (user.user_status === 0 || user.user_status === false) {
    return {
      success: false,
      message: "Cannot update locked account. Please unlock the account first.",
    };
  }

  const updateData = {
    full_name: full_name || user.full_name,
    user_phone: user_phone || user.user_phone,
    user_address: user_address || user.user_address,
    updated_at: new Date(),
  };
  await db.User.update(updateData, { where: { user_id } });
  const updateUser = await db.User.findByPk(user_id);
  return {
    success: true,
    message: "User updated successfully",
    data: updateUser,
  };
};
const updateUserStatusById = async (user_id, user_status) => {
  if (!user_id) {
    return { success: false, message: "User ID is required" };
  }
  const user = await db.User.findByPk(user_id);
  if (!user) return { success: false, message: "User not found" };
  const newStatus = user_status ? 1 : 0;
  await db.User.update(
    { user_status: newStatus, updated_at: new Date() },
    { where: { user_id } }
  );
  const updatedUser = await db.User.findByPk(user_id);
  return {
    success: true,
    message: "User status updated successfully",
    data: updatedUser,
  };
};
const getUsersPaginated = async (
  search = "",
  limit = 10,
  page = 1,
  role,
  user_status
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  // Xây dựng điều kiện where
  const whereConditions = {};

  // Search theo name, email, phone
  if (search) {
    whereConditions[Op.or] = [
      { user_name: { [Op.substring]: search } },
      { user_email: { [Op.substring]: search } },
      { user_phone: { [Op.substring]: search } },
    ];
  }

  // Filter theo role
  if (role !== undefined && role !== "") {
    whereConditions.role = Number(role);
  }

  // Filter theo user_status
  if (user_status !== undefined && user_status !== "") {
    whereConditions.user_status =
      user_status === "true" || user_status === true;
  }

  // Đếm tổng số users
  const totalUsers = await db.User.count({ where: whereConditions });
  // Lấy danh sách users
  const users = await db.User.findAll({
    where: whereConditions,
    limit: Number(limit),
    offset,
    order: [
      ["role", "ASC"],
      ["user_id", "ASC"],
    ],
  });

  return {
    success: true,
    users,
    total: totalUsers,
  };
};

const lockUser = async (user_id) => {
  if (!user_id) {
    return { success: false, message: "User ID is required" };
  }
  const user = await db.User.findByPk(user_id);
  if (!user) return { success: false, message: "User not found" };
  //Kiem tra user da bi khoa chua
  if (user.user_status === 0 || user.user_status === false) {
    return { success: false, message: "User is already locked" };
  }
  if (user.role === 1) {
    return { success: false, message: "Cannot lock an admin user" };
  }
  await db.User.update(
    { user_status: 0, updated_at: new Date() },
    { where: { user_id } }
  );
  const updatedUser = await db.User.findByPk(user_id);
  return {
    success: true,
    message: "User locked successfully",
    data: updatedUser,
  };
};
const unlockUser = async (user_id) => {
  if (!user_id) {
    return { success: false, message: "User ID is required" };
  }
  const user = await db.User.findByPk(user_id);
  if (!user) return { success: false, message: "User not found" };
  //Kiem tra user da mo khoa chua
  if (user.user_status === 1 || user.user_status === true) {
    return { success: false, message: "User is already unlocked" };
  }
  await db.User.update(
    { user_status: 1, updated_at: new Date() },
    { where: { user_id } }
  );
  const updatedUser = await db.User.findByPk(user_id);
  return {
    success: true,
    message: "User unlocked successfully",
    data: updatedUser,
  };
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserStatusById,
  lockUser,
  unlockUser,
  getUsersPaginated,
};
