import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Module_Lesson extends Model {
    static associate(models) {
      Module_Lesson.belongsTo(models.Module, {
        foreignKey: "module_id",
      });
      Module_Lesson.belongsTo(models.Lesson, {
        foreignKey: "lesson_id",
      });
    }
  }
  Module_Lesson.init(
    {
      module_lesson_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "modules",
          key: "module_id",
        },
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "lessons",
          key: "lesson_id",
        },
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      order_index: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.BOOLEAN, allowNull: false },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Module_Lesson",
      tableName: "module_lessons",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Module_Lesson;
};
