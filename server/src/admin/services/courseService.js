import db from "../../models/index.js";

const createCourse = async (
  course_title,
  description,
  course_level,
  certificate_id
) => {
  if (!course_title || !description || !course_level || !certificate_id) {
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
  course_level
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

export {
  createCourse,
  updateCourseById,
  deleteCourse,
  getCoursesByCertificateId,
  getCourseById,
};
