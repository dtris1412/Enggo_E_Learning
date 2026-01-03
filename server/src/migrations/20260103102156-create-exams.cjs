"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exams", {
      exam_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exam_title: { type: Sequelize.STRING(255), allowNull: false },
      exam_duration: { type: Sequelize.INTEGER, allowNull: false },
      exam_code: { type: Sequelize.CHAR(10), allowNull: false },
      year: { type: Sequelize.DATE, allowNull: false },
      certificate_id: {
        type: Sequelize.INTEGER,
        references: { model: "certificates", key: "certificate_id" },
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exams");
  },
};
