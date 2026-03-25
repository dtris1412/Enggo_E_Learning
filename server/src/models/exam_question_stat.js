import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Exam_Question_Stat extends Model {
    static associate(models) {
      Exam_Question_Stat.belongsTo(models.Question, {
        foreignKey: "question_id",
      });
    }
  }
  Exam_Question_Stat.init(
    {
      exam_question_stats_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "questions", key: "question_id" },
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
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Exam_Question_Stat",
      tableName: "exam_question_stats",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Exam_Question_Stat;
};
