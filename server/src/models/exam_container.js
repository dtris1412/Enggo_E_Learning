import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Exam_Container extends Model {
    static associate(models) {
      Exam_Container.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
      Exam_Container.hasMany(models.Container_Question, {
        foreignKey: "container_id",
      });
    }
  }
  Exam_Container.init(
    {
      container_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "exams", key: "exam_id" },
      },
      skill: {
        type: DataTypes.ENUM("listening", "reading", "writing", "speaking"),
      },
      type: {
        type: DataTypes.ENUM(
          "toeic_group",
          "toeic_single",
          "ielts_passage",
          "writing_task",
          "speaking_part",
        ),
        allowNull: false,
      },
      order: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      instruction: { type: DataTypes.TEXT, allowNull: true },
      image_url: { type: DataTypes.STRING, allowNull: true },
      audio_url: { type: DataTypes.STRING, allowNull: true },
      time_limit: { type: DataTypes.INTEGER, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Exam_Container",
      tableName: "exam_containers",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Exam_Container;
};
