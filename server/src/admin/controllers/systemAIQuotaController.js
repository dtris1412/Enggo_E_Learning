import {
  getSystemQuota,
  updateSystemCredit,
  updateSystemConfig,
  getUsageStatistics,
} from "../services/systemAIQuotaService.js";

/**
 * GET /api/admin/ai-quota
 * Lấy thông tin quota hệ thống hiện tại
 */
export const getQuota = async (req, res) => {
  try {
    const quota = await getSystemQuota();

    res.json({
      success: true,
      data: {
        quota_id: quota.quota_id,
        open_ai_credit: quota.open_ai_credit,
        system_open_ai_token: quota.system_open_ai_token,
        ai_token_unit: quota.ai_token_unit,
        ai_token_totals: quota.ai_token_totals,
        ai_token_used: quota.ai_token_used,
        buffer_percent: quota.buffer_percent,
        price_per_milion: quota.price_per_milion,
        total_cost: quota.total_cost,
      },
    });
  } catch (error) {
    console.error("Get quota error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get system quota",
      details: error.message,
    });
  }
};

/**
 * PUT /api/admin/ai-quota/credit
 * Cập nhật credit khi admin nạp tiền vào hệ thống
 * Body: { credit, pricePerMillion?, bufferPercent?, aiTokenUnit? }
 */
export const updateCredit = async (req, res) => {
  try {
    const { credit, pricePerMillion, bufferPercent, aiTokenUnit } = req.body;

    // Validate
    if (credit === undefined || credit === null) {
      return res.status(400).json({
        success: false,
        error: "Credit is required",
      });
    }

    if (typeof credit !== "number" || credit < 0) {
      return res.status(400).json({
        success: false,
        error: "Credit must be a non-negative number",
      });
    }

    // Cập nhật credit và tính toán lại quota
    const result = await updateSystemCredit(credit, {
      pricePerMillion,
      bufferPercent,
      aiTokenUnit,
    });

    res.json({
      success: true,
      message: "Credit updated successfully",
      data: {
        quota: {
          quota_id: result.quota.quota_id,
          open_ai_credit: result.quota.open_ai_credit,
          system_open_ai_token: result.quota.system_open_ai_token,
          ai_token_unit: result.quota.ai_token_unit,
          ai_token_totals: result.quota.ai_token_totals,
          ai_token_used: result.quota.ai_token_used,
          buffer_percent: result.quota.buffer_percent,
          price_per_milion: result.quota.price_per_milion,
          total_cost: result.quota.total_cost,
        },
        calculated: result.calculated,
      },
    });
  } catch (error) {
    console.error("Update credit error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update credit",
      details: error.message,
    });
  }
};

/**
 * PUT /api/admin/ai-quota/config
 * Cập nhật cấu hình hệ thống (price, buffer, unit)
 * Body: { pricePerMillion?, bufferPercent?, aiTokenUnit? }
 */
export const updateConfig = async (req, res) => {
  try {
    const { pricePerMillion, bufferPercent, aiTokenUnit } = req.body;

    // Validate ít nhất 1 field
    if (!pricePerMillion && !bufferPercent && !aiTokenUnit) {
      return res.status(400).json({
        success: false,
        error:
          "At least one of pricePerMillion, bufferPercent, or aiTokenUnit is required",
      });
    }

    const result = await updateSystemConfig({
      pricePerMillion,
      bufferPercent,
      aiTokenUnit,
    });

    res.json({
      success: true,
      message: "Configuration updated successfully",
      data: {
        quota: {
          quota_id: result.quota.quota_id,
          open_ai_credit: result.quota.open_ai_credit,
          system_open_ai_token: result.quota.system_open_ai_token,
          ai_token_unit: result.quota.ai_token_unit,
          ai_token_totals: result.quota.ai_token_totals,
          ai_token_used: result.quota.ai_token_used,
          buffer_percent: result.quota.buffer_percent,
          price_per_milion: result.quota.price_per_milion,
          total_cost: result.quota.total_cost,
        },
        calculated: result.calculated,
      },
    });
  } catch (error) {
    console.error("Update config error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update configuration",
      details: error.message,
    });
  }
};

/**
 * GET /api/admin/ai-quota/stats
 * Lấy thống kê sử dụng AI chi tiết
 */
export const getStats = async (req, res) => {
  try {
    const stats = await getUsageStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get usage statistics",
      details: error.message,
    });
  }
};
