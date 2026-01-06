import {
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
  createUser as createUserService,
  updateUserById as updateUserByIdService,
  updateUserStatusById as updateUserStatusByIdService,
  getUsersPaginated as getUsersPaginatedService,
  lockUser as lockUserService,
  unlockUser as unlockUserService,
} from "../services/userService.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    if (!users.success) {
      return res.status(400).json(users);
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error in get all users controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await getUserByIdService(user_id);
    if (!user.success) {
      return res.status(400).json(user);
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in get user by id controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const createUser = async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_password,
      full_name,
      user_phone,
      user_address,
      avatar,
      user_status,
      role,
    } = req.body;
    const newUser = await createUserService(
      user_name,
      user_email,
      user_password,
      full_name,
      user_phone,
      user_address,
      avatar,
      user_status,
      role
    );
    if (!newUser.success) {
      return res.status(400).json(newUser);
    }
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error in create user controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { full_name, user_phone, user_address } = req.body;
    const updatedUser = await updateUserByIdService(
      user_id,
      full_name,
      user_phone,
      user_address
    );
    if (!updatedUser.success) {
      return res.status(400).json(updatedUser);
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error in update user by id controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateUserStatusById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { user_status } = req.body;
    const updatedUserStatus = await updateUserStatusByIdService(
      user_id,
      user_status
    );
    if (!updatedUserStatus.success) {
      return res.status(400).json(updatedUserStatus);
    }
    res.status(200).json(updatedUserStatus);
  } catch (err) {
    console.error("Error in update user status by id controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getUsersPaginated = async (req, res) => {
  try {
    const { search = "", limit = 10, page = 1, role, user_status } = req.query;
    const result = await getUsersPaginatedService(
      search,
      limit,
      page,
      role,
      user_status
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in get users paginated controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const lockUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const result = await lockUserService(user_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in lock user controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const unlockUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const result = await unlockUserService(user_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in lock user controller:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
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
