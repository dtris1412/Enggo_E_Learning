import {
  createSkill as createSkillService,
  updateSkill as updateSkillService,
  getSkillsPaginated as getSkillsPaginatedService,
  getSkillById as getSkillByIdService,
} from "../services/skillService.js";

const getSkillsPaginated = async (req, res) => {
  try {
    const { search, limit, page } = req.query;
    const result = await getSkillsPaginatedService(search, limit, page);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving skills:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getSkillById = async (req, res) => {
  try {
    const { skill_id } = req.params;
    const result = await getSkillByIdService(skill_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving skill by ID:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const createSkill = async (req, res) => {
  try {
    const { skill_name } = req.body;
    const result = await createSkillService(skill_name);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating skill:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { skill_id } = req.params;
    const { skill_name } = req.body;
    const result = await updateSkillService(skill_id, skill_name);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating skill:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { createSkill, updateSkill, getSkillsPaginated, getSkillById };
