import db from "../../models/index.js";

const { System_AI_Quota } = db;

/**
 * Lấy thông tin quota hệ thống
 * @returns {Promise<Object>} Quota info
 */
export const getSystemQuota = async () => {
  try {
    let quota = await System_AI_Quota.findOne({
      where: { quota_id: 1 },
    });

    // Nếu chưa có, tạo quota mặc định
    if (!quota) {
      quota = await System_AI_Quota.create({
        quota_id: 1,
        open_ai_credit: 0,
        system_open_ai_token: 0,
        ai_token_unit: 500,
        ai_token_totals: 0,
        ai_token_used: 0,
        buffer_percent: 40,
        price_per_milion: 0.75, // GPT-4o mini average price
        total_cost: 0,
      });
    }

    return quota;
  } catch (error) {
    console.error("Error getting system quota:", error);
    throw new Error("Failed to get system quota");
  }
};

/**
 * Tính toán quota từ credit
 * @param {number} credit - Số $ credit
 * @param {number} pricePerMillion - Giá per 1M tokens
 * @param {number} bufferPercent - Phần trăm buffer (0-100)
 * @param {number} aiTokenUnit - Số OpenAI token cho 1 AI token
 * @returns {Object} Calculated values
 */
export const calculateQuotaFromCredit = (
  credit,
  pricePerMillion,
  bufferPercent,
  aiTokenUnit,
) => {
  // Tính tổng OpenAI token có thể dùng
  const totalOpenAITokens = (credit / pricePerMillion) * 1_000_000;

  // Trừ buffer
  const bufferDecimal = bufferPercent / 100;
  const systemOpenAITokens = Math.floor(
    totalOpenAITokens * (1 - bufferDecimal),
  );

  // Quy đổi sang AI token nội bộ
  const aiTokensTotal = Math.floor(systemOpenAITokens / aiTokenUnit);

  return {
    totalOpenAITokens: Math.floor(totalOpenAITokens),
    systemOpenAITokens,
    aiTokensTotal,
    bufferTokens: Math.floor(totalOpenAITokens - systemOpenAITokens),
  };
};

/**
 * Cập nhật credit hệ thống và tính toán lại quota
 * @param {number} newCredit - Số credit mới
 * @param {Object} options - Tuỳ chọn cập nhật
 * @returns {Promise<Object>} Updated quota
 */
export const updateSystemCredit = async (newCredit, options = {}) => {
  try {
    const quota = await getSystemQuota();

    // Lấy giá trị hiện tại hoặc từ options
    const pricePerMillion = options.pricePerMillion || quota.price_per_milion;
    const bufferPercent = options.bufferPercent || quota.buffer_percent;
    const aiTokenUnit = options.aiTokenUnit || quota.ai_token_unit;

    // Validate input
    if (newCredit < 0) {
      throw new Error("Credit cannot be negative");
    }

    if (pricePerMillion <= 0) {
      throw new Error("Price per million must be greater than 0");
    }

    // Tính toán quota mới
    const calculated = calculateQuotaFromCredit(
      newCredit,
      pricePerMillion,
      bufferPercent,
      aiTokenUnit,
    );

    // Cập nhật database
    await quota.update({
      open_ai_credit: newCredit,
      system_open_ai_token: calculated.systemOpenAITokens,
      ai_token_totals: calculated.aiTokensTotal,
      price_per_milion: pricePerMillion,
      buffer_percent: bufferPercent,
      ai_token_unit: aiTokenUnit,
    });

    return {
      quota,
      calculated,
    };
  } catch (error) {
    console.error("Error updating system credit:", error);
    throw error;
  }
};

/**
 * Cập nhật cấu hình hệ thống (price, buffer, unit)
 * Không thay đổi credit, chỉ tính lại quota
 * @param {Object} config - Cấu hình mới
 * @returns {Promise<Object>} Updated quota
 */
export const updateSystemConfig = async (config) => {
  try {
    const quota = await getSystemQuota();

    const pricePerMillion = config.pricePerMillion || quota.price_per_milion;
    const bufferPercent = config.bufferPercent || quota.buffer_percent;
    const aiTokenUnit = config.aiTokenUnit || quota.ai_token_unit;

    // Validate
    if (pricePerMillion <= 0) {
      throw new Error("Price per million must be greater than 0");
    }

    if (bufferPercent < 0 || bufferPercent > 100) {
      throw new Error("Buffer percent must be between 0 and 100");
    }

    if (aiTokenUnit <= 0) {
      throw new Error("AI token unit must be greater than 0");
    }

    // Tính lại quota với credit hiện tại
    const calculated = calculateQuotaFromCredit(
      quota.open_ai_credit,
      pricePerMillion,
      bufferPercent,
      aiTokenUnit,
    );

    // Cập nhật
    await quota.update({
      price_per_milion: pricePerMillion,
      buffer_percent: bufferPercent,
      ai_token_unit: aiTokenUnit,
      system_open_ai_token: calculated.systemOpenAITokens,
      ai_token_totals: calculated.aiTokensTotal,
    });

    return {
      quota,
      calculated,
    };
  } catch (error) {
    console.error("Error updating system config:", error);
    throw error;
  }
};

