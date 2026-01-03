"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("writing_submission", {
      submission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: { type: Sequelize.TEXT, allowNull: false },
      submiited_at: { type: Sequelize.DATE, allowNull: false },
      task_id: {
        type: Sequelize.INTEGER,
        references: { model: "writing_task", key: "task_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("writing_submission");
  },
};
