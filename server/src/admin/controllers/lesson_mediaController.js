import {
  createMedia as createMediaService,
  updateMediaById as updateMediaByIdService,
  getMediasPaginated as getMediasPaginatedService,
  getMediaById as getMediaByIdService,
  getMediasByLessonId as getMediasByLessonIdService,
  deleteMedia as deleteMediaService,
} from "../services/lesson_mediaService.js";

const createMedia = async (req, res) => {
  try {
    const { order_index, description, media_type, media_url, transcript } =
      req.body;
    const { lesson_id } = req.params;
    const newMedia = await createMediaService(
      order_index,
      description,
      media_type,
      media_url,
      transcript,
      lesson_id,
    );
    if (!newMedia.success) {
      return res.status(400).json(newMedia);
    }
    res.status(201).json(newMedia);
  } catch (err) {
    console.error("Error in createMedia:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateMediaById = async (req, res) => {
  try {
    const { media_id } = req.params;
    const { order_index, description, media_type, media_url, transcript } =
      req.body;
    const updatedMedia = await updateMediaByIdService(
      media_id,
      order_index,
      description,
      media_type,
      media_url,
      transcript,
    );
    if (!updatedMedia.success) {
      return res.status(400).json(updatedMedia);
    }
    res.status(200).json(updatedMedia);
  } catch (err) {
    console.error("Error in updateMediaById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMediasPaginated = async (req, res) => {
  try {
    const { search, limit, page, media_type } = req.query;
    const result = await getMediasPaginatedService(
      search,
      parseInt(limit) || 10,
      parseInt(page) || 1,
      media_type,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getMediasPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMediaById = async (req, res) => {
  try {
    const { media_id } = req.params;
    const result = await getMediaByIdService(media_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getMediaById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMediasByLessonId = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const result = await getMediasByLessonIdService(lesson_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getMediasByLessonId:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { media_id } = req.params;
    const result = await deleteMediaService(media_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteMedia:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createMedia,
  updateMediaById,
  getMediasPaginated,
  getMediaById,
  getMediasByLessonId,
  deleteMedia,
};
