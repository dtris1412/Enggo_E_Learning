"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'ewallet' to payment_method ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE payments 
      MODIFY COLUMN payment_method 
      ENUM('credit_card', 'paypal', 'bank_transfer', 'ewallet') 
      NOT NULL
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove 'ewallet' from payment_method ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE payments 
      MODIFY COLUMN payment_method 
      ENUM('credit_card', 'paypal', 'bank_transfer') 
      NOT NULL
    `);
  },
};
