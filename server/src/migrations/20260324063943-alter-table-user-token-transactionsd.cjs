"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_token_transactions", "tokens_used", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.sequelize.query(`
      UPDATE user_token_transactions
      SET tokens_used = 0
      WHERE tokens_used IS NULL;
    `);
    await queryInterface.addColumn("user_token_transactions", "const_usd", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("user_token_transactions", "ai_model", {
      type: Sequelize.STRING,
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
    await queryInterface.removeColumn("user_token_transactions", "tokens_used");
    await queryInterface.removeColumn("user_token_transactions", "const_usd");
    await queryInterface.removeColumn("user_token_transactions", "ai_model");
  },
};
