import db from "../../models/index.js";

/**
 * QUESTION SERVICE
 * Quản lý các nghiệp vụ liên quan đến Question (Câu hỏi)
 */

const createQuestion = async (question_content, explanation, question_type) => {
  if (!question_content) {
    return { success: false, message: "Question content is required." };
  }

  if (!question_type) {
    return { success: false, message: "Question type is required." };
  }

  const newQuestion = await db.Question.create({
    question_content,
    explanation,
    question_type,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Question created successfully",
    data: newQuestion,
  };
};

const updateQuestion = async (
  question_id,
  question_content,
  explanation,
  question_type,
) => {
  if (!question_id) {
    return { success: false, message: "Question ID is required." };
  }

  const question = await db.Question.findByPk(question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }

  const updateData = {
    updated_at: new Date(),
  };

  if (question_content !== undefined)
    updateData.question_content = question_content;
  if (explanation !== undefined) updateData.explanation = explanation;
  if (question_type !== undefined) updateData.question_type = question_type;

  await question.update(updateData);

  return {
    success: true,
    message: "Question updated successfully",
    data: question,
  };
};

const deleteQuestion = async (question_id) => {
  if (!question_id) {
    return { success: false, message: "Question ID is required." };
  }

  const question = await db.Question.findByPk(question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }

  await question.destroy();

  return {
    success: true,
    message: "Question deleted successfully",
  };
};

export { createQuestion, updateQuestion, deleteQuestion };
