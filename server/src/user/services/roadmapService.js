import db from "../../models/index.js";

const getRoadmapsPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  roadmap_level,
  certificate_id,
  sortBy = "created_at",
  sortOrder = "DESC",
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);

  const whereConditions = {};
  if (search && search.trim()) {
    whereConditions.roadmap_title = { [Op.like]: `%${search}%` };
  }
  if (roadmap_level) {
    whereConditions.roadmap_level = roadmap_level;
  }
  if (certificate_id) {
    whereConditions.certificate_id = certificate_id;
  }
  whereConditions.roadmap_status = true; // Only show active roadmaps

  // Validate sortBy field
  const allowedSortFields = [
    "created_at",
    "roadmap_title",
    "estimated_duration",
  ];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  const { count, rows } = await db.Roadmap.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name", "description"],
      },
    ],
    limit: Number(limit),
    offset: Number(offset),
    order: [[validSortBy, validSortOrder]],
  });

  return {
    success: true,
    data: {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      roadmaps: rows,
    },
  };
};

const getRoadmapById = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }

  const roadmap = await db.Roadmap.findOne({
    where: { roadmap_id, roadmap_status: true },
    include: [
      {
        model: db.Certificate,
        attributes: ["certificate_id", "certificate_name", "description"],
      },
      {
        model: db.Phase,
        attributes: [
          "phase_id",
          "phase_name",
          "phase_description",
          "order",
          "phase_aims",
        ],
        order: [["order", "ASC"]],
        include: [
          {
            model: db.Phase_Course,
            attributes: ["phase_course_id", "order_number", "is_required"],
            include: [
              {
                model: db.Course,
                attributes: [
                  "course_id",
                  "course_title",
                  "description",
                  "course_level",
                  "estimate_duration",
                  "tag",
                  "access_type",
                ],
                where: { course_status: true },
                required: false,
                include: [
                  {
                    model: db.Module,
                    attributes: [
                      "module_id",
                      "module_title",
                      "module_description",
                      "order_index",
                      "estimated_time",
                    ],
                    required: false,
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
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: db.Document_Phase,
            attributes: ["document_phase_id", "order_index"],
            include: [
              {
                model: db.Document,
                attributes: [
                  "document_id",
                  "document_type",
                  "document_name",
                  "document_description",
                  "document_url",
                  "file_type",
                  "access_type",
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }

  return { success: true, data: roadmap };
};

export { getRoadmapsPaginated, getRoadmapById };
