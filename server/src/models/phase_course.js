import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Phase_Course extends Model {
    static associate(models) {
      Phase_Course.belongsTo(models.Phase, {
        foreignKey: "phase_id",
      });
      Phase_Course.belongsTo(models.Course, {
        foreignKey: "course_id",
      });
    }
  }
  Phase_Course.init(
    {
      phase_course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phase_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "phases",
          key: "phase_id",
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
      order_number: { type: DataTypes.INTEGER, allowNull: false },
      is_required: { type: DataTypes.BOOLEAN, allowNull: false },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Phase_Course",
      tableName: "phase_courses",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Phase_Course;
};
