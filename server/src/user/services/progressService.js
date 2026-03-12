import db from "../../models/index.js";

/**
 * Start a course for a user (create user_course record if not exists)
 * @param {number} userId
 * @param {number} courseId
 * @returns {Object} user_course record
 */
const startCourse = async (userId, courseId) => {
  // Check if course exists and is active
  const course = await db.Course.findOne({
    where: { course_id: courseId, course_status: true },
  });

  if (!course) {
    throw new Error("Course not found or inactive");
  }

  // Check if user already started this course
  let userCourse = await db.User_Course.findOne({
    where: { user_id: userId, course_id: courseId },
  });

  if (userCourse) {
    return {
      userCourse,
      message: "Course already started",
      isNew: false,
    };
  }

  // Create new user_course record
  userCourse = await db.User_Course.create({
    user_id: userId,
    course_id: courseId,
    started_at: new Date(),
    progress_percentage: 0.0,
    is_completed: false,
  });

  return {
    userCourse,
    message: "Course started successfully",
    isNew: true,
  };
};

/**
 * Start a roadmap for a user (create user_roadmap record if not exists)
 * @param {number} userId
 * @param {number} roadmapId
 * @returns {Object} user_roadmap record
 */
const startRoadmap = async (userId, roadmapId) => {
  // Check if roadmap exists and is active
  const roadmap = await db.Roadmap.findOne({
    where: { roadmap_id: roadmapId, roadmap_status: true },
  });

  if (!roadmap) {
    throw new Error("Roadmap not found or inactive");
  }

  // Check if user already started this roadmap
  let userRoadmap = await db.User_Roadmap.findOne({
    where: { user_id: userId, roadmap_id: roadmapId },
  });

  if (userRoadmap) {
    return {
      userRoadmap,
      message: "Roadmap already started",
      isNew: false,
    };
  }

  // Create new user_roadmap record
  userRoadmap = await db.User_Roadmap.create({
    user_id: userId,
    roadmap_id: roadmapId,
    started_at: new Date(),
    progress_percentage: 0.0,
    is_completed: false,
  });

  return {
    userRoadmap,
    message: "Roadmap started successfully",
    isNew: true,
  };
};

/**
 * Update lesson progress for a user
 * @param {number} userId
 * @param {number} lessonId
 * @param {number} progressPercentage (0-100)
 * @param {boolean} isCompleted
 * @returns {Object} updated progress and course progress
 */
