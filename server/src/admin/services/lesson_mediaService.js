import db from "../../models/index.js";

const createMedia = async (
  order_index,
  description,
  media_type,
  media_url,
  transcript,
  lesson_id,
) => {
  if (!media_type || !media_url || !lesson_id) {
    return { success: false, message: "Missing required fields" };
  }
  const existingMedia = await db.Lesson_Media.findOne({
    where: { media_url, lesson_id },
  });
  if (existingMedia) {
    return { success: false, message: "Media already exists for this lesson" };
  }
  const newMedia = await db.Lesson_Media.create({
    order_index: order_index || 0,
    description,
    media_type,
    media_url,
    transcript,
    lesson_id,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newMedia };
};

const updateMediaById = async (
  media_id,
  order_index,
  description,
  media_type,
  media_url,
  transcript,
) => {
  if (!media_id) {
    return { success: false, message: "Missing media_id" };
  }
  const media = await db.Lesson_Media.findByPk(media_id);
  if (!media) {
    return { success: false, message: "Media not found" };
  }
  media.order_index = order_index ?? media.order_index;
  media.description = description ?? media.description;
  media.media_type = media_type ?? media.media_type;
  media.media_url = media_url ?? media.media_url;
  media.transcript = transcript ?? media.transcript;
  media.updated_at = new Date();
  await media.save();
  return { success: true, data: media };
};

const getMediasPaginated = async (
  search = "",
  limit = 10,
  page = 1,
  media_type,
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  // Xây dựng điều kiện where
  const whereConditions = {};

  // Search theo media_type
  if (media_type) {
    whereConditions[Op.or] = [
      { media_type: { [Op.substring]: media_type } },
      { description: { [Op.substring]: media_type } },
    ];
  }
  //Filter
  if (media_type !== undefined && media_type !== "") {
    whereConditions.media_type = media_type;
  }

  const { count, rows } = await db.Lesson_Media.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset,
    order: [["media_id", "ASC"]],
  });
  return {
    success: true,
    totalMedias: count,
    medias: rows,
  };
};

const getMediaById = async (media_id) => {
  if (!media_id) {
    return { success: false, message: "Missing media_id" };
  }
  const media = await db.Lesson_Media.findByPk(media_id);
  if (!media) {
    return { success: false, message: "Media not found" };
  }
  return { success: true, data: media };
};

const getMediasByLessonId = async (lesson_id) => {
  if (!lesson_id) {
    return { success: false, message: "Missing lesson_id" };
  }
  const medias = await db.Lesson_Media.findAll({
    where: { lesson_id },
    order: [["order_index", "ASC"]],
  });
  return { success: true, data: medias };
};

const deleteMedia = async (media_id) => {
  if (!media_id) {
    return { success: false, message: "Missing media_id" };
  }
  const media = await db.Lesson_Media.findByPk(media_id);
  if (!media) {
    return { success: false, message: "Media not found" };
  }
  await media.destroy();
  return { success: true, message: "Media deleted successfully" };
};

export {
  createMedia,
  updateMediaById,
  getMediasPaginated,
  getMediaById,
  getMediasByLessonId,
  deleteMedia,
};
