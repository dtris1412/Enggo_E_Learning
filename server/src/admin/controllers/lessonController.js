import {
  createLesson as createLessonService,
  updateLessonById as updateLessonByIdService,
  getLessonById as getLessonByIdService,
  getLessonsPaginated as getLessonsPaginatedService,
  lockLesson as lockLessonService,
  unlockLesson as unlockLessonService,
} from "../services/lessonService.js";

const createLesson = async (req, res) => {
  try {
    const {
      lesson_title,
      lesson_type,
      difficulty_level,
      lesson_content,
      is_exam_format,
      estimated_time,
      skill_id,
      lesson_status,
    } = req.body;

    const result = await createLessonService(
      lesson_title,
      lesson_type,
      difficulty_level,
      lesson_content,
      is_exam_format,
      estimated_time,
      skill_id,
      lesson_status
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createLesson:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateLessonById = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const {
      lesson_title,
      lesson_type,
      difficulty_level,
      lesson_content,
      is_exam_format,
      estimated_time,
      skill_id,
    } = req.body;
    const result = await updateLessonByIdService(
      lesson_id,
      lesson_title,
      lesson_type,
      difficulty_level,
      lesson_content,
      is_exam_format,
      estimated_time,
      skill_id
    );
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateLessonById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getLessonById = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const result = await getLessonByIdService(lesson_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getLessonById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getLessonsPaginated = async (req, res) => {
  try {
    const {
      search,
      limit,
      page,
      lesson_type,
      difficulty_level,
      is_exam_format,
      lesson_status,
    } = req.query;
    const result = await getLessonsPaginatedService(
      search,
      limit,
      page,
      lesson_type,
      difficulty_level,
      is_exam_format,
      lesson_status
    );
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getLessonsPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const lockLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const result = await lockLessonService(lesson_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in lockLesson:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const unlockLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const result = await unlockLessonService(lesson_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in unlockLesson:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export {
  createLesson,
  updateLessonById,
  getLessonById,
  getLessonsPaginated,
  lockLesson,
  unlockLesson,
};
