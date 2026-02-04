"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("speaking_feedbacks", {
      speaking_feedback_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      record_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "speaking_records",
          key: "record_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      model_name: {
        type: Sequelize.STRING,
      },
      overall_score: {
        type: Sequelize.FLOAT,
      },
      criteria_scores: {
        type: Sequelize.JSON,
      },
      transcript: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      comments: {
        type: Sequelize.TEXT,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
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
