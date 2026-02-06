import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Speaking_Record extends Model {
    static associate(models) {
      Speaking_Record.belongsTo(models.User_Exam, {
        foreignKey: "user_exam_id",
      });
      Speaking_Record.belongsTo(models.Container_Question, {
        foreignKey: "container_question_id",
      });
      Speaking_Record.hasMany(models.Speaking_Feedback, {
        foreignKey: "record_id",
      });
    }
  }
  Speaking_Record.init(
    {
      record_id: {
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
      audio_url: { type: DataTypes.STRING, allowNull: false },
      duration: { type: DataTypes.INTEGER, allowNull: false },
      submitted_at: { type: DataTypes.DATE, allowNull: false },
      final_score: { type: DataTypes.FLOAT, allowNull: true },
    },
    {
      sequelize,
      modelName: "Speaking_Record",
      tableName: "speaking_records",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Speaking_Record;
};
