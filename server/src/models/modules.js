import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      Module.belongsTo(models.Course, {
        foreignKey: "course_id",
      });
      Module.hasMany(models.Module_Lesson, {
        foreignKey: "module_id",
      });
    }
  }
  Module.init(
    {
      module_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      module_title: { type: DataTypes.STRING, allowNull: false },
      module_description: { type: DataTypes.TEXT, allowNull: false },
      order_index: { type: DataTypes.INTEGER, allowNull: false },
      estimated_time: { type: DataTypes.INTEGER, allowNull: false },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses",
          key: "course_id",
        },
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Module",
      tableName: "modules",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Module;
};
