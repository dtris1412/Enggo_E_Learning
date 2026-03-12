import progressService from "../services/progressService.js";

/**
 * Start a course for the authenticated user
 * POST /api/user/courses/:id/start
 */
const startCourse = async (req, res) => {
  try {
    const userId = req.user.user_id; // From auth middleware
    const courseId = parseInt(req.params.id);

    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const result = await progressService.startCourse(userId, courseId);

    return res.status(result.isNew ? 201 : 200).json({
      success: true,
      message: result.message,
      data: result.userCourse,
      isNew: result.isNew,
    });
  } catch (error) {
    console.error("Error starting course:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start course",
    });
  }
};

/**
 * Start a roadmap for the authenticated user
 * POST /api/user/roadmaps/:id/start
 */
const startRoadmap = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roadmapId = parseInt(req.params.id);

    if (!roadmapId || isNaN(roadmapId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roadmap ID",
      });
    }

    const result = await progressService.startRoadmap(userId, roadmapId);

    return res.status(result.isNew ? 201 : 200).json({
      success: true,
      message: result.message,
      data: result.userRoadmap,
      isNew: result.isNew,
    });
  } catch (error) {
    console.error("Error starting roadmap:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start roadmap",
    });
  }
};

/**
 * Update lesson progress for the authenticated user
 * PUT /api/user/lessons/:id/progress
 * Body: { progressPercentage: number, isCompleted: boolean }
 */
const updateLessonProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const lessonId = parseInt(req.params.id);
    const { progressPercentage, isCompleted } = req.body;

    if (!lessonId || isNaN(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    if (
      progressPercentage === undefined ||
      isNaN(progressPercentage) ||
      progressPercentage < 0 ||
      progressPercentage > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress percentage must be between 0 and 100",
      });
    }

    const result = await progressService.updateLessonProgress(
      userId,
      lessonId,
      progressPercentage,
      isCompleted || false,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.lessonProgress,
    });
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update lesson progress",
    });
  }
};

/**
 * Get course progress for the authenticated user
 * GET /api/user/courses/:id/progress
 */
const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const courseId = parseInt(req.params.id);

    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const result = await progressService.getCourseProgress(userId, courseId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getting course progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get course progress",
    });
  }
};

/**
 * Get roadmap progress for the authenticated user
 * GET /api/user/roadmaps/:id/progress
 */
const getRoadmapProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roadmapId = parseInt(req.params.id);

    if (!roadmapId || isNaN(roadmapId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roadmap ID",
      });
    }

    const result = await progressService.getRoadmapProgress(userId, roadmapId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getting roadmap progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get roadmap progress",
    });
  }
};

/**
 * Get lesson progress for the authenticated user
 * GET /api/user/lessons/:id/progress
 */
const getLessonProgress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const lessonId = parseInt(req.params.id);

    if (!lessonId || isNaN(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const result = await progressService.getLessonProgress(userId, lessonId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get lesson progress",
    });
  }
};

/**
 * Get all enrolled courses for the authenticated user
 * GET /api/user/courses/enrolled
 */
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const courses = await progressService.getEnrolledCourses(userId);

    return res.status(200).json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error getting enrolled courses:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get enrolled courses",
    });
  }
};

export {
  startCourse,
  startRoadmap,
  updateLessonProgress,
  getCourseProgress,
  getRoadmapProgress,
  getLessonProgress,
  getEnrolledCourses,
};
