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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Gradient -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🎉 Chào mừng đến Enggo Learning!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Bắt đầu hành trình học tập của bạn ngày hôm nay</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #2c3e50;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 20px 0; font-size: 15px; color: #555; line-height: 1.6;">
            Cảm ơn bạn đã tạo tài khoản tại Enggo Learning. Chúng tôi rất vui mừng chào đón bạn vào cộng đồng học tập của chúng tôi! 🚀
          </p>

          <!-- Card: Welcome Package -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 8px; color: white; margin: 30px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px;">🎁 Bạn nhận được Gói Free:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin: 10px 0; font-size: 15px;">✨ <strong>1,000 AI tokens</strong> mỗi tháng</li>
              <li style="margin: 10px 0; font-size: 15px;">📚 <strong>Truy cập toàn bộ</strong> khóa học miễn phí</li>
              <li style="margin: 10px 0; font-size: 15px;">📝 <strong>Flashcard</strong> học từ vựng</li>
              <li style="margin: 10px 0; font-size: 15px;">⏰ <strong>Hiệu lực 30 ngày</strong> kể từ ngày đăng ký</li>
            </ul>
          </div>

          <!-- Card: Next Steps -->
          <div style="background-color: #f0f4ff; padding: 24px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #667eea;">🚀 Bước tiếp theo:</h2>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Đăng nhập</strong> vào tài khoản của bạn</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Khám phá</strong> các khóa học</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Bắt đầu học</strong> ngay hôm nay</li>
            </ol>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Bắt đầu học ngay</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 20px 30px; border-top: 1px solid #e0e6ed; text-align: center; font-size: 13px; color: #7f8c8d;">
          <p style="margin: 0;">Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi tại <strong>support@enggo.com</strong></p>
          <p style="margin: 10px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: "Chào mừng bạn đến Enggo Learning! 🎉",
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Gradient -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">✅ Thanh toán thành công</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Cảm ơn bạn đã nâng cấp gói</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #2c3e50;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 20px 0; font-size: 15px; color: #555; line-height: 1.6;">
            Thanh toán của bạn đã được xử lý thành công! Đơn hàng dưới đây hiện đã kích hoạt.
          </p>

          <!-- Invoice Card -->
          <div style="background-color: #f0fdf4; border: 1px solid #d1fae5; padding: 24px; border-radius: 8px; margin: 30px 0;">
            <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #059669;">📋 Chi tiết hóa đơn</h2>
            
            <div style="display: table; width: 100%; margin-bottom: 15px;">
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; font-weight: 500; color: #2c3e50; width: 50%;">Mã đơn:</div>
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; text-align: right; color: #059669;"><strong>#${order_id}</strong></div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; font-weight: 500; color: #2c3e50;">Gói:</div>
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; text-align: right; color: #2c3e50;"><strong>${plan_name}</strong> (${billing_type})</div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; font-weight: 500; color: #2c3e50;">Ngày thanh toán:</div>
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; text-align: right; color: #2c3e50;">${formatDate(created_at)}</div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; font-weight: 500; color: #2c3e50;">Hết hạn:</div>
                <div style="display: table-cell; padding: 10px 0; border-bottom: 1px solid #d1fae5; text-align: right; color: #e74c3c;"><strong>${formatDate(subscription_expires_at)}</strong></div>
              </div>
              <div style="display: table-row; background-color: #ecfdf5;">
                <div style="display: table-cell; padding: 12px 0; font-weight: 600; color: #059669; font-size: 16px;">Tổng cộng:</div>
                <div style="display: table-cell; padding: 12px 0; text-align: right; color: #059669; font-size: 18px; font-weight: 600;">
                  ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total_amount)}
                </div>
              </div>
            </div>
          </div>

          <!-- Features Card -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px;">🎉 Bạn hiện có thể:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin: 10px 0; font-size: 15px;">✨ Truy cập toàn bộ khóa học premium</li>
              <li style="margin: 10px 0; font-size: 15px;">🤖 Sử dụng AI tokens không giới hạn</li>
              <li style="margin: 10px 0; font-size: 15px;">📥 Download tất cả tài liệu học tập</li>
              <li style="margin: 10px 0; font-size: 15px;">⭐ Ưu tiên hỗ trợ từ đội ngũ của chúng tôi</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/learning" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Bắt đầu học ngay</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 20px 30px; border-top: 1px solid #e0e6ed; text-align: center; font-size: 13px; color: #7f8c8d;">
          <p style="margin: 0;">Câu hỏi về hóa đơn? Liên hệ: <strong>support@enggo.com</strong></p>
          <p style="margin: 10px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `✅ Thanh toán thành công - Đơn #${order_id}`,
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Gradient -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">⏰ Gói của bạn sắp hết hạn</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Chỉ còn <strong>${daysRemaining} ngày</strong> để giữ lại quyền truy cập</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #2c3e50;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 20px 0; font-size: 15px; color: #e74c3c; line-height: 1.6; font-weight: 600;">
            Gói <strong>${plan_name}</strong> sẽ hết hạn trong <strong>${daysRemaining} ngày</strong> (${formatDate(expired_at)}).
          </p>

          <!-- Stats Card -->
          <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffe5a1 100%); border-left: 4px solid #f59e0b; padding: 24px; border-radius: 8px; margin: 30px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #d97706;">📊 Thống kê hiện tại:</h2>
            <div style="margin: 12px 0;">
              <div style="font-size: 14px; color: #666;">AI Tokens còn lại:</div>
              <div style="font-size: 24px; font-weight: 600; color: #d97706;">${remaining_tokens} tokens</div>
            </div>
            <div style="margin: 12px 0; padding-top: 12px; border-top: 1px solid #fecb81;">
              <div style="font-size: 14px; color: #666;">Hết hạn vào:</div>
              <div style="font-size: 16px; font-weight: 600; color: #d97706;">${formatDate(expired_at)}</div>
            </div>
          </div>

          <!-- Action Card -->
          <div style="background-color: #f0f4ff; border: 1px solid #dbeafe; padding: 24px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #667eea;">🔄 Để tiếp tục học tập:</h2>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Đăng nhập</strong> vào tài khoản</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Chọn nâng cấp</strong> gói</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Chọn gói mới</strong> phù hợp</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;"><strong>Hoàn thành thanh toán</strong></li>
            </ol>
          </div>

          <!-- Tip -->
          <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #2e7d32;">
              <strong>💡 Mẹo:</strong> Nếu bạn hủy gói trước khi hết hạn, bạn vẫn có thể sử dụng nó đầy đủ cho đến hết hạn.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/subscription/upgrade" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Nâng cấp gói ngay</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 20px 30px; border-top: 1px solid #e0e6ed; text-align: center; font-size: 13px; color: #7f8c8d;">
          <p style="margin: 0;">Cần giúp đỡ? Liên hệ: <strong>support@enggo.com</strong></p>
          <p style="margin: 10px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Gradient -->
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📢 Gói của bạn đã hết hạn</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Nhưng đừng lo, gói Free vẫn có sẵn cho bạn</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #2c3e50;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 20px 0; font-size: 15px; color: #555; line-height: 1.6;">
            Gói Premium của bạn đã hết hạn. Nhưng đừng lo! Tài khoản của bạn đã tự động được hạ cấp về <strong>gói Free</strong> - vẫn rất tuyệt!
          </p>

          <!-- Changes Card -->
          <div style="background: linear-gradient(135deg, #fecaca 0%, #fda2a2 100%); border-left: 4px solid #ef4444; padding: 24px; border-radius: 8px; margin: 30px 0; color: #7f1d1d;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #991b1b;">📊 Thay đổi tài khoản:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin: 10px 0; font-size: 15px;">✅ <strong>Gói Free</strong> đã được kích hoạt</li>
              <li style="margin: 10px 0; font-size: 15px;">✨ Bạn nhận được <strong>1,000 AI tokens mới</strong></li>
              <li style="margin: 10px 0; font-size: 15px;">📚 Truy cập <strong>tất cả khóa học miễn phí</strong></li>
              <li style="margin: 10px 0; font-size: 15px;">⏰ Hiệu lực trong <strong>30 ngày tới</strong></li>
            </ul>
          </div>

          <!-- Benefits Card -->
          <div style="background-color: #f0f4ff; border: 1px solid #dbeafe; padding: 24px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #667eea;">📚 Bạn vẫn có thể:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;">Truy cập tất cả bài học cơ bản</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;">Học Flashcards từ vựng</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;">Làm bài tập luyện tập</li>
              <li style="margin: 10px 0; font-size: 15px; color: #2c3e50;">Sử dụng 1,000 AI tokens/tháng</li>
            </ul>
          </div>

          <!-- Upgrade Card -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 18px;">🚀 Muốn tiếp tục với Premium?</h2>
            <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">
              Nâng cấp lên gói <strong>Pro</strong> hoặc <strong>Premium</strong> để:
            </p>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0; font-size: 14px;">💎 Truy cập tất cả khóa học premium</li>
              <li style="margin: 8px 0; font-size: 14px;">🤖 AI tokens không giới hạn</li>
              <li style="margin: 8px 0; font-size: 14px;">📥 Download tài liệu</li>
            </ul>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/subscription/upgrade" style="display: inline-block; padding: 12px 32px; margin: 0 10px 10px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Nâng cấp gói</a>
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/learning" style="display: inline-block; padding: 12px 32px; margin: 0 10px 10px 0; background-color: #e5e7eb; color: #2c3e50; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Tiếp tục học</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 20px 30px; border-top: 1px solid #e0e6ed; text-align: center; font-size: 13px; color: #7f8c8d;">
          <p style="margin: 0;">Cần giúp đỡ? Liên hệ: <strong>support@enggo.com</strong></p>
          <p style="margin: 10px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
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

