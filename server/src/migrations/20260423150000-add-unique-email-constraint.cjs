"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add UNIQUE constraint to user_email
    try {
      await queryInterface.changeColumn("users", "user_email", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });
      console.log("✅ Added UNIQUE constraint to user_email");
    } catch (error) {
      console.error("❌ Error adding UNIQUE constraint:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove UNIQUE constraint from user_email
    try {
      await queryInterface.changeColumn("users", "user_email", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      });
      console.log("✅ Removed UNIQUE constraint from user_email");
    } catch (error) {
      console.error("❌ Error removing UNIQUE constraint:", error);
      throw error;
    }
  },
};
