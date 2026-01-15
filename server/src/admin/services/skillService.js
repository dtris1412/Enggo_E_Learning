import db from "../../models/index.js";
const createSkill = async (skill_name) => {
  if (!skill_name) {
    return { success: false, message: "Skill name is required." };
  }
  const existingSkill = await db.Skill.findOne({ where: { skill_name } });
  if (existingSkill) {
    return { success: false, message: "Skill already exists." };
  }
  const newSkill = await db.Skill.create({
    skill_name,
    created_at: new Date(),
  });
  return {
    success: true,
    message: "Skill created successfully",
    data: newSkill,
  };
};

const updateSkill = async (skill_id, skill_name) => {
  const skill = await db.Skill.findByPk(skill_id);
  if (!skill) {
    return { success: false, message: "Skill not found." };
  }
  skill.skill_name = skill_name || skill.skill_name;
  skill.updated_at = new Date();
  await skill.save();
  return {
    success: true,
    message: "Skill updated successfully",
    data: skill,
  };
};

const getSkillsPaginated = async (search, limit = 10, page = 1) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  // Xây dựng điều kiện where
  const whereConditions = {};

  // Search theo skil_name
  if (search) {
    whereConditions.skill_name = { [Op.substring]: search };
  }

  const { count, rows } = await db.Skill.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: db.Certificate_Skill,
        as: "Certificate_Skills",
        attributes: [
          "certificate_skill_id",
          "certificate_id",
          "weight",
          "description",
        ],
        include: [
          {
            model: db.Certificate,
            attributes: ["certificate_id", "certificate_name"],
          },
        ],
      },
    ],
    limit: Number(limit),
    offset,
    order: [["created_at", "ASC"]],
  });
  return {
    success: true,
    message: "Skills retrieved successfully",
    data: {
      skills: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    },
  };
};

const getSkillById = async (skill_id) => {
  const skill = await db.Skill.findByPk(skill_id, {
    include: [
      {
        model: db.Certificate_Skill,
        as: "Certificate_Skills",
        attributes: [
          "certificate_skill_id",
          "certificate_id",
          "weight",
          "description",
        ],
        include: [
          {
            model: db.Certificate,
            attributes: ["certificate_id", "certificate_name", "description"],
          },
        ],
      },
    ],
  });
  if (!skill) {
    return { success: false, message: "Skill not found." };
  }
  return {
    success: true,
    message: "Skill retrieved successfully",
    data: skill,
  };
};
export { createSkill, updateSkill, getSkillsPaginated, getSkillById };
