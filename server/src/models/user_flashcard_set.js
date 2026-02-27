import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User_Flashcard_Set extends Model {
    static associate(models) {
      User_Flashcard_Set.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      User_Flashcard_Set.belongsTo(models.Flashcard_Set, {
        foreignKey: "flashcard_set_id",
      });
    }
  }
  User_Flashcard_Set.init(
    {
      user_flashcard_set_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      flashcard_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flashcard_sets", key: "flashcard_set_id" },
      },
      started_at: { type: DataTypes.DATE, allowNull: false },
      progress_percent: { type: DataTypes.FLOAT, allowNull: true },
      status: {
        type: DataTypes.ENUM("active", "completed", "archived"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User_Flashcard_Set",
      tableName: "user_flashcard_sets",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User_Flashcard_Set;
};
