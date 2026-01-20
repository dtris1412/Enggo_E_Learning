import db from "../../models/index.js";
import lesson from "../../models/lesson.js";

const createQuestion = async (
  order_index,
  question_type,
  content,
  correct_answer,
  explaination,
  difficulty_level,
  generate_by_ai,
  lesson_id,
  options,
  ai_model,
  status,
) => {
  if (!lesson_id) {
    return {
      success: false,
      message: "Lesson ID is required to create a question.",
    };
  }
  if (!question_type || !content || !correct_answer || !difficulty_level) {
    return { success: false, message: "Missing required question fields." };
  }
  const newQuestion = await db.Lesson_Question.create({
    order_index,
    question_type,
    content,
    correct_answer,
    explaination,
    difficulty_level,
    generated_by_ai: generate_by_ai || false,
    lesson_id,
    options,
    ai_model,
    status,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newQuestion };
};

const updateQuestion = async (
  lesson_question_id,
  order_index,
  question_type,
  content,
  correct_answer,
  explaination,
  difficulty_level,
  generate_by_ai,
  options,
  ai_model,
  status,
) => {
  if (!lesson_question_id) {
    return {
      success: false,
      message: "Lesson Question ID is required to update a question.",
    };
  }
  if (!question_type || !content || !correct_answer || !difficulty_level) {
    return { success: false, message: "Missing required question fields." };
  }
  const question = await db.Lesson_Question.findByPk(lesson_question_id);
  if (!question) return { success: false, message: "Question not found." };

  question.order_index = order_index || question.order_index;
  question.question_type = question_type || question.question_type;
  question.content = content || question.content;
  question.correct_answer = correct_answer || question.correct_answer;
  question.explaination = explaination || question.explaination;
  question.difficulty_level = difficulty_level || question.difficulty_level;
  question.generated_by_ai =
    generate_by_ai !== undefined ? generate_by_ai : question.generated_by_ai;
  question.options = options || question.options;
  question.ai_model = ai_model || question.ai_model;
  question.status = status !== undefined ? status : question.status;

  question.updated_at = new Date();
  await question.save();
  return { success: true, data: question };
};

const getQuestionsByLessonIdPaginated = async (
  lesson_id,
  search = "",
  page = 1,
  limit = 10,
  question_type,
  difficulty_level,
  generate_by_ai,
  ai_model,
  status,
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  const whereConditions = {};
  if (search) {
    whereConditions[Op.or] = [
      { content: { [Op.substring]: search } },
      { correct_answer: { [Op.substring]: search } },
    ];
  }
  if (question_type) {
    whereConditions.question_type = question_type;
  }
  if (difficulty_level) {
    whereConditions.difficulty_level = difficulty_level;
  }
  if (generate_by_ai !== undefined) {
    whereConditions.generated_by_ai = generate_by_ai;
  }
  if (ai_model) {
    whereConditions.ai_model = ai_model;
  }
  if (status !== undefined) {
    whereConditions.status = status;
  }

  const { count, rows } = await db.Lesson_Question.findAndCountAll({
    where: { ...whereConditions, lesson_id },
    limit: Number(limit),
    offset: Number(offset),
    order: [["created_at", "ASC"]],
  });
  return {
    success: true,
    totalQuestions: count,
    questions: rows,
  };
};

const getQuestionsPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  question_type,
  difficulty_level,
  generate_by_ai,
  ai_model,
  status,
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  const whereConditions = {};
  if (search) {
    whereConditions[Op.or] = [
      { content: { [Op.substring]: search } },
      { correct_answer: { [Op.substring]: search } },
    ];
  }
  if (question_type) {
    whereConditions.question_type = question_type;
  }
  if (difficulty_level) {
    whereConditions.difficulty_level = difficulty_level;
  }
  if (generate_by_ai !== undefined) {
    whereConditions.generated_by_ai = generate_by_ai;
  }
  if (ai_model) {
    whereConditions.ai_model = ai_model;
  }
  if (status !== undefined) {
    whereConditions.status = status;
  }

  const { count, rows } = await db.Lesson_Question.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset,
    order: [["created_at", "ASC"]],
  });
  return {
    success: true,
    totalQuestions: count,
    questions: rows,
  };
};

const getQuestionById = async (lesson_question_id) => {
  if (!lesson_question_id) {
    return {
      success: false,
      message: "Lesson Question ID is required to get a question.",
    };
  }
  const question = await db.Lesson_Question.findByPk(lesson_question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }
  return { success: true, data: question };
};

const lockQuestion = async (lesson_question_id) => {
  if (!lesson_question_id) {
    return {
      success: false,
      message: "Lesson Question ID is required to lock a question.",
    };
  }
  const question = await db.Lesson_Question.findByPk(lesson_question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }
  question.status = false;
  await question.save();
  return { success: true, data: question };
};

const unlockQuestion = async (lesson_question_id) => {
  if (!lesson_question_id) {
    return {
      success: false,
      message: "Lesson Question ID is required to unlock a question.",
    };
  }
  const question = await db.Lesson_Question.findByPk(lesson_question_id);
  if (!question) {
    return { success: false, message: "Question not found." };
  }
  question.status = true;
  await question.save();
  return { success: true, data: question };
};

export {
  createQuestion,
  updateQuestion,
  getQuestionsByLessonIdPaginated,
  getQuestionsPaginated,
  getQuestionById,
  lockQuestion,
  unlockQuestion,
};
