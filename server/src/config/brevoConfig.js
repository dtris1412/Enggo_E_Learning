import dotenv from "dotenv";

dotenv.config();

/**
 * Brevo Email Service Configuration
 *
 * Cần các biến environment:
 * - BREVO_API_KEY: API key từ Brevo (https://app.brevo.com/settings/keys/api)
 * - BREVO_SENDER_EMAIL: Email gửi đi (VD: noreply@enggo.com)
 * - BREVO_SENDER_NAME: Tên hiển thị (VD: Enggo Learning)
 */

export const brevoConfig = {
  apiKey: process.env.BREVO_API_KEY,
  senderEmail: process.env.BREVO_SENDER_EMAIL || "noreply@enggo.com",
  senderName: process.env.BREVO_SENDER_NAME || "Enggo Learning",
  apiUrl: "https://api.brevo.com/v3",
};

// Validate configuration
export const validateBrevoConfig = () => {
  if (!brevoConfig.apiKey) {
    console.warn(
      "⚠️ BREVO_API_KEY not found in environment variables. Email service will not work.",
    );
    return false;
  }
  return true;
};
