"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exam_containers", {
      container_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "exams",
          key: "exam_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      skill: {
        type: Sequelize.ENUM,
        values: ["reading", "listening", "writing", "speaking"],
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: [
          "toeic_group",
          "toeic_single",
          "ielts_passage",
          "writing_task",
          "speaking_part",
        ],
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      time_limit: {
        type: Sequelize.INTEGER,
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
