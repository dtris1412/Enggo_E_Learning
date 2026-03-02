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
