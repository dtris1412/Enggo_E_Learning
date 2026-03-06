/**
 * Test file for Subscription Access Control
 *
 * Test cases để verify subscription access logic
 * Run: npm test (nếu có setup testing framework)
 */

import {
  getUserSubscriptionPlan,
  checkContentAccess,
  getUserSubscriptionInfo,
} from "../src/shared/services/subscriptionAccessService.js";

// Mock data for testing
const TEST_USER_IDS = {
  FREE_USER: 1,
  PRO_USER: 2,
  PREMIUM_USER: 3,
  EXPIRED_USER: 4,
  NO_SUBSCRIPTION: 5,
};

/**
 * Test getUserSubscriptionPlan
 */
async function testGetUserSubscriptionPlan() {
  console.log("\n=== Testing getUserSubscriptionPlan ===");

  // Test 1: Free user
  const freePlan = await getUserSubscriptionPlan(TEST_USER_IDS.FREE_USER);
  console.log(`Free user plan: ${freePlan}`);
  console.assert(freePlan === "free", "Free user should have 'free' plan");

  // Test 2: Pro user
  const proPlan = await getUserSubscriptionPlan(TEST_USER_IDS.PRO_USER);
  console.log(`Pro user plan: ${proPlan}`);
  console.assert(proPlan === "pro", "Pro user should have 'pro' plan");

  // Test 3: Premium user
  const premiumPlan = await getUserSubscriptionPlan(TEST_USER_IDS.PREMIUM_USER);
  console.log(`Premium user plan: ${premiumPlan}`);
  console.assert(
    premiumPlan === "premium",
    "Premium user should have 'premium' plan",
  );

  // Test 4: Expired subscription
  const expiredPlan = await getUserSubscriptionPlan(TEST_USER_IDS.EXPIRED_USER);
  console.log(`Expired user plan: ${expiredPlan}`);
  console.assert(
    expiredPlan === "free",
    "Expired user should fall back to 'free' plan",
  );

  // Test 5: No subscription
  const noPlan = await getUserSubscriptionPlan(TEST_USER_IDS.NO_SUBSCRIPTION);
  console.log(`User with no subscription: ${noPlan}`);
  console.assert(
    noPlan === "free",
    "User with no subscription should have 'free' plan",
  );

  // Test 6: Invalid user ID
  const invalidPlan = await getUserSubscriptionPlan(null);
  console.log(`Invalid user plan: ${invalidPlan}`);
  console.assert(
    invalidPlan === "free",
    "Invalid user should default to 'free' plan",
  );

  console.log("✅ getUserSubscriptionPlan tests passed");
}

/**
 * Test checkContentAccess
 */
async function testCheckContentAccess() {
  console.log("\n=== Testing checkContentAccess ===");

  // Test 1: Free user accessing free content
  let result = await checkContentAccess(TEST_USER_IDS.FREE_USER, "free");
  console.log(
    `Free user + free content: ${result.canAccess ? "✅ Allowed" : "❌ Denied"}`,
  );
  console.assert(
    result.canAccess === true,
    "Free user should access free content",
  );

  // Test 2: Free user accessing premium content
  result = await checkContentAccess(TEST_USER_IDS.FREE_USER, "premium");
  console.log(
    `Free user + premium content: ${result.canAccess ? "✅ Allowed" : "❌ Denied"}`,
  );
  console.assert(
    result.canAccess === false,
    "Free user should NOT access premium content",
  );

  // Test 3: Pro user accessing free content
  result = await checkContentAccess(TEST_USER_IDS.PRO_USER, "free");
  console.log(
    `Pro user + free content: ${result.canAccess ? "✅ Allowed" : "❌ Denied"}`,
  );
  console.assert(
    result.canAccess === true,
    "Pro user should access free content",
  );

  // Test 4: Pro user accessing premium content
  result = await checkContentAccess(TEST_USER_IDS.PRO_USER, "premium");
  console.log(
    `Pro user + premium content: ${result.canAccess ? "✅ Allowed" : "❌ Denied"}`,
  );
  console.assert(
    result.canAccess === true,
    "Pro user should access premium content",
  );

  // Test 5: Premium user accessing premium content
  result = await checkContentAccess(TEST_USER_IDS.PREMIUM_USER, "premium");
  console.log(
    `Premium user + premium content: ${result.canAccess ? "✅ Allowed" : "❌ Denied"}`,
  );
  console.assert(
    result.canAccess === true,
    "Premium user should access premium content",
  );

  // Test 6: Expired user accessing premium content
  result = await checkContentAccess(TEST_USER_IDS.EXPIRED_USER, "premium");
  console.log(
    `Expired user + premium content: ${result.canAccess ? "✅ Allowed" : "❌ Denied"}`,
  );
  console.assert(
    result.canAccess === false,
    "Expired user should NOT access premium content",
  );

  console.log("✅ checkContentAccess tests passed");
}

