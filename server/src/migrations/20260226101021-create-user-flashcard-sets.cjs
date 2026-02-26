"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_flashcard_sets", {
      user_flashcard_set_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      flashcard_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "flashcard_sets",
          key: "flashcard_set_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      progress_percent: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "completed", "archived"),
        allowNull: false,
        defaultValue: "active",
      },
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
