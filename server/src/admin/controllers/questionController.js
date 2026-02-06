import {
  createQuestion as createQuestionService,
  updateQuestion as updateQuestionService,
  deleteQuestion as deleteQuestionService,
} from "../services/questionService.js";

/**
 * QUESTION CONTROLLER
 * Xử lý các request liên quan đến Question (Câu hỏi)
 */

const createQuestion = async (req, res) => {
  try {
    const { question_content, explanation } = req.body;
    const result = await createQuestionService(question_content, explanation);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createQuestion:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { question_content, explanation } = req.body;

    const result = await updateQuestionService(
      question_id,
      question_content,
      explanation,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateQuestion:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const result = await deleteQuestionService(question_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteQuestion:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { createQuestion, updateQuestion, deleteQuestion };
