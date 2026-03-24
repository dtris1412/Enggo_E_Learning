import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class System_AI_Quota extends Model {
    static associate(models) {}
  }
  System_AI_Quota.init(
    {
      quota_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      open_ai_credit: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      system_open_ai_token: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ai_token_unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500,
      },
      ai_token_totals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ai_token_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      buffer_percent: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 20,
      },
      price_per_milion: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "System_AI_Quota",
      tableName: "system_ai_quotas",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return System_AI_Quota;
};
