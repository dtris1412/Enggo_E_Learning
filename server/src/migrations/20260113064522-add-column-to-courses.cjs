"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("courses", "course_level");
    await queryInterface.addColumn("courses", "course_level", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.removeColumn("courses", "course_aim");
    await queryInterface.addColumn("courses", "course_aim", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("courses", "course_level");
    await queryInterface.removeColumn("courses", "course_aim");
  },
};
