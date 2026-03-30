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
  parent_id = null,
) => {
  if (!exam_id || !type || !order) {
    return { success: false, message: "Required fields are missing." };
  }

  const exam = await db.Exam.findByPk(exam_id);
  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  // If parent_id provided, verify it exists
  if (parent_id) {
    const parentContainer = await db.Exam_Container.findByPk(parent_id);
    if (!parentContainer) {
      return { success: false, message: "Parent container not found." };
    }
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
    parent_id,
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
  parent_id,
) => {
  if (!container_id) {
    return { success: false, message: "Container ID is required." };
  }

  const container = await db.Exam_Container.findByPk(container_id);
  if (!container) {
    return { success: false, message: "Container not found." };
  }

  // If parent_id provided, verify it exists
  if (parent_id) {
    const parentContainer = await db.Exam_Container.findByPk(parent_id);
    if (!parentContainer) {
      return { success: false, message: "Parent container not found." };
    }
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
    parent_id,
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

  // Only get parent containers (parent_id is null)
  const containers = await db.Exam_Container.findAll({
    where: { exam_id, parent_id: null },
    include: [
      {
        model: db.Exam_Container,
        as: "children",
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
      },
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

  // Sort containers and nested data by order field (Sequelize nested include order is unreliable with joins)
  const sorted = containers.map((c) => c.toJSON());
  sorted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  sorted.forEach((container) => {
    if (container.children) {
      container.children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      container.children.forEach((child) => {
        if (child.Container_Questions) {
          child.Container_Questions.sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0),
          );
          child.Container_Questions.forEach((cq) => {
            if (cq.Question_Options) {
              cq.Question_Options.sort(
                (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
              );
            }
          });
        }
      });
    }
    if (container.Container_Questions) {
      container.Container_Questions.sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      container.Container_Questions.forEach((cq) => {
        if (cq.Question_Options) {
          cq.Question_Options.sort(
            (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
          );
        }
      });
    }
  });

  return {
    success: true,
    message: "Containers retrieved successfully",
    data: sorted,
  };
};

export {
  createExamContainer,
  updateExamContainer,
  deleteExamContainer,
  getContainersByExamId,
};
