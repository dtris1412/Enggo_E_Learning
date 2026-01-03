"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: { type: Sequelize.STRING(50), allowNull: false },
      user_password: { type: Sequelize.STRING(256), allowNull: false },
      full_name: Sequelize.STRING(100),
      user_email: { type: Sequelize.STRING(255), allowNull: false },
      user_phone: Sequelize.CHAR(10),
      user_address: Sequelize.TEXT,
      avatar: Sequelize.STRING(255),
      role: { type: Sequelize.INTEGER, allowNull: false },
      user_level: Sequelize.STRING(4),
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
