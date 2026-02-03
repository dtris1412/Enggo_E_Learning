"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("passages", "passages_ibfk_1");
    await queryInterface.removeColumn("passages", "exam_id");
    await queryInterface.addColumn("passages", "container_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "exam_containers",
        key: "container_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {},
};
