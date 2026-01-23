import {
  createModuleLesson as createModuleLessonService,
  updateModuleLesson as updateModuleLessonService,
  deleteModuleLesson as deleteModuleLessonService,
  getModuleLessons as getModuleLessonsService,
} from "../services/module_lessonService.js";

const createModuleLesson = async (req, res) => {
  try {
    const { module_id } = req.params;
    const { lesson_id, description, order_index, status } = req.body;
    const result = await createModuleLessonService(
      module_id,
      lesson_id,
      description,
      order_index,
      status,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createModuleLesson:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateModuleLesson = async (req, res) => {
  try {
    const { module_lesson_id } = req.params;
    const { order_index, status } = req.body;
    const result = await updateModuleLessonService(
      module_lesson_id,
      order_index,
      status,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateModuleLesson:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteModuleLesson = async (req, res) => {
  try {
    const { module_lesson_id } = req.params;
    const result = await deleteModuleLessonService(module_lesson_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in deleteModuleLesson:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getModuleLessons = async (req, res) => {
  try {
    const { module_id } = req.params;
    const result = await getModuleLessonsService(module_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getModuleLessons:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createModuleLesson,
  updateModuleLesson,
  deleteModuleLesson,
  getModuleLessons,
};
