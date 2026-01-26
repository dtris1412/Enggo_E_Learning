import db from "../../models/index.js";

// Hàm tính tổng giá của tất cả courses trong roadmap
const calculateRoadmapPrice = async (roadmap_id) => {
  try {
    // Lấy tất cả phases của roadmap
    const phases = await db.Phase.findAll({
      where: { roadmap_id },
      include: [
        {
          model: db.Phase_Course,
          include: [
            {
              model: db.Course,
              attributes: ["course_id", "price", "is_free"],
            },
          ],
        },
      ],
    });

    let totalPrice = 0;

    // Duyệt qua tất cả phases và tính tổng giá courses
    phases.forEach((phase) => {
      phase.Phase_Courses?.forEach((phaseCourse) => {
        if (phaseCourse.Course && !phaseCourse.Course.is_free) {
          totalPrice += parseFloat(phaseCourse.Course.price || 0);
        }
      });
    });

    return totalPrice;
  } catch (error) {
    console.error("Error calculating roadmap price:", error);
    return 0;
  }
};

const createRoadmap = async (
  roadmap_title,
  roadmap_description,
  roadmap_aim,
  roadmap_level,
  estimated_duration,
  roadmap_status,
  certificate_id,
  discount_percent,
  roadmap_price,
) => {
  if (!roadmap_title || !roadmap_level) {
    return { success: false, message: "Missing required roadmap fields." };
  }
  const existingRoadmap = await db.Roadmap.findOne({
    where: { roadmap_title, roadmap_level },
  });
  if (existingRoadmap) {
    return {
      success: false,
      message: "Roadmap with the same title and level already exists.",
    };
  }

  const newRoadmap = await db.Roadmap.create({
    roadmap_title,
    roadmap_description,
    roadmap_aim,
    roadmap_level,
    estimated_duration,
    roadmap_status,
    certificate_id,
    discount_percent,
    roadmap_price,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return { success: true, data: newRoadmap };
};

const updateRoadmap = async (
  roadmap_id,
  roadmap_title,
  roadmap_description,
  roadmap_aim,
  roadmap_level,
  estimated_duration,
  roadmap_status,
  certificate_id,
  discount_percent,
) => {
  if (!roadmap_id) {
    return {
      success: false,
      message: "Roadmap ID is required to update a roadmap.",
    };
  }
  if (!roadmap_title || !roadmap_level) {
    return { success: false, message: "Missing required roadmap fields." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  roadmap.roadmap_title = roadmap_title;
  roadmap.roadmap_description = roadmap_description;
  roadmap.roadmap_aim = roadmap_aim;
  roadmap.roadmap_level = roadmap_level;
  roadmap.estimated_duration = estimated_duration;
  roadmap.roadmap_status = roadmap_status;
  roadmap.certificate_id = certificate_id;
  roadmap.discount_percent = discount_percent;
  roadmap.updated_at = new Date();
  await roadmap.save();
  return { success: true, data: roadmap };
};

const getRoadmapsPaginated = async (
  search = "",
  page = 1,
  limit = 10,
  roadmap_level,
  roadmap_status,
) => {
  const Op = db.Sequelize.Op;
  const offset = (Number(page) - 1) * Number(limit);
  const whereConditions = {};
  if (search) {
    whereConditions[Op.or] = [
      { roadmap_title: { [Op.iLike]: `%${search}%` } },
      { roadmap_description: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (roadmap_level) {
    whereConditions.roadmap_level = roadmap_level;
  }
  if (roadmap_status) {
    whereConditions.roadmap_status = roadmap_status;
  }
  const { count, rows } = await db.Roadmap.findAndCountAll({
    include: [
      {
        model: db.Phase,
        include: [
          {
            model: db.Phase_Course,
            include: [
              {
                model: db.Course,
                attributes: ["course_id", "price", "is_free"],
              },
            ],
          },
        ],
      },
    ],
    where: whereConditions,
    offset,
    limit: Number(limit),
  });

  // Tính giá cho từng roadmap
  const roadmapsWithPrice = await Promise.all(
    rows.map(async (roadmap) => {
      const calculatedPrice = await calculateRoadmapPrice(roadmap.roadmap_id);
      const discountAmount = roadmap.discount_percent
        ? (calculatedPrice * roadmap.discount_percent) / 100
        : 0;
      const finalPrice = calculatedPrice - discountAmount;

      return {
        ...roadmap.toJSON(),
        calculated_price: calculatedPrice,
        discount_amount: discountAmount,
        final_price: finalPrice,
      };
    }),
  );

  return {
    success: true,
    data: roadmapsWithPrice,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
const getRoadmapById = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id, {
    include: [
      {
        model: db.Phase,
        include: [
          {
            model: db.Phase_Course,
            include: [
              {
                model: db.Course,
                attributes: ["course_id", "course_title", "price", "is_free"],
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

  // Tính giá động
  const calculatedPrice = await calculateRoadmapPrice(roadmap_id);
  const discountAmount = roadmap.discount_percent
    ? (calculatedPrice * roadmap.discount_percent) / 100
    : 0;
  const finalPrice = calculatedPrice - discountAmount;

  return {
    success: true,
    data: {
      ...roadmap.toJSON(),
      calculated_price: calculatedPrice,
      discount_amount: discountAmount,
      final_price: finalPrice,
    },
  };
};

// calculateRoadmapPrice,
const lockRoadmap = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  roadmap.roadmap_status = false;
  await roadmap.save();
  return { success: true, data: roadmap };
};

const unlockRoadmap = async (roadmap_id) => {
  if (!roadmap_id) {
    return { success: false, message: "Roadmap ID is required." };
  }
  const roadmap = await db.Roadmap.findByPk(roadmap_id);
  if (!roadmap) {
    return { success: false, message: "Roadmap not found." };
  }
  roadmap.roadmap_status = true;
  await roadmap.save();
  return { success: true, data: roadmap };
};

export {
  createRoadmap,
  updateRoadmap,
  getRoadmapsPaginated,
  getRoadmapById,
  lockRoadmap,
  unlockRoadmap,
};
