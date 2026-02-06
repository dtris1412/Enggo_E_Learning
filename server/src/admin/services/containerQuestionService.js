import db from "../../models/index.js";

/**
 * CONTAINER QUESTION SERVICE
 * Quản lý nghiệp vụ liên kết Question với Container
 */

const addQuestionToContainer = async (
  container_id,
  question_id,
  order,
  image_url,
  score,
) => {
  if (!container_id || !question_id || !order) {
    return { success: false, message: "All fields are required." };
  }

  const container = await db.Exam_Container.findByPk(container_id);
  if (!container) {
    return { success: false, message: "Container not found." };
  }

  const question = await db.Question.findByPk(question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }

  const newContainerQuestion = await db.Container_Question.create({
    container_id,
    question_id,
    order,
    image_url: image_url || null,
    score: score || 1.0,
  });

  return {
    success: true,
    message: "Question added to container successfully",
    data: newContainerQuestion,
  };
};

const removeQuestionFromContainer = async (container_question_id) => {
  if (!container_question_id) {
    return { success: false, message: "Container Question ID is required." };
  }

  const containerQuestion = await db.Container_Question.findByPk(
    container_question_id,
  );
  if (!containerQuestion) {
    return { success: false, message: "Container question not found." };
  }

  await containerQuestion.destroy();

  return {
    success: true,
    message: "Question removed from container successfully",
  };
};

const updateQuestionOrderInContainer = async (
  container_question_id,
  order,
  image_url,
  score,
) => {
  if (!container_question_id) {
    return { success: false, message: "Container Question ID is required." };
  }

  const containerQuestion = await db.Container_Question.findByPk(
    container_question_id,
  );
  if (!containerQuestion) {
    return { success: false, message: "Container question not found." };
  }

  const updateData = {};
  if (order !== undefined) updateData.order = order;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (score !== undefined) updateData.score = score;

  await containerQuestion.update(updateData);

  return {
    success: true,
    message: "Question updated successfully",
    data: containerQuestion,
  };
};

export {
  addQuestionToContainer,
  removeQuestionFromContainer,
  updateQuestionOrderInContainer,
};
