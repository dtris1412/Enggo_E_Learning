import db from "../../models/index.js";

const getCoursesPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  course_level,
  access_type,
  tag,
  sortBy = "created_at",
  sortOrder = "DESC",
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  const whereConditions = {};
  if (search && search.trim()) {
    whereConditions.course_title = { [Op.like]: `%${search}%` };
  }
  if (course_level) {
    whereConditions.course_level = course_level;
  }
  if (access_type) {
    whereConditions.access_type = access_type;
  }
  if (tag) {
    whereConditions.tag = { [Op.like]: `%${tag}%` };
  }
  whereConditions.course_status = true; // Only show active courses

  // Validate sortBy field
  const allowedSortFields = ["created_at", "course_title", "estimate_duration"];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  const { count, rows } = await db.Course.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: db.Module,
        attributes: [
          "module_id",
          "module_title",
          "module_description",
          "order_index",
        ],
        required: false,
      },
    ],
    limit: Number(limit),
    offset: Number(offset),
    order: [[validSortBy, validSortOrder]],
    distinct: true,
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      courses: rows,
    },
  };
};

const getCourseById = async (course_id, user_id = null) => {
  if (!course_id) {
    return { success: false, message: "Course ID is required." };
  }

  const course = await db.Course.findOne({
    where: { course_id, course_status: true },
    include: [
      {
        model: db.Module,
        attributes: [
          "module_id",
          "module_title",
          "module_description",
          "order_index",
        ],
        include: [
          {
            model: db.Module_Lesson,
            attributes: [
              "module_lesson_id",
              "description",
              "order_index",
              "status",
            ],
            where: { status: true },
            required: false,
            include: [
              {
                model: db.Lesson,
                attributes: [
                  "lesson_id",
                  "lesson_type",
                  "lesson_title",
                  "lesson_content",
                  "estimated_time",
                  "difficulty_level",
                  "is_exam_format",
                ],
                ...(user_id
                  ? {
                      include: [
                        {
                          model: db.User_Lesson_Progress,
                          attributes: [
                            "user_lesson_progress_id",
                            "user_id",
                            "is_completed",
                            "progress_percentage",
                          ],
                          required: false,
                        },
                      ],
                    }
                  : {}),
              },
            ],
          },
        ],
      },
    ],
    order: [
      [db.Module, "order_index", "ASC"],
      [db.Module, db.Module_Lesson, "order_index", "ASC"],
    ],
  });

  if (!course) {
    return { success: false, message: "Course not found." };
  }

  // Filter user progress at application level
  if (user_id && course.Modules) {
    course.Modules.forEach((module) => {
      if (module.Module_Lessons) {
        module.Module_Lessons.forEach((ml) => {
          if (ml.Lesson && ml.Lesson.User_Lesson_Progress) {
            ml.Lesson.User_Lesson_Progress =
              ml.Lesson.User_Lesson_Progress.filter(
                (p) => p.user_id === user_id,
              );
          }
        });
      }
    });
  }

  return { success: true, data: course };
};

export { getCoursesPaginated, getCourseById };
