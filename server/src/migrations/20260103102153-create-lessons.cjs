"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lessons", {
      lesson_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lesson_type: { type: Sequelize.STRING(20), allowNull: false },
      difficulty_level: { type: Sequelize.CHAR(10), allowNull: false },
      lesson_content: { type: Sequelize.TEXT, allowNull: false },
      order_index: { type: Sequelize.INTEGER, allowNull: false },
      is_exam_format: { type: Sequelize.BOOLEAN, allowNull: false },
      estimated_time: { type: Sequelize.INTEGER, allowNull: false },
      skill_id: {
        type: Sequelize.INTEGER,
        references: { model: "skills", key: "skill_id" },
      },
      course_id: {
        type: Sequelize.INTEGER,
        references: { model: "courses", key: "course_id" },
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lessons");
  },
};
