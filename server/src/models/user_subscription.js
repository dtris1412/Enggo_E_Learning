import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Subscription extends Model {
    static associate(models) {
      User_Subscription.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      User_Subscription.belongsTo(models.Subscription_Price, {
        foreignKey: "subscription_price_id",
      });
      User_Subscription.belongsTo(models.Order, {
        foreignKey: "order_id",
      });
    }
  }
  User_Subscription.init(
    {
      user_subscription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      subscription_price_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_prices",
          key: "subscription_price_id",
        },
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "orders",
          key: "order_id",
        },
      },
      started_at: { type: DataTypes.DATE, allowNull: false },
      expired_at: { type: DataTypes.DATE, allowNull: true },
      status: {
        type: DataTypes.ENUM("active", "expired", "canceled"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "User_Subscription",
      tableName: "user_subscriptions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Subscription;
};
