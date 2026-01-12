"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roadmaps", {
      roadmap_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roadmap_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roadmap_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      roadmap_aim: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      roadmap_level: {
        type: Sequelize.ENUM("Cơ bản", "Trung cấp", "Nâng cao"),
        allowNull: false,
      },
      estimate_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      roadmap_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      certificate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "certificates",
          key: "certificate_id",
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
    await queryInterface.dropTable("roadmaps");
  },
};
