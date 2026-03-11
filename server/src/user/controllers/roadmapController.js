import {
  getRoadmapsPaginated as getRoadmapsPaginatedService,
  getRoadmapById as getRoadmapByIdService,
} from "../services/roadmapService.js";

const getRoadmapsPaginated = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      roadmap_level,
      certificate_id,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await getRoadmapsPaginatedService(
      search,
      page,
      limit,
      roadmap_level,
      certificate_id,
      sortBy,
      sortOrder,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getRoadmapsPaginated controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
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
    console.error("Error in getRoadmapById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { getRoadmapsPaginated, getRoadmapById };
