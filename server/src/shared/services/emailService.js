import { brevoConfig } from "../../config/brevoConfig.js";

/**
 * Brevo Email Service
 * API Reference: https://developers.brevo.com/docs/send-transactional-email
 */

/* ====================== COMMON STYLES ====================== */
const baseStyles = {
  container:
    "max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);",
  header:
    "background-color: #1e40af; padding: 40px 30px; text-align: center; color: white;",
  content: "padding: 40px 30px;",
  button:
    "display: inline-block; padding: 14px 32px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;",
  footer:
    "background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #64748b; line-height: 1.5;",
};

/**
 * Send email via Brevo API
 */
export const sendEmail = async (mailData) => {
  if (!brevoConfig.apiKey) {
    console.error("❌ Brevo API key not configured");
    throw new Error("Email service not configured");
  }

  try {
    const payload = {
      sender: {
        name: brevoConfig.senderName,
        email: brevoConfig.senderEmail,
      },
      to: [{ email: mailData.to }],
      subject: mailData.subject,
      htmlContent: mailData.htmlBody,
    };

    if (mailData.textBody && mailData.textBody.trim()) {
      payload.textContent = mailData.textBody;
    }

    if (mailData.cc?.length > 0) {
      payload.cc = mailData.cc.map((email) => ({ email }));
    }
    if (mailData.bcc?.length > 0) {
      payload.bcc = mailData.bcc.map((email) => ({ email }));
    }
    if (mailData.attachments?.length > 0) {
      payload.attachment = mailData.attachments;
    }

    const response = await fetch(`${brevoConfig.apiUrl}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": brevoConfig.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Brevo API Error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log(
      `✅ Email sent to ${mailData.to} - Message ID: ${result.messageId}`,
    );
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/* ====================== WELCOME EMAIL ====================== */
export const sendWelcomeEmail = async (user) => {
  const { user_email, full_name } = user;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="${baseStyles.container}">
        
        <div style="${baseStyles.header}">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Chào mừng đến Enggo Learning</h1>
          <p style="margin: 12px 0 0 0; font-size: 15px; opacity: 0.95;">Bắt đầu hành trình học tập của bạn</p>
        </div>

        <div style="${baseStyles.content}">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e2937;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
            Cảm ơn bạn đã tạo tài khoản tại Enggo Learning. Chúng tôi rất vui mừng chào đón bạn vào cộng đồng học tập.
          </p>

          <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 24px; border-radius: 8px; margin: 28px 0;">
            <h2 style="margin: 0 0 16px 0; font-size: 17px; color: #1e40af;">Bạn nhận được:</h2>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #475569;">
              <li>1.000 AI tokens mỗi tháng</li>
              <li>Truy cập toàn bộ khóa học miễn phí</li>
              <li>Hệ thống Flashcard thông minh</li>
              <li>Hỗ trợ học tập cơ bản</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login" style="${baseStyles.button}">Bắt đầu học ngay</a>
          </div>
        </div>

        <div style="${baseStyles.footer}">
          <p style="margin: 0;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ <strong>support@enggo.com</strong></p>
          <p style="margin: 12px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: "Chào mừng bạn đến Enggo Learning",
    htmlBody,
  });
};

/* ====================== INVOICE EMAIL ====================== */
export const sendInvoiceEmail = async (order) => {
  const {
    user_email,
    full_name,
    order_id,
    total_amount,
    billing_type,
    plan_name,
    created_at,
    subscription_expires_at,
  } = order;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="${baseStyles.container}">
        
        <div style="background-color: #166534; padding: 40px 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Thanh toán thành công</h1>
          <p style="margin: 10px 0 0 0; font-size: 15px; opacity: 0.9;">Cảm ơn bạn đã nâng cấp gói học</p>
        </div>

        <div style="${baseStyles.content}">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e2937;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
            Thanh toán của bạn đã được xử lý thành công. Gói học đã được kích hoạt.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; margin: 28px 0;">
            <h2 style="margin: 0 0 18px 0; font-size: 17px; color: #1e2937;">Chi tiết hóa đơn</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr><td style="padding: 10px 0; color: #64748b; width: 45%;">Mã đơn hàng</td><td style="padding: 10px 0; text-align: right; font-weight: 600;">#${order_id}</td></tr>
              <tr><td style="padding: 10px 0; color: #64748b;">Gói</td><td style="padding: 10px 0; text-align: right; font-weight: 600;">${plan_name} (${billing_type})</td></tr>
              <tr><td style="padding: 10px 0; color: #64748b;">Ngày thanh toán</td><td style="padding: 10px 0; text-align: right;">${formatDate(created_at)}</td></tr>
              <tr><td style="padding: 10px 0; color: #64748b;">Hết hạn</td><td style="padding: 10px 0; text-align: right;">${formatDate(subscription_expires_at)}</td></tr>
              <tr style="background-color: #f0fdf4;">
                <td style="padding: 14px 0; font-weight: 600; color: #166534;">Tổng thanh toán</td>
                <td style="padding: 14px 0; text-align: right; font-size: 18px; font-weight: 700; color: #166534;">
                  ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total_amount)}
                </td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/learning" style="${baseStyles.button}">Bắt đầu học ngay</a>
          </div>
        </div>

        <div style="${baseStyles.footer}">
          <p style="margin: 0;">Câu hỏi về hóa đơn? Liên hệ <strong>support@enggo.com</strong></p>
          <p style="margin: 12px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `Thanh toán thành công - Đơn #${order_id}`,
    htmlBody,
  });
};

