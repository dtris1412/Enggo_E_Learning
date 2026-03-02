import db from "../../models/index.js";

// Lấy user token wallet theo user_id

const getUserTokenWalletByUserId = async (user_id) => {
  if (!user_id) {
    return { success: false, message: "User ID is required." };
  }
  const userTokenWallet = await db.User_Token_Wallet.findOne({
    where: { user_id },
  });
  if (!userTokenWallet) {
    return {
      success: false,
      message: "User token wallet not found for the given user ID.",
    };
  }
  return { success: true, data: userTokenWallet };
};

const createUserTokenWallet = async (user_id, token_balance, updated_at) => {
  if (!user_id) {
    return { success: false, message: "User ID is required." };
  }
  const existingWallet = await db.User_Token_Wallet.findOne({
    where: { user_id },
  });
  if (existingWallet) {
    return {
      success: false,
      message: "User token wallet already exists for the given user ID.",
    };
  }
  const newWallet = await db.User_Token_Wallet.create({
    user_id,
    token_balance,
    updated_at: updated_at || new Date(),
  });
  return { success: true, data: newWallet };
};
