"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.renameColumn(
    //   "flashcard_set",
    //   "set_id",
    //   "flashcard_set_id",
    // );
    // await queryInterface.removeConstraint(
    //   "flashcard_set",
    //   "flashcard_set_ibfk_2",
    // );
    // await queryInterface.removeColumn("flashcard_set", "card_id");
    // await queryInterface.removeColumn("flashcard_set", "source");
    // await queryInterface.addColumn("flashcard_set", "user_exam_id", {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "user_exams",
    //     key: "user_exam_id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });
    // await queryInterface.addColumn("flashcard_set", "exam_id", {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "exams",
    //     key: "exam_id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });
    // await queryInterface.addColumn("flashcard_set", "source_type", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("flashcard_set", "title", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("flashcard_set", "description", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("flashcard_set", "visibility", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });

    // await queryInterface.addColumn("flashcard_set", "created_by_type", {
    //   type: Sequelize.ENUM("admin", "user", "AI"),
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("flashcard_set", "total_cards", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("flashcard_set", "updated_at", {
    //   type: Sequelize.DATE,
    //   allowNull: false,
    //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    // });

    await queryInterface.renameTable("flashcard_set", "flashcard_sets");
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
