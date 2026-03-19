"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change selected_parts from INTEGER to JSON/TEXT
    await queryInterface.changeColumn("user_exams", "selected_parts", {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("user_exams", "selected_parts", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
