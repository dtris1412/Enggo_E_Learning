import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Subscription_Price extends Model {
    static associate(models) {
      Subscription_Price.belongsTo(models.Subscription_Plan, {
        foreignKey: "subscription_plan_id",
      });
      Subscription_Price.hasMany(models.User_Subscription, {
        foreignKey: "subscription_price_id",
      });
    }
  }
  Subscription_Price.init(
    {
      subscription_price_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subscription_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "subscription_plan_id",
        },
      },
      billing_type: {
        type: DataTypes.ENUM("monthly", "yearly", "weekly"),
        allowNull: false,
      },
      duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Subscription_Price",
      tableName: "subscription_prices",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Subscription_Price;
};
