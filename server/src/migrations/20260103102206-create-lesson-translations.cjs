"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lesson_translations", {
      translation_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      translation_title: Sequelize.STRING(100),
      translation_description: Sequelize.TEXT,
      instruction: Sequelize.TEXT,
      lesson_id: {
        type: Sequelize.INTEGER,
        references: { model: "lessons", key: "lesson_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      language_id: {
        type: Sequelize.INTEGER,
        references: { model: "languages", key: "language_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lesson_translations");
  },
};
