import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Lesson_Progress extends Model {
    static associate(models) {
      User_Lesson_Progress.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      User_Lesson_Progress.belongsTo(models.Lesson, {
        foreignKey: "lesson_id",
        as: "lesson",
      });
    }
  }
  User_Lesson_Progress.init(
    {
      user_lesson_progress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "lessons", key: "lesson_id" },
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
      modelName: "User_Lesson_Progress",
      tableName: "user_lesson_progress",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Lesson_Progress;
};
