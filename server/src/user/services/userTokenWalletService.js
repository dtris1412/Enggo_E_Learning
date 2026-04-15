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

// Ensure wallet exists and grant initial tokens for subscription
export const ensureWalletWithTokens = async (userId, tokens) => {
  try {
    let wallet = await User_Token_Wallet.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      // Create new wallet with tokens
      wallet = await User_Token_Wallet.create({
        user_id: userId,
        token_balance: tokens,
        updated_at: new Date(),
      });
      console.log(
        `Created new wallet for user ${userId} with ${tokens} tokens`,
      );
    } else {
      // Add tokens to existing wallet
      wallet.token_balance = (wallet.token_balance || 0) + tokens;
      wallet.updated_at = new Date();
      await wallet.save();
      console.log(
        `Updated wallet for user ${userId}: added ${tokens} tokens (total: ${wallet.token_balance})`,
      );
    }

    return wallet;
  } catch (error) {
    console.error("Error ensuring wallet with tokens:", error);
    throw new Error(`Error ensuring wallet with tokens: ${error.message}`);
  }
};
