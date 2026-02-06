import {
  createExamContainer as createExamContainerService,
  updateExamContainer as updateExamContainerService,
  deleteExamContainer as deleteExamContainerService,
  getContainersByExamId as getContainersByExamIdService,
} from "../services/examContainerService.js";

/**
 * EXAM CONTAINER CONTROLLER
 * Xử lý các request liên quan đến Exam Container (Nhóm câu hỏi/Đoạn văn)
 */

const createExamContainer = async (req, res) => {
  try {
    const {
      exam_id,
      skill,
      type,
      order,
      content,
      instruction,
      image_url,
      audio_url,
      time_limit,
    } = req.body;

    const result = await createExamContainerService(
      exam_id,
      skill,
      type,
      order,
      content,
      instruction,
      image_url,
      audio_url,
      time_limit,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createExamContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateExamContainer = async (req, res) => {
  try {
    const { container_id } = req.params;
    const {
      skill,
      type,
      order,
      content,
      instruction,
      image_url,
      audio_url,
      time_limit,
    } = req.body;

    const result = await updateExamContainerService(
      container_id,
      skill,
      type,
      order,
      content,
      instruction,
      image_url,
      audio_url,
      time_limit,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateExamContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteExamContainer = async (req, res) => {
  try {
    const { container_id } = req.params;
    const result = await deleteExamContainerService(container_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteExamContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getContainersByExamId = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const result = await getContainersByExamIdService(exam_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getContainersByExamId:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createExamContainer,
  updateExamContainer,
  deleteExamContainer,
  getContainersByExamId,
};
