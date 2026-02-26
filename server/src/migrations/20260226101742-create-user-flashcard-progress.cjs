"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_flashcard_progress", {
      progress_id: {
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
      flashcard_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "flashcards",
          key: "flashcard_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      repetition_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ease_factor: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 2.5,
      },
      interval_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      next_review_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      last_reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      last_core: {
        type: Sequelize.ENUM("again", "hard", "good", "easy"),
        allowNull: true,
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
