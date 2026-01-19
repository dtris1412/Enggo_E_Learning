"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("lesson_medias", "order_index", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("lesson_medias", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("lesson_medias", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.addColumn("lesson_medias", "updated_at", {
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
    await queryInterface.removeColumn("lesson_medias", "order_index");
    await queryInterface.removeColumn("lesson_medias", "description");
    await queryInterface.removeColumn("lesson_medias", "created_at");
    await queryInterface.removeColumn("lesson_medias", "updated_at");
  },
};
