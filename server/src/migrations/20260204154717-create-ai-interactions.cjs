"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ai_interactions", {
      ai_interaction_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      prompt: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      response: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      model_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token_usage: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
