"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change status from STRING to BOOLEAN
    await queryInterface.changeColumn("lesson_questions", "status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to STRING if needed
    await queryInterface.changeColumn("lesson_questions", "status", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },
};
