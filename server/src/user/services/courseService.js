const getAllCourses = async () => {
  const courses = await db.Course.findAll();
  return { success: true, data: courses };
};
const getCourseById = async (course_id) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }
  const course = await db.Course.findByPk(course_id);
  if (!course) {
    return {
      success: false,
      message: "Course not found for the given course ID.",
    };
  }
  return { success: true, data: course };
};

export { getAllCourses, getCourseById };
