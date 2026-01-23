import db from "../../models/index.js";

const createModuleLesson = async (
  module_id,
  lesson_id,
  description,
  order_index,
  status,
) => {
  if (
    !module_id ||
    !lesson_id ||
    order_index === undefined ||
    status === undefined
  ) {
    return { success: false, message: "Missing required fields." };
  }
  const existingModuleLesson = await db.Module_Lesson.findOne({
    where: { module_id, lesson_id },
  });
  if (existingModuleLesson) {
    return {
      success: false,
      message: "Lesson already added to this module.",
    };
  }
  const newModuleLesson = await db.Module_Lesson.create({
    module_id,
    lesson_id,
    description: description || null,
    order_index,
    status,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newModuleLesson };
};

const updateModuleLesson = async (module_lesson_id, order_index, status) => {
  if (!module_lesson_id) {
    return { success: false, message: "Module_Lesson ID is required." };
  }
  const moduleLesson = await db.Module_Lesson.findByPk(module_lesson_id);
  if (!moduleLesson) {
    return { success: false, message: "Module_Lesson not found." };
  }
  if (order_index !== undefined) {
    moduleLesson.order_index = order_index;
  }
  if (status !== undefined) {
    moduleLesson.status = status;
  }
  moduleLesson.updated_at = new Date();
  await moduleLesson.save();
  return { success: true, data: moduleLesson };
};

const deleteModuleLesson = async (module_lesson_id) => {
  if (!module_lesson_id) {
    return { success: false, message: "Module_Lesson ID is required." };
  }
  const moduleLesson = await db.Module_Lesson.findByPk(module_lesson_id);
  if (!moduleLesson) {
    return { success: false, message: "Module_Lesson not found." };
  }
  await moduleLesson.destroy();
  return { success: true, message: "Module_Lesson deleted successfully." };
};

const getModuleLessons = async (module_id) => {
  if (!module_id) {
    return { success: false, message: "Module ID is required." };
  }
  const moduleLessons = await db.Module_Lesson.findAll({
    where: { module_id },
    include: [{ model: db.Lesson }],
  });
  return { success: true, data: moduleLessons };
};

export {
  createModuleLesson,
  updateModuleLesson,
  deleteModuleLesson,
  getModuleLessons,
};
