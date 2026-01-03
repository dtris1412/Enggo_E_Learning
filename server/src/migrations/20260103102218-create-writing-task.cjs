"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("writing_task", {
      task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_type: { type: Sequelize.STRING(20), allowNull: false },
      question: { type: Sequelize.TEXT, allowNull: false },
      certificate_id: {
        type: Sequelize.INTEGER,
        references: { model: "certificates", key: "certificate_id" },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("writing_task");
  },
};
