import db from "../../models/index.js";

/**
 * QUESTION OPTION SERVICE
 * Quản lý các nghiệp vụ liên quan đến Question Option (Đáp án)
 */

const createQuestionOption = async (
  container_question_id,
  label,
  content,
  is_correct,
  order_index,
) => {
  if (
    !container_question_id ||
    !label ||
    !content ||
    is_correct === undefined ||
    !order_index
  ) {
    return { success: false, message: "All fields are required." };
  }

  const containerQuestion = await db.Container_Question.findByPk(
    container_question_id,
  );
  if (!containerQuestion) {
    return { success: false, message: "Container question not found." };
  }

  const newOption = await db.Question_Option.create({
    container_question_id,
    label,
    content,
    is_correct,
    order_index,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Question option created successfully",
    data: newOption,
  };
};

const updateQuestionOption = async (
  question_option_id,
  label,
  content,
  is_correct,
  order_index,
) => {
  if (!question_option_id) {
    return { success: false, message: "Question option ID is required." };
  }

  const option = await db.Question_Option.findByPk(question_option_id);
  if (!option) {
    return { success: false, message: "Question option not found." };
  }

  await option.update({
    label,
    content,
    is_correct,
    order_index,
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Question option updated successfully",
    data: option,
  };
};

const deleteQuestionOption = async (question_option_id) => {
  if (!question_option_id) {
    return { success: false, message: "Question option ID is required." };
  }

  const option = await db.Question_Option.findByPk(question_option_id);
  if (!option) {
    return { success: false, message: "Question option not found." };
  }

  await option.destroy();

  return {
    success: true,
    message: "Question option deleted successfully",
  };
};

export { createQuestionOption, updateQuestionOption, deleteQuestionOption };
