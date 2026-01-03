"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exam_questions", {
      exam_question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: Sequelize.INTEGER,
        references: { model: "questions", key: "question_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      exam_id: {
        type: Sequelize.INTEGER,
        references: { model: "exams", key: "exam_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      part_id: {
        type: Sequelize.INTEGER,
        references: { model: "parts", key: "part_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      score: Sequelize.FLOAT,
      order_index: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exam_questions");
  },
};
