import db from "../../models/index.js";

/**
 * EXAM CONTAINER SERVICE
 * Quản lý các nghiệp vụ liên quan đến Exam Container (Nhóm câu hỏi/Đoạn văn)
 */

const createExamContainer = async (
  exam_id,
  skill,
  type,
  order,
  content,
  instruction,
  image_url,
  audio_url,
  time_limit,
) => {
  if (!exam_id || !type || !order) {
    return { success: false, message: "Required fields are missing." };
  }

  const exam = await db.Exam.findByPk(exam_id);
  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  const newContainer = await db.Exam_Container.create({
    exam_id,
    skill,
    type,
    order,
    content,
    instruction,
    image_url,
    audio_url,
    time_limit,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Exam container created successfully",
    data: newContainer,
  };
};

const updateExamContainer = async (
  container_id,
  skill,
  type,
  order,
  content,
  instruction,
  image_url,
  audio_url,
  time_limit,
) => {
  if (!container_id) {
    return { success: false, message: "Container ID is required." };
  }

  const container = await db.Exam_Container.findByPk(container_id);
  if (!container) {
    return { success: false, message: "Container not found." };
  }

  await container.update({
    skill,
    type,
    order,
    content,
    instruction,
    image_url,
    audio_url,
    time_limit,
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Exam container updated successfully",
    data: container,
  };
};

const deleteExamContainer = async (container_id) => {
  if (!container_id) {
    return { success: false, message: "Container ID is required." };
  }

  const container = await db.Exam_Container.findByPk(container_id);
  if (!container) {
    return { success: false, message: "Container not found." };
  }

  await container.destroy();

  return {
    success: true,
    message: "Exam container deleted successfully",
  };
};

const getContainersByExamId = async (exam_id) => {
  if (!exam_id) {
    return { success: false, message: "Exam ID is required." };
  }

  const containers = await db.Exam_Container.findAll({
    where: { exam_id },
    include: [
      {
        model: db.Container_Question,
        include: [
          {
            model: db.Question,
            attributes: ["question_id", "question_content", "explanation"],
          },
          {
            model: db.Question_Option,
            attributes: [
              "question_option_id",
              "label",
              "content",
              "is_correct",
              "order_index",
            ],
            order: [["order_index", "ASC"]],
          },
        ],
        order: [["order", "ASC"]],
      },
    ],
    order: [["order", "ASC"]],
  });

  return {
    success: true,
    message: "Containers retrieved successfully",
    data: containers,
  };
};

export {
  createExamContainer,
  updateExamContainer,
  deleteExamContainer,
  getContainersByExamId,
};
