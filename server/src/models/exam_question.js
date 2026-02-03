import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Exam_Question extends Model {
    static associate(models) {
      Exam_Question.belongsTo(models.Question, {
        foreignKey: "question_id",
      });
      Exam_Question.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
      Exam_Question.belongsTo(models.Part, {
        foreignKey: "part_id",
      });
    }
  }
  Exam_Question.init(
    {
      exam_question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "questions", key: "question_id" },
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "exams", key: "exam_id" },
      },
      part_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "parts", key: "part_id" },
      },
      order_index: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Exam_Question",
      tableName: "exam_questions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Exam_Question;
};
