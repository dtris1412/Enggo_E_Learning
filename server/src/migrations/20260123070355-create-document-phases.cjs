"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("document_phases", {
      document_phase_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_index: { type: Sequelize.INTEGER, allowNull: true },
      phase_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "phases", key: "phase_id" },
      },
      document_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "documents", key: "document_id" },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("document_phases");
  },
};
