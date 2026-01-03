"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("flashcard", {
      card_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      front_text: { type: Sequelize.STRING(100), allowNull: false },
      back_text: Sequelize.STRING(255),
      example: Sequelize.TEXT,
      difficulty_level: Sequelize.CHAR(50),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("flashcard");
  },
};
