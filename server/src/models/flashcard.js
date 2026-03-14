import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Flashcard extends Model {
    static associate(models) {
      Flashcard.belongsTo(models.Flashcard_Set, {
        foreignKey: "flashcard_set_id",
      });
      Flashcard.belongsTo(models.Container_Question, {
        foreignKey: "container_question_id",
      });
      Flashcard.hasMany(models.User_Flashcard_Progress, {
        foreignKey: "flashcard_id",
      });
    }
  }
  Flashcard.init(
    {
      flashcard_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      flashcard_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flashcard_sets", key: "flashcard_set_id" },
      },
      container_question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "container_questions",
          key: "container_question_id",
        },
      },
      front_content: { type: DataTypes.STRING, allowNull: false },
      back_content: { type: DataTypes.STRING, allowNull: false },
      example: { type: DataTypes.TEXT, allowNull: true },
      difficulty_level: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      pronunciation: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Flashcard",
      tableName: "flashcards",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Flashcard;
};
