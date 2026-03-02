import * as userTokenWalletService from "../services/userTokenWalletService.js";

// Get current user's wallet
export const getUserWallet = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const wallet = await userTokenWalletService.getUserWallet(userId);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "User wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User wallet fetched successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
