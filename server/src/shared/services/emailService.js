import { brevoConfig } from "../../config/brevoConfig.js";

/**
 * Brevo Email Service
 * API Reference: https://developers.brevo.com/docs/send-transactional-email
 */

/**
 * Send email via Brevo API
 * @param {Object} mailData - Email data
 * @param {string} mailData.to - Recipient email
 * @param {string} mailData.subject - Email subject
 * @param {string} mailData.htmlBody - Email HTML content
 * @param {string} [mailData.textBody] - Email text content (optional)
 * @param {Array} [mailData.cc] - CC recipients (optional)
 * @param {Array} [mailData.bcc] - BCC recipients (optional)
 * @param {Array} [mailData.attachments] - Attachments (optional)
 * @returns {Promise<Object>} Response from Brevo API
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

    // Only add textContent if provided (not empty)
    if (mailData.textBody && mailData.textBody.trim()) {
      payload.textContent = mailData.textBody;
    }

    // Add optional fields if provided
    if (mailData.cc && mailData.cc.length > 0) {
      payload.cc = mailData.cc.map((email) => ({ email }));
    }

    if (mailData.bcc && mailData.bcc.length > 0) {
      payload.bcc = mailData.bcc.map((email) => ({ email }));
    }

    if (mailData.attachments && mailData.attachments.length > 0) {
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

/**
 * Send Welcome Email
 * Sent when user registers
 */
export const sendWelcomeEmail = async (user) => {
  const { user_email, full_name } = user;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #3498db;">🎉 Chào mừng đến Enggo Learning!</h1>
      
      <p>Xin chào <strong>${full_name}</strong>,</p>
      
      <p>Cảm ơn bạn đã đăng ký tài khoản tại Enggo Learning. Chúng tôi rất vui mừng chào đón bạn!</p>
      
      <h2 style="color: #2c3e50;">🎁 Bạn nhận được:</h2>
      <ul style="font-size: 16px; line-height: 1.8;">
        <li><strong>Gói Free:</strong> 1,000 AI tokens/tháng</li>
        <li><strong>Truy cập:</strong> Tất cả khóa học miễn phí</li>
        <li><strong>Hiệu lực:</strong> 30 ngày kể từ ngày đăng ký</li>
      </ul>
      
      <h2 style="color: #2c3e50;">🚀 Bước tiếp theo:</h2>
      <ol style="font-size: 16px; line-height: 1.8;">
        <li>Đăng nhập vào tài khoản của bạn</li>
        <li>Khám phá các khóa học</li>
        <li>Bắt đầu học tập!</li>
      </ol>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
      </p>
      
      <p style="color: #7f8c8d;">
        Trân trọng,<br/>
        <strong>Enggo Learning Team</strong>
      </p>
    </div>
  `;

  return sendEmail({
    to: user_email,
    subject: "Chào mừng đến Enggo Learning! 🎉",
    htmlBody,
  });
};

/**
 * Send Invoice Email
 * Sent after successful payment
 */
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #27ae60;">✅ Hóa đơn thanh toán</h1>
      
      <p>Xin chào <strong>${full_name}</strong>,</p>
      
      <p>Cảm ơn bạn đã thanh toán! Dưới đây là chi tiết hóa đơn của bạn.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">📋 Chi tiết đơn hàng</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ecf0f1;">
            <td style="padding: 10px 0; font-weight: bold;">Mã đơn:</td>
            <td style="padding: 10px 0; text-align: right;">#${order_id}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ecf0f1;">
            <td style="padding: 10px 0; font-weight: bold;">Gói:</td>
            <td style="padding: 10px 0; text-align: right;">${plan_name} (${billing_type})</td>
          </tr>
          <tr style="border-bottom: 1px solid #ecf0f1;">
            <td style="padding: 10px 0; font-weight: bold;">Số tiền:</td>
            <td style="padding: 10px 0; text-align: right; color: #27ae60; font-size: 18px; font-weight: bold;">
              ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total_amount)}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #ecf0f1;">
            <td style="padding: 10px 0; font-weight: bold;">Ngày thanh toán:</td>
            <td style="padding: 10px 0; text-align: right;">${formatDate(created_at)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Hết hạn:</td>
            <td style="padding: 10px 0; text-align: right;">${formatDate(subscription_expires_at)}</td>
          </tr>
        </table>
      </div>
      
      <h3 style="color: #2c3e50;">🎉 Bạn có thể:</h3>
      <ul style="font-size: 16px; line-height: 1.8;">
        <li>Truy cập toàn bộ khóa học premium</li>
        <li>Sử dụng AI tokens để giải bài tập</li>
        <li>Download tài liệu học tập</li>
      </ul>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
        Câu hỏi về hóa đơn? Liên hệ: support@enggo.com
      </p>
      
      <p style="color: #7f8c8d;">
        Trân trọng,<br/>
        <strong>Enggo Learning Team</strong>
      </p>
    </div>
  `;

  return sendEmail({
    to: user_email,
    subject: `Hóa đơn thanh toán - Đơn #${order_id}`,
    htmlBody,
  });
};

