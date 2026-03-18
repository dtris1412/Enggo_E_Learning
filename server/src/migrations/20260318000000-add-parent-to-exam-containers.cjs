"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("exam_containers", "parent_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "exam_containers",
        key: "container_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("exam_containers", "parent_id");
  },
};
