"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "subscription_plans",
      [
        {
          name: "Free",
          features: JSON.stringify({
            max_courses: 5,
            ai_assistance: false,
            download_documents: false,
            priority_support: false,
            custom_learning_path: false,
            certificates: true,
          }),
          monthly_ai_token_quota: 1000,
          code: "free",
          is_active: true,
        },
        {
          name: "Pro",
          features: JSON.stringify({
            max_courses: 50,
            ai_assistance: true,
            download_documents: true,
            priority_support: false,
            custom_learning_path: true,
            certificates: true,
            offline_access: true,
          }),
          monthly_ai_token_quota: 10000,
          code: "pro",
          is_active: true,
        },
        {
          name: "Premium",
          features: JSON.stringify({
            max_courses: -1,
            ai_assistance: true,
            download_documents: true,
            priority_support: true,
            custom_learning_path: true,
            certificates: true,
            offline_access: true,
            live_sessions: true,
          }),
          monthly_ai_token_quota: 50000,
          code: "premium",
          is_active: true,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subscription_plans", null, {});
  },
};
