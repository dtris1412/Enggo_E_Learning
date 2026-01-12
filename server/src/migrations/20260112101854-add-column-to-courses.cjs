"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Xóa foreign key constraint của certificate_id
    await queryInterface.removeConstraint("courses", "Courses_ibfk_1");

    // 2. Xóa column certificate_id
    await queryInterface.removeColumn("courses", "certificate_id");

    // 3. Thêm column phase_id
    await queryInterface.addColumn("courses", "phase_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "phases", // Tên bảng Phases
        key: "phase_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // 4. Thêm index cho phase_id để tăng performance
    await queryInterface.addIndex("courses", ["phase_id"], {
      name: "idx_courses_phase_id",
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Xóa index
    await queryInterface.removeIndex("Courses", "idx_courses_phase_id");

    // 2. Xóa foreign key constraint của phase_id
    await queryInterface.removeConstraint("Courses", "Courses_ibfk_2");

    // 3. Xóa column phase_id
    await queryInterface.removeColumn("Courses", "phase_id");

    // 4. Thêm lại column certificate_id
    await queryInterface.addColumn("Courses", "certificate_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Certificates",
        key: "certificate_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
