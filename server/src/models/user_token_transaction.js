import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Token_Transaction extends Model {
    static associate(models) {
      User_Token_Transaction.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  User_Token_Transaction.init(
    {
      transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      transaction_type: {
        type: DataTypes.ENUM(
          "subscription_grant",
          "usage",
          "purchase",
          "bonus",
        ),
        allowNull: false,
      },
      reference_id: { type: DataTypes.INTEGER, allowNull: true },

      created_at: { type: DataTypes.DATE, allowNull: false },
    },

    {
      sequelize,
      modelName: "User_Token_Transaction",
      tableName: "user_token_transactions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Token_Transaction;
};
