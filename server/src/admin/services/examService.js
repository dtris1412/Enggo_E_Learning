import db from "../../models/index.js";

/**
 * EXAM SERVICE
 * Quản lý các nghiệp vụ liên quan đến Exam (Đề thi)
 */

// Helper: Tự động tạo exam_code duy nhất
const generateExamCode = (exam_type) => {
  const prefix = exam_type === "TOEIC" ? "TC" : "IE";
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomSuffix}`;
};

// Helper: Lấy số câu hỏi mặc định theo loại đề
const getDefaultTotalQuestions = (exam_type) => {
  return exam_type === "TOEIC" ? 200 : 40; // TOEIC: 200 câu, IELTS: 40 câu
};

const createExam = async (examData) => {
  const {
    exam_title,
    exam_duration,
    exam_code,
    year,
    certificate_id,
    exam_type,
    source,
    total_questions,
  } = examData;

  // Validate required fields
  if (!exam_title || !exam_duration || !exam_type || !certificate_id) {
    return {
      success: false,
      message: "Exam title, duration, type, and certificate are required.",
    };
  }

  // Auto-generate exam_code nếu không được cung cấp
  let finalExamCode = exam_code;
  if (!finalExamCode) {
    finalExamCode = generateExamCode(exam_type);
    // Đảm bảo exam_code là duy nhất
    let existingExam = await db.Exam.findOne({
      where: { exam_code: finalExamCode },
    });
    while (existingExam) {
      finalExamCode = generateExamCode(exam_type);
      existingExam = await db.Exam.findOne({
        where: { exam_code: finalExamCode },
      });
    }
  } else {
    // Nếu exam_code được cung cấp, kiểm tra xem đã tồn tại chưa
    const existingExam = await db.Exam.findOne({
      where: { exam_code: finalExamCode },
    });
    if (existingExam) {
      return { success: false, message: "Exam code already exists." };
    }
  }

  // Auto-generate year nếu không được cung cấp
  const finalYear = year || new Date().getFullYear();

  // Auto-generate total_questions dựa vào exam_type nếu không được cung cấp
  const finalTotalQuestions =
    total_questions || getDefaultTotalQuestions(exam_type);

  const newExam = await db.Exam.create({
    exam_title,
    exam_duration,
    exam_code: finalExamCode,
    year: finalYear,
    certificate_id,
    exam_type,
    source: source || null,
    total_questions: finalTotalQuestions,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return { success: true, message: "Exam created successfully", data: newExam };
};

const getExamById = async (exam_id) => {
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

const getExamsPaginated = async (
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

const updateExamById = async (exam_id, examData) => {
  if (!exam_id) {
    return { success: false, message: "Exam ID is required." };
  }

  const exam = await db.Exam.findByPk(exam_id);
  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  const updateFields = {};

  // Only update fields that are provided
  if (examData.exam_title !== undefined) {
    updateFields.exam_title = examData.exam_title;
  }

  if (examData.exam_duration !== undefined) {
    updateFields.exam_duration = examData.exam_duration;
  }

  if (examData.exam_type !== undefined) {
    updateFields.exam_type = examData.exam_type;
    // Auto-update total_questions when exam_type changes
    updateFields.total_questions = getDefaultTotalQuestions(examData.exam_type);
  }

  if (examData.certificate_id !== undefined) {
    updateFields.certificate_id = examData.certificate_id;
  }

  if (examData.source !== undefined) {
    updateFields.source = examData.source;
  }

  updateFields.updated_at = new Date();

  await exam.update(updateFields);

  return {
    success: true,
    message: "Exam updated successfully",
    data: exam,
  };
};

const deleteExamById = async (exam_id) => {
  if (!exam_id) {
    return { success: false, message: "Exam ID is required." };
  }

  const exam = await db.Exam.findByPk(exam_id);
  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  await exam.destroy();

  return {
    success: true,
    message: "Exam deleted successfully",
  };
};

const getExamWithDetails = async (exam_id) => {
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
    ],
  });

  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  return {
    success: true,
    message: "Exam details retrieved successfully",
    data: exam,
  };
};

export {
  createExam,
  getExamById,
  getExamsPaginated,
  updateExamById,
  deleteExamById,
  getExamWithDetails,
};
