import db from "../../models/index.js";

const createModule = async (
  module_title,
  module_description,
  order_index,
  estimated_time,
  course_id
) => {
  if (
    !module_title ||
    !module_description ||
    order_index === undefined ||
    estimated_time === undefined ||
    !course_id
  ) {
    return { success: false, message: "All fields are required." };
  }
  const isExistingModule = await db.Module.findOne({
    where: { module_title, course_id },
  });
  if (isExistingModule) {
    return {
      success: false,
      message: "Module with this title already exists in the course.",
    };
  }
  const newModule = await db.Module.create({
    module_title,
    module_description,
    order_index,
    estimated_time,
    course_id,
    created_at: new Date(),
  });
  return { success: true, data: newModule };
};

const updateModuleById = async (
  module_id,
  module_title,
  module_description,
  order_index,
  estimated_time
) => {
  if (!module_id) {
    return { success: false, message: "Module ID is required." };
  }
  const module = await db.Module.findByPk(module_id);
  if (!module) {
    return { success: false, message: "Module not found." };
  }
  await module.update({
    module_title: module_title || module.module_title,
    module_description: module_description || module.module_description,
    order_index: order_index !== undefined ? order_index : module.order_index,
    estimated_time:
      estimated_time !== undefined ? estimated_time : module.estimated_time,
    updated_at: new Date(),
  });
  return { success: true, data: module };
};

const getModulesPaginated = async (
  search = "",
  limit = 10,
  page = 1,
  course_id = null
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  // Xây dựng điều kiện where
  const whereConditions = {};

  if (search) {
    whereConditions[Op.or] = [
      { module_title: { [Op.substring]: search } },
      { module_description: { [Op.substring]: search } },
    ];
  }

  // Filter by course_id if provided
  if (course_id) {
    whereConditions.course_id = course_id;
  }

  const totalModules = await db.Module.count({ where: whereConditions });

  // Lấy danh sách modules với phân trang
  const { count, rows } = await db.Module.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset,
    order: [["order_index", "ASC"]],
  });
  return {
    success: true,
    message: "Modules retrieved successfully",
    data: rows,
    total: count,
    currentPage: Number(page),
    totalPages: Math.ceil(count / Number(limit)),
  };
};

const getModuleById = async (module_id) => {
  if (!module_id) {
    return { success: false, message: "Module ID is required." };
  }
  const module = await db.Module.findByPk(module_id);
  if (!module) {
    return { success: false, message: "Module not found." };
  }
  return {
    success: true,
    message: "Module retrieved successfully",
    data: module,
  };
};

export { createModule, updateModuleById, getModulesPaginated, getModuleById };
