import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Order.belongsTo(models.Subscription_Price, {
        foreignKey: "subscription_price_id",
      });
      Order.hasOne(models.User_Subscription, {
        foreignKey: "order_id",
      });
      Order.hasMany(models.Payment, {
        foreignKey: "order_id",
      });
    }
  }
  Order.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      subscription_price_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_prices",
          key: "subscription_price_id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Order;
};
