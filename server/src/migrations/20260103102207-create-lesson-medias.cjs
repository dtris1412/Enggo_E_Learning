"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lesson_medias", {
      media_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      media_type: { type: Sequelize.STRING(20), allowNull: false },
      media_url: Sequelize.STRING(255),
      transcript: Sequelize.TEXT,
      lesson_id: {
        type: Sequelize.INTEGER,
        references: { model: "lessons", key: "lesson_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lesson_medias");
  },
};
