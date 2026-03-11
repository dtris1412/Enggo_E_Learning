import {
  getCoursesPaginated as getCoursesPaginatedService,
  getCourseById as getCourseByIdService,
} from "../services/courseService.js";

const getCoursesPaginated = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      course_level,
      access_type,
      tag,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await getCoursesPaginatedService(
      search,
      page,
      limit,
      course_level,
      access_type,
      tag,
      sortBy,
      sortOrder,
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCoursesPaginated controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await getCourseByIdService(course_id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCourseById controller:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { getCoursesPaginated, getCourseById };
