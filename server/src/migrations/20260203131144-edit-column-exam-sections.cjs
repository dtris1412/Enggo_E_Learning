"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint(
    //   "exam_sections",
    //   "exam_sections_ibfk_1",
    // );
    // await queryInterface.removeConstraint(
    //   "exam_sections",
    //   "exam_sections_ibfk_2",
    // );
    await queryInterface.removeConstraint(
      "writing_submission",
      "writing_submission_ibfk_1",
    );
    await queryInterface.dropTable("exam_sections");
    await queryInterface.dropTable("writing_task");
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
