import db from "../../models/index.js";

const { User_Token_Transaction, User } = db;

// Get user's transactions
export const getUserTransactions = async (
  userId,
  page = 1,
  limit = 10,
  type = "",
) => {
  try {
    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    if (type && type !== "") {
      where.transaction_type = type;
    }

    const { count, rows } = await User_Token_Transaction.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name"],
        },
      ],
      offset,
      limit,
      order: [["created_at", "DESC"]],
    });

    return {
      transactions: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching user transactions: ${error.message}`);
  }
};

// Get all transactions (admin)
export const getAllTransactions = async (page = 1, limit = 10, type = "") => {
  try {
    const offset = (page - 1) * limit;
    const where = {};

    if (type && type !== "") {
      where.transaction_type = type;
    }

    const { count, rows } = await User_Token_Transaction.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name", "user_email"],
        },
      ],
      offset,
      limit,
      order: [["created_at", "DESC"]],
    });

    return {
      transactions: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
};

// Get specific transaction
export const getTransactionById = async (transactionId) => {
  try {
    const transaction = await User_Token_Transaction.findByPk(transactionId, {
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "full_name", "user_email"],
        },
      ],
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  } catch (error) {
    throw new Error(`Error fetching transaction: ${error.message}`);
  }
};

// Create transaction
export const createTransaction = async (
  userId,
  amount,
  transactionType,
  referenceId = null,
  transaction = null,
) => {
  try {
    // Validate transaction type
    const validTypes = ["subscription_grant", "usage", "purchase", "bonus"];
    if (!validTypes.includes(transactionType)) {
      throw new Error(
        `Invalid transaction type. Must be one of: ${validTypes.join(", ")}`,
      );
    }

    const newTransaction = await User_Token_Transaction.create(
      {
        user_id: userId,
        amount,
        transaction_type: transactionType,
        reference_id: referenceId,
        created_at: new Date(),
      },
      { transaction },
    );

    return newTransaction;
  } catch (error) {
    throw new Error(`Error creating transaction: ${error.message}`);
  }
};

// Get transaction summary (admin) - stats by type
export const getTransactionSummary = async () => {
  try {
    const summary = await User_Token_Transaction.findAll({
      attributes: [
        "transaction_type",
        [db.sequelize.fn("COUNT", db.sequelize.col("transaction_id")), "count"],
        [db.sequelize.fn("SUM", db.sequelize.col("amount")), "total_amount"],
      ],
      group: ["transaction_type"],
      raw: true,
    });

    return summary;
  } catch (error) {
    throw new Error(`Error fetching transaction summary: ${error.message}`);
  }
};
