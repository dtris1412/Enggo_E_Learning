"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("questions", "options");
    await queryInterface.removeColumn("questions", "correct_answer");
    await queryInterface.removeColumn("questions", "audio_url");
    await queryInterface.removeColumn("questions", "image_url");
    await queryInterface.removeColumn("questions", "passage_id");
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
