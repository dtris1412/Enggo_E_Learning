"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "flashcard_sets",
      "flashcard_sets_ibfk_2",
    );
    await queryInterface.removeConstraint(
      "flashcard_sets",
      "flashcard_sets_ibfk_3",
    );
    await queryInterface.removeColumn("flashcard_sets", "exam_id");
    await queryInterface.removeColumn("flashcard_sets", "user_exam_id");
    await queryInterface.addColumn("flashcard_sets", "exam_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "exams",
        key: "exam_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("flashcard_sets", "user_exam_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "user_exams",
        key: "user_exam_id",
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
