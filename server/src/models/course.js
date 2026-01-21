import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Module, {
        foreignKey: "course_id",
      });
      Course.hasMany(models.Phase_Course, {
        foreignKey: "course_id",
      });
    }
  }
  Course.init(
    {
      course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      course_title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      course_level: { type: DataTypes.STRING, allowNull: false },
      course_aim: { type: DataTypes.STRING, allowNull: false },
      estimate_duration: { type: DataTypes.INTEGER, allowNull: false },
      course_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      tag: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      is_free: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "courses",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Course;
};
