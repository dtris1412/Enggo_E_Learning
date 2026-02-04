"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.renameColumn(
    //   "writing_feedback",
    //   "feedback_id",
    //   "writing_feedback_id",
    // );
    // await queryInterface.removeColumn("writing_feedback", "band_score");
    // await queryInterface.removeColumn("writing_feedback", "task_response");
    // await queryInterface.removeColumn("writing_feedback", "coherence");
    // await queryInterface.removeColumn("writing_feedback", "lexical_resource");
    // await queryInterface.removeColumn("writing_feedback", "grammar");
    // await queryInterface.removeColumn("writing_feedback", "ai_comment");
    // await queryInterface.removeColumn("writing_feedback", "lexical_resource");
    await queryInterface.addColumn("writing_feedback", "model_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("writing_feedback", "overall_score", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn("writing_feedback", "criteria_scores", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("writing_feedback", "comments", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("writing_feedback", "created_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.renameTable("writing_feedback", "writing_feedbacks");
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
