"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_exams", "started_at", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("user_exams", "submitted_at", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("user_exams", "status", {
      type: Sequelize.ENUM("submitted", "graded", "revised"),
      allowNull: false,
    });
    await queryInterface.addColumn("user_exams", "total_score", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn("user_exams", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.addColumn("user_exams", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
