"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("questions", "question_type", {
      type: Sequelize.ENUM(
        "listening_photographs",
        "listening_question_response",
        "listening_conversation",
        "listening_talk",
        "reading_incomplete_sentences",
        "reading_text_completion",
        "reading_reading_comprehension",
        "reading_matching_headings",
        "reading_true_false_not_given",
        "reading_multiple_choice",
        "reading_matching_information",
        "reading_sentence_completion",
        "reading_summary_completion",
        "reading_short_answer",
        "writing_task_1",
        "writing_task_2",
        "speaking_part_1",
        "speaking_part_2",
        "speaking_part_3",
        "grammar",
        "vocabulary",
      ),
      allowNull: false,
      defaultValue: "reading_multiple_choice",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("questions", "question_type");
  },
};
