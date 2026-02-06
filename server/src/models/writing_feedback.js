import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Writing_Feedback extends Model {
    static associate(models) {
      Writing_Feedback.belongsTo(models.Writing_Submission, {
        foreignKey: "submission_id",
      });
    }
  }
  Writing_Feedback.init(
    {
      writing_feedback_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      submission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "writing_submissions", key: "submission_id" },
      },
      model_name: { type: DataTypes.STRING, allowNull: false },
      overall_score: { type: DataTypes.FLOAT, allowNull: false },
      criteria_scores: { type: DataTypes.JSON, allowNull: false },
      comments: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Writing_Feedback",
      tableName: "writing_feedbacks",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Writing_Feedback;
};
