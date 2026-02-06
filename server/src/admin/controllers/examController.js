import {
  createExam as createExamService,
  getExamById as getExamByIdService,
  getExamsPaginated as getExamsPaginatedService,
  updateExamById as updateExamByIdService,
  deleteExamById as deleteExamByIdService,
  getExamWithDetails as getExamWithDetailsService,
} from "../services/examService.js";

/**
 * EXAM CONTROLLER
 * Xử lý các request liên quan đến Exam (Đề thi)
 */

const createExam = async (req, res) => {
  try {
    const result = await createExamService(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createExam:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

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

const updateExamById = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const result = await updateExamByIdService(exam_id, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateExamById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteExamById = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const result = await deleteExamByIdService(exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteExamById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExamWithDetails = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const result = await getExamWithDetailsService(exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamWithDetails:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createExam,
  getExamById,
  getExamsPaginated,
  updateExamById,
  deleteExamById,
  getExamWithDetails,
};
