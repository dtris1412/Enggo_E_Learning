import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Course extends Model {
    static associate(models) {
      User_Course.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      User_Course.belongsTo(models.Course, {
        foreignKey: "course_id",
      });
    }
  }
  User_Course.init(
    {
      user_course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "courses", key: "course_id" },
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
      modelName: "User_Course",
      tableName: "user_courses",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Course;
};
