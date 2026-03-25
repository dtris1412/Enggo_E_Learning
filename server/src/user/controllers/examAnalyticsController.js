import {
  analyzeExamPerformance,
  getUserOverallStats,
} from "../services/examAnalyticsService.js";
import { getUserExamStats } from "../services/examStatsService.js";

/**
 * EXAM ANALYTICS CONTROLLER
 * Xử lý các request liên quan đến thống kê và phân tích kết quả thi
 */

/**
 * GET /api/user/user-exams/:user_exam_id/stats
 * Lấy thống kê tổng hợp của user cho một bài thi cụ thể
 */
const getMyExamStats = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { user_exam_id } = req.params;

    if (!user_exam_id) {
      return res
        .status(400)
        .json({ success: false, message: "user_exam_id là bắt buộc." });
    }

    // Lấy exam_id từ user_exam
    const db = (await import("../../models/index.js")).default;
    const userExam = await db.User_Exam.findOne({
      where: { user_exam_id, user_id },
      attributes: ["exam_id"],
    });

    if (!userExam) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài thi.",
      });
    }

    const result = await getUserExamStats(user_id, userExam.exam_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in getMyExamStats:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/user/exam-stats
 * Lấy thống kê tổng thể của user trên tất cả các đề đã làm
 */
const getMyOverallStats = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await getUserOverallStats(user_id);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in getMyOverallStats:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/user/user-exams/:user_exam_id/ai-analysis
 * Dùng AI phân tích kết quả thi và gợi ý lộ trình học cá nhân hóa
 * Yêu cầu: bài thi đã được chấm (status = "graded")
 * Token: trừ token user và hệ thống
 */
const getAIExamAnalysis = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { user_exam_id } = req.params;

    if (!user_exam_id) {
      return res
        .status(400)
        .json({ success: false, message: "user_exam_id là bắt buộc." });
    }

    const result = await analyzeExamPerformance(
      parseInt(user_exam_id),
      user_id,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    if (err.message?.includes("Không đủ AI token")) {
      return res.status(402).json({ success: false, message: err.message });
    }
    console.error("Error in getAIExamAnalysis:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { getMyExamStats, getMyOverallStats, getAIExamAnalysis };
