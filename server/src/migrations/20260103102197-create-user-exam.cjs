"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_exam", {
      user_exam_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      exam_id: {
        type: Sequelize.INTEGER,
        references: { model: "exams", key: "exam_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      selected_parts: { type: Sequelize.INTEGER, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_exam");
  },
};
