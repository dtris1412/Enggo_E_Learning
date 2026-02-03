"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint(
    //   "exam_questions",
    //   "exam_questions_ibfk_1",
    // );
    // await queryInterface.removeConstraint(
    //   "exam_questions",
    //   "exam_questions_ibfk_2",
    // );
    // await queryInterface.removeConstraint(
    //   "exam_questions",
    //   "exam_questions_ibfk_3",
    // );
    // await queryInterface.removeColumn("exam_questions", "part_id");
    // await queryInterface.removeColumn("exam_questions", "exam_id");
    // await queryInterface.removeColumn("exam_questions", "question_id");
  },

  async down(queryInterface, Sequelize) {},
};
