import db from "../../models/index.js";

const createCourse = async (
  course_title,
  description,
  course_level,
  course_aim,
  estimate_duration,
  course_status,
  tag
) => {
  if (
    !course_title ||
    !description ||
    !course_level ||
    !course_aim ||
    !estimate_duration ||
    !course_status ||
    !tag
  ) {
    return { success: false, message: "All fields are required." };
  }

  const newCourse = await db.Course.create({
    course_title,
    description,
    course_level,
    course_aim,
    estimate_duration,
    course_status,
    tag,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Course created successfully",
    data: newCourse,
  };
};

const updateCourseById = async (
  course_id,
  course_title,
  description,
  course_level,
  course_aim,
  estimate_duration,
  course_status,
  tag
) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }

  const course = await db.Course.findByPk(course_id);
  if (!course) {
    return { success: false, message: "Course not found." };
  }

  course.course_title = course_title || course.course_title;
  course.description = description || course.description;
  course.course_level = course_level || course.course_level;
  course.course_aim = course_aim || course.course_aim;
  course.estimate_duration = estimate_duration || course.estimate_duration;
  course.course_status =
    course_status !== undefined ? course_status : course.course_status;
  course.tag = tag || course.tag;
  course.updated_at = new Date();

  await course.save();

  return {
    success: true,
    message: "Course updated successfully",
    data: course,
  };
};

const getCourseById = async (course_id) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }

  const course = await db.Course.findByPk(course_id);
  if (!course) {
    return { success: false, message: "Course not found." };
  }

  return {
    success: true,
    message: "Course retrieved successfully",
    data: course,
  };
};

const getCoursePaginated = async (
  search = "",
  limit = 10,
  page = 1,
  course_status,
  tag
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  // Xây dựng điều kiện where
  const whereConditions = {};
  // Search theo course_title, description
  if (search) {
    whereConditions[Op.or] = [
      { course_title: { [Op.substring]: search } },
      { description: { [Op.substring]: search } },
    ];
  }
  if (course_status !== undefined && course_status !== "") {
    whereConditions.course_status =
      course_status === "true" || course_status === true;
  }
  if (tag) {
    whereConditions.tag = { [Op.substring]: tag };
  }
  //Đếm tổng số course
  const totalCourses = await db.Course.count({
    where: whereConditions,
  });
  const { count, rows } = await db.Course.findAndCountAll({
    where: whereConditions,
    limit: Number(limit),
    offset,
    order: [["course_id", "ASC"]],
  });

  return {
    success: true,
    message: "Courses retrieved successfully",
    data: rows,
    total: count,
    currentPage: Number(page),
    totalPages: Math.ceil(count / Number(limit)),
  };
};

const lockCourseById = async (course_id) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }
  const course = await db.Course.findByPk(course_id);
  if (!course) {
    return { success: false, message: "Course not found." };
  }
  if (course.course_status === false) {
    return { success: false, message: "Course is already locked." };
  }

  await course.update({
    course_status: false,
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Course locked successfully",
    data: course,
  };
};

const unlockCourseById = async (course_id) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }
  const course = await db.Course.findByPk(course_id);
  if (!course) {
    return { success: false, message: "Course not found." };
  }
  if (course.course_status === true) {
    return { success: false, message: "Course is already unlocked." };
  }

  await course.update({
    course_status: true,
    updated_at: new Date(),
  });

  return {
    success: true,
    message: "Course unlocked successfully",
    data: course,
  };
};

export {
  createCourse,
  updateCourseById,
  getCourseById,
  getCoursePaginated,
  lockCourseById,
  unlockCourseById,
};
