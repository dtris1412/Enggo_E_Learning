"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("courses", "price");
    await queryInterface.removeColumn("courses", "is_free");
    await queryInterface.addColumn("courses", "access_type", {
      type: Sequelize.ENUM("free", "premium"),
      allowNull: false,
      defaultValue: "free",
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
