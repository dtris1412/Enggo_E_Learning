"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_answers", {
      user_answer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user_exam",
          key: "user_exam_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      container_question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "container_questions",
          key: "container_question_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question_option_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "question_options",
          key: "question_option_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