/**
 * Trừ token và cập nhật chi phí khi user sử dụng AI
 * Dùng atomic update để tránh race condition khi nhiều user dùng đồng thời
 * @param {number} tokensUsed - Tổng số tokens đã dùng (từ OpenAI response)
 * @param {number} aiTokensUsed - Số AI token đã dùng (nội bộ)
 * @returns {Promise<Object>} Updated quota và cost info
 */
export const deductTokenUsage = async (tokensUsed, aiTokensUsed) => {
  try {
    const quota = await getSystemQuota();

    // Tính chi phí phát sinh cho lần gọi này
    // cost_used = (tokens_used / 1,000,000) * price_per_milion
    const costUsed = (tokensUsed / 1_000_000) * quota.price_per_milion;

    // Kiểm tra còn đủ credit không
    const remainingCredit = quota.open_ai_credit - quota.total_cost;
    if (remainingCredit < costUsed) {
      throw new Error(
        `Insufficient credit. Remaining: $${remainingCredit.toFixed(6)}, Required: $${costUsed.toFixed(6)}`,
      );
    }

    // Kiểm tra còn đủ token quota không
    if (quota.system_open_ai_token < tokensUsed) {
      throw new Error("System has insufficient OpenAI token quota");
    }

    // Atomic update để tránh race condition
    // Dùng increment/decrement thay vì update trực tiếp
    await quota.increment({
      total_cost: costUsed,
      ai_token_used: aiTokensUsed,
    });

    await quota.decrement({
      system_open_ai_token: tokensUsed,
    });

    // Reload để lấy giá trị mới nhất
    await quota.reload();

    return {
      quota,
      cost_used: costUsed,
      tokens_used: tokensUsed,
      remaining_credit: quota.open_ai_credit - quota.total_cost,
    };
  } catch (error) {
    console.error("Error deducting token usage:", error);
    throw error;
  }
};

/**
 * Lấy thống kê sử dụng AI
 * @returns {Promise<Object>} Usage statistics
 */
export const getUsageStatistics = async () => {
  try {
    const quota = await getSystemQuota();

    const calculated = calculateQuotaFromCredit(
      quota.open_ai_credit,
      quota.price_per_milion,
      quota.buffer_percent,
      quota.ai_token_unit,
    );

    // Tính credit còn lại: remaining_credit = open_ai_credit - total_cost
    const remainingCredit = quota.open_ai_credit - quota.total_cost;
    const creditUsagePercent =
      quota.open_ai_credit > 0
        ? ((quota.total_cost / quota.open_ai_credit) * 100).toFixed(2)
        : 0;

    // Tính phần trăm token đã dùng
    const usagePercent =
      quota.ai_token_totals > 0
        ? ((quota.ai_token_used / quota.ai_token_totals) * 100).toFixed(2)
        : 0;

    const openAITokenUsagePercent =
      calculated.systemOpenAITokens > 0
        ? (
            ((calculated.systemOpenAITokens - quota.system_open_ai_token) /
              calculated.systemOpenAITokens) *
            100
          ).toFixed(2)
        : 0;

    // Tính tokens đã dùng
    const openAITokensUsed =
      calculated.systemOpenAITokens - quota.system_open_ai_token;

    return {
      credit: {
        total: quota.open_ai_credit,
        used: quota.total_cost.toFixed(6),
        remaining: remainingCredit.toFixed(6),
        usagePercent: parseFloat(creditUsagePercent),
      },
      openAITokens: {
        total: calculated.totalOpenAITokens,
        buffer: calculated.bufferTokens,
        available: calculated.systemOpenAITokens,
        used: openAITokensUsed,
        remaining: quota.system_open_ai_token,
        usagePercent: parseFloat(openAITokenUsagePercent),
      },
      aiTokens: {
        total: quota.ai_token_totals,
        used: quota.ai_token_used,
        remaining: quota.ai_token_totals - quota.ai_token_used,
        usagePercent: parseFloat(usagePercent),
      },
      config: {
        pricePerMillion: quota.price_per_milion,
        bufferPercent: quota.buffer_percent,
        aiTokenUnit: quota.ai_token_unit,
      },
    };
  } catch (error) {
    console.error("Error getting usage statistics:", error);
    throw error;
  }
};
