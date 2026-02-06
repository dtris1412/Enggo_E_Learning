"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add audio_url for Listening audio (Part 1-4 TOEIC)
    await queryInterface.addColumn("exam_containers", "audio_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: "image_url",
    });

    // Add instruction for Part instructions
    await queryInterface.addColumn("exam_containers", "instruction", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "content",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("exam_containers", "audio_url");
    await queryInterface.removeColumn("exam_containers", "instruction");
  },
};
