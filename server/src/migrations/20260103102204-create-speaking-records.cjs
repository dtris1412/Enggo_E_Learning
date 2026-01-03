"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("speaking_records", {
      record_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      audio_url: { type: Sequelize.STRING(255), allowNull: false },
      transcript: Sequelize.TEXT,
      pronouciation_score: Sequelize.FLOAT,
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "user_id" },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("speaking_records");
  },
};
