import {
  createExamMedia as createExamMediaService,
  deleteExamMedia as deleteExamMediaService,
  getExamMediaByExamId as getExamMediaByExamIdService,
} from "../services/examMediaService.js";

/**
 * EXAM MEDIA CONTROLLER
 * Xử lý các request liên quan đến Exam Media (Audio/Media của đề thi)
 */

const createExamMedia = async (req, res) => {
  try {
    const { exam_id, audio_url, duration } = req.body;
    const result = await createExamMediaService(exam_id, audio_url, duration);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createExamMedia:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteExamMedia = async (req, res) => {
  try {
    const { media_id } = req.params;
    const result = await deleteExamMediaService(media_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteExamMedia:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExamMediaByExamId = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const result = await getExamMediaByExamIdService(exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getExamMediaByExamId:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { createExamMedia, deleteExamMedia, getExamMediaByExamId };
