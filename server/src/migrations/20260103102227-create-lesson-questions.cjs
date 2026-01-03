"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lesson_questions", {
      lesson_question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_type: { type: Sequelize.STRING(20), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      correct_answer: { type: Sequelize.TEXT, allowNull: false },
      explaination: Sequelize.TEXT,
      difficulty_level: { type: Sequelize.CHAR(10), allowNull: false },
      generated_by_ai: { type: Sequelize.BOOLEAN, allowNull: false },
      lesson_id: {
        type: Sequelize.INTEGER,
        references: { model: "lessons", key: "lesson_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lesson_questions");
  },
};
