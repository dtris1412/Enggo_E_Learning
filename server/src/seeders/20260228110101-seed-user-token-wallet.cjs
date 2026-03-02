"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Insert token wallets cho 3 users
      await queryInterface.sequelize.query(`
        INSERT INTO user_token_wallets (user_id, token_balance, updated_at) VALUES
        (1, 0, NOW()),
        (2, 0, NOW()),
        (3, 0, NOW())
        ON DUPLICATE KEY UPDATE token_balance = VALUES(token_balance);
      `);
      console.log("Token wallets created/updated successfully");
    } catch (error) {
      console.error("Error creating token wallets:", error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Delete token wallets for user_id 1, 2, 3
      await queryInterface.sequelize.query(`
        DELETE FROM user_token_wallets
        WHERE user_id IN (1, 2, 3)
      `);
      console.log("Token wallets deleted successfully");
    } catch (error) {
      console.error("Error deleting token wallets:", error.message);
      throw error;
    }
  },
};
