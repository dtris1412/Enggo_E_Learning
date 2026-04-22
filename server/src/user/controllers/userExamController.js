import {
  startExam as startExamService,
  saveAnswers as saveAnswersService,
  submitExam as submitExamService,
  getExamResult as getExamResultService,
  getExamAttemptDetail as getExamAttemptDetailService,
  abandonExam as abandonExamService,
  getOngoingExam as getOngoingExamService,
  getUserExamHistory as getUserExamHistoryService,
  submitWritingTask as submitWritingTaskService,
  getWritingSubmissions as getWritingSubmissionsService,
  submitAllWritingTasks as submitAllWritingTasksService,
  handleSpeakingTurn as handleSpeakingTurnService,
  submitSpeakingSession as submitSpeakingSessionService,
  evaluateAllSpeakingService,
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

// ──────────────────────────────────────────────
// IELTS Writing controllers
// ──────────────────────────────────────────────

const submitWritingTask = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const { container_question_id, content } = req.body;
    const user_id = req.user?.user_id;

    if (!container_question_id || !content) {
      return res.status(400).json({
        success: false,
        message: "container_question_id and content are required.",
      });
    }

    const result = await submitWritingTaskService(
      parseInt(user_exam_id),
      parseInt(container_question_id),
      content,
      user_id,
    );

    if (!result.success) return res.status(400).json(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in submitWritingTask:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getWritingSubmissions = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const result = await getWritingSubmissionsService(parseInt(user_exam_id));
    if (!result.success) return res.status(400).json(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getWritingSubmissions:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const submitAllWriting = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const { tasks } = req.body;
    const user_id = req.user?.user_id;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "tasks array is required." });
    }

    const result = await submitAllWritingTasksService(
      parseInt(user_exam_id),
      tasks,
      user_id,
    );

    if (!result.success) return res.status(400).json(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in submitAllWriting:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Có lỗi xảy ra khi nộp bài writing",
      detail: err.message,
    });
  }
};

// ──────────────────────────────────────────────
// IELTS Speaking controllers
// ──────────────────────────────────────────────

const speakingTurn = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const { container_id, messages, part_type } = req.body;

    if (!container_id || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "container_id and messages array are required.",
      });
    }

    const result = await handleSpeakingTurnService(
      parseInt(user_exam_id),
      parseInt(container_id),
      messages,
      part_type,
    );

    if (!result.success) return res.status(400).json(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in speakingTurn:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const submitSpeaking = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const { container_id, messages, duration_seconds } = req.body;

    if (!container_id || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "container_id and messages array are required.",
      });
    }

    const result = await submitSpeakingSessionService(
      parseInt(user_exam_id),
      parseInt(container_id),
      messages,
      duration_seconds || 0,
    );

    if (!result.success) return res.status(400).json(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in submitSpeaking:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const evaluateAllSpeaking = async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const result = await evaluateAllSpeakingService(parseInt(user_exam_id));
    if (!result.success) return res.status(400).json(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in evaluateAllSpeaking:", err);
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
  submitWritingTask,
  getWritingSubmissions,
  submitAllWriting,
  speakingTurn,
  submitSpeaking,
  evaluateAllSpeaking,
};
