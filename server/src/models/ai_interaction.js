import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class AI_Interaction extends Model {
    static associate(models) {
      AI_Interaction.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      AI_Interaction.belongsTo(models.User_Exam, {
        foreignKey: "user_exam_id",
      });
      AI_Interaction.belongsTo(models.Container_Question, {
        foreignKey: "container_question_id",
      });
    }
  }
  AI_Interaction.init(
    {
      ai_interaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
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
      promt: { type: DataTypes.TEXT, allowNull: false },
      response: { type: DataTypes.TEXT, allowNull: false },
      model_name: { type: DataTypes.STRING, allowNull: false },
      token_usage: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "AI_Interaction",
      tableName: "ai_interactions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return AI_Interaction;
};
