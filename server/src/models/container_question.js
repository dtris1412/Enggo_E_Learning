import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Container_Question extends Model {
    static associate(models) {
      Container_Question.belongsTo(models.Exam_Container, {
        foreignKey: "container_id",
      });
      Container_Question.belongsTo(models.Question, {
        foreignKey: "question_id",
      });
      Container_Question.hasMany(models.Question_Option, {
        foreignKey: "container_question_id",
      });
      Container_Question.hasMany(models.User_Answer, {
        foreignKey: "container_question_id",
      });
      Container_Question.hasMany(models.Writing_Submission, {
        foreignKey: "container_question_id",
      });
      Container_Question.hasMany(models.Speaking_Record, {
        foreignKey: "container_question_id",
      });
      Container_Question.hasMany(models.AI_Interaction, {
        foreignKey: "container_question_id",
      });
    }
  }
  Container_Question.init(
    {
      container_question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      container_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "exam_containers", key: "container_id" },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "questions", key: "question_id" },
      },
      order: { type: DataTypes.INTEGER, allowNull: false },
      image_url: { type: DataTypes.STRING, allowNull: true },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 1.0,
      },
    },
    {
      sequelize,
      modelName: "Container_Question",
      tableName: "container_questions",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Container_Question;
};
