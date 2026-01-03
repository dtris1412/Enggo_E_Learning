"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: { type: Sequelize.STRING(20), allowNull: false },
      question_content: { type: Sequelize.TEXT, allowNull: false },
      correct_answer: { type: Sequelize.TEXT, allowNull: false },
      explanation: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("questions");
  },
};
