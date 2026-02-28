import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Token_Wallet extends Model {
    static associate(models) {
      User_Token_Wallet.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  User_Token_Wallet.init(
    {
      wallet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      token_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "User_Token_Wallet",
      tableName: "user_token_wallets",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Token_Wallet;
};
