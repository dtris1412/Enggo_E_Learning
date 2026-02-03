import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Part, {
        foreignKey: "part_id",
      });
      Question.belongsTo(models.Passage, {
        foreignKey: "passage_id",
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
      correct_answer: { type: DataTypes.TEXT, allowNull: false },
      explanation: { type: DataTypes.TEXT, allowNull: true },
      part_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "parts", key: "part_id" },
      },
      options: { type: DataTypes.JSON, allowNull: false },
      audio_url: { type: DataTypes.STRING, allowNull: true },
      image_url: { type: DataTypes.STRING, allowNull: true },
      passage_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "passages", key: "passage_id" },
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
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
