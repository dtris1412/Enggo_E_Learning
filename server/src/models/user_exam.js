import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Exam extends Model {
    static associate(models) {
      User_Exam.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      User_Exam.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
      User_Exam.hasMany(models.User_Answer, {
        foreignKey: "user_exam_id",
      });
      User_Exam.hasMany(models.Writing_Submission, {
        foreignKey: "user_exam_id",
      });
      User_Exam.hasMany(models.Speaking_Record, {
        foreignKey: "user_exam_id",
      });
      User_Exam.hasMany(models.AI_Interaction, {
        foreignKey: "user_exam_id",
      });
    }
  }
  User_Exam.init(
    {
      user_exam_id: {
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
      selected_parts: { type: DataTypes.JSON, allowNull: false },
      started_at: { type: DataTypes.DATE, allowNull: false },
      submitted_at: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM("submitted", "graded", "revised"),
        allowNull: false,
      },
      total_score: { type: DataTypes.FLOAT, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "User_Exam",
      tableName: "user_exams",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Exam;
};
