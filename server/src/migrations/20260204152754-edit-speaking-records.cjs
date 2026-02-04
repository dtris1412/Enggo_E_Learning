"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "speaking_records",
      "speaking_records_ibfk_1",
    );
    await queryInterface.removeColumn("speaking_records", "user_id");
    await queryInterface.removeColumn("speaking_records", "transcript");
    await queryInterface.removeColumn(
      "speaking_records",
      "pronouciation_score",
    );
    await queryInterface.addColumn("speaking_records", "user_exam_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_exam",
        key: "user_exam_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn(
      "speaking_records",
      "container_question_id",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "container_questions",
          key: "container_question_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    );
    await queryInterface.addColumn("speaking_records", "duration", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn("speaking_records", "submitted_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("speaking_records", "final_score", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
