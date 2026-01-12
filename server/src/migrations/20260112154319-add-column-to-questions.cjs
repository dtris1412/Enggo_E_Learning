"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("questions", "part_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "parts",
        key: "part_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.removeColumn("questions", "type");
    await queryInterface.addColumn("questions", "options", {
      type: Sequelize.JSON,
      allowNull: false,
    });
    await queryInterface.addColumn("questions", "audio_url", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("questions", "image_url", {
      type: Sequelize.STRING(255),
      allowNull: true,
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
