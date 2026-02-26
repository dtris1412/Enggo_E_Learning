"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.renameColumn("flashcard", "card_id", "flashcard_id");
    // await queryInterface.addColumn("flashcard", "flashcard_set_id", {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "flashcard_sets",
    //     key: "flashcard_set_id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });
    // await queryInterface.addColumn("flashcard", "container_question_id", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: "container_questions",
    //     key: "container_question_id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "SET NULL",
    // });

    // await queryInterface.renameColumn(
    //   "flashcard",
    //   "front_text",
    //   "front_content",
    // );
    await queryInterface.changeColumn("flashcard", "front_content", {
      type: Sequelize.STRING(255),
    });
    await queryInterface.renameColumn("flashcard", "back_text", "back_content");
    await queryInterface.addColumn("flashcard", "pronunciation", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn("flashcard", "audio_url", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.renameTable("flashcard", "flashcards");
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
