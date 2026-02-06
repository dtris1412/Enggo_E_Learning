import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Exam_Media extends Model {
    static associate(models) {
      Exam_Media.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
    }
  }
  Exam_Media.init(
    {
      media_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "exams", key: "exam_id" },
      },
      audio_url: { type: DataTypes.STRING, allowNull: false },
      duration: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Exam_Media",
      tableName: "exam_medias",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Exam_Media;
};
