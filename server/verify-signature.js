import crypto from "crypto";

/**
 * Script để verify VNPay signature generation
 * So sánh với data thực tế từ logs
 */

// EXACT data từ log cuối cùng của user
const testData = {
  vnp_Amount: 19900000,
  vnp_BankCode: "NCB",
  vnp_Command: "pay",
  vnp_CreateDate: "20260309180815",
  vnp_CurrCode: "VND",
  vnp_IpAddr: "127.0.0.1",
  vnp_Locale: "vn",
  vnp_OrderInfo: "Subscription Pro monthly",
  vnp_OrderType: "other",
  vnp_ReturnUrl: "http://localhost:8080/api/payment/vnpay/callback",
  vnp_TmnCode: "LD93OCFU",
  vnp_TxnRef: "23",
  vnp_Version: "2.1.0",
};

// Hash secret từ .env
const hashSecrets = [
  "MM9M40KG9FRAZ97M32FYIIHD7N3BA2JF", // Current
  "RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ", // Demo
];

// Expected hash từ log
const expectedHash =
  "3e76e793032926df433a424f5317038e05d840fa8e40624b9c2c77eeff5f411af7b0d02b91a3d9a33aed30c7d3d1179519831eb4e985f4d444a6545487400f8b";

console.log("=== VNPAY SIGNATURE VERIFICATION ===\n");

// Check 1: Verify all required params
console.log("1. CHECKING REQUIRED PARAMS:");
const requiredParams = [
  "vnp_Version",
  "vnp_Command",
  "vnp_TmnCode",
  "vnp_Amount",
  "vnp_CreateDate",
  "vnp_CurrCode",
  "vnp_TxnRef",
  "vnp_OrderType",
  "vnp_OrderInfo",
  "vnp_ReturnUrl",
  "vnp_IpAddr",
  "vnp_Locale",
];

const missingParams = requiredParams.filter((param) => !(param in testData));
if (missingParams.length > 0) {
  console.log("   ❌ Missing params:", missingParams);
} else {
  console.log("   ✅ All required params present");
}

// Check 2: Verify sorting order
console.log("\n2. CHECKING SORT ORDER:");
const sortedKeys = Object.keys(testData).sort();
console.log("   Sorted keys:", sortedKeys);

// Check 3: Build signData
console.log("\n3. BUILDING SIGN DATA:");
const signData = sortedKeys.map((key) => `${key}=${testData[key]}`).join("&");
console.log("   SignData length:", signData.length);
console.log("   SignData:\n   ", signData);

// Check 4: Test với các hash secrets khác nhau
console.log("\n4. TESTING HASH GENERATION:");
hashSecrets.forEach((secret, index) => {
  const hmac = crypto.createHmac("sha512", secret);
  const hash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  console.log(`\n   Secret #${index + 1}: ${secret}`);
  console.log(`   Generated hash: ${hash}`);
  console.log(`   Expected hash:  ${expectedHash}`);
  console.log(`   Match: ${hash === expectedHash ? "✅ YES" : "❌ NO"}`);
});

// Check 5: Verify signData format
console.log("\n5. SIGN DATA ANALYSIS:");
console.log("   Format: key=value&key=value&...");
console.log("   No encoding: ✓");
console.log("   Alphabetically sorted: ✓");
console.log("   No spaces around =: ✓");
console.log("   No spaces around &: ✓");

// Check 6: Check for common issues
console.log("\n6. COMMON ISSUES CHECK:");
console.log(
  "   - Có space thừa?",
  signData.includes("  ") ? "❌ YES" : "✅ NO",
);
console.log("   - Có encoding?", signData.includes("%") ? "❌ YES" : "✅ NO");
console.log(
  "   - Có [object Object]?",
  signData.includes("[object") ? "❌ YES" : "✅ NO",
);
console.log(
  "   - OrderInfo có ký tự đặc biệt?",
  /[^a-zA-Z0-9\s]/.test(testData.vnp_OrderInfo) ? "❌ YES" : "✅ NO",
);

// Check 7: Test without BankCode (optional param)
console.log("\n7. TEST WITHOUT OPTIONAL PARAMS:");
const testDataNoBankCode = { ...testData };
delete testDataNoBankCode.vnp_BankCode;

const signDataNoBankCode = Object.keys(testDataNoBankCode)
  .sort()
  .map((key) => `${key}=${testDataNoBankCode[key]}`)
  .join("&");

console.log("   SignData (no BankCode):\n   ", signDataNoBankCode);

hashSecrets.forEach((secret, index) => {
  const hmac = crypto.createHmac("sha512", secret);
  const hash = hmac
    .update(Buffer.from(signDataNoBankCode, "utf-8"))
    .digest("hex");
  console.log(`\n   Secret #${index + 1} hash: ${hash.substring(0, 50)}...`);
});

console.log("\n====================================");
console.log("\nCONCLUSION:");
console.log(
  "Nếu KHÔNG có hash match → Hash Secret SAI hoặc merchant account không hợp lệ",
);
console.log(
  "Nếu có hash match → Kiểm tra VNPay merchant settings (return URL whitelist, etc.)",
);
