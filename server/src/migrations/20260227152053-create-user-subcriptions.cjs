"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_subscriptions", {
      user_subscription_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subscription_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "subscription_plan_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "expired", "canceled"),
        allowNull: false,
        defaultValue: "active",
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
    await queryInterface.dropTable("user_subscriptions");
  },
};
