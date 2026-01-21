import db from "../../models/index.js";

const createPhase = async (
  phase_name,
  phase_description,
  order,
  phase_aims,
  roadmap_id,
) => {
  if (
    !phase_name ||
    !phase_description ||
    order === undefined ||
    !phase_aims ||
    !roadmap_id
  ) {
    return { success: false, message: "All fields are required." };
  }
  const existingPhase = await db.Phase.findOne({
    where: { phase_name, roadmap_id },
  });
  if (existingPhase) {
    return {
      success: false,
      message: "Phase with this name already exists in the roadmap.",
    };
  }
  const newPhase = await db.Phase.create({
    phase_name,
    phase_description,
    order,
    phase_aims,
    roadmap_id,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newPhase };
};

const updatePhase = async (
  phase_id,
  phase_name,
  phase_description,
  order,
  phase_aims,
) => {
  if (!phase_id) {
    return { success: false, message: "Phase ID is required." };
  }
  const phase = await db.Phase.findByPk(phase_id);
  if (!phase) {
    return { success: false, message: "Phase not found." };
  }
  phase.phase_name = phase_name || phase.phase_name;
  phase.phase_description = phase_description || phase.phase_description;
  phase.order = order !== undefined ? order : phase.order;
  phase.phase_aims = phase_aims || phase.phase_aims;

  phase.updated_at = new Date();
  await phase.save();
  return { success: true, data: phase };
};

const getPhasesByRoadmapId = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const phases = await db.Phase.findAll({
    where: { roadmap_id },
    order: [["order", "ASC"]],
  });
  return { success: true, data: phases };
};

const getPhaseById = async (phase_id) => {
  if (!phase_id) {
    return { success: false, message: "Phase ID is required." };
  }
  const phase = await db.Phase.findByPk(phase_id);
  if (!phase) {
    return { success: false, message: "Phase not found." };
  }
  return { success: true, data: phase };
};

export { createPhase, updatePhase, getPhasesByRoadmapId, getPhaseById };
