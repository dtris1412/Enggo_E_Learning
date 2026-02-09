"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("reports", "report_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("reports", "report_type", {
      type: Sequelize.ENUM(
        "users",
        "courses",
        "lessons",
        "exams",
        "blogs",
        "documents",
        "roadmaps",
      ),
      allowNull: false,
    });
    await queryInterface.addColumn("reports", "file_path", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("reports", "file_format", {
      type: Sequelize.ENUM("excel", "csv"),
      allowNull: false,
      defaultValue: "excel",
    });
    await queryInterface.addColumn("reports", "filters", {
      type: Sequelize.JSON,
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
