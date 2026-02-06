import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Writing_Submission extends Model {
    static associate(models) {
      Writing_Submission.belongsTo(models.User_Exam, {
        foreignKey: "user_exam_id",
      });
      Writing_Submission.belongsTo(models.Container_Question, {
        foreignKey: "container_question_id",
      });
      Writing_Submission.hasMany(models.Writing_Feedback, {
        foreignKey: "submission_id",
      });
    }
  }
  Writing_Submission.init(
    {
      submission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "user_exams", key: "user_exam_id" },
      },
      container_question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "container_questions",
          key: "container_question_id",
        },
      },
      content: { type: DataTypes.TEXT, allowNull: false },
      word_count: { type: DataTypes.INTEGER, allowNull: false },
      final_score: { type: DataTypes.FLOAT, allowNull: true },
      status: {
        type: DataTypes.ENUM("submitted", "graded", "revised"),
        allowNull: false,
      },
      submitted_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Writing_Submission",
      tableName: "writing_submissions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Writing_Submission;
};
