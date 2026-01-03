"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("feedbacks", {
      feedback_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      score: { type: Sequelize.FLOAT, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: false },
      suggestion: { type: Sequelize.TEXT, allowNull: false },
      answer_id: {
        type: Sequelize.INTEGER,
        references: { model: "user_answer", key: "answer_id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("feedbacks");
  },
};
