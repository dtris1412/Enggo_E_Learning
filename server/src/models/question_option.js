import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Question_Option extends Model {
    static associate(models) {
      Question_Option.belongsTo(models.Container_Question, {
        foreignKey: "container_question_id",
      });
      Question_Option.hasMany(models.User_Answer, {
        foreignKey: "question_option_id",
      });
    }
  }
  Question_Option.init(
    {
      question_option_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      container_question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "container_questions",
          key: "container_question_id",
        },
      },

      label: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false },
      order_index: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Question_Option",
      tableName: "question_options",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Question_Option;
};
