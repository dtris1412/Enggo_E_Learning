"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("documents", {
      document_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      document_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      document_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      document_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phase_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "phases",
          key: "phase_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("documents");
  },
};
