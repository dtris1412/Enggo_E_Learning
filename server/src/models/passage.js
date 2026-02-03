import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Passage extends Model {
    static associate(models) {
      Passage.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
      Passage.belongsTo(models.Part, {
        foreignKey: "part_id",
      });
      Passage.hasMany(models.Question, {
        foreignKey: "passage_id",
      });
    }
  }
  Passage.init(
    {
      passage_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "exams", key: "exam_id" },
      },
      part_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "parts", key: "part_id" },
      },
      passage_content: { type: DataTypes.TEXT, allowNull: false },
      audio_url: { type: DataTypes.STRING, allowNull: true },
      image_url: { type: DataTypes.STRING, allowNull: true },
      passage_type: {
        type: DataTypes.ENUM(
          "AUDIO_SINGLE",
          "TEXT_SINGLE",
          "TEXT_DOUBLE",
          "TEXT_TRIPLE",
          "ACADEMIC_LONG_TEXT",
          "GENERAL_SHORT_TEXT",
          "CONVERSATION",
          "MONOLOGUE",
        ),
        allowNull: false,
      },
      order_index: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Passage",
      tableName: "passages",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Passage;
};
