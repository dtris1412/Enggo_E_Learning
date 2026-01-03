"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("flashcard_set", {
      set_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      card_id: {
        type: Sequelize.INTEGER,
        references: { model: "flashcard", key: "card_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      source: { type: Sequelize.TEXT, allowNull: false },
      created_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("flashcard_set");
  },
};
