"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("system_ai_quotas", {
      quota_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      open_ai_credit: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      system_open_ai_token: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ai_token_unit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 500,
      },
      ai_token_totals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ai_token_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      buffer_percent: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 20,
      },
      price_per_milion: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("system_ai_quotas");
  },
};
