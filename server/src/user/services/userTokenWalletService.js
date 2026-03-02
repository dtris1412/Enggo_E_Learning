import db from "../../models/index.js";

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
