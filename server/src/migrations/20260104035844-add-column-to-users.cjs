"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // ...existing code...
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "user_status", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "user_status");
  },
  // ...existing code...
};
