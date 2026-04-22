import db from "../../models/index.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createSubscription } from "../../user/services/userSubscriptionService.js";
import { sendWelcomeEmail } from "./emailService.js";
dotenv.config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9,11}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
const SALT_ROUDS = 10;

const otpStore = {};

// Helper function to send OTP via email
const sendOTPEmail = async (user_email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Email Verification OTP - Enggo Learning",
      html: `<h3>Email Verification</h3>
             <p>Your OTP code is: <strong>${otp}</strong></p>
             <p>This code will expire in 5 minutes.</p>
             <p>Please do not share this code with anyone.</p>`,
    });
    return true;
  } catch (err) {
    console.error("Error sending OTP email:", err);
    return false;
  }
};

const forgotPassword = async (user_email) => {
  try {
    //Kiểm tra email có tồn tại không
    //Tạo OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //Lưu OTP vào bộ nhớ tạm thời với thời hạn 5 phút
    otpStore[user_email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    //Gửi OTP qua email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    });
    return { success: true, message: "OTP sent successfully" };
  } catch (err) {
    console.error("Error in forgot password service:", err);
    return { success: false, message: "Internal server error" };
  }
};
const resetPassword = async (user_name, user_email, otp, new_password) => {
  try {
    //Kiểm tra OTP
    const record = otpStore[user_email];
    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    //Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(new_password, SALT_ROUDS);

    //Cập nhật mật khẩu trong DB chỉ dựa vào email (không cần user_name)
    const result = await db.User.update(
      { user_password: hashedPassword },
      { where: { user_email } },
    );

    if (result[0] === 0) {
      return { success: false, message: "User not found" };
    }

    delete otpStore[user_email]; //Xoá OTP sau khi sử dụng

    return { success: true, message: "Password reset successfully" };
  } catch (err) {
    console.error("Error in reset password service:", err);
    return { success: false, message: "Internal server error" };
  }
};

const verifyOTP = async (user_email, otp) => {
  try {
    const record = otpStore[user_email];

    if (!record) {
      return { success: false, message: "No OTP found for this email" };
    }

    if (record.expiresAt < Date.now()) {
      delete otpStore[user_email];
      return { success: false, message: "OTP has expired" };
    }

    if (record.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    return { success: true, message: "OTP verified successfully" };
  } catch (err) {
    console.error("Error in verify OTP service:", err);
    return { success: false, message: "Internal server error" };
  }
};

// Step 1: Register - Generate OTP and send email (NO DB SAVE)
const register = async (
  user_name,
  user_email,
  user_password,
  full_name,
  user_phone,
  user_address,
  avatar,
  user_status,
  role,
) => {
  try {
    // Validate required fields
    if (!user_name || !user_email || !user_password) {
      return {
        success: false,
        message: "Username, email and password are required.",
      };
    }

    // Validate email format
    if (!emailRegex.test(user_email)) {
      return {
        success: false,
        message: "Invalid email format.",
      };
    }

    // Validate password strength
    if (!passwordRegex.test(user_password)) {
      return {
        success: false,
        message:
          "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.",
      };
    }

    // Check if username or email already exists
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ user_name }, { user_email }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username or email already exists.",
      };
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5 minute expiration
    otpStore[user_email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    // Send OTP via email
    const emailSent = await sendOTPEmail(user_email, otp);
    if (!emailSent) {
      delete otpStore[user_email];
      return {
        success: false,
        message: "Failed to send OTP email. Please try again.",
      };
    }

    // Store registration data temporarily for verification step
    otpStore[user_email].registrationData = {
      user_name,
      user_email,
      user_password,
      full_name,
      user_phone,
      user_address,
      avatar,
      user_status: user_status !== undefined ? user_status : true,
      role: role || 2,
    };

    console.log(`OTP sent to ${user_email}`);
    return {
      success: true,
      message: "OTP sent to your email. Please verify within 5 minutes.",
    };
  } catch (err) {
    console.error("Error in register service:", err);
    return { success: false, message: "Internal server error" };
  }
};

// Step 2: Verify Email - Verify OTP and create user
const verifyEmail = async (user_email, otp) => {
  try {
    // Check if OTP exists and is valid
    const record = otpStore[user_email];
    if (!record) {
      return { success: false, message: "No OTP found for this email" };
    }

    if (record.expiresAt < Date.now()) {
      delete otpStore[user_email];
      return { success: false, message: "OTP has expired" };
    }

    if (record.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    // Get stored registration data
    const registrationData = record.registrationData;
    if (!registrationData) {
      delete otpStore[user_email];
      return {
        success: false,
        message: "Invalid registration data. Please register again.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registrationData.user_password,
      SALT_ROUDS,
    );

    // Create user with email_verified_at
    const newUser = await db.User.create({
      user_name: registrationData.user_name,
      user_email: registrationData.user_email,
      user_password: hashedPassword,
      full_name: registrationData.full_name,
      user_phone: registrationData.user_phone,
      user_address: registrationData.user_address,
      avatar: registrationData.avatar || null,
      user_status: registrationData.user_status,
      role: registrationData.role,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Create wallet and free subscription
    try {
      const freePrice = await db.Subscription_Price.findOne({
        include: [
          {
            model: db.Subscription_Plan,
            where: { code: "free" },
            attributes: [
              "subscription_plan_id",
              "code",
              "monthly_ai_token_quota",
            ],
          },
        ],
        where: { billing_type: "free" },
      });

      if (freePrice) {
        const monthlyQuota = freePrice.Subscription_Plan.monthly_ai_token_quota;
        await db.User_Token_Wallet.create({
          user_id: newUser.user_id,
          token_balance: monthlyQuota,
          updated_at: new Date(),
        });

        await createSubscription(
          newUser.user_id,
          freePrice.subscription_price_id,
          null,
        );
        console.log(
          `User ${newUser.user_id} created with free plan and wallet`,
        );
      } else {
        const defaultFreeQuota = 100;
        await db.User_Token_Wallet.create({
          user_id: newUser.user_id,
          token_balance: defaultFreeQuota,
          updated_at: new Date(),
        });
        console.log(
          `User ${newUser.user_id} created with default wallet (${defaultFreeQuota} tokens)`,
        );
      }
    } catch (subscriptionError) {
      console.error(
        "Error creating subscription or wallet:",
        subscriptionError,
      );
      const defaultFreeQuota = 100;
      try {
        await db.User_Token_Wallet.create({
          user_id: newUser.user_id,
          token_balance: defaultFreeQuota,
          updated_at: new Date(),
        });
      } catch (walletError) {
        console.error("Error creating wallet:", walletError);
      }
    }

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail({
        user_email: newUser.user_email,
        full_name: newUser.full_name || newUser.user_name,
      });
      console.log(`Welcome email sent to ${newUser.user_email}`);
    } catch (emailError) {
      console.error(
        `Failed to send welcome email to ${newUser.user_email}:`,
        emailError.message,
      );
    }

    // Clean up OTP
    delete otpStore[user_email];

    // Generate tokens
    const accessToken = jwt.sign(
      { user_id: newUser.user_id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { user_id: newUser.user_id, role: newUser.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    return {
      success: true,
      message: "Email verified successfully. Welcome to Enggo Learning!",
      user: newUser,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.error("Error in verify email service:", err);
    return { success: false, message: "Internal server error" };
  }
};

const login = async (user_name, user_password) => {
  try {
    console.log("AuthService login called with:", user_name);
    const user = await db.User.findOne({ where: { user_name } });
    if (!user) return { success: false, message: "User not found" };

    // Check if email is verified
    if (!user.email_verified_at) {
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    // Check password
    const isMatchPassword = await bcrypt.compare(
      user_password,
      user.user_password,
    );
    if (!isMatchPassword)
      return { success: false, message: "Incorrect password" };

    // Check user status
    if (!user.user_status) {
      return {
        success: false,
        message: "User account is deactivated. Please contact support.",
      };
    }

    console.log("User found and password is valid:", user.user_name);

    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    return {
      success: true,
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.error("Error in login service:", err);
    return { success: false, message: "Internal server error" };
  }
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return { success: false, message: "No refresh token provided" };
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Verify user still exists and is active
    const user = await db.User.findOne({
      where: { user_id: decoded.user_id },
      attributes: ["user_id", "role", "user_status"],
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if user is still active
    if (!user.user_status) {
      return { success: false, message: "User account is deactivated" };
    }

    // Create new access token with current user data
    const newAccessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return { success: true, accessToken: newAccessToken };
  } catch (error) {
    console.error("Refresh token error:", error);
    return { success: false, message: "Invalid or expired refresh token" };
  }
};

const logout = async () => {
  return { success: true, message: "Logout successful" };
};
export {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
