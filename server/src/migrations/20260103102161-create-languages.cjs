"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("languages", {
      language_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      language_name: Sequelize.STRING(50),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("languages");
  },
};
