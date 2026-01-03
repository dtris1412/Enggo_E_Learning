"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lesson_question_options", {
      option_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: { type: Sequelize.TEXT, allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false },
      lesson_question_id: {
        type: Sequelize.INTEGER,
        references: { model: "lesson_questions", key: "lesson_question_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lesson_question_options");
  },
};
