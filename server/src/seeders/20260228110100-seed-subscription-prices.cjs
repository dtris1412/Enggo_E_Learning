"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy IDs của subscription plans theo code
    const [freePlan] = await queryInterface.sequelize.query(
      `SELECT subscription_plan_id FROM subscription_plans WHERE code = 'free' LIMIT 1`,
    );

    const [proPlan] = await queryInterface.sequelize.query(
      `SELECT subscription_plan_id FROM subscription_plans WHERE code = 'pro' LIMIT 1`,
    );

    const [premiumPlan] = await queryInterface.sequelize.query(
      `SELECT subscription_plan_id FROM subscription_plans WHERE code = 'premium' LIMIT 1`,
    );

    const prices = [];

    // Free Plan - Monthly
    if (freePlan && freePlan[0]) {
      prices.push({
        subscription_plan_id: freePlan[0].subscription_plan_id,
        billing_type: "monthly",
        duration_days: 30,
        price: 0,
        discount_percentage: null,
        is_active: true,
      });
    }

    // Pro Plan - Monthly
    if (proPlan && proPlan[0]) {
      prices.push({
        subscription_plan_id: proPlan[0].subscription_plan_id,
        billing_type: "monthly",
        duration_days: 30,
        price: 99000,
        discount_percentage: null,
        is_active: true,
      });

      // Pro Plan - Yearly (với discount)
      prices.push({
        subscription_plan_id: proPlan[0].subscription_plan_id,
        billing_type: "yearly",
        duration_days: 365,
        price: 990000,
        discount_percentage: 15,
        is_active: true,
      });

      // Pro Plan - Weekly
      prices.push({
        subscription_plan_id: proPlan[0].subscription_plan_id,
        billing_type: "weekly",
        duration_days: 7,
        price: 29000,
        discount_percentage: null,
        is_active: true,
      });
    }

    // Premium Plan - Monthly
    if (premiumPlan && premiumPlan[0]) {
      prices.push({
        subscription_plan_id: premiumPlan[0].subscription_plan_id,
        billing_type: "monthly",
        duration_days: 30,
        price: 299000,
        discount_percentage: null,
        is_active: true,
      });

      // Premium Plan - Yearly (với discount)
      prices.push({
        subscription_plan_id: premiumPlan[0].subscription_plan_id,
        billing_type: "yearly",
        duration_days: 365,
        price: 2990000,
        discount_percentage: 20,
        is_active: true,
      });

      // Premium Plan - Weekly
      prices.push({
        subscription_plan_id: premiumPlan[0].subscription_plan_id,
        billing_type: "weekly",
        duration_days: 7,
        price: 89000,
        discount_percentage: null,
        is_active: true,
      });
    }

    if (prices.length > 0) {
      await queryInterface.bulkInsert("subscription_prices", prices, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subscription_prices", null, {});
  },
};
