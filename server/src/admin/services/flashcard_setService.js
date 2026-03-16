import db from "../../models/index.js";
import { Op } from "sequelize";

// Lấy tất cả flashcard sets (có phân trang, filter, search)
const getFlashcardSetsPaginated = async ({
  page = 1,
  limit = 10,
  search = "",
  visibility = "",
  created_by_type = "",
  sortBy = "created_at",
  order = "DESC",
}) => {
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Search theo title hoặc description
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filter theo visibility
  if (visibility) {
    whereClause.visibility = visibility;
  }

  // Filter theo created_by_type
  if (created_by_type) {
    whereClause.created_by_type = created_by_type;
  }

  const { count, rows } = await db.Flashcard_Set.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
      {
        model: db.Flashcard,
        attributes: ["flashcard_id", "front_content", "back_content"],
        separate: true, // Fetch flashcards in separate query to avoid cartesian product
      },
    ],
    attributes: {
      include: [
        [
          db.sequelize.literal(`(
            SELECT COUNT(DISTINCT user_id)
            FROM user_flashcard_sets
            WHERE user_flashcard_sets.flashcard_set_id = Flashcard_Set.flashcard_set_id
          )`),
          "learner_count",
        ],
      ],
    },
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, order]],
    distinct: true,
  });

  return {
    flashcardSets: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy flashcard set theo ID
const getFlashcardSetById = async (flashcard_set_id) => {
  const flashcardSet = await db.Flashcard_Set.findOne({
    where: { flashcard_set_id },
    include: [
      {
        model: db.User,
        attributes: ["user_id", "user_name", "user_email", "avatar"],
      },
      {
        model: db.Flashcard,
        attributes: [
          "flashcard_id",
          "front_content",
          "back_content",
          "example",
          "difficulty_level",
          "pronunciation",
          "audio_url",
        ],
      },
    ],
    attributes: {
      include: [
        [
          db.sequelize.literal(`(
            SELECT COUNT(DISTINCT user_id)
            FROM user_flashcard_sets
            WHERE user_flashcard_sets.flashcard_set_id = Flashcard_Set.flashcard_set_id
          )`),
          "learner_count",
        ],
      ],
    },
    subQuery: false,
  });

  return flashcardSet;
};

// Tạo flashcard set mới
const createFlashcardSet = async ({
  user_id,
  user_exam_id = null,
  exam_id = null,
  source_type = null,
  title,
  description = null,
  visibility = "",
  created_by_type = "",
}) => {
  const flashcardSet = await db.Flashcard_Set.create({
    user_id,
    user_exam_id,
    exam_id,
    source_type,
    title,
    description,
    visibility,
    created_by_type,
    total_cards: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return flashcardSet;
};

// Cập nhật flashcard set
const updateFlashcardSet = async (flashcard_set_id, data) => {
  const flashcardSet = await db.Flashcard_Set.findByPk(flashcard_set_id);

  if (!flashcardSet) {
    throw new Error("Flashcard set not found");
  }

  data.updated_at = new Date();

  await flashcardSet.update(data);

  return flashcardSet;
};

// Xóa flashcard set (sẽ xóa cascade cả flashcards)
const deleteFlashcardSet = async (flashcard_set_id) => {
  const flashcardSet = await db.Flashcard_Set.findByPk(flashcard_set_id);

  if (!flashcardSet) {
    throw new Error("Flashcard set not found");
  }

  // Xóa tất cả flashcards trong set trước
  await db.Flashcard.destroy({
    where: { flashcard_set_id },
  });

  // Xóa set
  await flashcardSet.destroy();

  return { message: "Flashcard set deleted successfully" };
};

// Cập nhật total_cards count
const updateTotalCards = async (flashcard_set_id) => {
  const flashcardSet = await db.Flashcard_Set.findByPk(flashcard_set_id);

  if (!flashcardSet) {
    throw new Error("Flashcard set not found");
  }

  const count = await db.Flashcard.count({
    where: { flashcard_set_id },
  });

  flashcardSet.total_cards = count;
  flashcardSet.updated_at = new Date();
  await flashcardSet.save();

  return flashcardSet;
};

export default {
  getFlashcardSetsPaginated,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  updateTotalCards,
};
