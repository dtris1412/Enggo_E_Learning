"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("documents", "view_count", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn("documents", "download_count", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn("documents", "acess_type", {
      type: Sequelize.ENUM("free", "premium"),
      defaultValue: "free",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("documents", "view_count");
    await queryInterface.removeColumn("documents", "download_count");
    await queryInterface.removeColumn("documents", "acess_type");
  },
};
