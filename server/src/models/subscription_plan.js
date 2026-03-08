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
      features: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("features");
          if (!rawValue) return {};
          if (typeof rawValue === "object") return rawValue;
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            console.error("Error parsing features JSON:", e);
            return {};
          }
        },
        set(value) {
          if (typeof value === "string") {
            this.setDataValue("features", value);
          } else {
            this.setDataValue("features", JSON.stringify(value));
          }
        },
      },
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
