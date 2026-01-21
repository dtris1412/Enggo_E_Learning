import db from "../../models/index.js";

const createPhaseCourse = async (
  phase_id,
  course_id,
  order_number,
  is_required,
) => {
  if (
    !phase_id ||
    !course_id ||
    order_number === undefined ||
    is_required === undefined
  ) {
    return { success: false, message: "Missing required fields." };
  }
  const existingEntry = await db.Phase_Course.findOne({
    where: { phase_id, course_id },
  });
  if (existingEntry) {
    return { success: false, message: "Entry already exists." };
  }
  const newEntry = await db.Phase_Course.create({
    phase_id,
    course_id,
    order_number,
    is_required,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newEntry };
};

const updatePhaseCourse = async (
  phase_course_id,
  phase_id,
  course_id,
  order_number,
  is_required,
) => {
  if (!phase_course_id) {
    return { success: false, message: "Phase_Course ID is required." };
  }
  if (
    !phase_id ||
    !course_id ||
    order_number === undefined ||
    is_required === undefined
  ) {
    return { success: false, message: "Missing required fields." };
  }
  const phaseCourse = await db.Phase_Course.findByPk(phase_course_id);
  if (!phaseCourse) {
    return { success: false, message: "Phase_Course not found." };
  }
  phaseCourse.phase_id = phase_id;
  phaseCourse.course_id = course_id;
  phaseCourse.order_number = order_number;
  phaseCourse.is_required = is_required;
  phaseCourse.updated_at = new Date();
  await phaseCourse.save();
  return { success: true, data: phaseCourse };
};

const getPhaseCoursesByPhaseId = async (phase_id) => {
  if (!phase_id) {
    return { success: false, message: "Phase ID is required." };
  }
  const phaseCourses = await db.Phase_Course.findAll({
    where: { phase_id },
    include: [{ model: db.Course }],
  });
  return { success: true, data: phaseCourses };
};

const removeCourseFromPhase = async (phase_course_id) => {
  if (!phase_course_id) {
    return { success: false, message: "Phase_Course ID is required." };
  }
  const phaseCourse = await db.Phase_Course.findByPk(phase_course_id);
  if (!phaseCourse) {
    return { success: false, message: "Phase_Course not found." };
  }
  await phaseCourse.destroy();
  return { success: true, message: "Phase_Course removed successfully." };
};

export {
  createPhaseCourse,
  updatePhaseCourse,
  getPhaseCoursesByPhaseId,
  removeCourseFromPhase,
};
