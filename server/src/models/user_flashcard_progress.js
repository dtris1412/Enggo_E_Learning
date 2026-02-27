import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Flashcard_Progress extends Model {
    static associate(models) {}
  }
  User_Flashcard_Progress.init(
    {
      progress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      flashcard_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flashcards", key: "flashcard_id" },
      },
      repetition_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ease_factor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 2.5,
      },
      interval_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      next_review_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_core: {
        type: DataTypes.ENUM("again", "hard", "good", "easy"),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User_Flashcard_Progress",
      tableName: "user_flashcard_progress",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Flashcard_Progress;
};
