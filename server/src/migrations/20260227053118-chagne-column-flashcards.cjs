"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "user_flashcard_progress",
      "user_flashcard_progress_ibfk_2",
    );
    await queryInterface.removeColumn("flashcards", "flashcard_id");
    await queryInterface.addColumn("flashcards", "flashcard_id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    });
    await queryInterface.addConstraint("user_flashcard_progress", {
      fields: ["flashcard_id"],
      type: "foreign key",
      name: "user_flashcard_progress_ibfk_2",
      references: {
        table: "flashcards",
        field: "flashcard_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
