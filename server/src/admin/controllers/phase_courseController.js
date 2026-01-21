import {
  createPhaseCourse as createPhaseCourseService,
  updatePhaseCourse as updatePhaseCourseService,
  getPhaseCoursesByPhaseId as getPhaseCoursesByPhaseIdService,
  removeCourseFromPhase as removeCourseFromPhaseService,
} from "../services/phase_courseService.js";

const createPhaseCourse = async (req, res) => {
  try {
    const { phase_id } = req.params;
    const { course_id, order_number, is_required } = req.body;
    const result = await createPhaseCourseService(
      phase_id,
      course_id,
      order_number,
      is_required,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating phase course:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
const updatePhaseCourse = async (req, res) => {
  try {
    const { phase_course_id } = req.params;
    const { order_number, is_required } = req.body;
    const result = await updatePhaseCourseService(
      phase_course_id,
      order_number,
      is_required,
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error("Error updating phase course:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getPhaseCoursesByPhaseId = async (req, res) => {
  try {
    const { phase_id } = req.params;
    const result = await getPhaseCoursesByPhaseIdService(phase_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving phase courses by phase ID:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const removeCourseFromPhase = async (req, res) => {
  try {
    const { phase_course_id } = req.params;
    const result = await removeCourseFromPhaseService(phase_course_id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error removing course from phase:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
export {
  createPhaseCourse,
  updatePhaseCourse,
  getPhaseCoursesByPhaseId,
  removeCourseFromPhase,
};
