import db from "../../models/index.js";

/**
 * Get lesson by ID with media and questions
 * @param {number} lessonId
 * @returns {Object} lesson with media and questions
 */
const getLessonById = async (lessonId) => {
  if (!lessonId) {
    return { success: false, message: "Lesson ID is required." };
  }

  const lesson = await db.Lesson.findOne({
    where: { lesson_id: lessonId, lesson_status: true },
    include: [
      {
        model: db.Lesson_Media,
        attributes: [
          "media_id",
          "order_index",
          "description",
          "media_type",
          "media_url",
          "transcript",
        ],
        required: false,
      },
      {
        model: db.Lesson_Question,
        attributes: [
          "lesson_question_id",
          "order_index",
          "question_type",
          "content",
          "options",
          "correct_answer",
          "explaination",
          "difficulty_level",
        ],
        where: { status: true },
        required: false,
      },
    ],
    order: [
      [db.Lesson_Media, "order_index", "ASC"],
      [db.Lesson_Question, "order_index", "ASC"],
    ],
  });

  if (!lesson) {
    return { success: false, message: "Lesson not found." };
  }

  return { success: true, data: lesson };
};

export { getLessonById };
