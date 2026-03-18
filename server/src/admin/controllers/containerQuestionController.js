import {
  addQuestionToContainer as addQuestionToContainerService,
  removeQuestionFromContainer as removeQuestionFromContainerService,
  updateQuestionOrderInContainer as updateQuestionOrderInContainerService,
  addMultipleQuestionsToContainer as addMultipleQuestionsToContainerService,
} from "../services/containerQuestionService.js";

/**
 * CONTAINER QUESTION CONTROLLER
 * Xử lý các request liên kết Question với Container
 */

const addQuestionToContainer = async (req, res) => {
  try {
    const { container_id, question_id, order, image_url, score } = req.body;
    const result = await addQuestionToContainerService(
      container_id,
      question_id,
      order,
      image_url,
      score,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in addQuestionToContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeQuestionFromContainer = async (req, res) => {
  try {
    const { container_question_id } = req.params;
    const result = await removeQuestionFromContainerService(
      container_question_id,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in removeQuestionFromContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuestionOrderInContainer = async (req, res) => {
  try {
    const { container_question_id } = req.params;
    const { order, image_url, score } = req.body;

    const result = await updateQuestionOrderInContainerService(
      container_question_id,
      order,
      image_url,
      score,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateQuestionOrderInContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Thêm nhiều câu hỏi vào container cùng lúc
 * POST /api/admin/container-questions/bulk
 * Body: {
 *   container_id: number,
 *   questions: [
 *     {
 *       question_content: string,
 *       explanation: string,
 *       order: number,
 *       image_url: string,
 *       score: number,
 *       options: [
 *         { label: "A", content: "...", is_correct: boolean, order_index: number },
 *         ...
 *       ]
 *     },
 *     ...
 *   ]
 * }
 */
const addMultipleQuestionsToContainer = async (req, res) => {
  try {
    const { container_id, questions } = req.body;

    if (!container_id) {
      return res
        .status(400)
        .json({ success: false, message: "Container ID is required." });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array.",
      });
    }

    const result = await addMultipleQuestionsToContainerService(
      container_id,
      questions,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in addMultipleQuestionsToContainer:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  addQuestionToContainer,
  removeQuestionFromContainer,
  updateQuestionOrderInContainer,
  addMultipleQuestionsToContainer,
};
