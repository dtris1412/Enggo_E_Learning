import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Lesson_Questions extends Model {
    static associate(models) {
      Lesson_Questions.belongsTo(models.Lesson, {
        foreignKey: "lesson_id",
      });
    }
  }
  Lesson_Questions.init(
    {
      lesson_question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_index: { type: DataTypes.INTEGER, allowNull: true },
      lesson_question_type: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      correct_answer: { type: DataTypes.STRING, allowNull: false },
      explaination: { type: DataTypes.TEXT, allowNull: true },
      difficulty_level: { type: DataTypes.STRING, allowNull: false },
      generate_by_ai: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "lessons",
          key: "lesson_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      options: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ai_model: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      modelName: "Lesson_Questions",
      tableName: "lesson_questions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Lesson_Questions;
};
