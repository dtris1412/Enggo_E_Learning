"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("passages", {
      passage_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "exams",
          key: "exam_id",
        },
        onDelete: "CASCADE",
      },

      part_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "parts",
          key: "part_id",
        },
        onDelete: "CASCADE",
      },

      passage_content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      audio_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      passage_type: {
        type: Sequelize.ENUM(
          // TOEIC
          "AUDIO_SINGLE",
          "TEXT_SINGLE",
          "TEXT_DOUBLE",
          "TEXT_TRIPLE",

          // IELTS
          "ACADEMIC_LONG_TEXT",
          "GENERAL_SHORT_TEXT",
          "CONVERSATION",
          "MONOLOGUE"
        ),
        allowNull: false,
      },

      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("passages");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_passages_passage_type";'
    );
  },
};
