import {
  startExam as startExamService,
  saveAnswers as saveAnswersService,
  submitExam as submitExamService,
  getExamResult as getExamResultService,
  getExamAttemptDetail as getExamAttemptDetailService,
  abandonExam as abandonExamService,
  getOngoingExam as getOngoingExamService,
  getUserExamHistory as getUserExamHistoryService,
} from "../services/userExamService.js";

/**
 * USER EXAM CONTROLLER
 * Xử lý các request liên quan đến quá trình thi thử online
 */

// Bắt đầu bài thi mới
const startExam = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy từ token
    const { exam_id, selected_parts } = req.body;

    const result = await startExamService(user_id, exam_id, selected_parts);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in startExam:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Lưu câu trả lời
const saveAnswers = async (req, res) => {
  try {
    const { user_exam_id, answers } = req.body;

    const result = await saveAnswersService(user_exam_id, answers);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in saveAnswers:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Submit bài thi
const submitExam = async (req, res) => {
  try {
    const { user_exam_id } = req.body;

    const result = await submitExamService(user_exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in submitExam:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Xem kết quả bài thi
const getExamResult = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const user_id = req.user.user_id; // Lấy từ token

    const result = await getExamResultService(user_exam_id, user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamResult:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Xem chi tiết lần thi
const getExamAttemptDetail = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const user_id = req.user.user_id; // Lấy từ token

    const result = await getExamAttemptDetailService(user_exam_id, user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamAttemptDetail:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Hủy bài thi đang làm
const abandonExam = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const user_id = req.user.user_id; // Lấy từ token

    const result = await abandonExamService(user_exam_id, user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in abandonExam:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Lấy bài thi đang làm
const getOngoingExam = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy từ token

    const result = await getOngoingExamService(user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getOngoingExam:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Lấy lịch sử thi của user
const getUserExamHistory = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy từ token
    const { limit, page } = req.query;

    console.log("[Controller] getUserExamHistory called:", {
      user_id,
      limit,
      page,
      hasUser: !!req.user,
    });

    const result = await getUserExamHistoryService(user_id, limit, page);

    console.log("[Controller] Service returned:", {
      success: result.success,
      message: result.message,
      dataCount: result.data?.length,
    });

    if (!result.success) {
      console.error("[Controller] Returning 400 error:", result);
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getUserExamHistory:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  startExam,
  saveAnswers,
  submitExam,
  getExamResult,
  getExamAttemptDetail,
  abandonExam,
  getOngoingExam,
  getUserExamHistory,
};
