import {
  createPhase as createPhaseService,
  updatePhase as updatePhaseService,
  getPhasesByRoadmapId as getPhasesByRoadmapIdService,
  getPhaseById as getPhaseByIdService,
} from "../services/phaseService.js";

const createPhase = async (req, res) => {
  try {
    const { phase_name, phase_description, order, phase_aims } = req.body;
    const { roadmap_id } = req.params;
    const result = await createPhaseService(
      phase_name,
      phase_description,
      order,
      phase_aims,
      roadmap_id,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating phase:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const updatePhase = async (req, res) => {
  try {
    const { phase_id } = req.params;
    const { phase_name, phase_description, order, phase_aims } = req.body;
    const result = await updatePhaseService(
      phase_id,
      phase_name,
      phase_description,
      order,
      phase_aims,
    );
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating phase:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getPhasesByRoadmapId = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const result = await getPhasesByRoadmapIdService(roadmap_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving phases by roadmap ID:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getPhaseById = async (req, res) => {
  try {
    const { phase_id } = req.params;
    const result = await getPhaseByIdService(phase_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving phase by ID:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
export { createPhase, updatePhase, getPhasesByRoadmapId, getPhaseById };
