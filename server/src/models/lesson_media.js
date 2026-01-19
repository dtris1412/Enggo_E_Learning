import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Lesson_Media extends Model {
    static associate(models) {
      Lesson_Media.belongsTo(models.Lesson, {
        foreignKey: "lesson_id",
      });
    }
  }
  Lesson_Media.init(
    {
      media_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_index: { type: DataTypes.INTEGER, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      media_type: { type: DataTypes.STRING, allowNull: false },
      media_url: { type: DataTypes.STRING, allowNull: false },
      transcript: { type: DataTypes.TEXT, allowNull: true },

      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "lessons",
          key: "lesson_id",
        },
      },
    },
    {
      sequelize,
      modelName: "Lesson_Media",
      tableName: "lesson_medias",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Lesson_Media;
};
