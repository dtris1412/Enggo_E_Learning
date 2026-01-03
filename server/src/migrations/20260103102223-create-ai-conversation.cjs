"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ai_conversation", {
      conversation_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mode: { type: Sequelize.INTEGER, allowNull: false },
      started_at: { type: Sequelize.DATE, allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ai_conversation");
  },
};
