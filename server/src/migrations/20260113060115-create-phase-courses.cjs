"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("phase_courses", {
      phase_course_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phase_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "phases",
          key: "phase_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "courses",
          key: "course_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      order_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("phase_courses");
  },
};
