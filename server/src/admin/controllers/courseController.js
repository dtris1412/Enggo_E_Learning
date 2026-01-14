import {
  createCourse as createCourseService,
  updateCourseById as updateCourseByIdService,
  getCourseById as getCourseByIdService,
  getCoursePaginated as getCoursePaginatedService,
  lockCourseById as lockCourseByIdService,
  unlockCourseById as unlockCourseByIdService,
} from "../services/courseService.js";

const createCourse = async (req, res) => {
  try {
    const {
      course_title,
      description,
      course_level,

      course_aim,
      estimate_duration,
      course_status,
      tag,
    } = req.body;
    const newCourse = await createCourseService(
      course_title,
      description,
      course_level,

      course_aim,
      estimate_duration,
      course_status,
      tag
    );
    if (!newCourse.success) {
      return res.status(400).json(newCourse);
    }
    res.status(201).json(newCourse);
  } catch (err) {
    console.error("Error in createCourse:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;
    const {
      course_title,
      description,
      course_level,
      course_aim,
      estimate_duration,
      course_status,
      tag,
    } = req.body;
    const updatedCourse = await updateCourseByIdService(
      course_id,
      course_title,
      description,
      course_level,
      course_aim,
      estimate_duration,
      course_status,
      tag
    );
    if (!updatedCourse.success) {
      return res.status(400).json(updatedCourse);
    }
    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error("Error in updateCourseById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;
    const result = await getCourseByIdService(course_id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCourseById:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCoursePaginated = async (req, res) => {
  try {
    const { search, limit, page, course_status, course_level, tag } = req.query;
    const result = await getCoursePaginatedService(
      search,
      limit,
      page,
      course_status,
      course_level,
      tag
    );
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getCoursePaginated:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const lockCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;
    const result = await lockCourseByIdService(course_id); // Bỏ course_status
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in lockCourseById: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const unlockCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;
    const result = await unlockCourseByIdService(course_id); // Bỏ course_status
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in unlockCourseById: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  createCourse,
  updateCourseById,
  getCourseById,
  getCoursePaginated,
  lockCourseById,
  unlockCourseById,
};
