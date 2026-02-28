"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "subscription_plans",
      [
        {
          name: "Free",
          features: JSON.stringify([
            "Truy cập bài học cơ bản",
            "Giới hạn tính năng AI",
            "Giới hạn nguồn tài liệu",
          ]),
          monthly_ai_token_quota: 1000,
          code: "FREE",
          is_active: true,
        },
        {
          name: "Pro",
          features: JSON.stringify([
            "Truy cập toàn bộ nội dung",
            "Bài tập không giới hạn",
            "Hỗ trợ ưu tiên",
            "Tải tài liệu về máy",
            "Hỗ trợ toàn bộ tính năng AI",
            "Phân tích tiến độ nâng cao",
          ]),
          monthly_ai_token_quota: 10000,
          code: "PRO",
          is_active: true,
        },
        {
          name: "Premium",
          features: JSON.stringify([
            "Truy cập toàn bộ nội dung",
            "Bài tập không giới hạn",
            "Hỗ trợ ưu tiên",
            "Tải tài liệu về máy",
            "Hỗ trợ toàn bộ tính năng AI",
            "Phân tích tiến độ nâng cao",
          ]),
          monthly_ai_token_quota: 50000,
          code: "PREMIUM",
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
