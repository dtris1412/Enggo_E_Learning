"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("phases", "phase_aim", "phase_aims");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("phases", "phase_aims", "phase_aim");
  },
};
