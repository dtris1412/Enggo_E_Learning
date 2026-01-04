"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "google_id", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("users", "facebook_id", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {},
};
