"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("documents", "documents_ibfk_1");
    await queryInterface.removeColumn("documents", "phase_id");
    await queryInterface.addColumn("documents", "document_size", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("documents", "file_type", {
      type: Sequelize.STRING,
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
