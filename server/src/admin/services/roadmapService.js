import db from "../../models/index.js";

const createRoadmap = async (
  roadmap_title,
  roadmap_description,
  roadmap_aim,
  roadmap_level,
  estimated_duration,
  roadmap_status,
  certificate_id,
  discount_percent,
  roadmap_price,
) => {
  if (!roadmap_title || !roadmap_level) {
    return { success: false, message: "Missing required roadmap fields." };
  }
  const existingRoadmap = await db.Roadmap.findOne({
    where: { roadmap_title, roadmap_level },
  });
  if (existingRoadmap) {
    return {
      success: false,
      message: "Roadmap with the same title and level already exists.",
    };
  }

  const newRoadmap = await db.Roadmap.create({
    roadmap_title,
    roadmap_description,
    roadmap_aim,
    roadmap_level,
    estimated_duration,
    roadmap_status,
    certificate_id,
    discount_percent,
    roadmap_price,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newRoadmap };
};

const updateRoadmap = async (
  roadmap_id,
  roadmap_title,
  roadmap_description,
  roadmap_aim,
  roadmap_level,
  estimated_duration,
  roadmap_status,
  certificate_id,
  discount_percent,
) => {
  if (!roadmap_id) {
    return {
      success: false,
      message: "Roadmap ID is required to update a roadmap.",
    };
  }
  if (!roadmap_title || !roadmap_level) {
    return { success: false, message: "Missing required roadmap fields." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  roadmap.roadmap_title = roadmap_title;
  roadmap.roadmap_description = roadmap_description;
  roadmap.roadmap_aim = roadmap_aim;
  roadmap.roadmap_level = roadmap_level;
  roadmap.estimated_duration = estimated_duration;
  roadmap.roadmap_status = roadmap_status;
  roadmap.certificate_id = certificate_id;
  roadmap.discount_percent = discount_percent;
  roadmap.updated_at = new Date();
  await roadmap.save();
  return { success: true, data: roadmap };
};

const getRoadmapsPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  roadmap_level,
  roadmap_status,
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  const whereConditions = {};
  if (search) {
    whereConditions[Op.or] = [
      { roadmap_title: { [Op.iLike]: `%${search}%` } },
      { roadmap_description: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (roadmap_level) {
    whereConditions.roadmap_level = roadmap_level;
  }
  if (roadmap_status) {
    whereConditions.roadmap_status = roadmap_status;
  }
  const { count, rows } = await db.Roadmap.findAndCountAll({
    where: whereConditions,
    offset,
    limit: Number(limit),
  });
  return {
    success: true,
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
const getRoadmapById = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  return { success: true, data: roadmap };
};

const lockRoadmap = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  roadmap.roadmap_status = false;
  await roadmap.save();
  return { success: true, data: roadmap };
};

const unlockRoadmap = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  roadmap.roadmap_status = true;
  await roadmap.save();
  return { success: true, data: roadmap };
};

export {
  createRoadmap,
  updateRoadmap,
  getRoadmapsPaginated,
  getRoadmapById,
  lockRoadmap,
  unlockRoadmap,
};
