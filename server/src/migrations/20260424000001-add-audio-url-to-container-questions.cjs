"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add audio_url for individual question audio (e.g., Part 1 TOEIC with multiple speakers)
    await queryInterface.addColumn("container_questions", "audio_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: "image_url",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("container_questions", "audio_url");
  },
};
