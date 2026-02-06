import {
  createQuestionOption as createQuestionOptionService,
  updateQuestionOption as updateQuestionOptionService,
  deleteQuestionOption as deleteQuestionOptionService,
} from "../services/questionOptionService.js";

/**
 * QUESTION OPTION CONTROLLER
 * Xử lý các request liên quan đến Question Option (Đáp án)
 */

const createQuestionOption = async (req, res) => {
  try {
    const { container_question_id, label, content, is_correct, order_index } =
      req.body;

    const result = await createQuestionOptionService(
      container_question_id,
      label,
      content,
      is_correct,
      order_index,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createQuestionOption:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuestionOption = async (req, res) => {
  try {
    const { question_option_id } = req.params;
    const { label, content, is_correct, order_index } = req.body;

    const result = await updateQuestionOptionService(
      question_option_id,
      label,
      content,
      is_correct,
      order_index,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateQuestionOption:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteQuestionOption = async (req, res) => {
  try {
    const { question_option_id } = req.params;
    const result = await deleteQuestionOptionService(question_option_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteQuestionOption:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { createQuestionOption, updateQuestionOption, deleteQuestionOption };
