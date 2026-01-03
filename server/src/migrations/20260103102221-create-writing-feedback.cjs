"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("writing_feedback", {
      feedback_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      band_score: Sequelize.FLOAT,
      task_response: Sequelize.TEXT,
      coherence: Sequelize.TEXT,
      lexical_resource: Sequelize.TEXT,
      grammar: Sequelize.TEXT,
      ai_comment: Sequelize.TEXT,
      submission_id: {
        type: Sequelize.INTEGER,
        references: { model: "writing_submission", key: "submission_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("writing_feedback");
  },
};
