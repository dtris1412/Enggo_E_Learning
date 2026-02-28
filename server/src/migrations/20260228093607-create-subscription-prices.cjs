"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscription_prices", {
      subscription_price_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subscription_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "subscription_plan_id",
        },
      },
      billing_type: {
        type: Sequelize.ENUM("monthly", "yearly", "weekly"),
        allowNull: false,
      },
      duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: { type: Sequelize.INTEGER, allowNull: false },
      discount_percentage: { type: Sequelize.FLOAT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
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
