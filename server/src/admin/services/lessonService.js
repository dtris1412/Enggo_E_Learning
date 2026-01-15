import db from "../../models/index.js";
import lesson from "../../models/lesson.js";

const createLesson = async (
  lesson_title,
  lesson_type,
  difficulty_level,
  lesson_content,
  is_exam_format,
  estimated_time,
  skill_id,
  lesson_status
) => {
  if (!lesson_title || !lesson_type || !difficulty_level || !skill_id) {
    return { success: false, message: "Required fields are missing." };
  }
  const existingLesson = await db.Lesson.findOne({ where: { lesson_title } });
  if (existingLesson) {
    return {
      success: false,
      message: "Lesson with this title already exists.",
    };
  }
  const newLesson = await db.Lesson.create({
    lesson_title,
    lesson_type,
    difficulty_level,
    lesson_content: lesson_content || null,
    is_exam_format: is_exam_format !== undefined ? is_exam_format : false,
    estimated_time: estimated_time || null,
    skill_id,
    lesson_status: lesson_status !== undefined ? lesson_status : true,
    created_at: new Date(),
  });
  return {
    success: true,
    message: "Lesson created successfully",
    data: newLesson,
  };
};
const updateLessonById = async (
  lesson_id,
  lesson_title,
  lesson_type,
  difficulty_level,
  lesson_content,
  is_exam_format,
  estimated_time,
  skill_id
) => {
  const lesson = await db.Lesson.findByPk(lesson_id);
  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }
  lesson.lesson_title = lesson_title || lesson.lesson_title;
  lesson.lesson_type = lesson_type || lesson.lesson_type;
  lesson.difficulty_level = difficulty_level || lesson.difficulty_level;
  lesson.lesson_content = lesson_content || lesson.lesson_content;
  lesson.is_exam_format =
    is_exam_format !== undefined ? is_exam_format : lesson.is_exam_format;
  lesson.estimated_time = estimated_time || lesson.estimated_time;
  lesson.skill_id = skill_id || lesson.skill_id;
  lesson.updated_at = new Date();
  await lesson.save();

  return {
    success: true,
    message: "Lesson updated successfully",
    data: lesson,
  };
};

const getLessonsPaginated = async (
  search = "",
  limit = 10,
  page = 1,
  lesson_type,
  difficulty_level,
  is_exam_format,
  lesson_status
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  // Xây dựng điều kiện where
  const whereConditions = {};
  // Search theo lesson_title
  if (search) {
    whereConditions.lesson_title = { [Op.substring]: search };
  }
  // Filter theo lesson_type
  if (lesson_type) {
    whereConditions.lesson_type = lesson_type;
  }
  // Filter theo difficulty_level
  if (difficulty_level) {
    whereConditions.difficulty_level = difficulty_level;
  }
  // Filter theo is_exam_format
  if (is_exam_format !== undefined && is_exam_format !== "") {
    whereConditions.is_exam_format =
      is_exam_format === "true" || is_exam_format === true;
  }
  // Filter theo lesson_status
  if (lesson_status !== undefined && lesson_status !== "") {
    whereConditions.lesson_status =
      lesson_status === "true" || lesson_status === true;
  }
  const { count, rows } = await db.Lesson.findAndCountAll({
    where: whereConditions,

    limit: Number(limit),
    offset,
    order: [["created_at", "ASC"]],
  });
  return {
    success: true,
    totalLessons: count,
    lessons: rows,
  };
};

const getLessonById = async (lesson_id) => {
  const lesson = await db.Lesson.findByPk(lesson_id);
  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }
  return {
    success: true,
    data: lesson,
  };
};

const lockLesson = async (lesson_id) => {
  if (!lesson_id) {
    return { success: false, message: "Lesson ID is required." };
  }
  const lesson = await db.Lesson.findByPk(lesson_id);
  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }
  lesson.lesson_status = false;
  await lesson.save();
  return {
    success: true,
    message: "Lesson locked successfully",
    data: lesson,
  };
};
const unlockLesson = async (lesson_id) => {
  if (!lesson_id) {
    return { success: false, message: "Lesson ID is required." };
  }
  const lesson = await db.Lesson.findByPk(lesson_id);
  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }
  lesson.lesson_status = true;
  await lesson.save();
  return {
    success: true,
    message: "Lesson unlocked successfully",
    data: lesson,
  };
};

export {
  createLesson,
  updateLessonById,
  getLessonsPaginated,
  getLessonById,
  lockLesson,
  unlockLesson,
};
