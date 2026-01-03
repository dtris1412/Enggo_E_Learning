"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blogs", {
      blog_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      blog_title: { type: Sequelize.STRING(100), allowNull: false },
      blog_content: { type: Sequelize.TEXT, allowNull: false },
      blog_thumbnail: { type: Sequelize.STRING(255), allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("blogs");
  },
};
