import * as userTokenTransactionService from "../services/userTokenTransactionService.js";

// Get current user's transactions
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || "";

    const result = await userTokenTransactionService.getUserTransactions(
      userId,
      page,
      limit,
      type,
    );

    res.status(200).json({
      success: true,
      message: "User transactions fetched successfully",
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get specific transaction
export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction =
      await userTokenTransactionService.getTransactionById(transactionId);

    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
