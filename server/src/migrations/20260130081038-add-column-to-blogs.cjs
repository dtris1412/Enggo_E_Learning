"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("blogs", "category", {
      type: Sequelize.ENUM(
        "Mẹo học tập",
        "TOEIC",
        "IELTS",
        "Ngữ pháp",
        "Từ vựng",
      ),
      allowNull: true, // or false depending on your requirements
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