/* ====================== RENEWAL REMINDER ====================== */
export const sendRenewalReminderEmail = async (subscription) => {
  const { user_email, full_name, plan_name, expired_at, remaining_tokens } =
    subscription;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const daysRemaining = Math.ceil(
    (new Date(expired_at) - new Date()) / (1000 * 60 * 60 * 24),
  );

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="${baseStyles.container}">
        
        <div style="background-color: #d97706; padding: 40px 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Gói của bạn sắp hết hạn</h1>
          <p style="margin: 12px 0 0 0; font-size: 15px;">Còn ${daysRemaining} ngày</p>
        </div>

        <div style="${baseStyles.content}">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e2937;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
            Gói <strong>${plan_name}</strong> sẽ hết hạn vào ngày <strong>${formatDate(expired_at)}</strong>.
          </p>

          <div style="background-color: #fffbeb; border: 1px solid #fcd34d; padding: 24px; border-radius: 8px; margin: 28px 0;">
            <p style="margin: 8px 0;"><strong>AI Tokens còn lại:</strong> ${remaining_tokens} tokens</p>
            <p style="margin: 8px 0;"><strong>Ngày hết hạn:</strong> ${formatDate(expired_at)}</p>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/subscription/upgrade" style="${baseStyles.button}">Nâng cấp gói ngay</a>
          </div>
        </div>

        <div style="${baseStyles.footer}">
          <p style="margin: 0;">Cần hỗ trợ? Liên hệ <strong>support@enggo.com</strong></p>
          <p style="margin: 12px 0 0 0;">© 2026 Enggo Learning</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `Nhắc nhở: Gói ${plan_name} sắp hết hạn (${daysRemaining} ngày)`,
    htmlBody,
  });
};

/* ====================== SUBSCRIPTION EXPIRED ====================== */
export const sendSubscriptionExpiredEmail = async (user) => {
  const { user_email, full_name } = user;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="${baseStyles.container}">
        
        <div style="background-color: #b91c1c; padding: 40px 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Gói Premium đã hết hạn</h1>
        </div>

        <div style="${baseStyles.content}">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e2937;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
            Gói Premium của bạn đã hết hạn. Tài khoản đã được tự động chuyển về gói Free.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/subscription/upgrade" style="${baseStyles.button}">Nâng cấp gói</a>
          </div>
        </div>

        <div style="${baseStyles.footer}">
          <p style="margin: 0;">Cần hỗ trợ? Liên hệ <strong>support@enggo.com</strong></p>
          <p style="margin: 12px 0 0 0;">© 2026 Enggo Learning</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: "Gói của bạn đã hết hạn - Chuyển về Free",
    htmlBody,
  });
};

/* ====================== DAILY FLASHCARD REMINDER ====================== */
export const sendDailyFlashcardReminderEmail = async (userData) => {
  const { user_email, full_name, total_due_cards, due_sets_summary } = userData;

  const setsSummaryHTML = due_sets_summary
    .slice(0, 5)
    .map(
      (set) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${set.set_name}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #4338ca;">${set.due_count} card</td>
      </tr>
    `,
    )
    .join("");

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="${baseStyles.container}">
        
        <div style="${baseStyles.header}">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Đến lúc ôn tập Flashcard</h1>
          <p style="margin: 12px 0 0 0; font-size: 15px;">Hôm nay bạn có ${total_due_cards} thẻ cần ôn</p>
        </div>

        <div style="${baseStyles.content}">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e2937;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #334155;">
            Bạn có <strong>${total_due_cards} flashcard</strong> cần ôn tập hôm nay theo thuật toán SM-2.
          </p>

          ${
            due_sets_summary.length > 0
              ? `
          <div style="margin: 28px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e2937;">Phân bổ theo bộ:</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
              ${setsSummaryHTML}
            </table>
          </div>`
              : ""
          }

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/flashcard" style="${baseStyles.button}">Ôn tập ngay hôm nay</a>
          </div>
        </div>

        <div style="${baseStyles.footer}">
          <p style="margin: 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `Nhắc nhở: ${total_due_cards} flashcard cần ôn tập hôm nay`,
    htmlBody,
  });
};

/* ====================== SINGLE SET FLASHCARD REMINDER ====================== */
export const sendFlashcardReminderEmail = async (flashcardData) => {
  const { user_email, full_name, set_name, set_id, due_count } = flashcardData;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="${baseStyles.container}">
        
        <div style="${baseStyles.header}">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Đến lúc ôn tập</h1>
          <p style="margin: 12px 0 0 0; font-size: 15px;">Bộ ${set_name}</p>
        </div>

        <div style="${baseStyles.content}">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1e2937;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
            Bộ flashcard <strong>${set_name}</strong> có <strong>${due_count} thẻ</strong> đang chờ bạn ôn tập.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/flashcard/set/${set_id}/learn" style="${baseStyles.button}">Bắt đầu ôn tập</a>
          </div>
        </div>

        <div style="${baseStyles.footer}">
          <p style="margin: 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `Nhắc nhở ôn tập: ${set_name} (${due_count} card)`,
    htmlBody,
  });
};
