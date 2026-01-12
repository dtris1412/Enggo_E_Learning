"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("phases", {
      phase_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phase_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phase_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      phase_aim: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      roadmap_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roadmaps",
          key: "roadmap_id",
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
    await queryInterface.dropTable("phases");
  },
};