/**
 * Send Flashcard Review Reminder Email
 * Sent when user has cards due for SM-2 review
 */
// Send daily flashcard review reminder - 1 email per user with total due cards count
export const sendDailyFlashcardReminderEmail = async (userData) => {
  const {
    user_email,
    full_name,
    total_due_cards,
    due_sets_summary, // Array of { set_name, due_count }
  } = userData;

  // Format sets summary for email
  const setsSummaryHTML = due_sets_summary
    .slice(0, 5) // Show top 5 sets
    .map(
      (set) =>
        `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e6ed; font-size: 14px;">
          📚 ${set.set_name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e6ed; text-align: center; font-weight: 600; color: #8b5cf6; font-size: 14px;">
          ${set.due_count} card
        </td>
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
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Gradient -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📚 Đến lúc ôn tập rồi!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Hôm nay bạn có flashcards cần ôn tập</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #2c3e50;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 30px 0; font-size: 15px; color: #555; line-height: 1.6;">
            Bạn có <strong>${total_due_cards} flashcard</strong> cần ôn tập hôm nay theo lịch trình SM-2. Hãy dành thời gian ôn tập để nâng cao khả năng nhớ lâu dài! 🎯
          </p>

          <!-- Big Number Card -->
          <div style="background: linear-gradient(135deg, #fecaca 0%, #fda2a2 100%); padding: 30px 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <div style="font-size: 48px; font-weight: 700; color: #991b1b;">${total_due_cards}</div>
            <div style="font-size: 16px; color: #7f1d1d; margin-top: 10px;">Flashcard chờ ôn tập hôm nay</div>
          </div>

          <!-- Sets Breakdown (if multiple) -->
          ${
            due_sets_summary.length > 0
              ? `
            <div style="margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #2c3e50;">📋 Phân bổ theo sets:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tbody>
                  ${setsSummaryHTML}
                </tbody>
              </table>
              ${
                due_sets_summary.length > 5
                  ? `<p style="margin: 15px 0 0 0; font-size: 13px; color: #7f8c8d; text-align: center;">... và ${due_sets_summary.length - 5} sets khác</p>`
                  : ""
              }
            </div>
          `
              : ""
          }

          <!-- SM-2 Info Card -->
          <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #667eea;">💡 Thuật toán SM-2</h3>
            <p style="margin: 0; font-size: 14px; color: #2c3e50; line-height: 1.6;">
              Lịch ôn tập được tính toán tối ưu dựa trên mức độ khó của mỗi card. Ôn tập đều đặn sẽ giúp bạn nhớ lâu hơn! 🧠
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/flashcard" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Bắt đầu ôn tập ngay</a>
          </div>

          <!-- Motivational Message -->
          <div style="background: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #5b21b6; font-style: italic;">
              "Mỗi ngày ôn tập một chút, kiến thức sẽ bền vững mãi. Bạn có thể đạt được mục tiêu! 💪"
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 20px 30px; border-top: 1px solid #e0e6ed; text-align: center; font-size: 13px; color: #7f8c8d;">
          <p style="margin: 0;">Được gửi vào lúc ${new Date().toLocaleTimeString("vi-VN")} (múi giờ của bạn)</p>
          <p style="margin: 10px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `📚 Nhắc nhở: ${total_due_cards} flashcard cần ôn tập hôm nay`,
    htmlBody,
  });
};

export const sendFlashcardReminderEmail = async (flashcardData) => {
  const {
    user_email,
    full_name,
    set_name,
    set_id,
    due_count,
    learning_count,
    mastered_count,
  } = flashcardData;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Gradient -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📚 Đến lúc ôn tập rồi!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Bạn có các card chờ ôn tập</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #2c3e50;">Xin chào <strong>${full_name}</strong>,</p>
          
          <p style="margin: 0 0 20px 0; font-size: 15px; color: #555; line-height: 1.6;">
            Flashcard set "<strong>${set_name}</strong>" có các card chờ bạn ôn tập theo thuật toán SM-2. Hãy cập nhật tiến độ học tập của bạn! 🎯
          </p>

          <!-- Stats Cards -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 30px 0;">
            <!-- Due Card -->
            <div style="background: linear-gradient(135deg, #fecaca 0%, #fda2a2 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #991b1b;">${due_count}</div>
              <div style="font-size: 13px; color: #7f1d1d; margin-top: 8px;">Chờ ôn tập</div>
            </div>

            <!-- Learning Card -->
            <div style="background: linear-gradient(135deg, #fef08a 0%, #fde047 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #713f12;">${learning_count}</div>
              <div style="font-size: 13px; color: #a16207; margin-top: 8px;">Đang học</div>
            </div>

            <!-- Mastered Card -->
            <div style="background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: 600; color: #15803d;">${mastered_count}</div>
              <div style="font-size: 13px; color: #166534; margin-top: 8px;">Đã thành thạo</div>
            </div>
          </div>

          <!-- SM-2 Info Card -->
          <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #667eea;">💡 Thuật toán SM-2 là gì?</h3>
            <p style="margin: 0; font-size: 14px; color: #2c3e50; line-height: 1.6;">
              SM-2 (Spaced Repetition Algorithm) giúp bạn ôn tập các card một cách khoa học. Các card có độ khó khác nhau sẽ được lên lịch ôn tập tối ưu để tối đa hóa khả năng nhớ lâu dài.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/flashcard/set/${flashcardData.set_id}/learn" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Bắt đầu ôn tập</a>
          </div>

          <!-- Motivational Message -->
          <div style="background: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #5b21b6; font-style: italic;">
              "Ôn tập đều đặn là chìa khóa để thành thạo một ngôn ngữ. Chúc bạn học tập tốt! 🌟"
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 20px 30px; border-top: 1px solid #e0e6ed; text-align: center; font-size: 13px; color: #7f8c8d;">
          <p style="margin: 0;">Bạn muốn giảm tần suất nhắc nhở? Kiểm tra cài đặt thông báo của bạn</p>
          <p style="margin: 10px 0 0 0;">© 2026 Enggo Learning. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user_email,
    subject: `📚 Nhắc nhở: Flashcards chờ ôn tập - "${set_name}" (${due_count} card)`,
    htmlBody,
  });
};
