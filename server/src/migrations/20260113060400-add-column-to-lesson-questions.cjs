"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("lesson_questions", "options", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("lesson_questions", "ai_model", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("lesson_questions", "status", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.addColumn("lesson_questions", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.addColumn("lesson_questions", "updated_at", {
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
