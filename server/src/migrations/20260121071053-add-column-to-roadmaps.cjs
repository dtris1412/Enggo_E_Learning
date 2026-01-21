"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("roadmaps", "roadmap_level", {
      type: Sequelize.ENUM("Beginner", "Intermediate", "Advanced"),
      allowNull: false,
    });
    await queryInterface.addColumn("roadmaps", "roadmap_price", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("roadmaps", "roadmap_price");
    await queryInterface.changeColumn("roadmaps", "roadmap_level", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },
};
