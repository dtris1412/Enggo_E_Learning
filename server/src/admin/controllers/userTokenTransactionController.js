import * as userTokenTransactionService from "../services/userTokenTransactionService.js";

// Get all transactions (admin)
export const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || "";

    const result = await userTokenTransactionService.getAllTransactions(
      page,
      limit,
      type,
    );

    res.status(200).json({
      success: true,
      message: "All transactions fetched successfully",
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

// Create transaction (admin)
export const createTransaction = async (req, res) => {
  try {
    const { userId, amount, transactionType, referenceId } = req.body;

    if (!userId || !amount || !transactionType) {
      return res.status(400).json({
        success: false,
        message: "userId, amount, and transactionType are required",
      });
    }

    const validTypes = ["subscription_grant", "usage", "purchase", "bonus"];
    if (!validTypes.includes(transactionType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transaction type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const transaction = await userTokenTransactionService.createTransaction(
      userId,
      amount,
      transactionType,
      referenceId || null,
    );

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get transaction summary (admin)
export const getTransactionSummary = async (req, res) => {
  try {
    const summary = await userTokenTransactionService.getTransactionSummary();

    res.status(200).json({
      success: true,
      message: "Transaction summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
