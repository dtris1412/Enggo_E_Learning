import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {}
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
      course_aim: { type: DataTypes.FLOAT, allowNull: false },
      estimate_duration: { type: DataTypes.INTEGER, allowNull: false },
      course_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      tag: { type: DataTypes.STRING, allowNull: false },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "courses",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Course;
};
