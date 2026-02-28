"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscription_plans", {
      subscription_plan_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      percentage_discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      features: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      monthly_ai_token_quota: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("subscription_plans");
  },
};
