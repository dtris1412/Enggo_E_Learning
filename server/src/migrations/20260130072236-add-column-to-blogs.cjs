"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("blogs", "slug", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("blogs", "excerpt", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("blogs", "blog_status", {
      type: Sequelize.ENUM("draft", "published", "hidden"),
      allowNull: false,
      defaultValue: "draft",
    });
    await queryInterface.addColumn("blogs", "views_count", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("blogs", "slug");
    await queryInterface.removeColumn("blogs", "excerpt");
    await queryInterface.removeColumn("blogs", "blog_status");
    await queryInterface.removeColumn("blogs", "views_count");
  },
};
