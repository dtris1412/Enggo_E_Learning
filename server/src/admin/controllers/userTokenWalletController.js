import * as userTokenWalletService from "../services/userTokenWalletService.js";

// Get all wallets (admin)
export const getAllWallets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await userTokenWalletService.getAllWallets(
      page,
      limit,
      search,
    );

    res.status(200).json({
      success: true,
      message: "All wallets fetched successfully",
      data: result.wallets,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update wallet balance (admin)
export const updateWalletBalance = async (req, res) => {
  try {
    const { walletId } = req.params;
    const { balance } = req.body;

    if (balance < 0) {
      return res.status(400).json({
        success: false,
        message: "Balance cannot be negative",
      });
    }

    const wallet = await userTokenWalletService.updateWalletBalance(
      walletId,
      balance,
    );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wallet balance updated successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add tokens to wallet (admin)
export const addTokens = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "userId and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const wallet = await userTokenWalletService.addTokensToWallet(
      userId,
      amount,
    );

    res.status(200).json({
      success: true,
      message: "Tokens added successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Deduct tokens from wallet (admin)
export const deductTokens = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "userId and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const wallet = await userTokenWalletService.deductTokensFromWallet(
      userId,
      amount,
    );

    res.status(200).json({
      success: true,
      message: "Tokens deducted successfully",
      data: wallet,
    });
  } catch (error) {
    if (error.message.includes("Insufficient")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
