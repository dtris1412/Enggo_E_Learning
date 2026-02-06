import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Speaking_Feedback extends Model {
    static associate(models) {
      Speaking_Feedback.belongsTo(models.Speaking_Record, {
        foreignKey: "record_id",
      });
    }
  }
  Speaking_Feedback.init(
    {
      speaking_feedback_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "speaking_records", key: "record_id" },
      },
      model_name: { type: DataTypes.STRING, allowNull: false },
      overall_score: { type: DataTypes.FLOAT, allowNull: false },
      criteria_scores: { type: DataTypes.JSON, allowNull: false },
      comments: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Speaking_Feedback",
      tableName: "speaking_feedbacks",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Speaking_Feedback;
};
