"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("courses", "course_aim", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn("courses", "estimate_duration", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn("courses", "course_status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
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
