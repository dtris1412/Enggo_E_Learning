"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "writing_submission",
      "writing_submission_ibfk_2",
    );
    await queryInterface.removeColumn("writing_submission", "task_id");
    await queryInterface.removeColumn("writing_submission", "user_id");
    await queryInterface.addColumn("writing_submission", "user_exam_id", {
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
      "writing_submission",
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
    await queryInterface.addColumn("writing_submission", "word_count", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("writing_submission", "final_score", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn("writing_submission", "status", {
      type: Sequelize.ENUM("submitted", "graded", "revised"),
    });
    await queryInterface.removeColumn("writing_submission", "submiited_at");
    await queryInterface.addColumn("writing_submission", "submitted_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.renameTable(
      "writing_submission",
      "writing_submissions",
    );
  },

  async down(queryInterface, Sequelize) {},
};
