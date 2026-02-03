"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("parts", "parts_ibfk_1");
    await queryInterface.removeColumn("parts", "certificate_id");
  },

  async down(queryInterface, Sequelize) {},
};
