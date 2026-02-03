import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.belongsTo(models.Certificate, {
        foreignKey: "certificate_id",
      });
      Exam.hasMany(models.Passage, {
        foreignKey: "exam_id",
      });
    }
  }
  Exam.init(
    {
      exam_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_title: { type: DataTypes.STRING, allowNull: false },
      exam_duration: { type: DataTypes.INTEGER, allowNull: false },
      exam_code: { type: DataTypes.STRING, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      certificate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "certificates", key: "certificate_id" },
      },
      exam_type: { type: DataTypes.ENUM("TOEIC", "IELTS"), allowNull: false },
      source: { type: DataTypes.STRING, allowNull: true },
      total_questions: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Exam",
      tableName: "exams",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Exam;
};
