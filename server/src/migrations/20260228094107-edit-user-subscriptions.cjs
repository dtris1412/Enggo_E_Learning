"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "user_subscriptions",
      "user_subscriptions_ibfk_2",
    );
    await queryInterface.removeColumn(
      "user_subscriptions",
      "subscription_plan_id",
    );
    await queryInterface.addColumn(
      "user_subscriptions",
      "subscription_price_id",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_prices",
          key: "subscription_price_id",
        },
      },
    );
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
