"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("parts", {
      part_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      part_number: { type: Sequelize.INTEGER, allowNull: false },
      description: Sequelize.TEXT,
      certificate_id: {
        type: Sequelize.INTEGER,
        references: { model: "certificates", key: "certificate_id" },
      },
      skill_id: {
        type: Sequelize.INTEGER,
        references: { model: "skills", key: "skill_id" },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("parts");
  },
};