/**
 * Send Renewal Reminder Email
 * Sent 7 days before subscription expires
 */
export const sendRenewalReminderEmail = async (subscription) => {
  const { user_email, full_name, plan_name, expired_at, remaining_tokens } =
    subscription;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const daysRemaining = Math.ceil(
    (new Date(expired_at) - new Date()) / (1000 * 60 * 60 * 24),
  );

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #f39c12;">⏰ Nhắc nhở: Gói của bạn sắp hết hạn</h1>
      
      <p>Xin chào <strong>${full_name}</strong>,</p>
      
      <p style="font-size: 16px; color: #e74c3c;">
        Gói <strong>${plan_name}</strong> của bạn sẽ hết hạn trong <strong>${daysRemaining} ngày</strong> (${formatDate(expired_at)}).
      </p>
      
      <div style="background-color: #fff3cd; border-left: 4px solid #f39c12; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <h3 style="color: #f39c12; margin-top: 0;">📊 Thống kê hiện tại:</h3>
        <p><strong>AI Tokens còn lại:</strong> <span style="color: #e74c3c;">${remaining_tokens} tokens</span></p>
        <p><strong>Hết hạn vào:</strong> ${formatDate(expired_at)}</p>
      </div>
      
      <h3 style="color: #2c3e50;">🔄 Để tiếp tục học tập:</h3>
      <ol style="font-size: 16px; line-height: 1.8;">
        <li>Đăng nhập vào tài khoản</li>
        <li>Chọn nâng cấp gói</li>
        <li>Chọn gói Pro hoặc Premium (được nâng cấp giá lần tới!)</li>
        <li>Hoàn thành thanh toán</li>
      </ol>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
        <strong>💡 Mẹo:</strong> Nếu bạn hủy gói, bạn vẫn có thể sử dụng nó cho đến hết hạn.
      </p>
      
      <p style="color: #7f8c8d;">
        Trân trọng,<br/>
        <strong>Enggo Learning Team</strong>
      </p>
    </div>
  `;

  return sendEmail({
    to: user_email,
    subject: `⏰ Nhắc nhở: Gói ${plan_name} sắp hết hạn (${daysRemaining} ngày)`,
    htmlBody,
  });
};

/**
 * Send Subscription Expired Notification
 * Sent when subscription expires and downgrades to free
 */
export const sendSubscriptionExpiredEmail = async (user) => {
  const { user_email, full_name } = user;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #e74c3c;">📢 Gói của bạn đã hết hạn</h1>
      
      <p>Xin chào <strong>${full_name}</strong>,</p>
      
      <p style="font-size: 16px; color: #e74c3c;">
        <strong>Gói của bạn đã hết hạn</strong> và tài khoản đã được hạ cấp về <strong>Free</strong>.
      </p>
      
      <div style="background-color: #f8d7da; border-left: 4px solid #e74c3c; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <h3 style="color: #e74c3c; margin-top: 0;">Thay đổi:</h3>
        <ul style="margin: 0;">
          <li>✅ Gói Free được kích hoạt</li>
          <li>✅ 1,000 AI tokens mới được cấp</li>
          <li>✅ Truy cập tất cả khóa học miễn phí</li>
        </ul>
      </div>
      
      <h3 style="color: #2c3e50;">📚 Khóa học miễn phí bạn có thể truy cập:</h3>
      <ul style="font-size: 16px; line-height: 1.8;">
        <li>Tất cả bài học cấp độ cơ bản</li>
        <li>Flashcards học từ vựng</li>
        <li>Bài tập luyện tập</li>
      </ul>
      
      <h3 style="color: #2c3e50;">🚀 Muốn quay lại Premium?</h3>
      <p style="font-size: 16px; line-height: 1.8;">
        Nâng cấp lên gói <strong>Pro</strong> hoặc <strong>Premium</strong> để tiếp tục truy cập tất cả tài liệu.
      </p>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
        Cần giúp đỡ? Liên hệ: support@enggo.com
      </p>
      
      <p style="color: #7f8c8d;">
        Trân trọng,<br/>
        <strong>Enggo Learning Team</strong>
      </p>
    </div>
  `;

  return sendEmail({
    to: user_email,
    subject: "Gói của bạn đã hết hạn - Chuyển về Free",
    htmlBody,
  });
};
