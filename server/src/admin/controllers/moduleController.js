import {
  createModule as createModuleService,
  updateModuleById as updateModuleByIdService,
  getModulesPaginated as getModulesPaginatedService,
  getModuleById as getModuleByIdService,
} from "../services/moduleService.js";

const createModule = async (req, res) => {
  try {
    const { module_title, module_description, order_index, estimated_time } =
      req.body;
    const { course_id } = req.params;
    const newModule = await createModuleService(
      module_title,
      module_description,
      order_index,
      estimated_time,
      course_id
    );
    if (!newModule.success) {
      return res.status(400).json(newModule);
    }
    res.status(201).json(newModule);
  } catch (err) {
    console.error("Error in createModule:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateModuleById = async (req, res) => {
  try {
    const { module_id } = req.params;
    const { module_title, module_description, order_index, estimated_time } =
      req.body;
    const updatedModule = await updateModuleByIdService(
      module_id,
      module_title,
      module_description,
      order_index,
      estimated_time
    );
    if (!updatedModule.success) {
      return res.status(400).json(updatedModule);
    }
    res.status(200).json(updatedModule);
  } catch (err) {
    console.error("Error in updateModuleById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getModulesPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { course_id } = req.params;

    // If course_id is provided, filter by course
    const search = course_id ? "" : "";
    const result = await getModulesPaginatedService(
      search,
      limit,
      page,
      course_id
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getModulesPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getModuleById = async (req, res) => {
  try {
    const { module_id } = req.params;
    const result = await getModuleByIdService(module_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getModuleById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { createModule, updateModuleById, getModulesPaginated, getModuleById };
