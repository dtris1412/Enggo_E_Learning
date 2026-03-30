"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // The writing_feedback_id column was originally named feedback_id (not AUTO_INCREMENT after rename).
    // This fixes it so MySQL uses AUTO_INCREMENT properly.
    await queryInterface.sequelize.query(
      `ALTER TABLE writing_feedbacks MODIFY writing_feedback_id INT NOT NULL AUTO_INCREMENT;`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE writing_feedbacks MODIFY writing_feedback_id INT NOT NULL;`,
    );
  },
};
