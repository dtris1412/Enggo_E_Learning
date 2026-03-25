import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.hasMany(models.Container_Question, {
        foreignKey: "question_id",
      });
      Question.hasMany(models.Exam_Question_Stat, {
        foreignKey: "question_id",
      });
    }
  }
  Question.init(
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_content: { type: DataTypes.TEXT, allowNull: false },
      explanation: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      question_type: {
        type: DataTypes.ENUM(
          "listening_photographs",
          "listening_question_response",
          "listening_conversation",
          "listening_talk",
          "reading_incomplete_sentences",
          "reading_text_completion",
          "reading_reading_comprehension",
          "reading_matching_headings",
          "reading_true_false_not_given",
          "reading_multiple_choice",
          "reading_matching_information",
          "reading_sentence_completion",
          "reading_summary_completion",
          "reading_short_answer",
          "writing_task_1",
          "writing_task_2",
          "speaking_part_1",
          "speaking_part_2",
          "speaking_part_3",
          "grammar",
          "vocabulary",
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "questions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Question;
};
