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

/**
 * Add tokens to user wallet
 * @param {number} userId - User ID
 * @param {number} amount - Amount of tokens to add
 * @param {object} transaction - Sequelize transaction (optional)
 */
export const addTokensToWallet = async (userId, amount, transaction = null) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Find or create wallet
    let wallet = await db.User_Token_Wallet.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (!wallet) {
      // Create new wallet if doesn't exist
      wallet = await db.User_Token_Wallet.create(
        {
          user_id: userId,
          token_balance: amount,
          updated_at: new Date(),
        },
        { transaction },
      );
    } else {
      // Update existing wallet
      await wallet.update(
        {
          token_balance: wallet.token_balance + amount,
          updated_at: new Date(),
        },
        { transaction },
      );
    }

    return wallet;
  } catch (error) {
    throw new Error(`Error adding tokens to wallet: ${error.message}`);
  }
};

export default {
  getUserTokenWalletByUserId,
  createUserTokenWallet,
  addTokensToWallet,
};
