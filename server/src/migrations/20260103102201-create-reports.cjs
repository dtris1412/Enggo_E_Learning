"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reports", {
      report_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      report_type: { type: Sequelize.STRING(50), allowNull: false },
      report_content: { type: Sequelize.TEXT, allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reports");
  },
};
