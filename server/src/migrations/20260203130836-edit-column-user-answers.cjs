"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("user_answer", "user_answer_ibfk_1");
    await queryInterface.removeConstraint("user_answer", "user_answer_ibfk_2");
    await queryInterface.dropTable("user_answer");
    await queryInterface.dropTable("exam_questions");
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
