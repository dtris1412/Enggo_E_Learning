import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Roadmap extends Model {
    static associate(models) {
      User_Roadmap.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      User_Roadmap.belongsTo(models.Roadmap, {
        foreignKey: "roadmap_id",
        as: "roadmap",
      });
    }
  }
  User_Roadmap.init(
    {
      user_roadmap_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      roadmap_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "roadmaps", key: "roadmap_id" },
      },
      started_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      progress_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User_Roadmap",
      tableName: "user_roadmaps",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Roadmap;
};
