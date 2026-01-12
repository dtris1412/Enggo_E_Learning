import certificate from "../../models/certificate.js";
import course from "../../models/course.js";
import db from "../../models/index.js";

const createCourse = async (
  course_title,
  description,
  course_level,
  certificate_id,
  course_aim,
  estimate_duration,
  course_status
) => {
  if (
    !course_title ||
    !description ||
    !course_level ||
    !certificate_id ||
    !course_aim ||
    !estimate_duration ||
    !course_status
  ) {
    return { success: false, message: "All fields are required." };
  }

  // Kiểm tra certificate có tồn tại không
  const certificate = await db.Certificate.findByPk(certificate_id);
  if (!certificate) {
    return { success: false, message: "Certificate not found." };
  }

  const newCourse = await db.Course.create({
    course_title,
    description,
    course_level,
    certificate_id,
    course_aim,
    estimate_duration,
    course_status,
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
  course_status
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
  course.updated_at = new Date();

  await course.save();

  return {
    success: true,
    message: "Course updated successfully",
    data: course,
  };
};

const deleteCourse = async (course_id) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }

  const course = await db.Course.findByPk(course_id);
  if (!course) {
    return { success: false, message: "Course not found." };
  }

  await course.destroy();

  return {
    success: true,
    message: "Course deleted successfully",
  };
};

const getCoursesByCertificateId = async (certificate_id) => {
  if (!certificate_id) {
    return { success: false, message: "Certificate ID is required." };
  }

  const courses = await db.Course.findAll({
    where: { certificate_id },
    order: [["course_id", "ASC"]],
  });

  return {
    success: true,
    message: "Courses retrieved successfully",
    data: courses,
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
  course_status
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

export {
  createCourse,
  updateCourseById,
  deleteCourse,
  getCoursesByCertificateId,
  getCourseById,
  getCoursePaginated,
};
