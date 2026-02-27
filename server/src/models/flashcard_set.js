import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Flashcard_Set extends Model {
    static associate(models) {
      Flashcard_Set.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Flashcard_Set.belongsTo(models.User_Exam, {
        foreignKey: "user_exam_id",
      });
      Flashcard_Set.belongsTo(models.Exam, {
        foreignKey: "exam_id",
      });
      Flashcard_Set.hasMany(models.Flashcard, {
        foreignKey: "flashcard_set_id",
      });
      Flashcard_Set.hasMany(models.User_Flashcard_Set, {
        foreignKey: "flashcard_set_id",
      });
    }
  }
  Flashcard_Set.init(
    {
      flashcard_set_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      user_exam_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "user_exams", key: "user_exam_id" },
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "exams", key: "exam_id" },
      },
      source_type: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      visibility: { type: DataTypes.STRING, allowNull: true },
      created_by_type: {
        type: DataTypes.ENUM("admin", "user", "AI"),
        allowNull: true,
      },
      total_cards: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Flashcard_Set",
      tableName: "flashcard_sets",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Flashcard_Set;
};
