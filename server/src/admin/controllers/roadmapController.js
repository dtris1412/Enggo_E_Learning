import {
  createRoadmap as createRoadmapService,
  updateRoadmap as updateRoadmapService,
  getRoadmapsPaginated as getRoadmapsPaginatedService,
  getRoadmapById as getRoadmapByIdService,
  lockRoadmap as lockRoadmapService,
  unlockRoadmap as unlockRoadmapService,
} from "../services/roadmapService.js";

const createRoadmap = async (req, res) => {
  try {
    const {
      roadmap_title,
      roadmap_description,
      roadmap_aim,
      roadmap_level,
      estimated_duration,
      roadmap_status,
      certificate_id,
      discount_percent,
      roadmap_price,
    } = req.body;
    const result = await createRoadmapService(
      roadmap_title,
      roadmap_description,
      roadmap_aim,
      roadmap_level,
      estimated_duration,
      roadmap_status,
      certificate_id,
      discount_percent,
      roadmap_price,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createRoadmap:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateRoadmap = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const {
      roadmap_title,
      roadmap_description,
      roadmap_aim,
      roadmap_level,
      estimated_duration,
      roadmap_status,
      certificate_id,
      discount_percent,
    } = req.body;
    const result = await updateRoadmapService(
      roadmap_id,
      roadmap_title,
      roadmap_description,
      roadmap_aim,
      roadmap_level,
      estimated_duration,
      roadmap_status,
      certificate_id,
      discount_percent,
    );
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in updateRoadmap:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getRoadmapsPaginated = async (req, res) => {
  try {
    const { search, page, limit, roadmap_level, roadmap_status } = req.query;
    const result = await getRoadmapsPaginatedService(
      search,
      page,
      limit,
      roadmap_level,
      roadmap_status,
    );
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getRoadmapPaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getRoadmapById = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const result = await getRoadmapByIdService(roadmap_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getRoadmapById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const lockRoadmap = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const result = await lockRoadmapService(roadmap_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in lockRoadmap:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const unlockRoadmap = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const result = await unlockRoadmapService(roadmap_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in unlockRoadmap:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createRoadmap,
  updateRoadmap,
  getRoadmapsPaginated,
  getRoadmapById,
  lockRoadmap,
  unlockRoadmap,
};
