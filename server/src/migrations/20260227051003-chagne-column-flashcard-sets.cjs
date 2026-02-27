"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint("flashcard_sets", "flashcard_set_id");
    await queryInterface.removeColumn("flashcard_sets", "flashcard_set_id");
    await queryInterface.addColumn("flashcard_sets", "flashcard_set_id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    });
    await queryInterface.addConstraint("flashcards", {
      fields: ["flashcard_set_id"],
      type: "foreign key",
      name: "flashcard_flashcard_set_id_foreign_idx",
      references: {
        table: "flashcard_sets",
        field: "flashcard_set_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("user_flashcard_sets", {
      fields: ["flashcard_set_id"],
      type: "foreign key",
      name: "user_flashcard_sets_ibfk_2",
      references: {
        table: "flashcard_sets",
        field: "flashcard_set_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {},
};
