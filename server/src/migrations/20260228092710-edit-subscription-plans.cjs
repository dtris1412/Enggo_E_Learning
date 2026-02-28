"use strict";

const { QueryInterface } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("subscription_plans", "code", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("subscription_plans", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    });

    await queryInterface.removeColumn("subscription_plans", "price");
    await queryInterface.removeColumn("subscription_plans", "duration_days");
    await queryInterface.removeColumn(
      "subscription_plans",
      "percentage_discount",
    );
    await queryInterface.changeColumn("subscription_plans", "features", {
      type: Sequelize.JSON,
      allowNull: true,
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
