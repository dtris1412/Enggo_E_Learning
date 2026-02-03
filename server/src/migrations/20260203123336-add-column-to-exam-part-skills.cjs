"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("part_skills", "part_skills_ibfk_1");
    await queryInterface.removeConstraint("part_skills", "part_skills_ibfk_2");
    await queryInterface.removeColumn("part_skills", "part_id");
    await queryInterface.removeColumn("part_skills", "skill_id");
    await queryInterface.dropTable("part_skills");
  },

  async down(queryInterface, Sequelize) {},
};
