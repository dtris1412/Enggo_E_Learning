import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Subscription_Plan extends Model {
    static associate(models) {
      Subscription_Plan.hasMany(models.Subscription_Price, {
        foreignKey: "subscription_plan_id",
      });
    }
  }
  Subscription_Plan.init(
    {
      subscription_plan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      features: { type: DataTypes.JSON, allowNull: true },
      monthly_ai_token_quota: { type: DataTypes.INTEGER, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Subscription_Plan",
      tableName: "subscription_plans",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Subscription_Plan;
};
