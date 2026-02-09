import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Report.init(
    {
      report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_name: DataTypes.STRING,
      report_type: {
        type: DataTypes.ENUM(
          "users",
          "courses",
          "lessons",
          "exams",
          "blogs",
          "documents",
          "roadmaps",
        ),
        allowNull: false,
      },
      report_content: DataTypes.TEXT,
      file_path: DataTypes.STRING,
      file_format: {
        type: DataTypes.ENUM("excel", "csv"),
        defaultValue: "excel",
      },
      filters: DataTypes.JSON,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "reports",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Report;
};
