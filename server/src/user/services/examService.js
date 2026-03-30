import db from "../../models/index.js";

/**
 * USER EXAM SERVICE
 * Quản lý các nghiệp vụ liên quan đến xem và lấy thông tin đề thi cho user
 */

// Lấy danh sách đề thi có phân trang (cho user)
export const getExamsPaginated = async (
  search = "",
  limit = 10,
  page = 1,
  exam_type,
  year,
  certificate_id,
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  const whereConditions = {};

  if (search) {
    whereConditions[Op.or] = [
      { exam_title: { [Op.substring]: search } },
      { exam_code: { [Op.substring]: search } },
    ];
  }

  if (exam_type) {
    whereConditions.exam_type = exam_type;
  }

  if (year) {
    whereConditions.year = Number(year);
  }

  if (certificate_id) {
    whereConditions.certificate_id = Number(certificate_id);
  }

  const { count, rows } = await db.Exam.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name"],
      },
    ],
    attributes: [
      "exam_id",
      "exam_title",
      "exam_code",
      "exam_duration",
      "year",
      "exam_type",
      "source",
      "total_questions",
      "created_at",
    ],
    limit: Number(limit),
    offset,
    order: [["created_at", "DESC"]],
  });

  return {
    success: true,
    message: "Exams retrieved successfully",
    data: {
      exams: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    },
  };
};

// Lấy thông tin cơ bản của 1 đề thi (không bao gồm câu hỏi và đáp án)
export const getExamById = async (exam_id) => {
  if (!exam_id) {
    return { success: false, message: "Exam ID is required." };
  }

  const exam = await db.Exam.findByPk(exam_id, {
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name"],
      },
      {
        model: db.Exam_Media,
        attributes: ["media_id", "audio_url", "duration"],
      },
      {
        model: db.Exam_Container,
        attributes: [
          "container_id",
          "skill",
          "type",
          "order",
          "instruction",
          "parent_id",
          "content",
        ],
        include: [
          {
            model: db.Container_Question,
            attributes: ["container_question_id"],
          },
          {
            model: db.Exam_Container,
            as: "children",
            attributes: [
              "container_id",
              "skill",
              "type",
              "order",
              "instruction",
              "content",
            ],
            include: [
              {
                model: db.Container_Question,
                attributes: ["container_question_id"],
              },
            ],
          },
        ],
        order: [["order", "ASC"]],
      },
    ],
    attributes: [
      "exam_id",
      "exam_title",
      "exam_code",
      "exam_duration",
      "year",
      "exam_type",
      "source",
      "total_questions",
      "created_at",
    ],
  });

  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  return {
    success: true,
    message: "Exam retrieved successfully",
    data: exam,
  };
};

// Lấy thông tin đầy đủ của đề thi để làm bài (không bao gồm is_correct trong options)
export const getExamForTaking = async (exam_id, user_exam_id = null) => {
  if (!exam_id) {
    return { success: false, message: "Exam ID is required." };
  }

  // Get selected parts if user_exam_id is provided
  let selectedParts = null;
  if (user_exam_id) {
    const userExam = await db.User_Exam.findByPk(user_exam_id);
    if (userExam && userExam.selected_parts) {
      selectedParts = userExam.selected_parts;
    }
  }

  const examQuery = {
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name"],
      },
      {
        model: db.Exam_Media,
        attributes: ["media_id", "audio_url", "duration"],
      },
      {
        model: db.Exam_Container,
        where:
          selectedParts && !selectedParts.includes("all")
            ? { parent_id: null, container_id: selectedParts }
            : { parent_id: null }, // Only get parent containers
        attributes: [
          "container_id",
          "skill",
          "type",
          "order",
          "content",
          "instruction",
          "image_url",
          "audio_url",
          "time_limit",
          "parent_id",
        ],
        include: [
          {
            model: db.Exam_Container,
            as: "children",
            attributes: [
              "container_id",
              "skill",
              "type",
              "order",
              "content",
              "instruction",
              "image_url",
              "audio_url",
              "time_limit",
              "parent_id",
            ],
            include: [
              {
                model: db.Container_Question,
                attributes: [
                  "container_question_id",
                  "order",
                  "image_url",
                  "score",
                ],
                include: [
                  {
                    model: db.Question,
                    attributes: ["question_id", "question_content"],
                  },
                  {
                    model: db.Question_Option,
                    attributes: [
                      "question_option_id",
                      "label",
                      "content",
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
            attributes: [
              "container_question_id",
              "order",
              "image_url",
              "score",
            ],
            include: [
              {
                model: db.Question,
                attributes: ["question_id", "question_content"],
              },
              {
                model: db.Question_Option,
                attributes: [
                  "question_option_id",
                  "label",
                  "content",
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
    ],
    attributes: [
      "exam_id",
      "exam_title",
      "exam_code",
      "exam_duration",
      "year",
      "exam_type",
      "source",
      "total_questions",
    ],
  };

  const exam = await db.Exam.findByPk(exam_id, examQuery);

  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  // Sort containers and questions by order field (Sequelize nested include order is unreliable with joins)
  const examData = exam.toJSON();
  if (examData.Exam_Containers) {
    examData.Exam_Containers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    examData.Exam_Containers.forEach((container) => {
      if (container.children) {
        container.children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        container.children.forEach((child) => {
          if (child.Container_Questions) {
            child.Container_Questions.sort(
              (a, b) => (a.order ?? 0) - (b.order ?? 0),
            );
          }
        });
      }
      if (container.Container_Questions) {
        container.Container_Questions.sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );
      }
    });
  }

  return {
    success: true,
    message: "Exam for taking retrieved successfully",
    data: examData,
  };
};
