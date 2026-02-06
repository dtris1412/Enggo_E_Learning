"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change year column from DATE to INTEGER
    await queryInterface.changeColumn("exams", "year", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to DATE
    await queryInterface.changeColumn("exams", "year", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
