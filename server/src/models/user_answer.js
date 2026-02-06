import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Answer extends Model {
    static associate(models) {
      User_Answer.belongsTo(models.User_Exam, {
        foreignKey: "user_exam_id",
      });
      User_Answer.belongsTo(models.Container_Question, {
        foreignKey: "container_question_id",
      });
      User_Answer.belongsTo(models.Question_Option, {
        foreignKey: "question_option_id",
      });
    }
  }
  User_Answer.init(
    {
      user_answer_id: {
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
      question_option_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "question_options", key: "question_option_id" },
      },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "User_Answer",
      tableName: "user_answers",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Answer;
};