const updateLessonProgress = async (
  userId,
  lessonId,
  progressPercentage,
  isCompleted = false,
) => {
  // Validate progress percentage
  const validProgress = Math.max(0, Math.min(100, progressPercentage));

  // Check if lesson exists
  const lesson = await db.Lesson.findOne({
    where: { lesson_id: lessonId },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // Find or create user_lesson_progress
  let lessonProgress = await db.User_Lesson_Progress.findOne({
    where: { user_id: userId, lesson_id: lessonId },
  });

  const now = new Date();

  if (lessonProgress) {
    // Update existing progress
    lessonProgress.progress_percentage = validProgress;
    lessonProgress.is_completed = isCompleted || validProgress === 100;
    if (lessonProgress.is_completed && !lessonProgress.completed_at) {
      lessonProgress.completed_at = now;
    }
    lessonProgress.updated_at = now;
    await lessonProgress.save();
  } else {
    // Create new progress record
    lessonProgress = await db.User_Lesson_Progress.create({
      user_id: userId,
      lesson_id: lessonId,
      started_at: now,
      completed_at: isCompleted || validProgress === 100 ? now : null,
      progress_percentage: validProgress,
      is_completed: isCompleted || validProgress === 100,
    });
  }

  // Update course progress if lesson belongs to a course
  await updateCourseProgressFromLessons(userId, lessonId);

  return {
    lessonProgress,
    message: "Lesson progress updated successfully",
  };
};

/**
 * Update course progress based on completed lessons
 * @param {number} userId
 * @param {number} lessonId
 */
const updateCourseProgressFromLessons = async (userId, lessonId) => {
  // Find which course(s) this lesson belongs to via module_lessons
  const moduleLessons = await db.Module_Lesson.findAll({
    where: { lesson_id: lessonId },
    include: [
      {
        model: db.Module,
        attributes: ["module_id", "course_id"],
      },
    ],
  });

  for (const moduleLesson of moduleLessons) {
    if (!moduleLesson.Module) continue;

    const courseId = moduleLesson.Module.course_id;

    // Check if user has started this course
    const userCourse = await db.User_Course.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!userCourse) continue;

    // Calculate course progress
    const courseProgress = await calculateCourseProgress(userId, courseId);

    // Update user_course
    userCourse.progress_percentage = courseProgress.progressPercentage;
    userCourse.is_completed = courseProgress.isCompleted;
    if (courseProgress.isCompleted && !userCourse.completed_at) {
      userCourse.completed_at = new Date();
    }
    userCourse.updated_at = new Date();
    await userCourse.save();

    // If course belongs to a roadmap, update roadmap progress
    await updateRoadmapProgressFromCourses(userId, courseId);
  }
};

/**
 * Update roadmap progress based on completed courses
 * @param {number} userId
 * @param {number} courseId
 */
const updateRoadmapProgressFromCourses = async (userId, courseId) => {
  // Find which roadmap(s) this course belongs to via phase_courses
  const phaseCourses = await db.Phase_Course.findAll({
    where: { course_id: courseId },
    include: [
      {
        model: db.Phase,
        attributes: ["phase_id", "roadmap_id"],
      },
    ],
  });

  for (const phaseCourse of phaseCourses) {
    if (!phaseCourse.Phase) continue;

    const roadmapId = phaseCourse.Phase.roadmap_id;

    // Check if user has started this roadmap
    const userRoadmap = await db.User_Roadmap.findOne({
      where: { user_id: userId, roadmap_id: roadmapId },
    });

    if (!userRoadmap) continue;

    // Calculate roadmap progress
    const roadmapProgress = await calculateRoadmapProgress(userId, roadmapId);

    // Update user_roadmap
    userRoadmap.progress_percentage = roadmapProgress.progressPercentage;
    userRoadmap.is_completed = roadmapProgress.isCompleted;
    if (roadmapProgress.isCompleted && !userRoadmap.completed_at) {
      userRoadmap.completed_at = new Date();
    }
    userRoadmap.updated_at = new Date();
    await userRoadmap.save();
  }
};

/**
 * Calculate course progress based on lesson completion
 * @param {number} userId
 * @param {number} courseId
 * @returns {Object} { progressPercentage, isCompleted, completedLessons, totalLessons }
 */
const calculateCourseProgress = async (userId, courseId) => {
  // Get all lessons in this course
  const modules = await db.Module.findAll({
    where: { course_id: courseId },
    include: [
      {
        model: db.Module_Lesson,
        include: [
          {
            model: db.Lesson,
            attributes: ["lesson_id"],
          },
        ],
      },
    ],
  });

  const lessonIds = [];
  modules.forEach((module) => {
    module.Module_Lessons?.forEach((ml) => {
      if (ml.Lesson) {
        lessonIds.push(ml.Lesson.lesson_id);
      }
    });
  });

  const totalLessons = lessonIds.length;

  if (totalLessons === 0) {
    return {
      progressPercentage: 0,
      isCompleted: false,
      completedLessons: 0,
      totalLessons: 0,
    };
  }

  // Get user's progress for these lessons
  const completedLessons = await db.User_Lesson_Progress.count({
    where: {
      user_id: userId,
      lesson_id: lessonIds,
      is_completed: true,
    },
  });

  const progressPercentage = (completedLessons / totalLessons) * 100;
  const isCompleted = completedLessons === totalLessons;

  return {
    progressPercentage: Math.round(progressPercentage * 100) / 100, // Round to 2 decimals
    isCompleted,
    completedLessons,
    totalLessons,
  };
};

/**
 * Calculate roadmap progress based on course completion
 * @param {number} userId
 * @param {number} roadmapId
 * @returns {Object} { progressPercentage, isCompleted, completedCourses, totalCourses }
 */
const calculateRoadmapProgress = async (userId, roadmapId) => {
  // Get all courses in this roadmap
  const phases = await db.Phase.findAll({
    where: { roadmap_id: roadmapId },
    include: [
      {
        model: db.Phase_Course,
        include: [
          {
            model: db.Course,
            attributes: ["course_id"],
          },
        ],
      },
    ],
  });

  const courseIds = [];
  phases.forEach((phase) => {
    phase.Phase_Courses?.forEach((pc) => {
      if (pc.Course) {
        courseIds.push(pc.Course.course_id);
      }
    });
  });

  const totalCourses = courseIds.length;

  if (totalCourses === 0) {
    return {
      progressPercentage: 0,
      isCompleted: false,
      completedCourses: 0,
      totalCourses: 0,
    };
  }

  // Get user's progress for these courses
  const completedCourses = await db.User_Course.count({
    where: {
      user_id: userId,
      course_id: courseIds,
      is_completed: true,
    },
  });

  const progressPercentage = (completedCourses / totalCourses) * 100;
  const isCompleted = completedCourses === totalCourses;

  return {
    progressPercentage: Math.round(progressPercentage * 100) / 100,
    isCompleted,
    completedCourses,
    totalCourses,
  };
};

/**
 * Get course progress for a user
 * @param {number} userId
 * @param {number} courseId
 * @returns {Object} course progress details
 */
const getCourseProgress = async (userId, courseId) => {
  const userCourse = await db.User_Course.findOne({
    where: { user_id: userId, course_id: courseId },
  });

  if (!userCourse) {
    return {
      started: false,
      progress: null,
    };
  }

  const progress = await calculateCourseProgress(userId, courseId);

  return {
    started: true,
    progress: {
      ...userCourse.dataValues,
      ...progress,
    },
  };
};

/**
 * Get roadmap progress for a user
 * @param {number} userId
 * @param {number} roadmapId
 * @returns {Object} roadmap progress details
 */
const getRoadmapProgress = async (userId, roadmapId) => {
  const userRoadmap = await db.User_Roadmap.findOne({
    where: { user_id: userId, roadmap_id: roadmapId },
  });

  if (!userRoadmap) {
    return {
      started: false,
      progress: null,
    };
  }

  const progress = await calculateRoadmapProgress(userId, roadmapId);

  return {
    started: true,
    progress: {
      ...userRoadmap.dataValues,
      ...progress,
    },
  };
};

/**
 * Get lesson progress for a user
 * @param {number} userId
 * @param {number} lessonId
 * @returns {Object} lesson progress
 */
const getLessonProgress = async (userId, lessonId) => {
  const lessonProgress = await db.User_Lesson_Progress.findOne({
    where: { user_id: userId, lesson_id: lessonId },
  });

  if (!lessonProgress) {
    return {
      started: false,
      progress: null,
    };
  }

  return {
    started: true,
    progress: lessonProgress,
  };
};

/**
 * Get all enrolled courses for a user with progress
 * @param {number} userId
 * @returns {Array} enrolled courses with progress information
 */
const getEnrolledCourses = async (userId) => {
  // Get all user_courses for this user
  const userCourses = await db.User_Course.findAll({
    where: { user_id: userId },
    include: [
      {
        model: db.Course,
        where: { course_status: true },
        attributes: [
          "course_id",
          "course_title",
          "description",
          "course_level",
          "access_type",
          "estimate_duration",
          "created_at",
        ],
        include: [
          {
            model: db.Module,
            attributes: ["module_id"],
            include: [
              {
                model: db.Module_Lesson,
                attributes: ["module_lesson_id", "lesson_id"],
              },
            ],
          },
        ],
      },
    ],
    order: [["started_at", "DESC"]], // Most recently started first
  });

  // Calculate progress for each course
  const coursesWithProgress = await Promise.all(
    userCourses.map(async (userCourse) => {
      const course = userCourse.Course;

      // Get all lessons in this course
      const allLessons = [];
      if (course.Modules) {
        course.Modules.forEach((module) => {
          if (module.Module_Lessons) {
            module.Module_Lessons.forEach((ml) => {
              allLessons.push(ml.lesson_id);
            });
          }
        });
      }

      const totalLessons = allLessons.length;

      // Get completed lessons count
      const completedLessons = await db.User_Lesson_Progress.count({
        where: {
          user_id: userId,
          lesson_id: allLessons,
          is_completed: true,
        },
      });

      // Get last accessed lesson

      return {
        course_id: course.course_id,
        course_title: course.course_title,
        description: course.description,
        course_level: course.course_level,
        access_type: course.access_type,
        estimate_duration: course.estimate_duration,

        progress_percentage: userCourse.progress_percentage,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,

        started_at: userCourse.started_at,
      };
    }),
  );

  return coursesWithProgress;
};

export default {
  startCourse,
  startRoadmap,
  updateLessonProgress,
  getCourseProgress,
  getRoadmapProgress,
  getLessonProgress,
  getEnrolledCourses,
  calculateCourseProgress,
  calculateRoadmapProgress,
};