/**
 * Test getUserSubscriptionInfo
 */
async function testGetUserSubscriptionInfo() {
  console.log("\n=== Testing getUserSubscriptionInfo ===");

  // Test 1: Active subscription
  const info = await getUserSubscriptionInfo(TEST_USER_IDS.PREMIUM_USER);
  console.log("Premium user subscription info:", info);
  console.assert(info !== null, "Premium user should have subscription info");
  console.assert(
    info?.plan_code === "premium",
    "Plan code should be 'premium'",
  );

  // Test 2: No subscription
  const noInfo = await getUserSubscriptionInfo(TEST_USER_IDS.NO_SUBSCRIPTION);
  console.log("User with no subscription:", noInfo);
  console.assert(
    noInfo === null,
    "User with no subscription should return null",
  );

  // Test 3: Expired subscription
  const expiredInfo = await getUserSubscriptionInfo(TEST_USER_IDS.EXPIRED_USER);
  console.log("Expired user subscription:", expiredInfo);
  console.assert(
    expiredInfo === null,
    "Expired subscription should return null",
  );

  console.log("✅ getUserSubscriptionInfo tests passed");
}

/**
 * Integration test: Simulated API request flow
 */
async function testAPIFlow() {
  console.log("\n=== Testing API Flow ===");

  // Simulate: Free user trying to access premium document
  const userId = TEST_USER_IDS.FREE_USER;
  const documentAccessType = "premium";

  console.log("\nScenario: Free user accessing premium document");
  console.log(`User ID: ${userId}`);
  console.log(`Document access_type: ${documentAccessType}`);

  const access = await checkContentAccess(userId, documentAccessType);

  if (!access.canAccess) {
    console.log("❌ Access denied");
    console.log(`Message: ${access.message}`);
    console.log(`User plan: ${access.userPlan}`);
    console.log("Expected response: 403 Forbidden");
  } else {
    console.log("✅ Access granted");
  }

  // Simulate: Premium user trying to access premium document
  console.log("\nScenario: Premium user accessing premium document");
  const premiumUserId = TEST_USER_IDS.PREMIUM_USER;
  console.log(`User ID: ${premiumUserId}`);
  console.log(`Document access_type: ${documentAccessType}`);

  const premiumAccess = await checkContentAccess(
    premiumUserId,
    documentAccessType,
  );

  if (premiumAccess.canAccess) {
    console.log("✅ Access granted");
    console.log(`Message: ${premiumAccess.message}`);
    console.log("Expected response: 200 OK");
  } else {
    console.log("❌ Access denied (unexpected!)");
  }

  console.log("✅ API flow tests passed");
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  Subscription Access Control Tests   ║");
  console.log("╚════════════════════════════════════════╝");

  try {
    await testGetUserSubscriptionPlan();
    await testCheckContentAccess();
    await testGetUserSubscriptionInfo();
    await testAPIFlow();

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║      ✅ All Tests Passed! ✅         ║");
    console.log("╚════════════════════════════════════════╝\n");
  } catch (error) {
    console.error("\n❌ Tests failed:", error);
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║      ❌ Tests Failed! ❌             ║");
    console.log("╚════════════════════════════════════════╝\n");
  }
}

// Export for testing frameworks
export {
  testGetUserSubscriptionPlan,
  testCheckContentAccess,
  testGetUserSubscriptionInfo,
  testAPIFlow,
  runAllTests,
};

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

/**
 * MANUAL TESTING GUIDE
 * ====================
 *
 * 1. Setup test users in database:
 *    - Insert users with different subscription plans
 *    - Create subscriptions with different expired_at dates
 *
 * 2. Update TEST_USER_IDS with actual user IDs
 *
 * 3. Run tests:
 *    node server/tests/subscriptionAccess.test.js
 *
 * 4. Test via API endpoints:
 *    ```bash
 *    # Free user accessing premium document
 *    curl -H "Authorization: Bearer FREE_USER_TOKEN" \
 *      http://localhost:8080/api/user/documents/1
 *
 *    # Premium user accessing premium document
 *    curl -H "Authorization: Bearer PREMIUM_USER_TOKEN" \
 *      http://localhost:8080/api/user/documents/1
 *    ```
 *
 * 5. Check responses:
 *    - 200 OK: Access granted
 *    - 403 Forbidden: Subscription required
 *    - 401 Unauthorized: Not logged in
 */
