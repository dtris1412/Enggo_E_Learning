import db from "../../models/index.js";

/**
 * EXAM MEDIA SERVICE
 * Quản lý các nghiệp vụ liên quan đến Exam Media (Audio/Media của đề thi)
 */

const createExamMedia = async (exam_id, audio_url, duration) => {
  if (!exam_id || !audio_url || !duration) {
    return { success: false, message: "All fields are required." };
  }

  const exam = await db.Exam.findByPk(exam_id);
  if (!exam) {
    return { success: false, message: "Exam not found." };
  }

  const newMedia = await db.Exam_Media.create({
    exam_id,
    audio_url,
    duration,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Exam media created successfully",
    data: newMedia,
  };
};

const deleteExamMedia = async (media_id) => {
  if (!media_id) {
    return { success: false, message: "Media ID is required." };
  }

  const media = await db.Exam_Media.findByPk(media_id);
  if (!media) {
    return { success: false, message: "Media not found." };
  }

  await media.destroy();

  return {
    success: true,
    message: "Exam media deleted successfully",
  };
};

const getExamMediaByExamId = async (exam_id) => {
  if (!exam_id) {
    return { success: false, message: "Exam ID is required." };
  }

  const mediaList = await db.Exam_Media.findAll({
    where: { exam_id },
    order: [["created_at", "ASC"]],
  });

  return {
    success: true,
    message: "Exam media retrieved successfully",
    data: mediaList,
  };
};

export { createExamMedia, deleteExamMedia, getExamMediaByExamId };
