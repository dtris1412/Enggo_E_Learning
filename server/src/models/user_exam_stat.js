import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Exam_Stat extends Model {
    static associate(models) {
      User_Exam_Stat.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      User_Exam_Stat.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
    }
  }
  User_Exam_Stat.init(
    {
      user_exam_stats_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "exams", key: "exam_id" },
      },
      total_correct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_wrong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      weakness_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "User_Exam_Stat",
      tableName: "user_exam_stats",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Exam_Stat;
};
