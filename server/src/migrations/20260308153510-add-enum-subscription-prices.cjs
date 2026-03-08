"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("subscription_prices", "billing_type", {
      type: Sequelize.ENUM("free", "monthly", "yearly", "weekly"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {},
};
