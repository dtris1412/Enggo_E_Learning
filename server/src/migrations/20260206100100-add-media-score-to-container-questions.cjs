"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add image_url for individual question images (e.g., Part 1 TOEIC)
    await queryInterface.addColumn("container_questions", "image_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: "order",
    });

    // Add score for individual question points
    await queryInterface.addColumn("container_questions", "score", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 1.0,
      after: "image_url",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("container_questions", "image_url");
    await queryInterface.removeColumn("container_questions", "score");
  },
};
