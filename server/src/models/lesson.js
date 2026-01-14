import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Skill, {
        foreignKey: "skill_id",
      });
      Lesson.belongsTo(models.Course, {
        foreignKey: "course_id",
      });
    }
  }
  Lesson.init(
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lesson_type: { type: DataTypes.STRING, allowNull: false },
      difficulty_level: { type: DataTypes.STRING, allowNull: false },
      lesson_content: { type: DataTypes.TEXT, allowNull: false },
      order_index: { type: DataTypes.INTEGER, allowNull: false },
      is_exam_format: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      estimated_time: { type: DataTypes.INTEGER, allowNull: false },
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "skills",
          key: "skill_id",
        },
      },
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
      modelName: "Lesson",
      tableName: "lessons",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Lesson;
};
