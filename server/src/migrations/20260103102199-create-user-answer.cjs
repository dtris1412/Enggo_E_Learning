"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_answer", {
      answer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_exam_id: {
        type: Sequelize.INTEGER,
        references: { model: "user_exam", key: "user_exam_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      exam_question_id: {
        type: Sequelize.INTEGER,
        references: { model: "exam_questions", key: "exam_question_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      answer_text: Sequelize.TEXT,
      score: Sequelize.FLOAT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_answer");
  },
};
