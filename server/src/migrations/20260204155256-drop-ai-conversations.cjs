"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "ai_conversation",
      "ai_conversation_ibfk_1",
    );
    await queryInterface.removeConstraint(
      "ai_conversation_message",
      "ai_conversation_message_ibfk_1",
    );
    await queryInterface.dropTable("ai_conversation_message");
    await queryInterface.dropTable("ai_conversation");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
