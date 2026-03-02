import db from "../../config/connectDB.js";

const { User_Token_Wallet, User } = db;

// Get user's token wallet
export const getUserWallet = async (userId) => {
  try {
    const wallet = await User_Token_Wallet.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name", "user_email"],
        },
      ],
    });
    return wallet;
  } catch (error) {
    throw new Error(`Error fetching user wallet: ${error.message}`);
  }
};

// Get all wallets (admin)
export const getAllWallets = async (page = 1, limit = 10, search = "") => {
  try {
    const offset = (page - 1) * limit;
    const where = search
      ? {
          [db.Sequelize.Op.or]: [
            db.sequelize.where(
              db.sequelize.col("User.user_name"),
              db.Sequelize.Op.like,
              `%${search}%`,
            ),
            db.sequelize.where(
              db.sequelize.col("User.full_name"),
              db.Sequelize.Op.like,
              `%${search}%`,
            ),
          ],
        }
      : {};

    const { count, rows } = await User_Token_Wallet.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name", "user_email"],
        },
      ],
      offset,
      limit,
      order: [["wallet_id", "DESC"]],
    });

    return {
      wallets: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching wallets: ${error.message}`);
  }
};

// Create wallet for new user
export const createUserWallet = async (userId) => {
  try {
    const wallet = await User_Token_Wallet.create({
      user_id: userId,
      token_balance: 0,
      updated_at: new Date(),
    });
    return wallet;
  } catch (error) {
    throw new Error(`Error creating user wallet: ${error.message}`);
  }
};

// Update wallet balance
export const updateWalletBalance = async (walletId, newBalance) => {
  try {
    const wallet = await User_Token_Wallet.findByPk(walletId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.token_balance = newBalance;
    wallet.updated_at = new Date();
    await wallet.save();
    return wallet;
  } catch (error) {
    throw new Error(`Error updating wallet: ${error.message}`);
  }
};

// Add tokens to wallet
export const addTokensToWallet = async (userId, amount) => {
  try {
    const wallet = await User_Token_Wallet.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new Error("Wallet not found for user");
    }

    wallet.token_balance += amount;
    wallet.updated_at = new Date();
    await wallet.save();
    return wallet;
  } catch (error) {
    throw new Error(`Error adding tokens: ${error.message}`);
  }
};

// Deduct tokens from wallet
export const deductTokensFromWallet = async (userId, amount) => {
  try {
    const wallet = await User_Token_Wallet.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new Error("Wallet not found for user");
    }

    if (wallet.token_balance < amount) {
      throw new Error("Insufficient token balance");
    }

    wallet.token_balance -= amount;
    wallet.updated_at = new Date();
    await wallet.save();
    return wallet;
  } catch (error) {
    throw new Error(`Error deducting tokens: ${error.message}`);
  }
};
