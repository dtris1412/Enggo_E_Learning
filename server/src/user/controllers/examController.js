import {
  getExamsPaginated as getExamsPaginatedService,
  getExamById as getExamByIdService,
  getExamForTaking as getExamForTakingService,
} from "../services/examService.js";

/**
 * EXAM CONTROLLER (USER)
 * Xử lý các request liên quan đến xem và lấy thông tin đề thi
 */

// Lấy danh sách đề thi có phân trang
const getExamsPaginated = async (req, res) => {
  try {
    const { search, limit, page, exam_type, year, certificate_id } = req.query;
    const result = await getExamsPaginatedService(
      search,
      limit,
      page,
      exam_type,
      year,
      certificate_id,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamsPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Lấy thông tin cơ bản của 1 đề thi
const getExamById = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const result = await getExamByIdService(exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Lấy đề thi để làm bài (không bao gồm đáp án)
const getExamForTaking = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { user_exam_id } = req.query;
    const result = await getExamForTakingService(exam_id, user_exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamForTaking:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { getExamsPaginated, getExamById, getExamForTaking };
