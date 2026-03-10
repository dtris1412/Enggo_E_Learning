"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog_comments", {
      blog_comment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
      },
      blog_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "blogs", key: "blog_id" },
        onDelete: "CASCADE",
      },
      parent_comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "blog_comments", key: "blog_comment_id" },
        onDelete: "CASCADE",
      },
      comment_content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("blog_comments");
  },
};
