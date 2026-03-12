import { getLessonById as getLessonByIdService } from "../services/lessonService.js";

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getLessonByIdService(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getLessonById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { getLessonById };
